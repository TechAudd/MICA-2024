import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dm6nlbyjk', // Replace with your Cloudinary cloud name
  api_key: '198443816722286',       // Replace with your Cloudinary API key
  api_secret: 'u-hvGQ-RpkoxRGnpa6LB4a19U5o'  // Replace with your Cloudinary API secret
});

export default cloudinary;
