Write-Host "🚀 Setting up Supabase Storage for Image Uploads" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "❌ Error: .env.local not found" -ForegroundColor Red
    Write-Host "Please create .env.local with your Supabase credentials first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Setup Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Supabase Dashboard - Easiest Method" -ForegroundColor Cyan
Write-Host "--------------------------------------"
Write-Host "1. Open your Supabase project dashboard"
Write-Host "2. Go to Storage → Create new bucket"
Write-Host "3. Name: 'images', Public: ON, Size limit: 5MB"
Write-Host "4. Set up policies (see STORAGE_SETUP.md)"
Write-Host ""
Write-Host "Option 2: SQL Editor" -ForegroundColor Cyan
Write-Host "-------------------"
Write-Host "1. Open your Supabase project dashboard"
Write-Host "2. Go to SQL Editor → New query"
Write-Host "3. Copy contents from: supabase/migrations/create_images_storage.sql"
Write-Host "4. Run the query"
Write-Host ""
Write-Host "Option 3: Supabase CLI (Advanced)" -ForegroundColor Cyan
Write-Host "---------------------------------"
Write-Host "Run: supabase db push"
Write-Host ""
Write-Host "📖 Full instructions: See STORAGE_SETUP.md" -ForegroundColor Magenta
Write-Host ""
Write-Host "After setup, go to Admin Panel → Settings → Profile Card Image" -ForegroundColor Green
Write-Host "to upload your hero image for instant loading!" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Your hero image will load with ZERO delay! ✨" -ForegroundColor Yellow
Write-Host ""

# Offer to open documentation
$response = Read-Host "Would you like to open STORAGE_SETUP.md for detailed instructions? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    if (Test-Path "STORAGE_SETUP.md") {
        Start-Process "STORAGE_SETUP.md"
    }
}
