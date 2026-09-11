export default function middleware(request) {
  const url = new URL(request.url)
  const params = url.searchParams
  
  if (Array.from(params.keys()).length > 0) {
    let hasJunk = false
    const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    
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
  
  // Force canonical hostname
  if (url.hostname === 'bhaktiamritsanatan.com' || url.hostname.endsWith('vercel.app')) {
    url.hostname = 'www.bhaktiamritsanatan.com'
    return Response.redirect(url, 301)
  }
}
