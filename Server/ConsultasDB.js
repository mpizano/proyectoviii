/*Arvhico que guarda todas las operaciones a base de datos*/
//Libreria para el encriptado y desencriptado de contraseñas
const bcrypt = require("bcryptjs");
//Numero requerido para la encriptación
const saltRounds = 10;
//Libreria para el framework express
const express = require("express");
//Libreria para poder usarl las rutas http en el archivo principal del servidor
const router = express.Router();
//Importando la conexion a la base de datos
const db = require("./DB.js");
const axios = require("axios");
const logger = require("./Logger.js")
//Funcion para obtener los generos de catalogo de la base de datos
router.post("/generos", (peticion, respuesta) => {
    const query = "SELECT idgenero,genero FROM GeneroCAT;";
    db.query(query, (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.send({ mensaje: "No se encontraron resultados" });
        } else {
            //Retornando el resultado de la consulta sql como un json
            return respuesta.status(200).json(resultado);
        }
    });
});


//Funcion para obtener los datos generales
router.post("/datosGenerales", (peticion, respuesta) => {
    const codigo = peticion.body.codigo;
    const query =
        "SELECT DatosGenerales.*,Genero " +
        "FROM DatosGenerales,GeneroCAT WHERE DatosGenerales.codigo = ?" +
        "AND DatosGenerales.IdGenero = GeneroCAT.IdGenero;";
    db.query(query, [codigo], (error, resultado) => {
        if (error) {
            respuesta.send({ error: error });
        }
        if (resultado.length > 0) {
            return respuesta.json(resultado);
        } else {
            return respuesta.json({
                mensaje: "No se obtuvieron datos del sistema",
            });
        }
    });
});

//Funcion para actualizar datos de la base ded atos
router.post("/update", (peticion, respuesta) => {
    const { codigo, nombre, apellidoPaterno, apellidoMaterno, genero } =
        peticion.body;
    const query =
        "UPDATE DatosGenerales SET nombre = ? , apellidoPaterno = ? , apellidoMaterno = ? , idgenero = ? WHERE codigo = ?;";
    db.query(
        query,
        [nombre, apellidoPaterno, apellidoMaterno, genero, codigo],
        (error, resultado) => {
            if (error) {
                respuesta.send({ error: error });
            }
            return respuesta.json({ mensaje: "Datos Actualizados" });
        }
    );
});

//Funcion para actualizar datos de la base de datos
router.post("/updatePassw", (peticion, respuesta) => {
    const { codigo, passw } = peticion.body;
    const query = "UPDATE Login SET password = ? WHERE codigo = ?;";
    bcrypt.hash(passw, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(query, [hash, codigo], (error, resultado) => {
            if (error) {
                respuesta.send({ error: error });
            }
            return respuesta.json({ mensaje: "Contraseña Actualizada" });
        });
    });
});

//Funcion para salir y borrar las cookies segun el token del usuario
router.get("/logout", (peticion, respuesta) => {
    respuesta.clearCookie("token");
    return respuesta.status(200).json({ Status: "Success" });
});

//Funcion para obtener los datos de los centro universitarios
router.get("/centrosUniversitarios", (peticion, respuesta) => {
    const query = "SELECT IdCu,Acronimo,Nombre FROM CentrosUniversitariosCAT;";
    db.query(query, (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send({ mensaje: "No se encontraron resultados" });
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener las coordinaciones del catalogo de coordinaciones en la base de datos datos
router.post("/coordinaciones", (peticion, respuesta) => {
    const cu = peticion.body.cu;
    const query = "SELECT * FROM CoordinacionesCAT WHERE IdCu = ?;";
    db.query(query, [cu], (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send("statusText: Sin contenido");
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcione para obtener las unidades del catalogo de la base de datos
router.post("/unidades", (peticion, respuesta) => {
    const coordi = peticion.body.coordi;
    const query = "SELECT * FROM UnidadCAT WHERE IdCoordinacion = ?;";
    db.query(query, [coordi], (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send("statusText: Sin contenido");
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener las divisiones del catalogo de divisiones y especificamente las
//divisiones que se encuentran en un centro universitario en especifico
router.post("/divisiones", (peticion, respuesta) => {
    const cu = peticion.body.cu;
    const query = "SELECT * FROM DivisionCAT WHERE IdCu = ?;";
    db.query(query, [cu], (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send("statusText: Sin contenido");
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener los departamentos de catalogo de la base de datos
router.post("/departamentos", (peticion, respuesta) => {
    const div = peticion.body.div;
    const query = "SELECT * FROM DepartamentoCAT WHERE IdDivision = ?";
    db.query(query, [div], (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send("statusText: Sin contenido");
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para devolver las areas que pertenecen a un departamento en la base de datos
router.post("/areas", (peticion, respuesta) => {
    //Obteniendo la variable del frontend
    const dep = peticion.body.dep;
    const query = "SELECT * FROM AreaCAT WHERE IdDepartamento = ?;";
    db.query(
        //Declarando la consulta sql y pasandole el parametro a consultar
        query,
        [dep],
        (error, resultado) => {
            if (error) {
                respuesta.status(500).send({ error: error.message });
            } else if (resultado.length === 0) {
                respuesta.status(204).send("statusText: Sin contenido");
            } else {
                //Retornando el resultado de la consulta sql como un json
                return respuesta.status(200).json(resultado);
            }
        }
    );
});

//Funcion para obtener todas las dependencias que esten realacionadas a un Centro Universitario en especifico
router.post("/opcionesDepe", async (peticion, respuesta, next) => {
    //Obteniendo la opcion seleccionada del centro universitario en el front end
    const cu = peticion.body.cu;
    try {
        //Funcion para ejecutar todas las consultas simultaneamente mediante promesas una vez resultas todas se
        //asignara el resultado a las variables y posteriormente se le enviara al front end
        const [areas, departamentos, divisiones, unidades, coordinaciones] =
            await Promise.all([
                //Creando una nueva promesa si se resuelve se le asginara el resultado, sino, se quedara con null
                new Promise((resolve, reject) => {
                    const query =
                        "SELECT IdArea AS Id,NombreArea AS Nombre FROM AreaCAT WHERE IdCu = ?;";
                    db.query(query, [cu], (error, resultado) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(resultado);
                        }
                    });
                }),
                //Creando otra promesa para ejecutarse de manera simultanea a las demas
                new Promise((resolve, reject) => {
                    const query =
                        "SELECT IdDepartamento AS Id,Departamento AS Nombre FROM DepartamentoCAT WHERE IdCu = ?;";
                    db.query(query, [cu], (error, resultado) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(resultado);
                        }
                    });
                }),
                //Creando otra promesa para ejecutarse de manera simultanea a las demas
                new Promise((resolve, reject) => {
                    const query =
                        "SELECT IdDivision AS Id,Division AS Nombre FROM DivisionCAT WHERE IdCu = ?;";
                    db.query(query, [cu], (error, resultado) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(resultado);
                        }
                    });
                }),
                //Creando otra promesa para ejecutarse de manera simultanea a las demas
                new Promise((resolve, reject) => {
                    const query =
                        "SELECT IdUnidad as Id, Nombre From UnidadCAT WHERE IdCu = ?;";
                    db.query(query, [cu], (error, resultado) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(resultado);
                        }
                    });
                }),
                //Creando otra promesa para ejecutarse de manera simultanea a las demas
                new Promise((resolve, reject) => {
                    const query =
                        "SELECT IdCoordinacion AS Id, Nombre FROM CoordinacionesCAT WHERE IdCu = ?;";
                    db.query(query, [cu], (error, resultado) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(resultado);
                        }
                    });
                }),
            ]);
        const datos = {
            areas,
            departamentos,
            divisiones,
            unidades,
            coordinaciones,
        };
        return respuesta.status(200).json(datos);
    } catch (error) {
        return respuesta.status(500).json(error);
    }
});

//Funcion para verificar si el codigo existe en la tabla login
router.post("/existeCodigo", (peticion, respuesta) => {
    //Obteniendo la variable del frontend
    const codigo = peticion.body.codigo;
    const query =
        "SELECT EXISTS(SELECT 1 FROM Login WHERE codigo = ?) AS existe;";
    db.query(
        //Declarando la consulta sql y pasandole el parametro a consultar
        query,
        [codigo],
        (error, resultado) => {
            if (error) {
                respuesta.status(500).send({ error: error.message });
            } else if (resultado.length === 0) {
                respuesta.status(204).send("statusText: Sin contenido");
            } else {
                //Retornando el resultado de la consulta sql como un json
                return respuesta.status(200).json(resultado);
            }
        }
    );
});

//Funcion para obtener los nombramientos de la tabla NombramientoCAT
router.get("/nombramientos", (peticion, respuesta) => {
    const query = "SELECT IdNombramiento,Nombramiento FROM NombramientoCAT;";
    db.query(query, (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send({ mensaje: "No se encontraron resultados" });
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener las carreras de un centro universitario
router.post("/carreras", (peticion, respuesta) => {
    const cu = peticion.body.cu;
    const query = "SELECT IdCarrera,NombreCarrera FROM CarreraCAT WHERE IdCu = ?;";
    db.query(query, [cu], (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send({ mensaje: "No se encontraron resultados" });
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener las solicitudes de cuentas
router.get("/solicitudesCuentas", (peticion, respuesta) => {
    const query = "SELECT IdSolicitud,Codigo,Nombre,ApellidoPaterno,ApellidoMaterno,CorreoElectronico,TipoSolicitud,DATE_FORMAT(Fecha,'%Y/%m/%d')Fecha FROM SolicitudCuenta;";
    db.query(query, (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send({ mensaje: "No se encontraron resultados" });
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener las solicitudes de cuentas
router.post("/solicitudEspecifica", (peticion, respuesta) => {
    const idSolicitud = peticion.body.idSolicitud;
    const query = "SELECT Codigo,Nombre,ApellidoPaterno,ApellidoMaterno,CorreoElectronico,TipoSolicitud FROM SolicitudCuenta WHERE IdSolicitud = ?;";
    db.query(query,[idSolicitud],  (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.status(204).send({ mensaje: "No se encontraron resultados" });
        } else {
            return respuesta.status(200).json(resultado);
        }
    });
});

//Funcion para obtener los generos de catalogo de la base de datos
router.get("/roles", (peticion, respuesta) => {
    const query = "SELECT IdTipoUsuario,TipoUsuario FROM TipoUsuarioCAT;";
    db.query(query, (error, resultado) => {
        if (error) {
            respuesta.status(500).send({ error: error.message });
        } else if (resultado.length === 0) {
            respuesta.send({ mensaje: "No se encontraron resultados" });
        } else {
            //Retornando el resultado de la consulta sql como un json
            return respuesta.status(200).json(resultado);
        }
    });
});
//Funcion para guardar la solicitud de cuenta en la base de datos
router.post("/solicitudCuentaEstudiante", (peticion, respuesta) => {
    //Obteniendo el contenido de la peticion
    const { email, codigo, nombreCompleto, cu, carrera, tipoSolicitud } =
        peticion.body;
    //Senetncia SQL
    const query =
        "INSERT INTO SolicitudCuenta(Codigo,Nombre,ApellidoPaterno,ApellidoMaterno,CorreoElectronico,CentroUniversitario,Carrera,TipoSolicitud)" +
        " VALUES(?,?,?,?,?,?,?,?);";
    //Nueva promesa para esperar a que se ejecuten las consultas
    new Promise((resolve, reject) => {
        db.query(
            query,
            [
                //Pasando las variables a la sentencia SQL
                codigo,
                nombreCompleto.nombre,
                nombreCompleto.apellidoPaterno,
                nombreCompleto.apellidoMaterno,
                email,
                cu.id,
                carrera.value,
                tipoSolicitud,
            ],
            (error, resultado) => {
                if (error) {
                    console.log(error);
                    respuesta.status(500).json({ message: "Fallo en la base de datos" });
                    //Se rechaza el error para cerrar la promesa
                    reject(error);
                } else {
                    //Se resuelve el resultado y se pasa a ejecutar los resultados de la promesa
                    resolve(resultado);
                }
            }
        );
    })
        //Cuando la promesa es resuelta se ejecutan lo siguiente
        .then((resultado) => {
            //Si la sentencia SQL se ejecuto correctamente se comunica con el servidor de emails para mandar el correo de confirmacion
            if (resultado.affectedRows === 1) {
                //Se hace otra promesa con la peticon al servidor de emails
                return axios.post(Bun.env.HTTPEMAILESTUDIANTE, {
                    email: email,
                    codigo: codigo,
                    nombreCompleto: `${nombreCompleto.nombre} ${nombreCompleto.apellidoPaterno} ${nombreCompleto.apellidoMaterno}`,
                    cu: cu.label,
                    carrera: carrera.label,
                });
            }
        })
        //Una vez resulta la promesa anteriror se concluye con exito la preticion completa
        .then((response) => {
            respuesta.status(200).json({
                message: "Peticion completada con exito",
                data: response.data,
            });
        })
        //Si alguna de las peticiones es rechazada se regresa un error
        .catch((error) => {
            console.error(error);
            respuesta.status(500).json({ message: "Fallo en el servicio de correo" });
        });
});

//Funcion para guardar la solicitud de cuenta en la base de datos
router.post("/solicitudCuenta", (peticion, respuesta) => {
    //Obteniendo el contenido de la peticion
    const { email, codigo, nombreCompleto, cu, dependencia, nombramiento,tipoSolicitud } =
        peticion.body;
    //Senetncia SQL
    const query =
        "INSERT INTO SolicitudCuenta(Codigo,Nombre,ApellidoPaterno,ApellidoMaterno,CorreoElectronico,CentroUniversitario,Dependencia,Nombramiento,TipoSolicitud)" +
        " VALUES(?,?,?,?,?,?,?,?,?);";
    //Nueva promesa para esperar a que se ejecuten las consultas
    new Promise((resolve, reject) => {
        db.query(
            query,
            [
                //Pasando las variables a la sentencia SQL
                codigo,
                nombreCompleto.nombre,
                nombreCompleto.apellidoPaterno,
                nombreCompleto.apellidoMaterno,
                email,
                cu.id,
                dependencia.value,
                nombramiento.value,
                tipoSolicitud,
            ],
            (error, resultado) => {
                if (error) {
                    console.log(error);
                    respuesta.status(500).json({ message: "Fallo en la base de datos" });
                    //Se rechaza el error para cerrar la promesa
                    reject(error);
                } else {
                    //Se resuelve el resultado y se pasa a ejecutar los resultados de la promesa
                    resolve(resultado);
                }
            }
        );
    })
        //Cuando la promesa es resuelta se ejecutan lo siguiente
        .then((resultado) => {
            //Si la sentencia SQL se ejecuto correctamente se comunica con el servidor de emails para mandar el correo de confirmacion
            if (resultado.affectedRows === 1) {
                //Se hace otra promesa con la peticon al servidor de emails
                return axios.post(Bun.env.RUTAEMAILHTTP, {
                    email: email,
                    codigo: codigo,
                    nombreCompleto: `${nombreCompleto.nombre} ${nombreCompleto.apellidoPaterno} ${nombreCompleto.apellidoMaterno}`,
                    cu: cu.label,
                    dependencia: dependencia.label,
                    nombramiento: nombramiento.label,
                });
            }
        })
        //Una vez resulta la promesa anteriror se concluye con exito la preticion completa
        .then((response) => {
            respuesta.status(200).json({
                message: "Peticion completada con exito",
                data: response.data,
            });
        })
        //Si alguna de las peticiones es rechazada se regresa un error
        .catch((error) => {
            console.error(error);
            respuesta.status(500).json({ message: "Fallo en el servicio de correo" });
        });
});

//Exportando las rutas de este archivo
module.exports = router;
