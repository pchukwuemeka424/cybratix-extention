#!/bin/bash
# Helper script to prepare screenshots for Chrome Web Store
# This script checks and converts screenshots to the required format

echo "Chrome Web Store Screenshot Preparation"
echo "========================================"
echo ""

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found"
    HAS_IMAGEMAGICK=true
else
    echo "⚠️  ImageMagick not found (optional, for image conversion)"
    HAS_IMAGEMAGICK=false
fi

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

echo ""
echo "Screenshot Requirements:"
echo "- Format: JPEG or 24-bit PNG (no alpha)"
echo "- Dimensions: 1280x800 or 640x400"
echo "- Quantity: At least 1, up to 5"
echo ""

# Function to check image dimensions
check_dimensions() {
    if [ "$HAS_IMAGEMAGICK" = true ]; then
        local file=$1
        local dims=$(identify -format "%wx%h" "$file" 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo "$dims"
        else
            echo "unknown"
        fi
    else
        echo "unknown (ImageMagick needed)"
    fi
}

# Function to convert image
convert_image() {
    if [ "$HAS_IMAGEMAGICK" = true ]; then
        local input=$1
        local output=$2
        local width=$3
        local height=$4
        
        echo "Converting $input to ${width}x${height}..."
        convert "$input" -resize "${width}x${height}" -alpha off "$output"
        echo "✅ Created: $output"
    else
        echo "⚠️  ImageMagick not available. Please resize manually."
    fi
}

# Check for existing screenshots
echo "Checking for screenshots..."
SCREENSHOT_COUNT=0
shopt -s nullglob
for img in screenshots/*.png screenshots/*.jpg screenshots/*.jpeg; do
    if [ -f "$img" ]; then
        SCREENSHOT_COUNT=$((SCREENSHOT_COUNT + 1))
    fi
done

if [ $SCREENSHOT_COUNT -gt 0 ]; then
    echo ""
    echo "Found $SCREENSHOT_COUNT screenshot(s):"
    for img in screenshots/*.png screenshots/*.jpg screenshots/*.jpeg; do
        if [ -f "$img" ]; then
            dims=$(check_dimensions "$img")
            echo "  - $(basename "$img"): $dims"
        fi
    done
else
    echo "  No screenshots found in screenshots/ directory"
fi
shopt -u nullglob

echo ""
echo "To create screenshots:"
echo "1. Take screenshots of your extension in action"
echo "2. Place them in the 'screenshots/' directory"
echo "3. Run this script again to check/convert them"
echo ""
echo "Recommended screenshots:"
echo "  1. Risk badge on a website (1280x800)"
echo "  2. Extension popup (1280x800)"
echo "  3. Detailed risk factors (1280x800)"
echo "  4. Multiple websites comparison (1280x800)"
echo "  5. Feature overview graphic (1280x800)"
echo ""

if [ "$HAS_IMAGEMAGICK" = true ]; then
    echo "To convert an image to 1280x800:"
    echo "  convert_image input.png screenshots/output-1280x800.png 1280 800"
    echo ""
    echo "To remove alpha channel from PNG:"
    echo "  convert input.png -alpha off output.png"
fi

echo ""
echo "For detailed instructions, see SCREENSHOTS_GUIDE.md"

