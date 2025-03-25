/*Archivo principal para configurar el servidor backend de la 
//aplicacion                                           */

//Liberias para la conexion hacia una base de datos MYSQL
const express = require("express");
//Libreria para el manejo de conexiones fuera del dominio del servidor
const cors = require("cors");
//Librerias para la creacion de sesiones y cookies
const cookieParser = require("cookie-parser");
//Importando las rutas de los demas archivos para ser usadas en el servidor
const routesConsultas = require("./ConsultasDB.js");
const routesSesion = require("./Sesion.js");
const routesEmail = require("./Emailer.js");

//Importando el transporter para los emails
const transporter = require("./EmailServer.js");

//Opciones de conexion para el servidor 
const corsOptions = {
  //Declarando que el puerto del frontend y el del backend puedan tener comunicacion entre el servidor 
  origin: ["http://localhost:8081","http://localhost:8080"],
  methods: ["GET", "POST"],
  credentials: true,
};

//Habilitando el servidor express
const app = express();

//Configurando el servidor express
app.use(express.json());

//
app.use(cors(corsOptions));

//Estableciendo y configurando las cookies en el servidor express
app.use(cookieParser());

//Estableciendo la rutas a usar en el servidor de otros archivos
app.use(routesConsultas);
app.use(routesSesion);
app.use(routesEmail);

//Verificando la conexion al servicio de correo
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Servidor listo para mandar emails");
  }
});

//Abrimos la conexion del backend en el puerto especificado
app.listen(3001, () => {
  console.log("Servidor conectado");
});
