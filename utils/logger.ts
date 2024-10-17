import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'},),
        winston.format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logging.log'}),
    ],
});

export function log(level: string, message: string) {
    logger.log(level, message);
}
