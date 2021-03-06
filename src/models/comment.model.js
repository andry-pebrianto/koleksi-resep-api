const db = require('../config/db');

module.exports = {
  selectAll: (level, paging) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM comment ${level === 1 ? 'WHERE is_active=1' : ''} LIMIT ${paging.limit} OFFSET ${paging.offset}`, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM comment WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  store: (body) =>
    new Promise((resolve, reject) => {
      const {
        id, recipeId, commentText, userId,
      } = body;

      db.query(
        'INSERT INTO comment (id, recipe_id, comment_text, user_id) VALUES ($1, $2, $3, $4)',
        [id, recipeId, commentText, userId],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  updateById: (id, body) =>
    new Promise((resolve, reject) => {
      const { commentText } = body;

      db.query(
        'UPDATE comment SET comment_text=$1 WHERE id=$2',
        [commentText, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  removeById: (id) =>
    new Promise((resolve, reject) => {
      db.query('DELETE FROM comment WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  bannedById: (id, banned) =>
    new Promise((resolve, reject) => {
      db.query('UPDATE comment SET is_active=$1 WHERE id=$2', [banned, id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectAllCommentByRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT comment.id, comment.comment_text, comment.user_id, comment.recipe_id, users.name, users.photo FROM comment INNER JOIN users ON comment.user_id = users.id WHERE recipe_id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  countAll: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) FROM comment', (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
