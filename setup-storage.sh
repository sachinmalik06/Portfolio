#!/bin/bash

echo "🚀 Setting up Supabase Storage for Image Uploads"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found"
    echo "Please create .env.local with your Supabase credentials first"
    exit 1
fi

echo "✅ Environment file found"
echo ""
echo "📋 Setup Instructions:"
echo ""
echo "Option 1: Supabase Dashboard (Easiest)"
echo "--------------------------------------"
echo "1. Open your Supabase project dashboard"
echo "2. Go to Storage → Create new bucket"
echo "3. Name: 'images', Public: ON, Size limit: 5MB"
echo "4. Set up policies (see STORAGE_SETUP.md)"
echo ""
echo "Option 2: SQL Editor"
echo "-------------------"
echo "1. Open your Supabase project dashboard"
echo "2. Go to SQL Editor → New query"
echo "3. Copy contents from: supabase/migrations/create_images_storage.sql"
echo "4. Run the query"
echo ""
echo "Option 3: Supabase CLI (Advanced)"
echo "---------------------------------"
echo "Run: supabase db push"
echo ""
echo "📖 Full instructions: See STORAGE_SETUP.md"
echo ""
echo "After setup, go to Admin Panel → Settings → Profile Card Image"
echo "to upload your hero image for instant loading!"
echo ""
echo "✨ Your hero image will load with ZERO delay! ✨"
