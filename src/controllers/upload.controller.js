const { success, failed } = require("../utils/createResponse");
const deleteFile = require("../utils/deleteFile");
const uploadToRustfs = require("../utils/uploadToRustfs");

module.exports = {
  uploadToRustfs: async (req, res) => {
    try {
      let photo = null;
      let video = null;

      if (req.files) {
        if (req.files.photo) {
          photo = await uploadToRustfs(req.files.photo[0]);
          await deleteFile(req.files.photo[0].path);
        }
        if (req.files.video) {
          video = await uploadToRustfs(req.files.video[0]);
          await deleteFile(req.files.video[0].path);
        }
      }

      success(res, {
        code: 200,
        payload: {
          photo: photo ? photo.url : null,
          video: video ? video.url : null,
        },
        message: "Upload Success",
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
