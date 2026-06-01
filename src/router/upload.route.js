const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const photoLimit = require("../middlewares/photoLimit");
const { uploadToRustfs } = require("../controllers/upload.controller");

const router = express.Router();

router.post("/upload/rustfs", jwtAuth, upload, photoLimit, uploadToRustfs);

module.exports = router;
