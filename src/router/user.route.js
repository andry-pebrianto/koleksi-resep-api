const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/user.validation');
const runValidation = require('../middlewares/runValidation');
const upload = require('../middlewares/upload');
const {
  list,
  detail,
  update,
  remove,
  listRecipe,
} = require('../controllers/user.controller');
const { myself } = require('../middlewares/authorization');

const router = express.Router();

router
  .get('/user', jwtAuth, list)
  .get('/user/:id', jwtAuth, detail)
  .put('/user/:id', jwtAuth, upload, validation.update, runValidation, myself, update)
  .delete('/user/:id', jwtAuth, myself, remove)
  .get('/user/:id/recipe', jwtAuth, listRecipe); // belum

module.exports = router;
