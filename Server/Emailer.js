//Importando el transporter para los emails
const transporter = require("./EmailServer.js");
//Libreria para el framework express
const express = require("express");
//Libreria para poder usarl las rutas http en el archivo principal del servidor
const router = express.Router();
//Libreria para usar el sistema de archivos
const fs = require("fs");

//Lectura de archivos para cargar los formatos de los emails
const emailConfirmacionSolicitud = fs.readFileSync(
    "./Formatos Emails/ConfirmacionSolicitud.html",
    "utf8"
);

const emailConfirmacionSolicitudEstudiante = fs.readFileSync(
    "./Formatos Emails/ConfirmacionSolicitudEstudiante.html",
    "utf8"
);

const emailContactoSoporte = fs.readFileSync(
    "./Formatos Emails/SoporteContacto.html",
    "utf8"
);

const emailConfirmacionContactoSoporte = fs.readFileSync(
    "./Formatos Emails/ConfirmacionContactoSoporte.html",
    "utf8"
)


//Ruta para enviar una notificacion por email al usuario confirmando la solicitud de su cuenta
router.post("/emailConfirmacion", async (peticion, respuesta) => {
    //Variables enbiadas del frontEnd
    const { email, codigo, nombreCompleto, cu, dependencia, nombramiento } =
        peticion.body;
    //Asignado las variables al campo que deben reemplazan en el formato del email
    const reemplazos = {
        nombreCompleto: nombreCompleto,
        codigo: codigo,
        centroUniversitario: cu,
        dependencia: dependencia,
        nombramiento: nombramiento,
    };
    //Formato modificable para el email
    let htmlConVariables = emailConfirmacionSolicitud;
    //Reemplazando las variables declaradas en el formato del email con el contenido de las 
    //variables de frontEnd
    Object.entries(reemplazos).forEach(([key, value]) => {
        htmlConVariables = htmlConVariables.replace(`{{${key}}}`, value);
    });
    try {
        //Funcion asincrona para enviar el correo
        await transporter.sendMail({
            //Datos del emisor del correo
            from: {
                //Nombre que aparecera en el correo
                name: "SISTEMA CGAI",
                //Direccion de correo
                address: Bun.env.SERVEREMAIL,
            },
            //Receptor del correo
            to: email,
            //Asunto del correo
            subject: "Confirmacion de cuenta",
            //Contenido del correo en el formato html
            html: htmlConVariables,
        });
        respuesta.status(200).json({ mensaje: "Correo enviado" });
    } catch (error) {
        console.error(error);
        respuesta.status(500).json({ mensaje: "Error al enviar el correo" });
    }
});

//Ruta para enviar una notificacion por email al usuario confirmando la solicitud de su cuenta
router.post("/emailConfirmacionEstudiante", async (peticion, respuesta) => {
    //Variables enbiadas del frontEnd
    const { email, codigo, nombreCompleto, cu, carrera } =
        peticion.body;
    //Asignado las variables al campo que deben reemplazan en el formato del email
    const reemplazos = {
        nombreCompleto: nombreCompleto,
        codigo: codigo,
        centroUniversitario: cu,
        carrera: carrera
    };
    //Formato modificable para el email
    let htmlConVariables = emailConfirmacionSolicitudEstudiante;
    /*Reemplazando las variables declaradas en el formato del email con el contenido de las 
    variables de frontEnd*/
    Object.entries(reemplazos).forEach(([key, value]) => {
        htmlConVariables = htmlConVariables.replace(`{{${key}}}`, value);
    });
    try {
        //Funcion asincrona para enviar el correo
        await transporter.sendMail({
            //Datos del emisor del correo
            from: {
                //Nombre que aparecera en el correo
                name: "SISTEMA CGAI",
                //Direccion de correo
                address: Bun.env.SERVEREMAIL,
            },
            //Receptor del correo
            to: email,
            //Asunto del correo
            subject: "Confirmacion de cuenta",
            //Contenido del correo en el formato html
            html: htmlConVariables,
        });
        respuesta.status(200).json({ mensaje: "Correo enviado" });
    } catch (error) {
        console.error(error);
        respuesta.status(500).json({ mensaje: "Error al enviar el correo" });
    }
});

//Funcion para mandar un correo de contacto a soporte
router.post("/emailSoporte", async (peticion, respuesta) => {
    //variables del frontEnd
    const { asunto, nombreCodigo, email, contenido } = peticion.body;
    //Campos a reemplazar
    const reemplazos = {
        nombreCodigo: nombreCodigo,
        email: email,
        contenido: contenido,
        asunto: asunto,
    };
    //Lista de receptores del correo 
    const receptores = { servidor: Bun.env.SERVER_EMAIL, usuario: email};
    //Reemplazando variables en el formato html para el correo enviado a soporte
    let htmlSoporteConVariables = emailContactoSoporte;
    Object.entries(reemplazos).forEach(([key, value]) => {
        htmlSoporteConVariables = htmlSoporteConVariables.replace(`{{${key}}}`, value);
    });
    //Reemplazando variables en el formato del email de confirmacion al usuario
    let htmlConfirmacionConVariables = emailConfirmacionContactoSoporte;
    Object.entries(reemplazos).forEach(([key, value]) => {
        htmlConfirmacionConVariables = htmlConfirmacionConVariables.replace(`{{${key}}}`, value);
    });
    //Funcion asincrona para mandar el email
    try {
        // Primer email en ser enviado al servidor
        await transporter.sendMail({
            from: {
                name: "SOPORTE SISTEMA CGAI",
                address: receptores.servidor,
            },
            to: receptores.servidor,
            subject: asunto,
            html: htmlSoporteConVariables,
        }).catch(error => {
            console.error(error);
            throw error;
        });

        //Segundo email a ser enviado al usuario
        await transporter.sendMail({
            from: {
                name: "SOPORTE SISTEMA CGAI",
                address: receptores.servidor,
            },
            to: receptores.usuario,
            subject: "Confirmacion De Solicitud",
            html: htmlConfirmacionConVariables,
        }).catch(error => {
            console.error(error);
            throw error;
        });
        respuesta.status(200).json({ mensaje: "Correo enviado" });
    } catch (error) {
        console.error(error);
        respuesta.status(500).json({ mensaje: "Error al enviar el correo" });
    }
});

//Exportando las rutas de este archivo
module.exports = router;
