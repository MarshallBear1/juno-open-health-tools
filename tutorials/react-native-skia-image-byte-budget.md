# Compressing a React Native image to a strict byte budget with Skia

Image uploads often have a hard limit expressed in bytes, while camera and photo-library images arrive with unpredictable dimensions, encodings and file sizes. A quality setting alone cannot guarantee that an image will fit.

This tutorial uses React Native Skia's imperative API to:

1. decode an image from a local URI;
2. resize it on an offscreen surface;
3. try a descending set of JPEG qualities;
4. reduce the dimensions if quality changes are insufficient; and
5. return only an encoded image whose decoded bytes fit the limit.

It does not mount a React component and does not upload anything.

## Install Skia

Follow the current [React Native Skia installation guide](https://shopify.github.io/react-native-skia/docs/getting-started/installation/). The example was checked against `@shopify/react-native-skia` 2.6.2.

## The implementation

The complete reusable TypeScript source is in [`examples/react-native-skia-image-budget.ts`](../examples/react-native-skia-image-budget.ts). Its core pipeline is:

```ts
const data = await Skia.Data.fromURI(uri);
const source = data && Skia.Image.MakeImageFromEncoded(data);

const surface = Skia.Surface.MakeOffscreen(width, height);
const canvas = surface?.getCanvas();

canvas?.clear(Skia.Color("#FFFFFF"));
canvas?.drawImageRectOptions(
  source,
  { x: 0, y: 0, width: source.width(), height: source.height() },
  { x: 0, y: 0, width, height },
  FilterMode.Linear,
  MipmapMode.Linear,
  Skia.Paint(),
);

surface?.flush();
const snapshot = surface?.makeImageSnapshot();
const base64 = snapshot?.encodeToBase64(ImageFormat.JPEG, quality);
```

The reusable function wraps that pipeline in dimension and quality loops, validates its options, releases every Skia object, and reports the smallest failed attempt if no candidate fits.

## Use it

```ts
import { encodeImageToByteBudget } from "./react-native-skia-image-budget";

const result = await encodeImageToByteBudget(photoUri, {
  maxBytes: 3_600_000,
  maxDimension: 1600,
  qualities: [82, 70, 58, 46],
  dimensionSteps: [1, 0.85, 0.7, 0.55],
});

console.log({
  bytes: result.byteLength,
  dimensions: `${result.width}x${result.height}`,
  quality: result.quality,
});
```

`result.base64` contains the JPEG payload without a data-URL prefix. Write it with your file-system library's Base64 mode or send it through an API that accepts Base64 image data.

## Why count decoded bytes?

Base64 expands binary data by roughly one third. A transport limit may refer to the binary image, the Base64 payload, or the entire JSON request; those are different budgets.

The helper measures the decoded JPEG bytes exactly from the Base64 length and padding:

```ts
function decodedBase64ByteLength(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}
```

If an API caps the whole request, reserve space for the Base64 expansion and the surrounding JSON before setting `maxBytes`.

## Production considerations

- JPEG has no alpha channel. The example paints a white background before drawing; use another colour or a format that preserves transparency when that matters.
- Image metadata is not copied. Preserve only metadata you explicitly need, and avoid retaining sensitive EXIF fields by accident.
- Confirm how your picker handles EXIF orientation before processing camera images.
- Large source images can consume significant memory while decoded. Enforce an input-size policy and test on lower-memory devices.
- Run compression away from latency-sensitive interactions, show progress, and support cancellation in upload-heavy flows.
- Treat client-side checks as user-experience safeguards, not security controls. The receiving service must validate the actual upload again.

## Choosing the search order

The supplied function tries every quality at the largest permitted dimensions before it makes the image smaller. This preserves spatial detail when a lower JPEG quality is sufficient. For text-heavy screenshots, you may prefer to reduce dimensions less aggressively or use a lossless format. For photographs, a smaller image at higher quality can look better; tune the arrays using representative images rather than one sample.

## Provenance

This pattern was extracted from production work on [Juno](https://junocompanion.com/?utm_source=github&utm_medium=referral&utm_campaign=skia_tutorial), then rewritten as a standalone example with no application data, backend dependency or health-specific behaviour. The tutorial and sample are MIT-licensed as part of [Juno Open Health Tools](../README.md).
