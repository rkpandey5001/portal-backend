const express = require("express");
const Company = require("../models/CompanySchema.js");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");

//get all companies

const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res
        .status(400)
        .send({ message: "Please enter company name", success: false });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res
        .status(400)
        .send({ message: "Company already exists", success: false });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.id; //current or logged user id

    let companies = await Company.find({ userId });
    if (!companies) {
      return res
        .status(400)
        .send({ message: "Companies not found", success: false });
    }
    return res.status(200).json({
      message: "Companies found successfully",
      companies,
      success: true,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getCompanyById = async (req, res) => {
  try {
    let companyId = req.params.id;
    let company = await Company.findById(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false, id: companyId });
    }

    return res.status(200).json({
      message: "Company found successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const file = req.file; //cloudinary

    const fileUri = getDataUri(file); //cloudinary

    const resCloud = await cloudinary.uploader.upload(fileUri.content);
    const logo = resCloud.secure_url;

    const updateData = {
      name,
      description,
      website,
      location,
      logo,
    };

    let company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res
        .status(404)
        .send({ message: "Company not found", success: false });
    }
    return res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany };
