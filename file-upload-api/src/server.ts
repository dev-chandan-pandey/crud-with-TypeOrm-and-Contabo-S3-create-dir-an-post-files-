// import express from 'express';
// import dotenv from 'dotenv';
// import fileRoutes from './routes/fileRoutes';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use('/api', fileRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
import express from 'express';
import dotenv from 'dotenv';
import fileRoutes from './routes/fileRoutes';
import logger from './utils/logger'; // Import logger

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', fileRoutes);
console.log(`S3 Region: ${process.env.CONTABO_S3_REGION}`);
console.log(`S3 Endpoint: ${process.env.CONTABO_S3_BUCKET_URL}`);
console.log(`S3 Access Key: ${process.env.CONTABO_S3_ACCESS_KEY_ID}`);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
