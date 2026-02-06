"""
Convert GIFs to 15 scans, 8 slices each, in the exact order required by the Visual Turing Test.
Run from project root: python "visual turing website agransh/scripts/gif_to_15_scans.py"

Requires: pip install Pillow

Source paths (edit if needed):
  - Generated:       D:\\1_Agransh\\gif slices\\Generated
  - Real with patho: D:\\1_Agransh\\gif slices\\Real\\Real With Pathology\\gifs
  - Real wo patho:   D:\\1_Agransh\\gif slices\\Real\\Real wo patho

Output: public/agransh_images/scan_01/ .. scan_15/ each with 1.png .. 8.png (8 frames per GIF).
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install it with:")
    print("  pip install Pillow")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
OUTPUT_BASE = PROJECT_DIR / "public" / "agransh_images"

# Source folders (exact paths you provided)
PATH_GENERATED = Path(r"D:\1_Agransh\gif slices\Generated")
PATH_REAL_WITH_PATHO = Path(r"D:\1_Agransh\gif slices\Real\Real With Pathology\gifs")
PATH_REAL_WO_PATHO = Path(r"D:\1_Agransh\gif slices\Real\Real wo patho")

# Scan order: 1-15 with type and which "slot" in that type's list
# (real_wo: 2 scans → indices 0,1; real_patho: 5 scans → indices 0..4; generated: 8 scans → indices 0..7)
SCAN_ORDER = [
    ("real_wo_patho", 0),      # 1
    ("real_with_patho", 0),    # 2
    ("real_with_patho", 1),    # 3
    ("generated", 0),          # 4
    ("generated", 1),          # 5
    ("real_with_patho", 2),   # 6
    ("generated", 2),         # 7
    ("generated", 3),         # 8
    ("generated", 4),         # 9
    ("generated", 5),         # 10
    ("generated", 6),         # 11
    ("real_with_patho", 3),   # 12
    ("generated", 7),         # 13
    ("real_with_patho", 4),   # 14
    ("real_wo_patho", 1),      # 15
]

NUM_SLICES = 8


def get_gif_lists():
    """Collect sorted .gif paths for each category."""
    def sorted_gifs(folder):
        if not folder or not folder.exists():
            return []
        return sorted(folder.glob("*.gif"), key=lambda p: p.name.lower())

    return {
        "real_wo_patho": sorted_gifs(PATH_REAL_WO_PATHO),
        "real_with_patho": sorted_gifs(PATH_REAL_WITH_PATHO),
        "generated": sorted_gifs(PATH_GENERATED),
    }


def extract_8_frames(gif_path, out_dir):
    """Extract 8 evenly spaced frames from a GIF and save as 1.png .. 8.png."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        img = Image.open(gif_path)
        n_frames = getattr(img, "n_frames", 1)
        if n_frames < NUM_SLICES:
            # If fewer than 8 frames, duplicate last frame or use what we have
            indices = list(range(n_frames)) + [n_frames - 1] * (NUM_SLICES - n_frames)
            indices = indices[:NUM_SLICES]
        else:
            # Evenly spaced: 0, 1*(n-1)/7, 2*(n-1)/7, ... 7*(n-1)/7
            indices = [int(i * (n_frames - 1) / (NUM_SLICES - 1)) for i in range(NUM_SLICES)]

        for i, frame_idx in enumerate(indices):
            img.seek(frame_idx)
            frame = img.copy()
            if frame.mode in ("RGBA", "P"):
                frame = frame.convert("RGB")
            out_path = out_dir / f"{i + 1}.png"
            frame.save(out_path, "PNG")
        return True
    except Exception as e:
        print(f"  Error processing {gif_path.name}: {e}")
        return False


def main():
    gifs = get_gif_lists()
    needed = {"real_wo_patho": 2, "real_with_patho": 5, "generated": 8}
    for kind, paths in gifs.items():
        n = needed[kind]
        if len(paths) < n:
            print(f"Warning: {kind} has {len(paths)} GIFs, need {n}. Add more GIFs or adjust SCAN_ORDER.")

    print("Converting GIFs to 15 scans (8 slices each)...")
    for scan_num, (kind, slot) in enumerate(SCAN_ORDER, start=1):
        paths = gifs.get(kind, [])
        if slot >= len(paths):
            print(f"  Scan {scan_num:02d}: skip (no GIF for {kind} slot {slot})")
            continue
        gif_path = paths[slot]
        out_dir = OUTPUT_BASE / f"scan_{scan_num:02d}"
        if extract_8_frames(gif_path, out_dir):
            print(f"  Scan {scan_num:02d}: {gif_path.name} -> {out_dir.name}/1.png..8.png")
        else:
            print(f"  Scan {scan_num:02d}: failed")

    print(f"\nDone. Output: {OUTPUT_BASE}")


if __name__ == "__main__":
    main()
