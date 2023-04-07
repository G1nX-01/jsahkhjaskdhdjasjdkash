function accessLog(req, res, next) {
  const { hostname, method, path, ip, protocol } = req;
  console.log(`ACCESS: ${method} ${protocol}://${hostname}${path} - ${ip}`);
  next();
}

function errorLog(err, req, res, next) {
  const { hostname, method, path, protocol } = req;
  console.log(`ERROR: ${method} ${protocol}://${hostname}${path} - ${err}`);
  // next(); // you can call either next or send a uniform error response
  res.status(500).send({ status: "server-error", message: err.message });
}

function setHeaders(req, res, next) {
  // Allows resource sharing for clients that are hosted on
  // Different domains. Useful for public APIs
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Restrict http - methods to a chosen few. This applies only
  // When the browser sends a Preflight request, e.g. when using
  // window.fetch().
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE, OPTIONS");

  // Add some basic cache control for requesting browsers
  res.setHeader("Cache-Control", "private, max-age=120");

  // Use this header to cache files that do not change often,
  // e.g. static HTML, CSS or Javascript for 5 days
  // res.setHeader("Cache-Control", "public, max-age=432000, immutable")

  // If you want no cache at all, uncomment this header
  // res.setHeader("Cache-Control": "no-store, max-age=0")

  // You can also remove standard headers. In case of express,
  // the following will get rid of the X-Powered-By header
  res.removeHeader('X-Powered-By');
  next();
}

module.exports = { accessLog, errorLog, setHeaders };