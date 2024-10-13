const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // resume file path
      resumeOriginalName: { type: String }, // resume original name
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: { type: String, default: "" }, // profile photo file path
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // this will add createdAt and updatedAt fields automatically
);

// export the model
module.exports = mongoose.model("User", UserSchema);
