const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );
  app.use(
    "/images",
    createProxyMiddleware({
      target: "127.0.0.1:8000",
      changeOrigin: true,
    })
  );
};
