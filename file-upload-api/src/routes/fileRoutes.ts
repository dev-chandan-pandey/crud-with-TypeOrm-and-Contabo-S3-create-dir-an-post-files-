// import express from 'express';
// import { uploadFileToS3 } from '../controllers/fileController';

// const router = express.Router();

// router.post('/upload',uploadFileToS3);
// // router.get('/list-files/:directoryName', listFiles);
// // router.delete('/delete-file/:directoryName/:fileName', deleteFile);

// export default router;
import express from 'express';
import { uploadFileHandler, deleteFileHandler, listFilesHandler } from '../controllers/fileController';

const router = express.Router();

router.post('/upload', uploadFileHandler);
router.delete('/delete-file', deleteFileHandler);
router.get('/list-files', listFilesHandler);

export default router;


