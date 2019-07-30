const sharp = require("sharp");

module.exports = config => {
  console.log("cfg => ", config);
  return sharp(config.path)
    .resize(config.width, config.height)
    .toFile(config.outputName);
};
