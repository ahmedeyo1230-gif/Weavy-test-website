#!/bin/bash
# One-off conversion of heavy referenced PNGs to WebP (quality 80, capped width 1800px).
# Originals are kept on disk untouched; only .webp siblings are generated.
set -e
cd "$(dirname "$0")/../public/brand_assets"

convert_one() {
  local src="$1"
  local maxw="$2"
  local out="${src%.*}.webp"
  if [ -f "$src" ]; then
    cwebp -quiet -q 80 -resize "$maxw" 0 "$src" -o "$out"
    echo "$src -> $out ($(du -h "$out" | cut -f1))"
  fi
}

convert_one "Website_examples.png" 1600
convert_one "beauty.png" 1800
convert_one "Property.png" 1800
convert_one "Whatsapp.png" 1024
convert_one "Instagram.png" 1024
convert_one "messenger.png" 1200
convert_one "Tiktok_automatiom.png" 1600
convert_one "OmarEventOrganiser's Facebook profile page-2.png" 900
convert_one "aimedia.png" 1600
convert_one "Claude_image.png" 1800
convert_one "office-portrait.png" 1600
convert_one "HI-D.png" 1800
convert_one "2w.png.png" 1200
convert_one "social_lady.png" 1200
convert_one "tik_youtube_images.png" 1600
convert_one "dashboard1.png" 1400
convert_one "Blog_1.png" 1400
convert_one "Perfume.png" 1600
convert_one "Evy_cream.png" 1600
convert_one "Taste_summer.png" 1800
convert_one "Baaris.png" 1200
convert_one "H.png" 1600
convert_one "Fefo.png" 1600
convert_one "A6_Flyer_Mockup_2.png" 1600
