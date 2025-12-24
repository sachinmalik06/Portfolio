#!/bin/bash

# Backend Environment Variables Setup Script
# Generated from Vly for Git Sync
# Run this script to set up your Convex backend environment variables

echo 'Setting up Convex backend environment variables...'

# Check if Convex CLI is installed
if ! command -v npx &> /dev/null; then
    echo 'Error: npx is not installed. Please install Node.js and npm first.'
    exit 1
fi

echo "Setting JWKS..."
npx convex env set "JWKS" -- "{\"keys\":[{\"kty\":\"RSA\",\"n\":\"weA__mddxyFwEADLxDW3WnmzfTiJWaEt5jowTXAW8f6WKH9KRsTOtMJ22Zo9zGv2XUGeMQrCq39yOsWWNmMAMum12Kk4iWVP_mQjEeCzpLFO9QPDzCcqjEpe1pS_W5fj_AM8xdY2xG31yQMNU8KSN5DaGChfRKAxUfYOHfn9y5gEjDBnMYOK-Q3ZVSfUwz2KOWxRx0eeE2aMDjc86LKgfQyWJOYBNtYJ0_lmCvt741ymGCdy6AFgGxOCCJky6urM861ONLTumMPYGbzz4I3MOJJO_AtkLbYRxBYOUu7GCQEe9-gKPYHoV3WmcWefIqmcpZHlJk6Yh06bdKZT42SrCw\",\"e\":\"AQAB\",\"use\":\"sig\"}]}"

echo "Setting JWT_PRIVATE_KEY..."
npx convex env set "JWT_PRIVATE_KEY" -- "-----BEGIN PRIVATE KEY-----"

echo "Setting SITE_URL..."
npx convex env set "SITE_URL" -- "https://runtime-monitoring.vly.ai"

echo "Setting VLY_APP_NAME..."
npx convex env set "VLY_APP_NAME" -- "Cinematic Strategy"

echo "Setting VLY_INTEGRATION_BASE_URL..."
npx convex env set "VLY_INTEGRATION_BASE_URL" -- "https://integrations.vly.ai/"

echo "Setting VLY_INTEGRATION_KEY..."
npx convex env set "VLY_INTEGRATION_KEY" -- "sk_b962f37e5b6dda6fef7bec69589cd8c74a6f6a7c94ebdd5da6037a30931c1a88"

echo "✅ All backend environment variables have been set!"
echo "You can now run: pnpm dev:backend"
