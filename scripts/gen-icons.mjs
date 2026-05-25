import { createWriteStream, mkdirSync } from 'fs';
import zlib from 'zlib';

// 5x7 bitmap font rows for "A" and "S"
// Each row is a 5-bit mask (bit 4 = leftmost pixel)
const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  S: [0b01110, 0b10001, 0b10000, 0b01110, 0b00001, 0b10001, 0b01110],
};

const BG  = [0x0a, 0x0a, 0x0a]; // #0a0a0a
const FG  = [0xa7, 0x8b, 0xfa]; // #a78bfa

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf  = Buffer.allocUnsafe(4);
  const crcBuf  = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([lenBuf, body, crcBuf]);
}

function generatePNG(size) {
  // Determine scale so "AS" occupies ~60% of the image width
  const glyphW = 5, glyphH = 7, gap = 1;
  const totalUnits = glyphW + gap + glyphW;  // 11 units
  const scale = Math.floor((size * 0.60) / totalUnits);

  const textW  = totalUnits * scale;
  const textH  = glyphH * scale;
  const startX = Math.floor((size - textW) / 2);
  const startY = Math.floor((size - textH) / 2);

  // Build pixel grid: fill with BG
  const pixels = new Uint8Array(size * size * 3).fill(0);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3;
      pixels[idx]     = BG[0];
      pixels[idx + 1] = BG[1];
      pixels[idx + 2] = BG[2];
    }
  }

  // Render "A"
  for (let row = 0; row < glyphH; row++) {
    for (let col = 0; col < glyphW; col++) {
      const bit = (FONT.A[row] >> (4 - col)) & 1;
      if (!bit) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = startX + col * scale + dx;
          const py = startY + row * scale + dy;
          if (px >= 0 && px < size && py >= 0 && py < size) {
            const idx = (py * size + px) * 3;
            pixels[idx]     = FG[0];
            pixels[idx + 1] = FG[1];
            pixels[idx + 2] = FG[2];
          }
        }
      }
    }
  }

  // Render "S" (offset by glyphW + gap units)
  const sOffsetX = startX + (glyphW + gap) * scale;
  for (let row = 0; row < glyphH; row++) {
    for (let col = 0; col < glyphW; col++) {
      const bit = (FONT.S[row] >> (4 - col)) & 1;
      if (!bit) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = sOffsetX + col * scale + dx;
          const py = startY + row * scale + dy;
          if (px >= 0 && px < size && py >= 0 && py < size) {
            const idx = (py * size + px) * 3;
            pixels[idx]     = FG[0];
            pixels[idx + 1] = FG[1];
            pixels[idx + 2] = FG[2];
          }
        }
      }
    }
  }

  // Build raw scanline data (filter byte 0 = None before each row)
  const rawRows = Buffer.allocUnsafe(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    rawRows[y * (1 + size * 3)] = 0; // filter None
    const rowOffset = y * size * 3;
    for (let x = 0; x < size * 3; x++) {
      rawRows[y * (1 + size * 3) + 1 + x] = pixels[rowOffset + x];
    }
  }

  const compressed = zlib.deflateSync(rawRows, { level: 9 });

  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR: width(4) height(4) bitDepth(1) colorType(1=RGB=2) comp(1) filter(1) interlace(1)
  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8]  = 8; // bit depth
  ihdrData[9]  = 2; // color type: RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const chunks = Buffer.concat([
    sig,
    pngChunk('IHDR', ihdrData),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);

  return chunks;
}

mkdirSync('public/icons', { recursive: true });

for (const size of [192, 512]) {
  const png  = generatePNG(size);
  const path = `public/icons/icon-${size}.png`;
  const ws   = createWriteStream(path);
  ws.write(png);
  ws.end();
  console.log(`Created ${path} (${png.length} bytes)`);
}
