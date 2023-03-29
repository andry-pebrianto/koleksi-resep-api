const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const authModel = require("../models/auth.model");
const userModel = require("../models/user.model");
const { success, failed } = require("../utils/createResponse");
const sendEmail = require("../utils/email/sendEmail");
const activateAccountEmail = require("../utils/email/activateAccountEmail");
const resetAccountEmail = require("../utils/email/resetAccountEmail");
const jwtToken = require("../utils/generateJwtToken");
const { APP_NAME, EMAIL_FROM, API_URL, CLIENT_URL } = require("../utils/env");

module.exports = {
  register: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      const user = await userModel.selectByEmail(email);
      if (user.rowCount) {
        failed(res, {
          code: 409,
          payload: "Email already exist",
          message: "Register Failed",
        });
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(30).toString("hex");
      const insertData = await authModel.register({
        fullName,
        email,
        password: passwordHashed,
      });
      await authModel.updateToken(insertData.rows[0].id, token);

      // send email for activate account
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: "Activate Your Account!",
        html: activateAccountEmail(`${API_URL}/auth/activation/${token}`),
      };
      sendEmail(templateEmail);

      success(res, {
        code: 201,
        payload: null,
        message: "Register Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authModel.login(email);

      if (user.rowCount) {
        if (user.rows[0].is_active) {
          if (!user.rows[0].google_id) {
            const match = await bcrypt.compare(password, user.rows[0].password);

            if (match) {
              const refreshToken = await jwtToken.generateRefreshToken({
                id: user.rows[0].id,
                level: user.rows[0].level,
              });
              const accessToken = await jwtToken.generateAccessToken({
                id: user.rows[0].id,
                level: user.rows[0].level,
              });

              await authModel.deleteRefreshToken(user.rows[0].id);
              await authModel.insertRefreshToken(user.rows[0].id, refreshToken);

              success(res, {
                code: 200,
                payload: null,
                message: "Login Success",
                token: {
                  refreshToken,
                  accessToken,
                  id: user.rows[0].id,
                },
              });
              return;
            }
          } else {
            failed(res, {
              code: 400,
              payload:
                "Your email has been linked with google. Please login with google.",
              message: "Login Failed",
            });
            return;
          }
        } else {
          failed(res, {
            code: 403,
            payload: "Your account has been banned",
            message: "Login Failed",
          });
          return;
        }
      }

      failed(res, {
        code: 401,
        payload: "Wrong Email or Password",
        message: "Login Failed",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  googleAuth: async (req, res) => {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const response = await client.verifyIdToken({
        idToken: req.body.tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // if google email not verified
      if (!response.payload.email_verified) {
        failed(res, {
          code: 409,
          payload: "Email not verified",
          message: "Register Failed",
        });
        return;
      }

      const user = await userModel.selectByEmail(response.payload.email);
      if (user.rowCount) {
        failed(res, {
          code: 409,
          payload: "Email already exist",
          message: "Register Failed",
        });
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(30).toString("hex");
      const insertData = await authModel.register({
        fullName,
        email,
        password: passwordHashed,
      });
      await authModel.updateToken(insertData.rows[0].id, token);

      // send email for activate account
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: "Activate Your Account!",
        html: activateAccountEmail(`${API_URL}/auth/activation/${token}`),
      };
      sendEmail(templateEmail);

      success(res, {
        code: 201,
        payload: null,
        message: "Register Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  activation: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await authModel.checkEmailToken(token);

      if (!user.rowCount) {
        res.send(`
        <div>
          <h1>Activation Failed</h1>
          <h3>Token invalid</h3>
        </div>`);
        return;
      }
      await authModel.activateEmail(user.rows[0].id);
      await authModel.updateToken(user.rows[0].id, "");

      res.send(`
      <div>
        <h1>Activation Success</h1>
        <h3>You can login now</h3>
      </div>`);
    } catch (error) {
      res.send(`
      <div>
        <h1>Activation Failed</h1>
        <h3>${error.message}</h3>
      </div>`);
    }
  },
  forgot: async (req, res) => {
    try {
      const user = await userModel.selectByEmail(req.body.email);
      if (user.rowCount) {
        const token = crypto.randomBytes(30).toString("hex");
        // update email token
        await authModel.updateToken(user.rows[0].id, token);

        // send email for reset password
        const templateEmail = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: req.body.email.toLowerCase(),
          subject: "Reset Your Password!",
          html: resetAccountEmail(`${CLIENT_URL}/auth/reset/${token}`),
        };
        sendEmail(templateEmail);
      }

      success(res, {
        code: 200,
        payload: null,
        message: "Forgot Password Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  reset: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await authModel.checkEmailToken(token);
      console.log(user.rows);

      if (!user.rowCount) {
        failed(res, {
          code: 401,
          payload: "Token invalid",
          message: "Reset Password Failed",
        });
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);
      await authModel.resetPassword(user.rows[0].id, password);
      await authModel.updateToken(user.rows[0].id, "");

      success(res, {
        code: 200,
        payload: null,
        message: "Reset Password Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
};
