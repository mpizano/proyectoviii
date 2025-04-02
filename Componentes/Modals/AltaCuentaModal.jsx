//Importando Hooks
import React, { useEffect, useState } from "react";
//Importando uso  de modals
import Modal from "react-modal";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
//Importando notificaciones
import { notificarError, notificarExitoAlta } from "../notificacion.tsx";

// Para ayudar con la accesibilidad
Modal.setAppElement("#root");

const AltaCuentaModal = ({
  isOpen,
  onClose,
  idSolicitud,
  enviarBanderaAlPadre,
}) => {
  const enviarBandera = (boolValue) => {
    enviarBanderaAlPadre(boolValue);
  };

  //Variable para los datos de la solictud
  const [datosSolicitud, setDatosSolicitud] = useState({ Codigo: "" });
  //Variable para guardar las opciones desplegadas en el select de las opciones de tipo de usuario
  const [opcionesTipoUsuario, setOpcionesTipoUsuario] = useState([]);
  //Varibale para guardar la opcion seleccionada del rol
  const [rolSeleccion, setRolSeleccion] = useState("");
  //Varible para guardar la seleccion de tipo de usuario
  const [seleccionTipoUsuario, setSeleccionTipoUsuario] = useState("");
  //Variable para guardar el cambio del input del username
  const [username, setUsername] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  //Variable para guardar el cambio del input de la contraseña
  const [contrasenia, setContrasenia] = useState("");
  //Opciones para los tipos de roles
  const opcionesRol = [
    { value: "Admin", label: "Administrador" },
    { value: "Invitado", label: "Invitado" },
    { value: "Visitante", label: "Visitante" },
    { value: "Administrativo", label: "Administrativo" },
    { value: "edX", label: "edX" },
    { value: "Coursera", label: "Coursera" },
  ];
  const [deshabilitar, setDeshabilitar] = useState(true);

  //Funcion para generar un contraseña aleatoria
  const generarContraseña = () => {
    //Set de caracteres a usar para la generacion de contraseña
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const longitud = 10;
    let passwordArray = [];
    //Generacacion aleatoria de caracteres
    for (let i = 0; i < longitud; i++) {
      const randomIndex =
        window.crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
      passwordArray.push(charset[randomIndex]);
    }
    return passwordArray.join("");
  };

  //Efect para obtener las opciones de los roles al inicio del renderizado del modal
  useEffect(() => {
    //Funcion para obtener los roles
    const obtenerRoles = async () => {
      if (isOpen) {
        try {
          //Se hace la peticion al backend para traer los roles
          const respuesta = await axios.get(import.meta.env.VITE_HTTPROLES);
          //Se guardan los datos de la respuesta en las opciones de tipo de usuario
          setOpcionesTipoUsuario(respuesta.data);
        } catch (error) {
          console.error("Error al obtener opciones desde el servidor:", error);
        }
      }
    };
    obtenerRoles();
  }, [isOpen]);

  //Effect para obtener los datos de la solicitud a dar de alta
  useEffect(() => {
    const obtenerDatosSolicitud = async () => {
      //cuando las opciones de los tipos de roles se han cargado se obtienen los datos de la solicitud
      if (opcionesTipoUsuario.length > 0) {
        try {
          //Se hace la solicitud con el id de la solicitud que se quiere dar de alta
          const response = await axios.post(
            import.meta.env.VITE_HTTPSOLICITUDESPECIDIFCA,
            {
              idSolicitud: idSolicitud,
            }
          );
          //Se guardan los datos de la respuesta del backend
          const datos = response.data[0];
          //Se guardala la contraseña generada
          setContrasenia(generarContraseña());
          //Se fija el username de los datos obtenidos de la solicitud
          setUsername(datos.Nombre);
          setCorreoElectronico(datos.CorreoElectronico);
          //Se fijan los datos de la solicitud
          setDatosSolicitud(datos);
          //Se busca el tipo de usuario que corresponde en los datos de la solictud
          //con las opciones de tipo de usuario de los selects
          const tipoUsuarioEncontrado = opcionesTipoUsuario.find(
            (opcion) => opcion.TipoUsuario === datos.TipoSolicitud
          );
          //Se guarda el tipo de usuario seleccionado con el que se encontro en la solicitud
          const tipoUsuarioSeleccionado = {
            value: tipoUsuarioEncontrado?.IdTipoUsuario || "",
            label: tipoUsuarioEncontrado?.TipoUsuario || "",
          };
          //Se fija el tipo de usuario
          setSeleccionTipoUsuario(tipoUsuarioSeleccionado);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };
    obtenerDatosSolicitud();
  }, [opcionesTipoUsuario, idSolicitud]);

  //Funcion para manejar el cierre del modal
  const manejarCierre = (boolValue) => {
    //Se cierran las notificaciones
    toast.dismiss();
    //Se limpia el rol
    setRolSeleccion("");
    setDeshabilitar(true);
    //Se cierra el modal
    if (boolValue === true) {
      enviarBandera(boolValue);
    }
    onClose();
  };

  //Funcion para manejar el cambio de selecion del select
  const manejarSeleccion = (rolSeleccion) => {
    setRolSeleccion(rolSeleccion);
    setDeshabilitar(false);
  };

  //Funcion para manejar el cambio de selecion del select
  const manejarSeleccionTipoUsuario = (rolSeleccion) => {
    setSeleccionTipoUsuario(rolSeleccion);
  };

  //Funcion para dar de alta la cuenta
  const darAltaSolicitud = async () => {
    if (rolSeleccion.length !== 0) {
      try {
        //Se envia la solicitud al backend
        const respuesta = await axios.post(import.meta.env.VITE_HTTPALTA, {
          //Se pasan todos los datos de la solicitud
          idSolicitud: idSolicitud,
          codigo: datosSolicitud.Codigo,
          rol: rolSeleccion.value,
          correoElectronico: correoElectronico,
          username: username,
          passw: contrasenia,
          tipoUsuario: seleccionTipoUsuario.value,
          NombreCompleto: {
            Nombre: datosSolicitud.Nombre,
            ApellidoPaterno: datosSolicitud.ApellidoPaterno,
            ApellidoMaterno: datosSolicitud.ApellidoMaterno,
          },
        });
        //Si la respuesta del backend es correcta se notifica el exito de la alta
        if (respuesta.status === 200) {
          notificarExitoAlta(respuesta.data.mensaje);
          setTimeout(() => {
            manejarCierre(true);
          }, 1000);
        } else {
          //Si la respuesta no es correcta si importar el motivo, se notifica el error devuelto por el backend
          notificarError(respuesta.data.error);
        }
      } catch (error) {
        //Se notifica si hubo un error en la peticion
        notificarError(
          "Error en el servicio de Altas: " + error.response.data.error
        );
      }
    }
  };

  //Funcion para manejar el cambio de la contraseña en el input
  const manejarCambioContraseña = (event) => {
    const contrasenia = event.target.value;
    setContrasenia(contrasenia);
  };

  //Funcion para manejar el cambio del username en el input
  const manejarCambioUsername = (event) => {
    const username = event.target.value;
    setUsername(username);
  };

  //Funcion para manejar el cambio del input del correo electronico
  const manejarCambioCorreoElectronico = (event) => {
    const nuevoCorreo = event.target.value;
    setCorreoElectronico(nuevoCorreo);
  };

  return (
    <>
      {/*Modal para dar de alta una cuenta */}
      <Modal
        //Variable para ocultar o mostrar el modal
        isOpen={isOpen}
        //Cuando se solicita que se cierre el modal se manda a llamar a la funcion
        onRequestClose={manejarCierre}
        contentLabel="Alta cuenta"
        //Estilos para el modal
        className="rounded shadow-inner shadow-blue-gray-600 fixed inset-0 m-auto w-[40%] h-[70%] bg-white overflow-auto text-xl font-semibold"
        //Estilos para la parte exterior del modal
        overlayClassName="fixed inset-0"
      >
        {/*Inicio del contenido del modal */}
        <div className="flex flex-col items-center justify-start py-20 h-full">
          {/*Titulo */}
          <h1 className="mb-5">Alta cuenta</h1>
          {/*Contenido para mostrar en celdas */}
          <div className="grid grid-cols-2 gap-y-4 items-center w-full px-4">
            <label className="text-right mr-6">Codigo</label>
            {/*Input para el codigo, esta deshabilitado ya que el codigo no se debe de modificar */}
            <input
              value={datosSolicitud.Codigo}
              disabled
              className="rounded form-input w-[80%] border-b-4 border-b-indigo-500 outline-none focus:border-b-indigo-200 cursor-not-allowed"
            />
            <label className="text-right mr-6">Nombre de Usuario</label>
            <input
              value={username}
              onChange={manejarCambioUsername}
              className="rounded form-input w-[80%]  border-b-4 border-b-indigo-500 outline-none focus:border-b-indigo-200"
            />
            <label className="text-right mr-6">Correo Electronico</label>
            <input
              value={correoElectronico}
              onChange={manejarCambioCorreoElectronico}
              className="rounded form-input w-[80%]  border-b-4 border-b-indigo-500 outline-none focus:border-b-indigo-200"
            />
            <label className="text-right mr-6">Rol</label>
            {/*Select para los roles de usuario */}
            <Select
              options={opcionesRol}
              //Se pasan los roles que se requieren
              value={rolSeleccion}
              onChange={manejarSeleccion}
              placeholder="Rol"
              className="w-[80%]"
              maxMenuHeight={250}
            />
            <label className="text-right mr-6 ">Contraseña</label>
            <input
              value={contrasenia}
              onChange={manejarCambioContraseña}
              className="rounded form-input w-[80%]  border-b-4 border-b-indigo-500 outline-none focus:border-b-indigo-200"
            />
            <label className="text-right mr-6">Tipo de Usuario</label>
            {/*Select para el tipo de usario */}
            <Select
              value={seleccionTipoUsuario}
              onChange={manejarSeleccionTipoUsuario}
              //Se cargan los tipos de usuarios obtenidos del backend
              options={opcionesTipoUsuario.map((opcion) => ({
                value: opcion.IdTipoUsuario,
                label: opcion.TipoUsuario,
              }))}
              placeholder="Tipo de Usuario"
              className="w-[80%]"
            />
          </div>
          <div className="flex flex-row items-center">
            {/*Boton para dar de alta */}
            <button
              className={`mt-10 mr-5 text-white font-bold py-2 px-4 rounded  ${
                deshabilitar
                  ? `bg-gray-600 hover:bg-gray-700`
                  : ` bg-blue-500 hover:bg-blue-700 `
              }`}
              onClick={darAltaSolicitud}
              disabled={deshabilitar}
            >
              Alta
            </button>
            {/*Boton para regresar y cerrar el modal */}
            <button
              className="mt-10 bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded "
              onClick={manejarCierre}
            >
              Regresar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AltaCuentaModal;
