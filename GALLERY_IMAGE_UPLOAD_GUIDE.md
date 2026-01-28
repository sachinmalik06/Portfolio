# Gallery Image Upload Setup Guide

## Quick Start

This guide will help you set up the image upload functionality for the Gallery Manager in your portfolio admin panel.

---

## Step 1: Create Storage Bucket in Supabase

You need to create a storage bucket called `project-images` in your Supabase project.

### Option A: Using Supabase Dashboard (Recommended)

1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket** button
5. Fill in the details:
   - **Name**: `project-images`
   - **Public bucket**: ✅ **Check this box**
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`
6. Click **Create bucket**

### Option B: Using SQL Editor

1. Open Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase/migrations/create_project_images_bucket.sql`
4. Click **Run**
5. Verify the bucket was created in **Storage** section

---

## Step 2: Verify Setup

1. Go to **Storage** in Supabase Dashboard
2. You should see a bucket named `project-images`
3. Click on it to verify it's public and has the correct settings

---

## Step 3: Test Image Upload

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Navigate to the admin panel at `/auth`

3. Login with your admin credentials

4. Go to **Gallery Manager**

5. Click **Add New Item** or edit an existing item

6. In the **Project Image** section, you'll see two modes:
   - **URL Mode**: Enter an image URL (traditional method)
   - **Upload Mode**: Upload an image file directly

7. Test Upload Mode:
   - Click the **Upload** button to switch modes
   - Drag and drop an image or click to browse
   - Wait for upload to complete
   - You should see a preview and the URL auto-populated

8. Save the gallery item

9. Verify the image appears correctly in:
   - Gallery Manager table preview
   - Public gallery page

---

## Features

### 🎯 Dual Input Modes

- **URL Mode**: Paste any image URL from the web
- **Upload Mode**: Upload images directly to Supabase Storage

### 📤 Upload Capabilities

- Drag and drop support
- Click to browse files
- Live preview before saving
- Auto-save URL to form
- Progress indicator during upload

### ✅ File Validation

- **Supported formats**: JPG, PNG, WebP, GIF
- **Max file size**: 5MB
- **Auto-validation**: Invalid files are rejected with clear error messages

### 🔄 Mode Switching

- Seamlessly switch between URL and Upload modes
- State is preserved when switching
- Clear visual indicators for active mode

---

## File Structure

Images are stored in Supabase Storage with the following structure:

```
project-images/              # Storage bucket
└── gallery/                 # Gallery images folder
    ├── 1738059123-abc123.jpg
    ├── 1738059456-def456.png
    └── 1738059789-ghi789.webp
```

Each file is named with a timestamp and random string to prevent collisions.

---

## Troubleshooting

### ❌ "Bucket not found" error

**Solution**: Make sure you've created the `project-images` bucket in Supabase (see Step 1)

### ❌ "Policy violation" error

**Solution**: 
1. Verify the bucket is set to **public**
2. Check that RLS policies are set up correctly (run the SQL migration)
3. Make sure you're logged in as an admin user

### ❌ Upload button not responding

**Solution**:
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Hard refresh the page (Ctrl+Shift+R)

### ❌ Image doesn't display after upload

**Solution**:
1. Check that the upload completed successfully (green success message)
2. Verify the image URL was saved to the database
3. Check browser console for 404 errors
4. Verify bucket name is exactly `project-images`

### ❌ File size error

**Solution**: Images must be under 5MB. Compress your image using:
- [TinyPNG](https://tinypng.com/) for PNG files
- [Squoosh](https://squoosh.app/) for all formats
- Convert to WebP for best compression

---

## Best Practices

### 📸 Image Optimization

For best performance, optimize your images before uploading:

1. **Recommended format**: WebP (best compression, modern browsers)
2. **Fallback format**: JPG for photos, PNG for graphics
3. **Recommended size**: 1920x1080 or smaller
4. **File size**: Keep under 500KB for fast loading

### 🔐 Security

- Only authenticated admin users can upload images
- Public users can only view images
- File type and size validation prevents malicious uploads
- Unique filenames prevent overwriting

### 🎨 Image Guidelines

- Use high-quality images that represent your projects well
- Maintain consistent aspect ratios across gallery items
- Consider using a consistent color palette or style
- Test images on both desktop and mobile views

---

## What Changed

### New Files

1. `supabase/migrations/create_project_images_bucket.sql` - Storage bucket setup
2. `GALLERY_IMAGE_UPLOAD_GUIDE.md` - This guide

### Modified Files

1. `src/pages/admin/GalleryManager.tsx` - Added image upload UI with mode toggle

### Reused Components

1. `src/components/admin/ImageUpload.tsx` - Existing upload component (no changes needed)

---

## Next Steps

✅ Complete Step 1 (create storage bucket)  
✅ Complete Step 2 (verify setup)  
✅ Complete Step 3 (test image upload)  
🎉 Start uploading your project images!

---

**Made with ⚡ for seamless image management!**
