import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// export const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.CONTABO_S3_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.CONTABO_S3_SECRET_ACCESS_KEY as string,
//   },
//   endpoint: process.env.CONTABO_S3_BUCKET_URL,
//   region: process.env.CONTABO_S3_REGION,
//   forcePathStyle: true, // Required for S3-compatible services like Contabo
// });
// const s3Client = new S3Client({
//   credentials: {
//     accessKeyId: process.env.CONTABO_S3_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.CONTABO_S3_SECRET_ACCESS_KEY as string,
//   },
//   endpoint: process.env.CONTABO_S3_BUCKET_URL,
//   region: process.env.CONTABO_S3_REGION, // This is important
//   forcePathStyle: true,  // Required for S3-compatible services like Contabo
// });

// const s3Client = new S3Client({
//   credentials: {
//     accessKeyId: process.env.CONTABO_S3_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.CONTABO_S3_SECRET_ACCESS_KEY as string,
//   },
//   endpoint: process.env.CONTABO_S3_BUCKET_URL,
//   region: process.env.CONTABO_S3_REGION, // Ensure region is passed
//   forcePathStyle: true, // Required for S3-compatible services like Contabo
// });


const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.CONTABO_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CONTABO_S3_SECRET_ACCESS_KEY as string,
  },
  endpoint: process.env.CONTABO_S3_BUCKET_URL,  // Important for Contabo S3
  region: process.env.CONTABO_S3_REGION,       // Correctly pass the region from env
  forcePathStyle: true,                        // Required for S3-compatible services
});
console.log(`S3 Region: ${process.env.CONTABO_S3_REGION}`);
export default s3Client;