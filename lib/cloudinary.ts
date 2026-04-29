 
import { ICloudinaryFile } from '@/types/file.interface';
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env';

 
cloudinary.config({
    cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
    api_key: ENV.CLOUDINARY.API_KEY,
    api_secret: ENV.CLOUDINARY.API_SECRET,
});
export { cloudinary };

export const formatCloudinaryResponse = (file: any): ICloudinaryFile => {
    return {
        secure_url: file.secure_url,
        url: file.url,
        public_id: file.public_id,
        resource_type: file.resource_type,
        format: file.format,
        bytes: file.bytes,
        type: file.type,
        original_filename: file.original_filename,
        width: file.width,
        height: file.height,
        duration: file.duration,
        // created_at: file.created_at,
    };
};