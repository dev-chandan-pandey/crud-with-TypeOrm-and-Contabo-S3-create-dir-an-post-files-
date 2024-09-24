// import { Request, Response } from 'express';
// import { uploadFileToS3, listFilesInDirectory, deleteFileFromS3 } from '../services/fileService';

// // POST: Upload a file to S3 using streams
// export const uploadFile = async (req: Request, res: Response) => {
//   const directoryName = req.query.directoryName as string;
//   const fileName = req.query.fileName as string;

//   if (!directoryName || !fileName) {
//     return res.status(400).json({ message: 'Directory name and file name are required.' });
//   }

//   try {
//     const fileStream = req; // Use the request stream
//     const contentType = req.headers['content-type'] || 'application/octet-stream';

//     const fileUrl = await uploadFileToS3(directoryName, fileName, fileStream, contentType);
//     res.status(200).json({ message: 'File uploaded successfully', url: fileUrl });
//   } catch (error) {
//     res.status(500).json({ message: 'Error uploading file', error });
//   }
// };

// // GET: List files in a directory
// export const listFiles = async (req: Request, res: Response) => {
//   const { directoryName } = req.params;

//   try {
//     const files = await listFilesInDirectory(directoryName);
//     res.status(200).json({ files });
//   } catch (error) {
//     res.status(500).json({ message: 'Error listing files', error });
//   }
// };

// // DELETE: Delete a file from S3
// export const deleteFile = async (req: Request, res: Response) => {
//   const { directoryName, fileName } = req.params;

//   try {
//     await deleteFileFromS3(directoryName, fileName);
//     res.status(200).json({ message: 'File deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting file', error });
//   }
// };

//2
// import { Request, Response } from 'express';
// import { uploadFileToS3, listFilesInDirectory, deleteFileFromS3 } from '../services/fileService';
// import logger from '../utils/logger'; // Import logger

// // POST: Upload a file to S3 using streams
// export const uploadFile = async (req: Request, res: Response) => {
//   const directoryName = req.query.directoryName as string;
//   const fileName = req.query.fileName as string;

//   if (!directoryName || !fileName) {
//     logger.warn("Missing directory name or file name in request");
//     return res.status(400).json({ message: 'Directory name and file name are required.' });
//   }

//   try {
//     logger.info(`Starting file upload for file: ${fileName} in directory: ${directoryName}`);
//     const fileStream = req; // Use the request stream
//     const contentType = req.headers['content-type'] || 'application/octet-stream';

//     const fileUrl = await uploadFileToS3(directoryName, fileName, fileStream, contentType);
//     logger.info(`File uploaded successfully: ${fileName}`);
//     res.status(200).json({ message: 'File uploaded successfully', url: fileUrl });
//   } catch (error) {
//     logger.error(`Error during file upload for file: ${fileName}, Error: ${error}`);
//     res.status(500).json({ message: 'Error uploading file', error });
//   }
// };

// // GET: List files in a directory
// export const listFiles = async (req: Request, res: Response) => {
//   const { directoryName } = req.params;

//   try {
//     logger.info(`Request to list files in directory: ${directoryName}`);
//     const files = await listFilesInDirectory(directoryName);
//     logger.info(`Files listed successfully in directory: ${directoryName}`);
//     res.status(200).json({ files });
//   } catch (error) {
//     logger.error(`Error listing files in directory: ${directoryName}, Error: ${error}`);
//     res.status(500).json({ message: 'Error listing files', error });
//   }
// };

// // DELETE: Delete a file from S3
// export const deleteFile = async (req: Request, res: Response) => {
//   const { directoryName, fileName } = req.params;

//   try {
//     logger.info(`Request to delete file: ${fileName} from directory: ${directoryName}`);
//     await deleteFileFromS3(directoryName, fileName);
//     logger.info(`File deleted successfully: ${fileName}`);
//     res.status(200).json({ message: 'File deleted successfully' });
//   } catch (error) {
//     logger.error(`Error deleting file: ${fileName}, Error: ${error}`);
//     res.status(500).json({ message: 'Error deleting file', error });
//   }
// };
// 2end
//3
// import { Request, Response } from 'express';
// import { uploadFileToS3 } from '../services/fileService';
// import logger from '../utils/logger';

// // POST: Upload a file to S3 using streams
// export const uploadFile = async (req: Request, res: Response) => {
//   const directoryName = req.query.directoryName as string;
//   const fileName = req.query.fileName as string;

//   if (!directoryName || !fileName) {
//     logger.warn("Missing directory name or file name in request");
//     return res.status(400).json({ message: 'Directory name and file name are required.' });
//   }

//   try {
//     logger.info(`Starting file upload for file: ${fileName} in directory: ${directoryName}`);
//     const fileStream = req; // Use the request stream
//     const contentType = req.headers['content-type'] || 'application/octet-stream';

//     const fileUrl = await uploadFileToS3(directoryName, fileName, fileStream, contentType);
//     logger.info(`File uploaded successfully: ${fileName}`);
//     res.status(200).json({ message: 'File uploaded successfully', url: fileUrl });
//   } catch (error) {
//     logger.error(`Error during file upload for file: ${fileName}, Error: ${error}`);
//     res.status(500).json({ message: 'Error uploading file', error });
//   }
// };
// 3 end
// 
// 
import { Request, Response } from 'express';
import { uploadFileToS3, deleteFile, listFilesInDirectory } from '../services/fileService';
import logger from '../utils/logger';

// Upload file handler
export const uploadFileHandler = async (req: Request, res: Response) => {
  const { directoryName, fileName } = req.query;

  if (!directoryName || !fileName) {
    return res.status(400).json({ message: 'Directory name and file name are required' });
  }

  try {
    logger.info(`Starting file upload for file: ${fileName} in directory: ${directoryName}`);

    // Stream the file from the request
    const fileUrl = await uploadFileToS3(req, fileName as string, directoryName as string);

    logger.info(`File uploaded successfully: ${fileUrl}`);
    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    logger.error("Error uploading file", error);
    res.status(500).json({ message: "Error uploading file", error });
  }
};

// Delete file handler
export const deleteFileHandler = async (req: Request, res: Response) => {
  const { directoryName, fileName } = req.query;

  if (!directoryName || !fileName) {
    return res.status(400).json({ message: 'Directory name and file name are required' });
  }

  try {
    logger.info(`Deleting file: ${fileName} from directory: ${directoryName}`);

    await deleteFile(directoryName as string, fileName as string);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    logger.error("Error deleting file", error);
    res.status(500).json({ message: "Error deleting file", error });
  }
};

// List files handler
export const listFilesHandler = async (req: Request, res: Response) => {
  const { directoryName } = req.query;

  if (!directoryName) {
    return res.status(400).json({ message: 'Directory name is required' });
  }

  try {
    logger.info(`Listing files in directory: ${directoryName}`);

    const files = await listFilesInDirectory(directoryName as string);

    res.status(200).json({ message: 'Files listed successfully', files });
  } catch (error) {
    logger.error("Error listing files", error);
    res.status(500).json({ message: "Error listing files", error });
  }
};
