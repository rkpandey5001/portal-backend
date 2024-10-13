const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });
    }

    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token", success: false });
    }

    // Attach user to request object
    req.id = decoded.userId;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
