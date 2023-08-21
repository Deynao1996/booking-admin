export const getCroppedImageUrl = (baseUrl, pattern, params) => {
  if (!baseUrl) return
  return baseUrl.replace(pattern, params)
}
