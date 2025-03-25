/*Archivo que guarda las rutas para el manejo de la sesion del usuario */

//Libreria para el encriptado y desencriptado de contraseñas
const bcrypt = require("bcryptjs");
//Numero requerido para la encriptación
const saltRounds = 10;
const jwt = require("jsonwebtoken");
//Libreria para el framework express
const express = require("express");
//Libreria para poder usarl las rutas http en el archivo principal del servidor
const router = express.Router();
//Importando la conexion a la base de datos
const db = require("./DB.js");

//Funcion para registrar usuario, encriptando su contraseña
router.post("/alta", (peticion, respuesta) => {
  //Variables con los datos de la peticion
  const codigo = peticion.body.codigo;
  //El rol se pasa de texto al cifrado
  const rol = rolCifrado[peticion.body.rol];
  const correoElectronico = peticion.body.correoElectronico;
  const username = peticion.body.username;
  const passw = peticion.body.passw;
  const tipoUsuario = peticion.body.tipoUsuario;
  const NombreCompleto = peticion.body.NombreCompleto;
  const IdSolicitud = peticion.body.idSolicitud;
  //Se hace el hash a la contraseña con los parametros de la contraseña y las saltRounds
  bcrypt.hash(passw, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return respuesta.status(500).json({ error: "Error en el servidor" });
    }
    //Se verifica si el codigo ya existe en la tabla
    const queryVerificar = "SELECT 1 FROM Login WHERE Codigo = ?;";
    db.query(queryVerificar, [codigo], (error, resultado) => {
      if (error) {
        console.error("Error querying database:", error);
        return respuesta.status(500).json({ error: "Error en verificacion" });
      } else {
        //Se evalua si el resultado de la query fue correcto en cuyo caso el codigo ya existe en la tabla
        if (resultado.length >= 1) {
          //Devolvemos el error que ya existe el codigo
          return respuesta.status(500).json({ error: "Codigo Registrado" });
        } else {
          //Si no existe el codigo procedemos a insertar en la tabla login los campos que se requiere
          const queryLogin =
            "INSERT INTO Login (Codigo, Rol, Username, Password, IdTipoUsuario) VALUES (?, ?, ?, ?, ?);";
          db.query(
            queryLogin,
            [codigo, rol, username, hash, tipoUsuario],
            (error, resultado) => {
              if (error) {
                console.error("Error querying database:", error);
                return respuesta
                  .status(500)
                  .json({ error: "Error en alta de cuenta" });
              } else {
                //Si la query se ejecuto correctamente pasamos a insertar en la tabla de datos generales
                if (resultado.affectedRows === 1) {
                  //Se inserta en datos generales y como valor por defecto no se especifica el genero del usuario
                  /*TODO
                  Quitar el genero hardcodeado
                   */
                  const queryDatosGenerales =
                    "INSERT INTO DatosGenerales (IdDatosGenerales,ApellidoPaterno,ApellidoMaterno,Nombre,Codigo,CorreoElectronico,IdGenero) VALUES(?,?,?,?,?,?,'04')";
                  db.query(
                    queryDatosGenerales,
                    [
                      codigo,
                      NombreCompleto.ApellidoPaterno,
                      NombreCompleto.ApellidoMaterno,
                      NombreCompleto.Nombre,
                      codigo,
                      correoElectronico,
                    ],
                    (error, resultado) => {
                      if (error) {
                        console.error("Error querying database:", error);
                        return respuesta
                          .status(500)
                          .json({ error: "Error en datos generales" });
                      } else {
                        //Si la query se ejecuto correctamente ahora eliminaremos el registro de la solicitud de la tabla
                        if (resultado.affectedRows === 1) {
                          //Se eliminar la solicitud con el id que se paso en la peticion
                          const queryDelete =
                            "DELETE FROM SolicitudCuenta WHERE SolicitudCuenta.IdSolicitud = ?";
                          db.query(
                            queryDelete,
                            [IdSolicitud],
                            (error, resultado) => {
                              if (error) {
                                console.error(
                                  "Error querying database:",
                                  error
                                );
                                return respuesta
                                  .status(500)
                                  .json({ error: "Error al limpiar" });
                              } else {
                                if (resultado.affectedRows === 1) {
                                  //Si se elimino correctamente el registro de la tabla se responde con el mensaje de exito
                                  return respuesta.status(200).json({
                                    mensaje: "Se dio de alta una nueva cuenta",
                                  });
                                }
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    });
  });
});

//Funcion para borrar las cuentas de la base de datos
router.post("/borrarCuentas", (peticion, respuesta) => {
  //Se obtitenen los ids de los registros que se desean eliminar
  const idsCuentas = peticion.body.ids;
  //Se borran los registros dentro del rango seleccionado
  const query = "DELETE FROM SolicitudCuenta WHERE IdSolicitud IN (?)";
  db.query(query, [idsCuentas], (error, resultado) => {
    if (error) {
      console.error("Error querying database:", error);
      return respuesta.status(500).json({ error: "Internal server error" });
    } else {
      if (resultado.affectedRows > 0) {
        return respuesta
          .status(200)
          .json({ mensaje: "Se eliminaron correctamente" });
      } else {
        return respuesta.status(204).json({ mensaje: "Hubo un problema" });
      }
    }
  });
});

//Se cifra el texto plano del rol del usuario
const rolCifrado = {
  Admin: "ADPH",
  Invitado: "GHLM",
  Visitante: "HNMQ",
  Administrativo: "QWEL",
  edX: "BKXR",
  Coursera: "ZVCI",
};

//Funcion para asignar el rol
const roleMapping = {
  P: "admin",
  L: "Invitado",
  M: "Visitante",
  E: "Administrativo",
  X: "edX",
  C: "Coursera",
  // Añadir mas roles aquí
};

//Funcion para verificar que el usuario esté logeado con cookie
const verificarUsuario = (peticion, respuesta, login) => {
  const token = peticion.cookies.token;
  //verificando que exista un token con la peticion que se obtuvo del front end
  if (!token) {
    return respuesta.json({ mensaje: "No estas autenticado" });
  } else {
    //verificando que los datos correspondan a la configuracion de la cookie para obtener los datos
    jwt.verify(token, Bun.env.SECRETO, (err, decodificado) => {
      if (err) {
        return respuesta.json({ mensaje: "no estas autorizado" });
      } else {
        //Regresando los parametros de la cookie a la peticion del front end
        peticion.username = decodificado.username;
        peticion.codigo = decodificado.codigo;
        peticion.tipoUsuario = decodificado.tipoUsuario;
        peticion.rol = roleMapping[decodificado.rol[2]] || "invitado";
        login();
      }
    });
  }
};

//Funcion para verificar si un usuario esta loggeado o no mediante el uso de la cookie almacenada
router.get("/login", verificarUsuario, (peticion, respuesta) => {
  return respuesta.json({
    Status: "Loggeado",
    username: peticion.username,
    rol: peticion.rol,
    codigo: peticion.codigo,
    tipoUsuario: peticion.tipoUsuario,
  });
});

//Funcion para manejar la creacion de cookies si el usuario ingresa con su usuario de la base de datos
router.post("/ingreso", (req, res) => {
  const { codigo, passw } = req.body;
  if (codigo.length === 0 || passw === 0) {
    return res.json({ mensaje: "Codigo o contraseña invalidos" });
  }
  const query = "SELECT * FROM Login WHERE Codigo = ?;";
  //Ejecutando la query con los parametros del fronend
  db.query(query, codigo, (error, results) => {
    if (error) {
      return res.send({
        error: "Ocurrió un error porfavor intentelo mas tarde",
      });
    }
    //Si la consulta nos devuelve el usuario pasamos a crear la cookie
    if (results.length > 0) {
      const { Password, Username, Rol, IdTipoUsuario } = results[0];
      //Comparamos la contraseña ingresada por el usuario contra la contraseña almacenada en la base de datos
      bcrypt.compare(passw, Password, (err, response) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.json({ mensaje: "Error en contraseña" });
        }
        //Si las contraseñas coinciden creamos la cookie con las credenciales requeridas
        if (response) {
          jwt.sign(
            {
              username: Username,
              rol: Rol,
              codigo,
              tipoUsuario: IdTipoUsuario,
            },
            Bun.env.SECRETO,
            { expiresIn: "1d" },
            (err, token) => {
              if (err) {
                console.error("Error signing token:", err);
                return res.send({
                  error: "Ocurrio un error del servidor",
                });
              }
              res.cookie("token", token, { sameSite: "None", secure: true });
              return res.send({ Status: "Loggeado" });
            }
          );
        } else {
          return res.json({ mensaje: "¡Usuario o contraseña incorrecta!" });
        }
      });
    } else {
      return res.json({ mensaje: "¡Usuario o contraseña incorrecta!" });
    }
  });
});

//Exportando las rutas de este archivo
module.exports = router;
