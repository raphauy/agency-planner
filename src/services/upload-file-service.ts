import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFileWithUrl(url: string) {
  try {
    // Subir el archivo a Cloudinary
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload(url, { resource_type: 'auto', upload_preset: process.env.CLOUDINARY_PRESET }, (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error('No result returned from Cloudinary'));
        else resolve(result);
      });
    });

    console.log('Archivo subido con éxito:', result);
    return result.secure_url;
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
  }

}

export async function uploadFile(filePath: string) {
  try {
    // Leer el archivo del sistema de archivos
    const fileContent = fs.createReadStream(filePath);
    
    // Subir el archivo a Cloudinary
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto', upload_preset: process.env.CLOUDINARY_PRESET }, (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error('No result returned from Cloudinary'));
        else resolve(result);      });

      fileContent.pipe(uploadStream);
    });

    console.log('Archivo subido con éxito:', result);
    return result.secure_url;
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
  }
}

type CloudinaryResponse= {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

