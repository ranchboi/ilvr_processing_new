"""
Convert GIF and NPY images to PNG for the Visual Turing Test website.
Run from project root: python scripts/convert_to_png.py
"""
import os
import sys
from pathlib import Path

# Source and destination paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PUBLIC_DIR = PROJECT_DIR / "public" / "agransh_images"
SOURCE_BASE = Path(r"D:\1_Agransh\gif slices")

# Folder mappings: source subfolder -> destination folder name
FOLDERS = [
    (SOURCE_BASE / "Real" / "Real wo patho", "Real_wo_patho"),
    (SOURCE_BASE / "Generated", "Generated"),
]

# Real with patho - from gif files to send to arjun (legacy)
REAL_WITH_PATHO_SOURCE = Path(r"D:\1_Agransh\gif files to send to arjun")
# Real with patho NPY files (30, 28, 36, 26, 18) from gif slices\Real\Real With Pathology
REAL_WITH_PATHO_NPY_SOURCE = Path(r"D:\1_Agransh\gif slices\Real\Real With Pathology")
REAL_WITH_PATHO_NPY_FILES = ["30.npy", "28.npy", "36.npy", "26.npy", "18.npy"]


def convert_gif_to_png(src_path, dest_path):
    """Convert GIF to PNG using PIL."""
    try:
        from PIL import Image
        img = Image.open(src_path)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(dest_path, "PNG")
        return True
    except Exception as e:
        print(f"  Error converting {src_path.name}: {e}")
        return False


def convert_npy_to_png(src_path, dest_path):
    """Convert NPY array to PNG using numpy and PIL."""
    try:
        import numpy as np
        from PIL import Image
        arr = np.load(src_path)
        if arr.ndim == 3:
            arr = arr.squeeze()
        if arr.ndim == 2:
            pass
        elif arr.ndim == 3 and arr.shape[-1] in (1, 3):
            arr = arr.squeeze()
        else:
            arr = arr[0] if arr.ndim > 2 else arr
        # Normalize to 0-255
        arr_min, arr_max = arr.min(), arr.max()
        if arr_max > arr_min:
            arr = ((arr - arr_min) / (arr_max - arr_min) * 255).astype(np.uint8)
        else:
            arr = np.zeros_like(arr, dtype=np.uint8)
        img = Image.fromarray(arr)
        img.save(dest_path, "PNG")
        return True
    except Exception as e:
        print(f"  Error converting {src_path.name}: {e}")
        return False


def main():
    print("Converting images to PNG...")
    
    for src_folder, dest_name in FOLDERS:
        if not src_folder.exists():
            print(f"Skipping (not found): {src_folder}")
            continue
        dest_folder = PUBLIC_DIR / dest_name
        dest_folder.mkdir(parents=True, exist_ok=True)
        print(f"\n{dest_name}:")
        
        for f in sorted(src_folder.iterdir()):
            if f.suffix.lower() == ".gif":
                out_name = f.stem + ".png"
                out_path = dest_folder / out_name
                if convert_gif_to_png(f, out_path):
                    print(f"  {f.name} -> {out_name}")
            elif f.suffix.lower() == ".npy":
                out_name = f.stem + ".png"
                out_path = dest_folder / out_name
                if convert_npy_to_png(f, out_path):
                    print(f"  {f.name} -> {out_name}")
    
    # Real with patho - NPY files 30, 28, 36, 26, 18 from mask folder
    dest_folder = PUBLIC_DIR / "Real_with_patho"
    dest_folder.mkdir(parents=True, exist_ok=True)
    print(f"\nReal_with_patho (from NPY):")
    if REAL_WITH_PATHO_NPY_SOURCE.exists():
        for npy_name in REAL_WITH_PATHO_NPY_FILES:
            f = REAL_WITH_PATHO_NPY_SOURCE / npy_name
            if f.exists():
                out_name = f.stem + ".png"
                out_path = dest_folder / out_name
                if convert_npy_to_png(f, out_path):
                    print(f"  {f.name} -> {out_name}")
            else:
                print(f"  Skipping (not found): {f}")
    else:
        print(f"  Skipping (folder not found): {REAL_WITH_PATHO_NPY_SOURCE}")

    # Real with patho - legacy sample gifs (optional)
    if REAL_WITH_PATHO_SOURCE.exists():
        for f in sorted(REAL_WITH_PATHO_SOURCE.glob("*_sample.gif")):
            out_name = f.stem + ".png"
            out_path = dest_folder / out_name
            if convert_gif_to_png(f, out_path):
                print(f"  {f.name} -> {out_name}")
    
    print("\nDone! PNG images saved to public/agransh_images/")


if __name__ == "__main__":
    main()
