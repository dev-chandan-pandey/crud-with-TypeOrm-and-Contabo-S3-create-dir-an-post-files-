// import { s3 } from '../utils/s3Client';
// import { PutObjectCommand, DeleteObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
// import { Readable } from 'stream';

// // Upload file to S3 bucket using streams
// export const uploadFileToS3 = async (directoryName: string, fileName: string, fileStream: Readable, contentType: string) => {
//   const filePath = `${directoryName}/${fileName}`;

//   const uploadParams = {
//     Bucket: process.env.CONTABO_S3_BUCKET_NAME as string,
//     Key: filePath,
//     Body: fileStream,
//     ContentType: contentType,
//   };

//   await s3.send(new PutObjectCommand(uploadParams));

//   return `${process.env.CONTABO_S3_BUCKET_URL}/${filePath}`;
// };

// // List files in a directory
// export const listFilesInDirectory = async (directoryName: string) => {
//   const listParams = {
//     Bucket: process.env.CONTABO_S3_BUCKET_NAME as string,
//     Prefix: `${directoryName}/`,
//   };

//   const data = await s3.send(new ListObjectsCommand(listParams));
//   return data.Contents?.map(file => file.Key);
// };

// // Delete a file from the S3 bucket
// export const deleteFileFromS3 = async (directoryName: string, fileName: string) => {
//   const deleteParams = {
//     Bucket: process.env.CONTABO_S3_BUCKET_NAME as string,
//     Key: `${directoryName}/${fileName}`,
//   };

//   await s3.send(new DeleteObjectCommand(deleteParams));
// };
//2
// import { s3 } from '../utils/s3Client';
// import { PutObjectCommand, DeleteObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
// import { Readable } from 'stream';
// import logger from '../utils/logger'; // Import logger

// // Upload file to S3 bucket using streams
// export const uploadFileToS3 = async (directoryName: string, fileName: string, fileStream: Readable, contentType: string) => {
//   const filePath = `${directoryName}/${fileName}`;

//   const uploadParams = {
//     Bucket: process.env.CONTABO_S3_BUCKET_NAME as string,
//     Key: filePath,
//     Body: fileStream,
//     ContentType: contentType,
//   };

//   try {
//     logger.info(`Uploading file: ${fileName} to directory: ${directoryName}`);
//     await s3.send(new PutObjectCommand(uploadParams));
//     logger.info(`File uploaded successfully: ${fileName}`);
//     return `${process.env.CONTABO_S3_BUCKET_URL}/${filePath}`;
//   } catch (error) {
//     logger.error(`Error uploading file: ${fileName}, Error: ${error}`);
//     throw new Error("Error uploading file");
//   }
// };

// // List files in a directory
// export const listFilesInDirectory = async (directoryName: string) => {
//   const listParams = {
//     Bucket: process.env.CONTABO_S3_BUCKET_NAME as string,
//     Prefix: `${directoryName}/`,
//   };

//   try {
//     logger.info(`Listing files in directory: ${directoryName}`);
//     const data = await s3.send(new ListObjectsCommand(listParams));
//     logger.info(`Files listed successfully in directory: ${directoryName}`);
//     return data.Contents?.map(file => file.Key);
//   } catch (error) {
//     logger.error(`Error listing files in directory: ${directoryName}, Error: ${error}`);
//     throw new Error("Error listing files");
//   }
// };

// // Delete a file from the S3 bucket
// export const deleteFileFromS3 = async (directoryName: string, fileName: string) => {
//   const deleteParams = {
//     Bucket: process.env.CONTABO_S3_BUCKET_NAME as string,
//     Key: `${directoryName}/${fileName}`,
//   };

//   try {
//     logger.info(`Deleting file: ${fileName} from directory: ${directoryName}`);
//     await s3.send(new DeleteObjectCommand(deleteParams));
//     logger.info(`File deleted successfully: ${fileName}`);
//   } catch (error) {
//     logger.error(`Error deleting file: ${fileName}, Error: ${error}`);
//     throw new Error("Error deleting file");
//   }
// };
// 2end

// 


