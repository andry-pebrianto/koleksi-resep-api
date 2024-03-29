const jwt = require('jsonwebtoken');
const { failed } = require('../utils/createResponse');
const { ACCESS_TOKEN_KEY } = require('../utils/env');

module.exports = (req, res, next) => {
  try {
    const { token } = req.headers;
    const decoded = jwt.verify(token, ACCESS_TOKEN_KEY);

    req.APP_DATA = { tokenDecoded: decoded };
    next();
  } catch (error) {
    failed(res, {
      code: 401,
      payload: 'Token Invalid',
      message: 'Unauthorized',
    });
  }
};
