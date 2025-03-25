//Importando la libreria para establecer conexion con el servidor smtp de correo de microsoft
const nodemailer = require('nodemailer')

//Creando un objeto transporter este es el encargado de establecer la conexion con el servicio
//de correo electronico
/*Importante si se quiere cambiar el correo y servicio lo unico que se tiene que cambiar es el host
 *por el que el host provee para el servicio SMTP y cambiar las variables de entorno para los datos de acceso
 */
const transporter = nodemailer.createTransport({
  //Host smtp de google
  host: Bun.env.SMTP_HOST,
  //Puerto de comunicacion ver documentacion para saber cual es el puerto adecuado a usar
  port: Bun.env.SMTP_PORT,
  secure: false,
  //Opciones de seguridad
  tls: { rejectUnauthorized: true },
  //Parametros de la cuenta de correo que manejara los emails 
  auth: {
    //Cuenta de correo 
    user: Bun.env.SERVER_EMAIL,
    //Contraseña de la cuenta de correo dependiendo el host se requiere la contraseña de la cuenta o la contraseña de la aplicacion
    pass: Bun.env.SERVER_PASSW,
  },
});

//Exportando el modulo transporter 
module.exports = transporter

