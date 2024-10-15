const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const dbconnect = require("./utils/db.js");
const userRouter = require("./routes/userRoutes.js");
const companyRouter = require("./routes/companyRoutes.js");
const jobRouter = require("./routes/jobRoutes.js");
const applicantsRouter = require("./routes/applicationRoutes.js");

dotenv.config({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use("/api/v1/user", userRouter);

app.use("/api/v1/company", companyRouter);

app.use("/api/v1/job", jobRouter);

app.use("/api/v1/applicant", applicantsRouter);

const port = 3000;

app.get("/api", (req, res) => {
  res.send({
    message: "Welcome to Job Portal Website developed by Rahul Kumar Pandey",
  });
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    dbconnect();
    console.log(`Server is running on port ${port}`);
  }
});
