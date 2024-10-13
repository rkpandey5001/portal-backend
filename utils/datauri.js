const DataUriParser = require("datauri/parser.js");
const Path = require("path");

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = Path.extname(file.originalname).toString();
  const myUri = parser.format(extName, file.buffer);
  return myUri;
};

module.exports = getDataUri;
