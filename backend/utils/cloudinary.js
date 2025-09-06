const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.uploadImage = async (base64) => {
  const res = await cloudinary.uploader.upload(base64, { folder: "products" });
  return { url: res.secure_url, public_id: res.public_id };
};
exports.deleteImage = async (public_id) => {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
};
