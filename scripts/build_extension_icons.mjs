import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconDir = path.join(root, "extension", "icons");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const value of buffer) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([length, typeBytes, data, checksum]);
}

function roundedRectDistance(x, y, left, top, right, bottom, radius) {
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  return Math.hypot(x - cx, y - cy) - radius;
}

function insideJ(x, y, size) {
  const scale = size / 128;
  const vertical = x >= 61 * scale && x <= 78 * scale && y >= 31 * scale && y <= 82 * scale;
  const top = x >= 50 * scale && x <= 89 * scale && y >= 28 * scale && y <= 43 * scale;
  const hookOuter = Math.hypot(x - 53 * scale, y - 82 * scale) <= 27 * scale;
  const hookInner = Math.hypot(x - 53 * scale, y - 82 * scale) < 12 * scale;
  const hook = hookOuter && !hookInner && x <= 76 * scale && y >= 68 * scale;
  return vertical || top || hook;
}

function makeIcon(size) {
  const stride = size * 4 + 1;
  const pixels = Buffer.alloc(stride * size);
  const margin = size * 0.07;
  const radius = size * 0.26;
  const colors = {
    teal: [13, 102, 91, 255],
    tealDark: [8, 74, 67, 255],
    cream: [255, 254, 250, 255],
    coral: [215, 109, 85, 255],
    transparent: [0, 0, 0, 0],
  };

  for (let y = 0; y < size; y += 1) {
    const row = y * stride;
    pixels[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const index = row + 1 + x * 4;
      const d = roundedRectDistance(x + 0.5, y + 0.5, margin, margin, size - margin, size - margin, radius);
      let color = colors.transparent;
      if (d <= 0) {
        const blend = Math.max(0, Math.min(1, (x + y) / (size * 2)));
        color = colors.teal.map((value, i) => Math.round(value * (1 - blend * 0.12) + colors.tealDark[i] * blend * 0.12));
      }
      if (d <= 0 && insideJ(x + 0.5, y + 0.5, size)) color = colors.cream;
      const dot = Math.hypot(x - size * 0.78, y - size * 0.23) <= size * 0.055;
      if (d <= 0 && dot) color = colors.coral;
      pixels.set(color, index);
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(pixels, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

await mkdir(iconDir, { recursive: true });
for (const size of [16, 32, 48, 128]) {
  await writeFile(path.join(iconDir, `icon${size}.png`), makeIcon(size));
}

console.log(`Wrote extension icons to ${iconDir}`);
