//Libreria para hacer logs
const winston = require("winston");
//Formato para el dia y la hora
const customTimestampFormat = winston.format.timestamp({
    format: "DD-MM-YY HH:mm:ss A",
});

//Formato para el log
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

//Niveles para los logs
const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
    },
};

// Define a format to exclude log messages with 'error' level
const excludeErrorLevel = winston.format((info) => {
    if (info.level === "error") {
        return false; // Exclude error messages from this format
    }
    return info; // Include other log messages
});

//Creando un logger
const logger = winston.createLogger({
    //Se usan los niveles personalizados
    levels: config.levels,
    //Se le da el formato al log
    format: winston.format.combine(
        //se usa el formato personalizado para la fecha y hora
        customTimestampFormat,
        //Se usa el formato json
        winston.format.json(),
        //Se alinea el log
        winston.format.align(),
        //Se usa el formato personzalizado para el contenido del mensaje
        customFormat
    ),
    //Creacion de las vias donde se guardan o muestran los logs
    transports: [
        //Creacion de archivo con tamaño maximo de 100mb se crean nuevos automaticamente
        new winston.transports.File({
            filename: "./Logs/Error.log",
            level: "error",
            maxsize: 104857600,
        }),
        //Creacion de archivo con tamaña maximo de 100mb
        new winston.transports.File({
            format: winston.format.combine(excludeErrorLevel()),
            filename: "./Logs/App.log",
            level: "info",
            maxsize: 104857600,
        }),
        //Creacion de salida a consola
        new winston.transports.Console({
            level: "debug",
        }),
    ],
});

module.exports = logger;
