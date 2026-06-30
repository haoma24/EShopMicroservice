// Catalog stores only the image file name (e.g. "product-1.png").
// The actual assets live in `public/images/products/`, served from the web root.
const PRODUCT_IMAGE_BASE = '/images/products'

// Inline SVG shown when a product image is missing or fails to load.
export const PRODUCT_IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  )

export function resolveProductImage(imageFile: string | undefined | null): string {
  if (!imageFile) return PRODUCT_IMAGE_FALLBACK
  // Already an absolute URL or root-relative path — use as-is.
  if (/^(https?:)?\/\//.test(imageFile) || imageFile.startsWith('/')) return imageFile
  return `${PRODUCT_IMAGE_BASE}/${imageFile}`
}
