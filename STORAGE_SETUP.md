# Supabase Storage Setup for Image Uploads

## Quick Setup

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 5 MB
   - **Allowed MIME types**: image/jpeg, image/jpg, image/png, image/webp, image/gif
5. Click **Create bucket**

6. Go to **Storage** → **Policies**
7. Add these policies for the `images` bucket:
   - **Public read access** (SELECT for everyone)
   - **Authenticated upload** (INSERT for authenticated users)
   - **Authenticated update** (UPDATE for authenticated users)
   - **Authenticated delete** (DELETE for authenticated users)

### Option 2: Via SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy and paste the contents of `supabase/migrations/create_images_storage.sql`
5. Click **Run**

### Option 3: Via Supabase CLI (For Local Development)

```bash
# Make sure you have Supabase CLI installed
supabase migration up

# Or apply specific migration
supabase db push
```

## Verify Setup

After setup, test the storage:

1. Go to **Admin Panel** → **Settings** → **Profile Card Image**
2. Try uploading an image
3. The image should upload instantly and display

## Expected Result

✅ Images upload to Supabase Storage
✅ Public URLs are generated automatically
✅ Hero section loads images with **zero delay**
✅ No more Google Drive URL conversion

## Storage Structure

```
images/
├── hero/          # Hero section images
│   ├── 1234567890-abc123.webp
│   └── ...
├── logo/          # Logo images
└── gallery/       # Future: Gallery images
```

## Troubleshooting

### Upload fails with "Policy violation"
- Ensure you're logged in as admin
- Check that the policies are correctly set up
- Verify bucket is public

### Image doesn't load
- Check browser console for CORS errors
- Verify the bucket name is exactly `images`
- Ensure RLS policies allow public SELECT

### "Bucket not found"
- Bucket may not be created yet
- Run the SQL migration again
- Or create manually via dashboard

## Benefits

- ⚡ **Instant loading** - Images served from CDN
- 🔒 **Secure** - Authenticated upload only
- 📦 **Organized** - Folder structure
- 🎨 **Optimized** - Automatic compression options
- 💾 **Cached** - Browser caching enabled

## Next Steps

After setup:
1. Upload your hero image via Admin Panel
2. Old Google Drive URLs will still work (backward compatible)
3. New uploads will use Supabase Storage
4. Page load will be **significantly faster**
