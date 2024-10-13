const express = require("express");
const auth = require("../middlewares/auth.js");

const {
  register,
  login,
  logout,
  updateProfile,
} = require("../controllers/user.controllers.js");
const { singleUpload } = require("../middlewares/multer.js");
const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(auth, singleUpload, updateProfile);

module.exports = router;
