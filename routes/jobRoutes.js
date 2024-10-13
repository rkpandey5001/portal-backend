const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");

const {
  jobPost,
  getAllJobs,
  getJobById,
  getJobByAdmin,
} = require("../controllers/job.controller.js");

router.route("/post").post(auth, jobPost);
router.route("/getjobs").get(auth, getAllJobs);
router.route("/getadminjobs").get(auth, getJobByAdmin);
router.route("/get/:id").get(auth, getJobById);

module.exports = router;
