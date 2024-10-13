const express = require("express");
const auth = require("../middlewares/auth.js");

const {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} = require("../controllers/company.controller.js");
const { singleUpload } = require("../middlewares/multer.js");
const router = express.Router();

router.route("/register").post(auth, registerCompany);
router.route("/getcompany").get(auth, getCompany);
router.route("/get/:id").get(auth, getCompanyById);
router.route("/update/:id").put(auth, singleUpload, updateCompany);

module.exports = router;
