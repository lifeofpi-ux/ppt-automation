"""
decompose_visual_objects.py

Decompose an IMAGE-2 text-free master slide visual into selectable PNG
objects using the HTML object bbox manifest, with optional SAM2 refinement.

USAGE:
  python decompose_visual_objects.py --slide slide03
  python decompose_visual_objects.py --slide slide03 --sam2
  python decompose_visual_objects.py --manifest ../drafts/slide03_objects.json --image ../images/slide03_visual_master.png

INPUT:
  ../drafts/[slide]_objects.json
  ../images/[slide]_visual_master.png

OUTPUT:
  ../objects/[slide]/[object_id].png
  ../objects/[slide]/[slide]_decomposition.json

INSTALL BASE:
  pip install pillow numpy

OPTIONAL OPENCV CLEANUP:
  pip install opencv-python

OPTIONAL SAM2:
  Install SAM2 separately from the official repo, then set:
    SAM2_CHECKPOINT=C:\\path\\to\\sam2.1_hiera_small.pt
    SAM2_MODEL_CFG=configs/sam2.1/sam2.1_hiera_s.yaml

SAM2 NOTE:
  This script uses SAM2 only as a refinement step. The HTML bbox manifest is
  still the source of truth for what objects should exist.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from PIL import Image


SCRIPT_DIR = Path(__file__).resolve().parent
ASSET_DIR = SCRIPT_DIR.parent
DRAFT_DIR = ASSET_DIR / "drafts"
IMAGE_DIR = ASSET_DIR / "images"
OBJECT_DIR = ASSET_DIR / "objects"


def safe_name(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9._-]+", "-", value.strip())
    return value.strip("-") or "object"


def clamp_box(box: Tuple[int, int, int, int], width: int, height: int) -> Tuple[int, int, int, int]:
    x1, y1, x2, y2 = box
    return max(0, x1), max(0, y1), min(width, x2), min(height, y2)


def bbox_from_manifest(item: Dict[str, Any], padding: int, width: int, height: int) -> Tuple[int, int, int, int]:
    bbox = item["bboxScreenshotPx"]
    x1 = int(round(bbox["x"])) - padding
    y1 = int(round(bbox["y"])) - padding
    x2 = int(round(bbox["x"] + bbox["width"])) + padding
    y2 = int(round(bbox["y"] + bbox["height"])) + padding
    return clamp_box((x1, y1, x2, y2), width, height)


def try_opencv_trim_alpha(image: Image.Image) -> Image.Image:
    """Trim fully transparent edges when alpha exists. Falls back cleanly."""
    if image.mode != "RGBA":
        return image.convert("RGBA")
    alpha = np.array(image.getchannel("A"))
    rows = np.where(alpha.max(axis=1) > 0)[0]
    cols = np.where(alpha.max(axis=0) > 0)[0]
    if rows.size == 0 or cols.size == 0:
        return image
    return image.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))


def load_sam2_predictor(enabled: bool):
    if not enabled:
        return None
    checkpoint = os.environ.get("SAM2_CHECKPOINT")
    model_cfg = os.environ.get("SAM2_MODEL_CFG")
    if not checkpoint or not model_cfg:
        print("SAM2 requested, but SAM2_CHECKPOINT or SAM2_MODEL_CFG is missing. Falling back to bbox crops.")
        return None
    try:
        import torch
        from sam2.build_sam import build_sam2
        from sam2.sam2_image_predictor import SAM2ImagePredictor
    except Exception as exc:
        print(f"SAM2 import failed ({exc}). Falling back to bbox crops.")
        return None

    device = "cuda" if torch.cuda.is_available() else "cpu"
    sam2_model = build_sam2(model_cfg, checkpoint, device=device)
    predictor = SAM2ImagePredictor(sam2_model)
    print(f"SAM2 enabled on {device}")
    return predictor


def sam2_mask_for_box(predictor, slide_rgb: np.ndarray, box: Tuple[int, int, int, int]) -> Optional[np.ndarray]:
    if predictor is None:
        return None
    try:
        predictor.set_image(slide_rgb)
        masks, scores, _ = predictor.predict(
            point_coords=None,
            point_labels=None,
            box=np.array(box, dtype=np.float32),
            multimask_output=True,
        )
        if masks is None or len(masks) == 0:
            return None
        best_idx = int(np.argmax(scores))
        return masks[best_idx].astype(np.uint8) * 255
    except Exception as exc:
        print(f"SAM2 mask failed for box {box}: {exc}. Using bbox crop.")
        return None


def crop_with_optional_mask(
    master: Image.Image,
    item: Dict[str, Any],
    box: Tuple[int, int, int, int],
    full_mask: Optional[np.ndarray],
    trim_alpha: bool,
) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = master.crop(box).convert("RGBA")
    if full_mask is not None:
        mask_crop = Image.fromarray(full_mask[y1:y2, x1:x2], mode="L")
        rgba = crop.copy()
        rgba.putalpha(mask_crop)
        return try_opencv_trim_alpha(rgba) if trim_alpha else rgba
    return crop


def decompose(
    manifest_path: Path,
    image_path: Path,
    output_root: Path,
    use_sam2: bool,
    padding: int,
    trim_alpha: bool,
) -> Path:
    manifest = json.loads(manifest_path.read_text(encoding="utf8"))
    slide_name = Path(manifest.get("slide", manifest_path.stem)).stem.replace("_objects", "")
    master = Image.open(image_path).convert("RGBA")
    width, height = master.size
    slide_rgb = np.array(master.convert("RGB"))

    predictor = load_sam2_predictor(use_sam2)
    out_dir = output_root / slide_name
    out_dir.mkdir(parents=True, exist_ok=True)

    records: List[Dict[str, Any]] = []
    for index, item in enumerate(manifest.get("objects", []), start=1):
        object_id = safe_name(item.get("id") or f"object-{index:02d}")
        box = bbox_from_manifest(item, padding, width, height)
        refine = str(item.get("refine", "auto")).lower()
        should_refine = predictor is not None and refine not in {"none", "false", "bbox"}
        mask = sam2_mask_for_box(predictor, slide_rgb, box) if should_refine else None
        object_image = crop_with_optional_mask(master, item, box, mask, trim_alpha)
        object_path = out_dir / f"{index:02d}_{object_id}.png"
        object_image.save(object_path)
        records.append({
            "id": object_id,
            "kind": item.get("kind", "design"),
            "sourceBoxPx": {"x1": box[0], "y1": box[1], "x2": box[2], "y2": box[3]},
            "sourceManifestBoxPx": item.get("bboxScreenshotPx"),
            "outputSizePx": {"width": object_image.size[0], "height": object_image.size[1]},
            "preservesSourceBoxSize": object_image.size == (box[2] - box[0], box[3] - box[1]),
            "method": "sam2_box_mask" if mask is not None else "bbox_crop",
            "path": str(object_path.relative_to(ASSET_DIR)).replace("\\", "/"),
            "pptxLayer": item.get("pptxLayer", "design"),
        })
        print(f"  {records[-1]['method']}: {object_path.name}")

    output_manifest = out_dir / f"{slide_name}_decomposition.json"
    output_manifest.write_text(json.dumps({
        "slide": slide_name,
        "sourceImage": str(image_path.relative_to(ASSET_DIR)).replace("\\", "/"),
        "sourceManifest": str(manifest_path.relative_to(ASSET_DIR)).replace("\\", "/"),
        "objects": records,
    }, ensure_ascii=False, indent=2), encoding="utf8")
    return output_manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slide", help="Slide basename, e.g. slide03")
    parser.add_argument("--manifest", help="Path to slide objects manifest JSON")
    parser.add_argument("--image", help="Path to IMAGE-2 master visual PNG")
    parser.add_argument("--output", default=str(OBJECT_DIR), help="Output root directory")
    parser.add_argument("--sam2", action="store_true", help="Enable SAM2 mask refinement when installed")
    parser.add_argument("--padding", type=int, default=8, help="BBox padding in screenshot pixels")
    parser.add_argument("--trim-alpha", action="store_true", help="Trim transparent edges. Disabled by default to preserve PPTX positioning.")
    args = parser.parse_args()

    if args.slide:
      manifest_path = Path(args.manifest) if args.manifest else DRAFT_DIR / f"{args.slide}_objects.json"
      image_path = Path(args.image) if args.image else IMAGE_DIR / f"{args.slide}_visual_master.png"
    else:
      if not args.manifest or not args.image:
        raise SystemExit("Provide either --slide or both --manifest and --image")
      manifest_path = Path(args.manifest)
      image_path = Path(args.image)

    manifest_path = manifest_path.resolve()
    image_path = image_path.resolve()
    if not manifest_path.exists():
        raise SystemExit(f"Manifest not found: {manifest_path}")
    if not image_path.exists():
        raise SystemExit(f"Image not found: {image_path}")

    output_manifest = decompose(
        manifest_path=manifest_path,
        image_path=image_path,
        output_root=Path(args.output).resolve(),
        use_sam2=args.sam2,
        padding=args.padding,
        trim_alpha=args.trim_alpha,
    )
    print(f"Wrote {output_manifest}")


if __name__ == "__main__":
    main()
