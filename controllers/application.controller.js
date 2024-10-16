const Application = require("../models/ApplicationSchema.js");
const Job = require("../models/JobSchema.js");

const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Job Id is required", success: false });
    }
    const application = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (application) {
      return res
        .status(201)
        .json({ message: "Already applied for this job", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(201)
      .json({ message: "Job applied successfully", success: true });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!applications) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }
    // const applications = await Application.find({ applicant: userId }).populate({ path: 'job', select: 'title company location'
    return res
      .status(200)
      .json({ message: "Applied jobs", applications, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant" },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ message: "Applicants", job, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status is required", success: false });
    }

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
};
