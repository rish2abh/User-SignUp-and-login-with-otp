const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_SCERET
});

module.exports = cloudinary
