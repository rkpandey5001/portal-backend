const express = require("express");
const auth = require("../middlewares/auth.js");

const {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} = require("../controllers/application.controller.js");
const router = express.Router();

router.route("/apply/:id").get(auth, applyJob);
router.route("/get").get(auth, getAppliedJobs);
router.route("/:id/applicants").get(auth, getApplicants);
router.route("/status/:id/update").put(auth, updateStatus);

module.exports = router;
