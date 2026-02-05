/**
 * Convert GIF and NPY images to PNG for the Visual Turing Test website.
 * Run: npm run convert-to-png
 */
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'agransh_images');
// Real with patho: 30, 28, 36, 26, 18 from gif slices\Real\Real With Pathology (not mask)
const REAL_WITH_PATHO_NPY_SOURCE = path.join('D:', '1_Agransh', 'gif slices', 'Real', 'Real With Pathology');
const REAL_WITH_PATHO_NPY_FILES = ['30.npy', '28.npy', '36.npy', '26.npy', '18.npy'];

async function convertGifToPng(gifPath, pngPath) {
  try {
    const sharp = require('sharp');
    await sharp(gifPath)
      .png()
      .toFile(pngPath);
    return true;
  } catch (err) {
    console.error(`  Error converting ${path.basename(gifPath)}:`, err.message);
    return false;
  }
}

const NUM_SLICES_PER_SCAN = 8;

/** Normalize slice data to 0-255 and write one PNG. */
async function writeSlicePng(sliceData, height, width, pngPath) {
  const sharp = require('sharp');
  let min = sliceData[0], max = sliceData[0];
  for (let i = 1; i < sliceData.length; i++) {
    if (sliceData[i] < min) min = sliceData[i];
    if (sliceData[i] > max) max = sliceData[i];
  }
  const range = max > min ? max - min : 1;
  const pngBuf = Buffer.alloc(width * height);
  for (let i = 0; i < sliceData.length; i++) {
    pngBuf[i] = Math.round(((sliceData[i] - min) / range) * 255);
  }
  await sharp(pngBuf, { raw: { width, height, channels: 1 } }).png().toFile(pngPath);
}

/**
 * Convert one NPY volume to 8 slice PNGs (same volume, 8 divisions).
 * Output: vol_0.png ... vol_7.png in destFolder.
 * If 3D [N,H,W]: use first 8 slices (or evenly spaced if N>8). If 2D: duplicate slice 8 times.
 */
async function convertNpyTo8Slices(npyPath, destFolder, baseName) {
  try {
    const { load } = require('npyjs');
    const buf = fs.readFileSync(npyPath);
    const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    const arr = await load(arrayBuffer);
    let data = arr.data;
    const shape = arr.shape;
    const sharp = require('sharp');

    let numSlices = 1, height, width, sliceSize;
    if (shape.length === 3) {
      numSlices = shape[0];
      height = shape[1];
      width = shape[2];
      sliceSize = height * width;
    } else if (shape.length === 2) {
      height = shape[0];
      width = shape[1];
      sliceSize = height * width;
    } else {
      console.error(`  Unsupported shape ${shape} for ${path.basename(npyPath)}`);
      return false;
    }

    const indices = [];
    if (numSlices >= NUM_SLICES_PER_SCAN) {
      for (let s = 0; s < NUM_SLICES_PER_SCAN; s++) {
        indices.push(Math.floor((s * numSlices) / NUM_SLICES_PER_SCAN));
      }
    } else {
      for (let s = 0; s < NUM_SLICES_PER_SCAN; s++) {
        indices.push(Math.min(s % numSlices, numSlices - 1));
      }
    }

    for (let i = 0; i < NUM_SLICES_PER_SCAN; i++) {
      const sliceIdx = indices[i];
      const start = sliceIdx * sliceSize;
      const sliceData = Array.from(data.slice(start, start + sliceSize));
      const pngPath = path.join(destFolder, `${baseName}_${i}.png`);
      await writeSlicePng(sliceData, height, width, pngPath);
    }
    return true;
  } catch (err) {
    console.error(`  Error converting ${path.basename(npyPath)}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('Converting images to PNG...\n');

  // 1. Real with patho: each NPY -> 8 slice PNGs (same volume, 8 divisions) e.g. 30_0.png ... 30_7.png
  const realWithPathoDest = path.join(PUBLIC_DIR, 'Real_with_patho');
  if (!fs.existsSync(realWithPathoDest)) fs.mkdirSync(realWithPathoDest, { recursive: true });
  if (fs.existsSync(REAL_WITH_PATHO_NPY_SOURCE)) {
    console.log('Real_with_patho (8 slices per NPY volume):');
    for (const npyName of REAL_WITH_PATHO_NPY_FILES) {
      const npyPath = path.join(REAL_WITH_PATHO_NPY_SOURCE, npyName);
      if (fs.existsSync(npyPath)) {
        const baseName = path.basename(npyName, '.npy');
        if (await convertNpyTo8Slices(npyPath, realWithPathoDest, baseName)) {
          console.log(`  ${npyName} -> ${baseName}_0.png ... ${baseName}_7.png (8 slices same volume)`);
        }
      } else {
        console.log(`  Skipping (not found): ${npyName}`);
      }
    }
    console.log('');
  } else {
    console.log(`Skipping Real_with_patho NPY (folder not found): ${REAL_WITH_PATHO_NPY_SOURCE}\n`);
  }

  // 2. GIF to PNG in existing public folders
  const folders = ['Real_wo_patho', 'Generated', 'Real_with_patho'];
  for (const folder of folders) {
    const folderPath = path.join(PUBLIC_DIR, folder);
    if (!fs.existsSync(folderPath)) continue;
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.gif'));
    if (files.length === 0) continue;
    console.log(`${folder} (GIF -> PNG):`);
    for (const file of files) {
      const gifPath = path.join(folderPath, file);
      const pngName = path.basename(file, '.gif') + '.png';
      const pngPath = path.join(folderPath, pngName);
      if (await convertGifToPng(gifPath, pngPath)) console.log(`  ${file} -> ${pngName}`);
    }
    console.log('');
  }

  console.log('Done! PNG images saved to public/agransh_images/');
}

main().catch(console.error);