// 
import { PutObjectCommand, ListObjectsV2Command, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from '../utils/logger';
import s3Client from '../utils/s3Client';
import { Readable } from 'stream';

// Check if directory exists
// Check if directory exists
export const checkDirectoryExists = async (directoryName: string): Promise<boolean> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
      Prefix: `${directoryName}/`,  // S3 directories are just keys with a "/" suffix
      MaxKeys: 1
    });
    const response = await s3Client.send(command);
    logger.info(`Directory exists check: ${directoryName}`);

    // Ensure Contents is not undefined and has at least one item
    return !!(response.Contents && response.Contents.length > 0); // Convert to boolean
  } catch (error) {
    logger.error(`Error checking directory existence for: ${directoryName}`, error);
    return false;  // Always return a boolean
  }
};



// Create directory in S3
export const createDirectory = async (directoryName: string): Promise<void> => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
      Key: `${directoryName}/`,  // S3 directory as a key with '/'
      Body: '',  // Empty body to act as a folder
    });
    await s3Client.send(command);
    logger.info(`Directory created: ${directoryName}`);
  } catch (error) {
    logger.error(`Error creating directory: ${directoryName}`, error);
    throw new Error(`Error creating directory: ${error}`);
  }
};

// Upload file to S3
export const uploadFileToS3 = async (fileStream: Readable, fileName: string, directoryName: string) => {
  logger.info(`S3 Region: ${process.env.CONTABO_S3_REGION}`);

  try {
    // Check if directory exists, and create if it doesn't
    const directoryExists = (await checkDirectoryExists(directoryName)) ?? false;
if (!directoryExists) {
  logger.info(`Directory ${directoryName} does not exist, creating.`);
  await createDirectory(directoryName);
}

    // Upload the file
    const command = new PutObjectCommand({
      Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
      Key: `${directoryName}/${fileName}`,
      Body: fileStream,  // Direct stream to S3
    });
    await s3Client.send(command);
    logger.info(`File uploaded successfully: ${fileName} in directory ${directoryName}`);
    return `${process.env.CONTABO_S3_BUCKET_URL}/${directoryName}/${fileName}`;
  } catch (error) {
    logger.error(`Error uploading file: ${fileName}`, error);
    throw new Error(`Error during file upload: ${error}`);
  }
};

// Delete file from S3
export const deleteFile = async (directoryName: string, fileName: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
      Key: `${directoryName}/${fileName}`,
    });
    await s3Client.send(command);
    logger.info(`File deleted: ${fileName} from directory ${directoryName}`);
  } catch (error) {
    logger.error(`Error deleting file: ${fileName} from ${directoryName}`, error);
    throw new Error(`Error deleting file: ${error}`);
  }
};

// List files in directory
// export const listFilesInDirectory = async (directoryName: string): Promise<any[]> => {
//   try {
//     const command = new ListObjectsV2Command({
//       Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
//       Prefix: `${directoryName}/`,
//     });
//     const response = await s3Client.send(command);
//     logger.info(`Files listed in directory: ${directoryName}`);
//     return response.Contents || [];
//   } catch (error) {
//     logger.error(`Error listing files in directory: ${directoryName}`, error);
//     throw new Error(`Error listing files: ${error}`);
//   }
// };
// export const listFilesInDirectory = async (directoryName: string): Promise<any[]> => {
//   try {
//     logger.info(`Checking for files in directory: ${directoryName}`);

//     const command = new ListObjectsV2Command({
//       Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
//       Prefix: `${directoryName}/`,
//     });

//     const response = await s3Client.send(command);

//     // Check if contents exist and list the files
//     if (!response.Contents || response.Contents.length === 0) {
//       logger.warn(`No files found in directory: ${directoryName}`);
//       return [];
//     }

//     logger.info(`Files listed in directory: ${directoryName}`);
//     return response.Contents || [];
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       // Specific handling if the error is of type Error
//       logger.error(`Error listing files in directory: ${directoryName}`, error.message);

//       if (error.name === 'NoSuchKey') {
//         logger.warn(`Directory ${directoryName} does not exist.`);
//       }
//     } else {
//       logger.error(`Unknown error occurred while listing files in ${directoryName}`);
//     }

