/**
 * Utility functions for handling encrypted image URLs
 * Converts Azure Blob Storage URLs to decrypt endpoint URLs
 */

/**
 * Checks if a URL is an Azure Blob Storage URL
 */
const isAzureBlobUrl = (url: string | undefined | null): boolean => {
  if (!url) return false
  return url.includes('blob.core.windows.net') || url.includes('azure')
}

/**
 * Converts an Azure Blob Storage URL to a decrypt endpoint URL
 * If the URL is not an Azure URL, returns it as-is
 * 
 * @param url - The original image URL (Azure Blob Storage URL or regular URL)
 * @returns The decrypt endpoint URL or original URL if not Azure
 */
export const getDecryptedImageUrl = (url: string | undefined | null): string => {
  if (!url) return ''
  
  // If it's not an Azure URL, return as-is (for local images, external images, etc.)
  if (!isAzureBlobUrl(url)) {
    return url
  }
  
  // Convert to decrypt endpoint URL
  // Use relative URL if no base URL is configured (for same-origin requests)
  const encodedUrl = encodeURIComponent(url)
  
  // Use relative path for decrypt endpoint (works with proxy or same origin)
  return `/api/files/decrypt?url=${encodedUrl}`
}

/**
 * Hook-like function to get decrypted image URL
 * Can be used in components
 */
export const useDecryptedImageUrl = (url: string | undefined | null): string => {
  return getDecryptedImageUrl(url)
}

