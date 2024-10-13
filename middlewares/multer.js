const multer = require("multer");

const storage = multer.memoryStorage();

//add files

const singleUpload = multer({ storage: storage }).single("file");

module.exports = { singleUpload };
