import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  mongoUri: `${process.env.DB_HOST}${process.env.DB_NAME}`,
  config: {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    serverSelectionTimeoutMS: 30000,
    // keepAlive: true,
  },
};

export default dbConfig;


import mongoose from 'mongoose';
import Logger from '../utils/Logger';

export const initiateMongodb = async () => {
  try {
    mongoose.connect(dbConfig.mongoUri, dbConfig.config);
  } catch (error: any) {
   console.error(`Mongoose connection error ${error}`);
   Logger.error(`Mongoose connection error ${error}`);
   throw new Error('datatbase connection failed')
  }

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose connection to ${dbConfig.mongoUri} successful`);
    // Logger.info(`Mongoose connection to ${dbConfig.mongoUri} successful`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error ${err}`);
    Logger.error(`Mongoose connection error ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
    Logger.info('Mongoose connection disconnected');
  });
};




