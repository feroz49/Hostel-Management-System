export const ROOM_IMAGE_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
    </defs>
    <rect width="1200" height="700" fill="url(#bg)" />
    <rect x="180" y="360" width="840" height="200" rx="22" fill="#334155" />
    <rect x="220" y="325" width="250" height="145" rx="18" fill="#475569" />
    <rect x="505" y="325" width="250" height="145" rx="18" fill="#475569" />
    <rect x="790" y="325" width="190" height="145" rx="18" fill="#475569" />
    <text x="600" y="195" text-anchor="middle" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="56" font-weight="700">
      Room Preview
    </text>
    <text x="600" y="250" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="30">
      Image temporarily unavailable
    </text>
  </svg>`
)}`

export const handleRoomImageError = (event) => {
  const image = event.currentTarget
  image.onerror = null
  image.src = ROOM_IMAGE_FALLBACK
}
