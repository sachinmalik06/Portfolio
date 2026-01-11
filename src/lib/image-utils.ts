/**
 * Converts a Google Drive sharing URL to a direct image URL that can be used in <img> tags
 * 
 * Examples:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * 
 * Returns: https://drive.google.com/thumbnail?id=FILE_ID&sz=w2000
 * 
 * Note: File must be set to "Anyone with the link can view" in Google Drive sharing settings
 */
export function convertDriveUrlToDirectImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }

  const trimmedUrl = url.trim();

  // If it's already a direct Google Drive thumbnail URL, return as is
  if (trimmedUrl.includes('drive.google.com/thumbnail?')) {
    return trimmedUrl;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch1 = trimmedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch1) {
    fileId = fileIdMatch1[1];
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openIdMatch = trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch) {
      fileId = openIdMatch[1];
    }
  }

  // Format 3: https://drive.google.com/uc?id=FILE_ID (already in direct format, but missing export=view)
  if (!fileId) {
    const ucIdMatch = trimmedUrl.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
    if (ucIdMatch) {
      fileId = ucIdMatch[1];
    }
  }

  // If we found a file ID, convert to direct image URL
  if (fileId) {
    // Use thumbnail endpoint which is more reliable for embedding
    // sz=w2000 gives us a high-quality image (2000px width)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  }

  // If no file ID found, return original URL (might be a regular image URL)
  return trimmedUrl;
}

/**
 * Checks if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}






