const Job = require("../models/JobSchema.js");
//for student
const jobPost = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experience,
      location,
      jobType,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experience ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      experienceLevel: experience,
      location,
      jobType,
      position,
      company: companyId,
      created_by: userId,
    });

    return res
      .status(201)
      .json({ message: "Job posted successfully", job, success: true });
  } catch (err) {
    console.log(err);
  }
};

//get all jobs
const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", success: false });
    }
    return res.status(200).json({ jobs, success: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};

//get job by id for student
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applications");

    if (!job) {
      return res.status(404).json({ message: "No job found", success: false });
    }
    return res.status(200).json({ job, success: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};

//job created by admin
const getJobByAdmin = async (req, res) => {
  try {
    const jobs = await Job.find({ created_by: req.id })
      .populate("company")
      .populate("created_by");

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", success: false });
    }
    return res.status(200).json({ jobs, success: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  jobPost,
  getAllJobs,
  getJobById,
  getJobByAdmin,
};
