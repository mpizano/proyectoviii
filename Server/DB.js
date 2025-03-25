/*Archivo que guarda la conexion a la base de datos*/

//Importando libreria para e uso de base de datos mysql 
const mysql = require("mysql");

//Creando la pool para las conecciones mysql se manejan de manera automatica
const db = mysql.createPool({
    user: Bun.env.DB_USER,
    host: Bun.env.DB_HOST,
    password: Bun.env.DB_PASSWORD,
    database: Bun.env.DB_NAME,
    connectionLimit: 100,
    queueLimit: 0,
});

//Provando la conexion a la base de datos
db.getConnection((err, connection) => {
    if (err) {
        console.error("Error en la conexion de la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos");
    }
});

//Exportando la conexion a la base de datos
module.exports = db;