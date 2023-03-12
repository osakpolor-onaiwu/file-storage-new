import { createLogger, transports, format } from 'winston';
import 'winston-mongodb';
import dbConfig from '../config/mongo';
let logger:any

if(process.env.ENVIRONMENT !== 'local') {
  logger = createLogger({
    transports:[
        new transports.Console({
          level: 'info',
          format:format.combine(format.timestamp(),format.json(),format.label())
        }),
    ]
  })
}else{
  logger = createLogger({
    transports:[
        new transports.MongoDB({
          level: 'info',
          options:{...dbConfig.config, useUnifiedTopology:true},
          db:dbConfig.mongoUri,
        }),
    ]
  })
}


export default logger