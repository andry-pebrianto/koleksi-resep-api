const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { APP_NAME, NODE_ENV, PORT } = require("./utils/env");
const { failed } = require("./utils/createResponse");

// deklarasi express
const app = express();

// middleware
app.use(express.json());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);
app.use(xss());
app.use(cors());
app.use(express.static("public"));

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 request per IP per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too Many Requests",
    data: "Terlalu banyak request, coba lagi setelah 15 menit",
  },
});
app.use(limiter);

// root router
app.get("/", (req, res) =>
  res.send(
    `${APP_NAME} API - ${NODE_ENV[0].toUpperCase() + NODE_ENV.slice(1)}`,
  ),
);
// main router
app.use(require("./router/auth.route"));
app.use(require("./router/user.route"));
app.use(require("./router/recipe.route"));
app.use(require("./router/comment.route"));
app.use(require("./router/tag.route"));
app.use(require("./router/upload.route"));
// 404 router
app.use((req, res) => {
  failed(res, {
    code: 404,
    payload: "Resource on that url not found",
    message: "Not Found",
  });
});

// running server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with ${NODE_ENV} environment`);
  console.log(`Visit http://localhost:${PORT}`);
  console.log("Developed by Andry Pebrianto");
});
