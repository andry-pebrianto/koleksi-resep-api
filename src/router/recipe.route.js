const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/recipe.validation');
const runValidation = require('../middlewares/runValidation');
const { onlyAdmin, onlyUser, recipeOwner } = require('../middlewares/authorization');
const {
  list,
  detail,
  insert,
  update,
  remove,
  banned,
  listComment,
  latest,
} = require('../controllers/recipe.controller');

const router = express.Router();

router
  // semua role
  .get('/recipe', jwtAuth, list)
  // semua pengguna internet
  .get('/recipe/latest', latest)
  // semua role
  .get('/recipe/:id', jwtAuth, detail)
  // hanya user
  .post('/recipe', jwtAuth, onlyUser, validation.insert, runValidation, insert)
  // hanya user dan pemilik
  .put('/recipe/:id', jwtAuth, onlyUser, recipeOwner, validation.insert, runValidation, update)
  // hanya user dan pemilik
  .delete('/recipe/:id', jwtAuth, onlyUser, recipeOwner, remove)
  // hanya admin
  .put('/recipe/banned/:id', jwtAuth, onlyAdmin, banned)
  // semua role
  .get('/recipe/:id/comment', jwtAuth, listComment);

module.exports = router;
