#!/bin/bash
# Build script for Cybratix Extension
# Creates a production-ready ZIP file for Chrome Web Store submission

VERSION=$(grep '"version"' manifest.json | cut -d'"' -f4)
OUTPUT_FILE="cybratix-v${VERSION}.zip"
TEMP_DIR=".build-temp"

echo "Building Cybratix Extension v${VERSION}..."

# Remove old build if exists
if [ -f "$OUTPUT_FILE" ]; then
  rm "$OUTPUT_FILE"
  echo "Removed old build file"
fi

# Remove temp directory if exists
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi

# Create temporary build directory
mkdir -p "$TEMP_DIR"

# Copy required files to temp directory
echo "Copying files..."

# Core extension files
cp manifest.json "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"

# Copy icons directory
cp -r icons "$TEMP_DIR/"

# Remove development files and system files from icons
rm -rf "$TEMP_DIR/icons/dev-tools" 2>/dev/null
rm -f "$TEMP_DIR/icons/HOW_TO_CREATE_ICONS.txt" 2>/dev/null
rm -f "$TEMP_DIR/icons/README.md" 2>/dev/null
find "$TEMP_DIR/icons" -name ".DS_Store" -delete 2>/dev/null

# Create ZIP from temp directory (ensures manifest.json is at root)
cd "$TEMP_DIR"
zip -r "../$OUTPUT_FILE" . -q
cd ..

# Clean up temp directory
rm -rf "$TEMP_DIR"

if [ -f "$OUTPUT_FILE" ]; then
  SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
  echo "✅ Build successful!"
  echo "📦 Output: $OUTPUT_FILE ($SIZE)"
  echo ""
  echo "Files included:"
  unzip -l "$OUTPUT_FILE" | grep -E "manifest.json|\.js$|\.html$|\.css$|\.png$" | head -10
  echo ""
  echo "✅ manifest.json is at the root of the ZIP"
  echo "✅ Ready for Chrome Web Store submission!"
else
  echo "❌ Build failed!"
  exit 1
fi

