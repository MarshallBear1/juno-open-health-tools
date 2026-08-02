import {
  FilterMode,
  ImageFormat,
  MipmapMode,
  Skia,
} from "@shopify/react-native-skia";

export type EncodedImage = {
  base64: string;
  byteLength: number;
  height: number;
  mimeType: "image/jpeg";
  quality: number;
  width: number;
};

export type ImageBudgetOptions = {
  /** Maximum size of the decoded JPEG bytes, not the Base64 string. */
  maxBytes: number;
  /** Longest output edge in pixels. Images are never enlarged. */
  maxDimension?: number;
  /** JPEG qualities to try at each size, from best to smallest. */
  qualities?: number[];
  /** Additional dimension multipliers to try if quality alone is insufficient. */
  dimensionSteps?: number[];
  /** JPEG has no alpha channel, so transparent pixels need a background. */
  backgroundColor?: string;
};

const DEFAULT_QUALITIES = [82, 70, 58, 46];
const DEFAULT_DIMENSION_STEPS = [1, 0.85, 0.7, 0.55];

export function decodedBase64ByteLength(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function validateOptions({
  maxBytes,
  maxDimension,
  qualities,
  dimensionSteps,
}: Required<
  Pick<ImageBudgetOptions, "maxBytes" | "maxDimension" | "qualities" | "dimensionSteps">
>) {
  if (!Number.isInteger(maxBytes) || maxBytes <= 0) {
    throw new Error("maxBytes must be a positive integer");
  }
  if (!Number.isInteger(maxDimension) || maxDimension <= 0) {
    throw new Error("maxDimension must be a positive integer");
  }
  if (
    qualities.length === 0 ||
    qualities.some((quality) => !Number.isInteger(quality) || quality < 0 || quality > 100)
  ) {
    throw new Error("qualities must contain integers from 0 to 100");
  }
  if (
    dimensionSteps.length === 0 ||
    dimensionSteps.some((step) => !Number.isFinite(step) || step <= 0 || step > 1)
  ) {
    throw new Error("dimensionSteps must contain numbers greater than 0 and at most 1");
  }
}

/**
 * Decode, resize and encode an image without mounting a React component.
 *
 * The first result that fits `maxBytes` is returned. The search favours
 * dimensions first, then JPEG quality: it tries every quality at the largest
 * allowed size before reducing the dimensions.
 */
export async function encodeImageToByteBudget(
  uri: string,
  options: ImageBudgetOptions,
): Promise<EncodedImage> {
  const maxDimension = options.maxDimension ?? 1600;
  const qualities = options.qualities ?? DEFAULT_QUALITIES;
  const dimensionSteps = options.dimensionSteps ?? DEFAULT_DIMENSION_STEPS;
  const backgroundColor = options.backgroundColor ?? "#FFFFFF";

  validateOptions({
    maxBytes: options.maxBytes,
    maxDimension,
    qualities,
    dimensionSteps,
  });

  const data = await Skia.Data.fromURI(uri);
  if (!data) {
    throw new Error("Skia could not read the image URI");
  }

  const source = Skia.Image.MakeImageFromEncoded(data);
  if (!source) {
    data.dispose();
    throw new Error("Skia could not decode the image");
  }

  try {
    const sourceWidth = source.width();
    const sourceHeight = source.height();
    const longestEdge = Math.max(sourceWidth, sourceHeight);
    const baseScale = Math.min(1, maxDimension / longestEdge);

    let smallestAttempt:
      | { byteLength: number; height: number; quality: number; width: number }
      | undefined;

    for (const dimensionStep of dimensionSteps) {
      const scale = baseScale * dimensionStep;
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));
      const surface = Skia.Surface.MakeOffscreen(width, height);

      if (!surface) {
        throw new Error(`Skia could not create a ${width}x${height} surface`);
      }

      const paint = Skia.Paint();
      let snapshot: ReturnType<typeof surface.makeImageSnapshot> | undefined;

      try {
        const canvas = surface.getCanvas();
        canvas.clear(Skia.Color(backgroundColor));
        canvas.drawImageRectOptions(
          source,
          { x: 0, y: 0, width: sourceWidth, height: sourceHeight },
          { x: 0, y: 0, width, height },
          FilterMode.Linear,
          MipmapMode.Linear,
          paint,
        );
        surface.flush();
        snapshot = surface.makeImageSnapshot();

        for (const quality of qualities) {
          const base64 = snapshot.encodeToBase64(ImageFormat.JPEG, quality);
          const byteLength = decodedBase64ByteLength(base64);

          if (!smallestAttempt || byteLength < smallestAttempt.byteLength) {
            smallestAttempt = { byteLength, height, quality, width };
          }

          if (byteLength <= options.maxBytes) {
            return {
              base64,
              byteLength,
              height,
              mimeType: "image/jpeg",
              quality,
              width,
            };
          }
        }
      } finally {
        snapshot?.dispose();
        paint.dispose();
        surface.dispose();
      }
    }

    const detail = smallestAttempt
      ? `; smallest attempt was ${smallestAttempt.byteLength} bytes at ${smallestAttempt.width}x${smallestAttempt.height}, quality ${smallestAttempt.quality}`
      : "";
    throw new Error(`No candidate fit the ${options.maxBytes}-byte budget${detail}`);
  } finally {
    source.dispose();
    data.dispose();
  }
}
