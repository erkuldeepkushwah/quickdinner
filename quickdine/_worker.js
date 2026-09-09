export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Serve static assets from dist folder
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2)$/)) {
      return fetch(request);
    }
    
    // SPA fallback - serve index.html for all routes
    return fetch(new URL('/index.html', url.origin));
  },
};
