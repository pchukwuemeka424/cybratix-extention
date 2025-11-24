# Chrome Web Store Submission Guide

## Build the Extension

Run the build script to create a proper ZIP file:

```bash
./build.sh
```

This creates `cybratix-v1.0.0.zip` with:
- ✅ `manifest.json` at the root directory
- ✅ All required extension files
- ✅ Icons included
- ✅ No development files
- ✅ Proper ZIP structure

## Verify the ZIP

Before uploading, verify the structure:

```bash
unzip -l cybratix-v1.0.0.zip | head -20
```

You should see `manifest.json` listed at the root (not in a subdirectory).

## Chrome Web Store Submission Steps

### 1. Create Developer Account
- Go to https://chrome.google.com/webstore/devconsole
- Pay one-time $5 registration fee
- Complete account setup

### 2. Prepare Required Materials

**Required:**
- ✅ Extension ZIP file (`cybratix-v1.0.0.zip`)
- ✅ Privacy Policy URL (create one or use GitHub Pages)
- ✅ Store listing description
- ✅ Screenshots (1280x800 or 640x400)

**Optional but Recommended:**
- Promotional images
- Detailed feature list
- Support URL

### 3. Upload Extension

1. Go to Chrome Web Store Developer Dashboard
2. Click "New Item"
3. Upload `cybratix-v1.0.0.zip`
4. Fill out store listing:
   - **Name**: Cybratix
   - **Summary**: Brief description (132 chars max)
   - **Description**: Full description
   - **Category**: Productivity or Developer Tools
   - **Language**: English

### 4. Privacy Policy

Create a simple privacy policy stating:
- Extension doesn't collect personal data
- API calls are made to IPQS for analysis
- No user data is stored
- All analysis is done server-side

Host it on:
- GitHub Pages
- Your website
- Any public URL

### 5. Screenshots

**Requirements:**
- Format: JPEG or 24-bit PNG (no alpha channel)
- Dimensions: 1280x800 or 640x400 pixels
- Quantity: At least 1, up to 5 screenshots

**Recommended Screenshots:**
1. Risk badge on a website (main feature)
2. Extension popup showing risk score
3. Detailed risk factors display
4. Multiple websites comparison
5. Feature overview graphic

**See `SCREENSHOTS_GUIDE.md` for detailed instructions.**

### 6. Submit for Review

1. Review all information
2. Check privacy policy URL works
3. Verify screenshots display correctly
4. Click "Submit for Review"

### 7. Review Process

- Usually takes 1-3 business days
- Chrome team reviews for:
  - Policy compliance
  - Security issues
  - Functionality
  - Store listing quality

### 8. After Approval

- Extension is published
- Warning disappears for users
- Can be installed from Chrome Web Store
- Updates can be submitted

## Common Issues

### "Invalid package" Error

**Solution:**
- ✅ Use the updated `build.sh` script
- ✅ Ensure `manifest.json` is at ZIP root
- ✅ Don't include parent directory in ZIP
- ✅ Verify ZIP file isn't corrupted

### "manifest.json not found"

**Solution:**
- ✅ Check ZIP structure with `unzip -l`
- ✅ `manifest.json` must be at root, not in subdirectory
- ✅ Rebuild using `./build.sh`

### Privacy Policy Required

**Solution:**
- Create a simple HTML page
- Host on GitHub Pages or your website
- Include URL in store listing

## ZIP File Structure

The correct structure should be:

```
cybratix-v1.0.0.zip
├── manifest.json          ← Must be at root
├── background.js
├── content.js
├── popup.html
├── popup.js
├── styles.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

**NOT:**
```
cybratix-v1.0.0.zip
└── WebSafety Pro/         ← Wrong! Parent directory
    └── manifest.json
```

## Testing Before Submission

1. **Test the ZIP:**
   ```bash
   unzip -t cybratix-v1.0.0.zip
   ```

2. **Verify manifest.json:**
   ```bash
   unzip -p cybratix-v1.0.0.zip manifest.json | head -5
   ```

3. **Check file count:**
   ```bash
   unzip -l cybratix-v1.0.0.zip | wc -l
   ```

## Support

If you encounter issues:
- Check Chrome Web Store Developer Policies
- Review error messages carefully
- Ensure all required fields are filled
- Verify ZIP file structure

Good luck with your submission! 🚀

