import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadResult = {
  url: string
  bytes: number
}

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

    console.log('Archivo subido con éxito a Cloudinary:');
    console.log('\tbytes:', result.bytes);
    console.log('\turl:', result.secure_url);
    const res: UploadResult= {
      url: result.secure_url,
      bytes: result.bytes
    }
    return res 
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
    return null
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
    const res: UploadResult= {
      url: result.secure_url,
      bytes: result.bytes
    }
    return res 
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
    return null
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

/**
 * Get data from Cloudinary functions:
 */

//const cloudinary = require('cloudinary').v2;

export async function getFileInfo(url: string): Promise<CloudinaryResponse | null> {
  try {
    // Extrae el ID público del recurso de la URL
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    const publicId = parts.slice(uploadIndex + 2).join('/').split('.')[0]; // +2 para saltar 'upload' y la versión
    console.log('publicId:', publicId)
    

    // Obtén los detalles del recurso usando el ID público
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.api.resource(publicId, (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error('No result returned from Cloudinary'));
        else resolve(result);
      });
    });
    return result;
  } catch (error) {
    console.error('Error obteniendo la información del archivo:', error);
    return null;
  }
}