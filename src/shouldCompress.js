const MIN_COMPRESS_LENGTH = 1024
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 100

function shouldCompress(req) {
  const { originType, originSize, webp } = req.params
  const { url = '', headers = {} } = req

  // Cloudflare 相關請求直接 bypass
  if (
    headers['cf-ray'] ||                    // Cloudflare Ray ID
    url.includes('/cdn-cgi/') ||           // Cloudflare 路徑
    headers.server === 'cloudflare' ||      // Cloudflare 服務器標記
    headers['cf-challenge'] ||              // CF 挑戰標記
    url.includes('challenges.cloudflare')   // CF 挑戰頁面
  ) {
    return false
  }

  // 原有的判斷邏輯
  if (!originType.startsWith('image')) return false
  if (originSize === 0) return false
  if (webp && originSize < MIN_COMPRESS_LENGTH) return false
  if (
    !webp &&
    (originType.endsWith('png') || originType.endsWith('gif')) &&
    originSize < MIN_TRANSPARENT_COMPRESS_LENGTH
  ) {
    return false
  }

  return true
}

module.exports = shouldCompress