//     throw new Error(`Error listing files: ${error}`);
//   }
// };
// List files in the specified directory in S3
// export const listFilesInDirectory = async (directoryName: string): Promise<any[]> => {
//   try {
//     logger.info(`Checking for files in directory: ${directoryName}`);

//     const command = new ListObjectsV2Command({
//       Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
//       Prefix: `${directoryName}/`,  // Ensure you're checking with the "/" suffix for a "directory"
//       MaxKeys: 1000  // Specify max keys to return in one call
//     });

//     const response = await s3Client.send(command);

//     // If no files found, log it and return an empty array
//     if (!response.Contents || response.Contents.length === 0) {
//       logger.warn(`No files found in directory: ${directoryName}`);
//       return [];
//     }

//     logger.info(`Files listed in directory: ${directoryName}`);
//     return response.Contents || [];
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       logger.error(`Error listing files in directory: ${directoryName}`, error.message);
//     } else {
//       logger.error(`Unknown error occurred while listing files in ${directoryName}`);
//     }
//     throw new Error(`Error listing files: ${error}`);
//   }
// };

import { HeadBucketCommand } from "@aws-sdk/client-s3";

export const checkBucketExists = async () => {
  try {
    const command = new HeadBucketCommand({
      Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
    });

    await s3Client.send(command);
    logger.info("Bucket exists and is accessible.");
  } catch (error) {
    logger.error("Error checking bucket existence", error);
  }
};

export const listFilesInDirectory = async (directoryName: string): Promise<any[]> => {
  // try {
  //   logger.info(`Listing files in directory: ${directoryName}`);
    
  //   // Ensure directory name ends with "/" to represent an S3 "directory"
  //   const prefix = directoryName.endsWith('/') ? directoryName : `${directoryName}/`;

  //   const command = new ListObjectsV2Command({
  //     Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
  //     Prefix: prefix,  // Ensure to use the correct key prefix with "/"
  //     MaxKeys: 1000,  // Fetch up to 1000 files (can adjust if needed)
  //   });

  //   const response = await s3Client.send(command);

  //   if (!response.Contents || response.Contents.length === 0) {
  //     logger.warn(`No files found in directory: ${directoryName}`);
  //     return [];
  //   }

  //   logger.info(`Files listed in directory: ${directoryName}`);
  //   return response.Contents || [];
  // } catch (error: unknown) {
  //   if (error instanceof Error) {
  //     logger.error(`Error listing files in directory: ${directoryName}`, error.message);
  //   } else {
  //     logger.error(`Unknown error occurred while listing files in ${directoryName}`);
  //   }
  //   throw new Error(`Error listing files: ${error}`);
  // }


  // try {
  //   checkBucketExists();
  //   const prefix = `${directoryName}/`; // Ensure the prefix ends with "/"
  //   logger.info(`Listing files in directory: ${prefix}`);

  //   const command = new ListObjectsV2Command({
  //     Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
  //     Prefix: prefix, // Set correct directory prefix
  //   });
  //   logger.info(`Sending ListObjectsV2Command: ${JSON.stringify(command)}`);
  //   const data = await s3Client.send(command);
  //      console.log(data,'317')
  //   if (data.Contents && data.Contents.length > 0) {
  //     logger.info(`Files found in directory: ${directoryName}`);
  //     return data.Contents.map(item => item.Key);
  //   } else {
  //     logger.warn(`No files found in directory: ${directoryName}`);
  //     return [];
  //   }
  // } catch (error) {





  
  //   logger.error(`Error listing files in directory: ${directoryName}`, error);
  //   throw new Error("Error listing files");
  // }

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.CONTABO_S3_BUCKET_NAME!,
    });

    const data = await s3Client.send(command);

    if (data.Contents && data.Contents.length > 0) {
      logger.info(`Files found in the bucket.`);
      return data.Contents.map(item => item.Key);
    } else {
      logger.warn(`No files found in the bucket.`);
      return [];
    }
  } catch (error) {
    logger.error("Error listing files in the bucket", error);
    throw new Error("Error listing files in the bucket");
  }
};


















