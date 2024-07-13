import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import * as fs from 'fs';

type UploadResult = {
  url: string
  bytes: number
}

export async function uploadFileWithUrl(url: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
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

export async function getFileInfo(url: string, configOptions: ConfigOptions): Promise<CloudinaryResponse | null> {

  if (!url.includes(configOptions.cloud_name!)) {
    console.log("configOptions.cloud_name", configOptions.cloud_name)
    const defaultCloudName= process.env.CLOUDINARY_CLOUD_NAME!
    if (!url.includes(defaultCloudName)) {
      console.log("url not found", url)
      console.log("default cloud name", defaultCloudName)      
      return null
    } else {
      console.log("using default cloud name", defaultCloudName)
      configOptions.cloud_name= defaultCloudName
      configOptions.api_key= process.env.CLOUDINARY_API_KEY!
      configOptions.api_secret= process.env.CLOUDINARY_API_SECRET!
    }
  }
  cloudinary.config(configOptions)

  try {
    // Extrae el ID público del recurso de la URL
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    const publicId = decodeURIComponent(parts.slice(uploadIndex + 2).join('/').split('.').slice(0, -1).join('.'))
    
    // Determina el tipo de recurso basado en la extensión del archivo
    const fileExtension = parts.slice(-1)[0].split('.').slice(-1)[0];
    const resourceType = fileExtension.match(/(mp4|mov|avi|mkv|webm)/i) ? 'video' : 'image';

    // Obtén los detalles del recurso usando el ID público
    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.api.resource(publicId, { resource_type: resourceType }, (error, result) => {
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