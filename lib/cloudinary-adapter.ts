import { v2 as cloudinary } from 'cloudinary';
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types';
import { getEnv } from './env';

cloudinary.config({
  cloud_name: getEnv('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnv('CLOUDINARY_API_KEY'),
  api_secret: getEnv('CLOUDINARY_API_SECRET'),
});

const CLOUDINARY_CLOUD_NAME = getEnv('CLOUDINARY_CLOUD_NAME') || '';

const UPLOAD_FOLDER = 'sg-platform';

export const cloudinaryAdapter: Adapter = ({ prefix }) => {
  const folder = prefix ? `${UPLOAD_FOLDER}/${prefix}` : UPLOAD_FOLDER;

  const adapter: GeneratedAdapter = {
    name: 'cloudinary',

    async handleUpload({ file, data }) {
      const result = await new Promise<Record<string, string>>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: file.filename.replace(/\.[^.]+$/, ''),
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as Record<string, string>);
          },
        );
        stream.end(file.buffer);
      });

      data.cloudinaryPublicId = result.public_id;
      data.url = result.secure_url;

      return data;
    },

    async handleDelete({ filename }) {
      const publicId = `${folder}/${filename.replace(/\.[^.]+$/, '')}`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {
        // Ignore delete errors — file may not exist
      }
    },

    generateURL({ filename }) {
      const publicId = `${folder}/${filename.replace(/\.[^.]+$/, '')}`;
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    },

    staticHandler(req, { params }) {
      const { filename } = params;
      const publicId = `${folder}/${filename.replace(/\.[^.]+$/, '')}`;
      const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
      return Response.redirect(url, 302);
    },
  };

  return adapter;
};
