#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './server';
const debug = require('debug')('filestorageutil:server');
import http from 'http';
import Logger from './utils/Logger'
import dbConfig from './config/mongo';
import mongoose from 'mongoose';

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */



server.on('secureConnection', (socket) => {
  socket.setTimeout(1 * 50 * 1000); // 35sec
})

server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;


  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  console.log(`Listening on ${bind}`)
  debug('Listening on ' + bind);
}


mongoose
  .connect(dbConfig.mongoUri, dbConfig.config)
  .then(() => {
    console.log('conneted to mongo db')
    server.listen(port, () => {
      console.log(`Server listening on ${port}`);
    })
  }).catch((err: any) => {
    Logger.info('Mongoose connection disconnected');
    console.log(err)
  })



const closeOpenConnections = (errorOccurred: boolean) => {
  Logger.info('Shutting down server and open connections', new Date().toJSON());
  server.close(() => {
    Logger.info('Server shut down', new Date().toJSON());
    mongoose.connection.close(() => {
      Logger.info('Mongoose connection closed', new Date().toJSON());
      process.exit(errorOccurred ? 1 : 0);
    });
  });
};

process.on('SIGINT', () => {
  closeOpenConnections(false);
});

process.on('unhandledRejection', (reason) => {
  Logger.info('unhandledRejection error---', new Date().toJSON());
  // throw reason;
});

