import * as Minio from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'password'
});

export const initStorage = async () => {
  const bucket = 'mailo-messages';
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, 'us-east-1');
      console.log(`Bucket ${bucket} created.`);
    }
  } catch (err) {
    console.error('MinIO Init Error:', err);
  }
};

export const saveMessageBody = async (key, stream, size) => {
  const bucket = 'mailo-messages';
  return minioClient.putObject(bucket, key, stream, size);
};

export const getMessageBody = async (key) => {
  const bucket = 'mailo-messages';
  return minioClient.getObject(bucket, key);
};

export default minioClient;
