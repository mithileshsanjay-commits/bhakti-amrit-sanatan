export default function middleware(request) {
  const url = new URL(request.url)
  const params = url.searchParams
  
  if (Array.from(params.keys()).length > 0) {
    let hasJunk = false
    const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 's', 'q', 'cat', 'tag', 'page', 'lang', 'city']
    
    for (const key of Array.from(params.keys())) {
      if (!allowed.includes(key.toLowerCase())) {
        hasJunk = true
        params.delete(key)
      }
    }
    
    // If we stripped junk parameters, redirect to the clean URL permanently to fix SEO.
    if (hasJunk) {
      url.search = params.toString()
      return Response.redirect(url, 301)
    }
  }
  
  // Exclude non-Dharma cricket / IPL URLs and retired Shop URLs permanently with 410 Gone
  const pathname = decodeURIComponent(url.pathname).toLowerCase()
  if (
    pathname === '/shop' ||
    pathname === '/shop.html' ||
    pathname.startsWith('/shop/') ||
    pathname.includes('cricket') || 
    pathname.includes('आईपीएल') || 
    pathname.includes('ipl')
  ) {
    return new Response('410 Gone - This section has been retired.', {
      status: 410,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  }

  // Force canonical hostname
  if (url.hostname === 'bhaktiamritsanatan.com' || url.hostname.endsWith('vercel.app')) {
    url.hostname = 'www.bhaktiamritsanatan.com'
    return Response.redirect(url, 301)
  }
}
