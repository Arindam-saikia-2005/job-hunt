import { v2 as cloudinary } from "cloudinary"

const cloudinary_api_name = process.env.CLODINARY_API_NAME;
const cloudinaru_api_key = process.env.CLODINARY_API_KEY;
const cloudinary_secret_key= process.env.CLOUDINARY_API_SECRET;

if(!cloudinary_api_name || !cloudinary_secret_key || !cloudinaru_api_key) {
    throw new Error("Please provide all the Cloudinary credentails");
}

cloudinary.config({
    cloud_name:cloudinary_api_name,
    api_key:cloudinaru_api_key,
    api_secret:cloudinary_secret_key
})