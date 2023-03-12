require('dotenv').config();
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import router from './routes';
import Logger from './utils/Logger';
import cors from 'cors';
import useragent from "express-useragent";
const isDevEnvironment = process.env.NODE_ENV || 'development';
import JobConfig from './worker';
import Graceful from '@ladjs/graceful';
const app = express();
app.use(useragent.express());
app.use(logger(isDevEnvironment ? 'dev' : 'short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import path from 'path';
import Bree from 'bree';

app.use(cors(), function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type", "Accept", "Authorization", "Origin, X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  next();
})

//worker
const bree = new Bree({
  root: path.join(__dirname, 'worker'),
  jobs: JobConfig,
  errorHandler: (error: any, workerMetadata: any) => {
    // workerMetadata will be populated with extended worker information only if
    // Bree instance is initialized with parameter `workerMetadata: true`
    if (workerMetadata.threadId) {
      console.log(`There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`)
    } else {
      console.log(`There was an error while running a worker ${workerMetadata.name}`)
    }
  }
});

//to start bree
(async () => await bree.start())(); 


app.use(router);

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  Logger.error({
    stack: err && err.stack,
    message: (err && err.message) || err,
    timestamp: Date.now()
  });

  err = (err && err.customError) ? err : createError((err && err.status) || 500); // Added this part so we only send intentionally thrown errors to user
  const data = {
    err: isDevEnvironment ? err : err.message
  }
  const result = {
    status: 'error',
    message: err.message,
    data
  };
  res.status(err.status).json(result);
});

export default app;
