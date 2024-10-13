const User = require("../models/UserSchema.js");
let dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");
dotenv.config();

const register = async (req, res) => {
  console.log(req.body);
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.uploader.upload(fileUri.content);
    console.log(myCloud);
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res
        .status(401)
        .json({ message: "Something is missing", success: false });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    const hashedPasssword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPasssword,
      role,
      profile: {
        profilePhoto: myCloud.secure_url,
      },
    });
    return res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (user.role !== role) {
      return res.status(401).json({
        message: "Account doesnt exist for this role",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }

    const tokenData = { userId: user._id };

    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullname}`, user, success: true });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (err) {
    console.log(err);
  }
};

const updateProfile = async (req, res) => {
  try {
    let { fullname, email, phoneNumber, bio, skills } = req.body;
    let file = req.file;

    // cloudinary upload

    const fileUri = getDataUri(file);
    console.log(file);

    const myCloud = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray = "";

    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; //middleware authentication

    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // updating data
    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
      user.email = email;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (bio) {
      user.profile.bio = bio;
    }
    if (skills) {
      user.profile.skills = skillsArray;
    }

    if (myCloud) {
      user.profile.resume = myCloud.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    console.log(myCloud);
    //resume comes here

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user, success: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
};
