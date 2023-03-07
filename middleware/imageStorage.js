const multer = require("multer");
const path = require("path");
const imgconfig = multer.diskStorage({})
// const imgconfig = multer.diskStorage({destination:({}),

//   filename: (req, file, callback) => {
//     console.log(file)
//     callback(null, `image_${Date.now()}.${file.originalname}`);
//   },
// });

const isImage = (req, file, callback) => {
  console.log(file)
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only image is allowed"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

module.exports = upload;