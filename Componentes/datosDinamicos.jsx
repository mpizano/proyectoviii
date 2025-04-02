import React, { useState, useEffect, useCallback } from "react";
//Importanto otros componentes creados para el proyecto
import { codigo } from "./getData.jsx";
//Importando el diccionario de datos
import Diccionario from "../Recursos/DiccionarioTerminos.js";
//Librerias para las peticiones http al backend
import Axios from "axios";
import Select from "react-select";
import UpdateConfirmationModal from "./Modals/UpdateConfirmationModal.jsx";
import {
  NotifyContainer,
  notificarError,
  notificarExito,
} from "./notificacion.tsx";
import { PantallaCargaModal } from "./Modals/PantallaCargaModal.jsx";
import "./Css componentes/DatosGenerales.css";
import { selectCustomStyle, temaSelect } from "./Modals/Styles.tsx";
const DatosDinamicos = () => {
  // Estado para controlar la habilitación del input
  const [inputHabilitado, setInputHabilitado] = useState(false);
  const [contraHabilitado, setContraHabilitado] = useState(false);
  //Variables para el catalogo de generos
  const [opciones, setOpciones] = useState([]);
  const [valorGenero, setGeneroSeleccionado] = useState("");

  // Variable donde se guardaran los contenidos de los inputs y el contenido cargando desde el backend
  const [valorInput, setValorInput] = useState({
    codigo: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    idGenero: "",
  });

  //Variable donde se guardaran los contenidos del usuario para comparar cuando los valores de los inputs cambien
  const [valorPorDefecto, setValorDefecto] = useState({
    codigo: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    idGenero: "",
  });

  //Variable para validar la contraseña nueva que se va a cambiar para accesar al sistema
  const [valorInputPassw, setValorInputPassw] = useState({
    contrasenia: "",
    contraseniaCorroborar: "",
  });

  // Estado para indicar si el contenido del input ha cambiado
  const [contenidoCambiado, setContenidoCambiado] = useState(false);
  const [contraCambiada, setContraCambiada] = useState(false);

  //Variables para el control del modal para notificar al usuario si desea salir
  const [parametro, setParametro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPantallaCargaOpen, setIsModalPantallaCarga] = useState(false);

  //Funcion para mostar el modal cuando el usuario desea cambiar la contraseña
  const handlePasswUpdate = () => {
    //Pasando la seccion que se va a actualizar para mostrarlo en el modal
    setParametro("Contraseña");
    //Mostrando el modal
    setIsModalOpen(true);
  };

  //Funcion para mostrar el modal cuando el usuario quiere cambiar sus datos generales
  const handleDatosUpdate = () => {
    setParametro("Datos");
    setIsModalOpen(true);
  };

  /*Funcion para elegir entre la funcion de actualizar datos y la de actualizar la contraseña dependiendo de lo
  que el usuario eligió*/
  const handleConfirmUpdate = () => {
    switch (parametro) {
      case "Contraseña": {
        //Llamando a la funcion para actualizar la contraseña
        actualizarPassw();
        break;
      }
      case "Datos": {
        //Llamando a la funcion para actualizar los datos generales
        actualizarDatos();
        break;
      }
      default:
        //Cerrando el modal
        setIsModalOpen(false);
    }
    //Cerrando el modal
    setIsModalOpen(false);
  };

  //Cuando el usuario no desea continuar con el cambio de datos el modal se cierra
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Funcion asincrona para obtener los datos del backend
  useEffect(() => {
    const obtenerValorPorDefecto = async () => {
      try {
        const respuesta = await Axios.post(
          import.meta.env.VITE_HTTPDATOSGENERALES,
          {
            codigo: codigo,
          }
        );

        if (respuesta.data.mensaje) {
          notificarError(respuesta.data.mensaje);
        } else {
          // Inicializar valorDefecto directamente con los valores obtenidos del backend
          const nuevoValorDefecto = {
            codigo: respuesta.data[0].Codigo,
            nombre: respuesta.data[0].Nombre,
            apellidoPaterno: respuesta.data[0].ApellidoPaterno,
            apellidoMaterno: respuesta.data[0].ApellidoMaterno,
            genero: respuesta.data[0].Genero,
            idGenero: respuesta.data[0].IdGenero,
          };
          //Fijando como los valores principales
          setValorInput(nuevoValorDefecto);
          //Fijando a los valores por defecto para hacer la validacion cuando el contenio cambie
          setValorDefecto(nuevoValorDefecto);
          //Cambiando la bandera porque si no cambiara inmediatamente al cargar los datos
          setContenidoCambiado(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    obtenerValorPorDefecto();
  }, []);

  //Cargando los generos de la tabla de catalogo de generos al componente
  useEffect(() => {
    const obtenerOpcionesDesdeServidor = async () => {
      try {
        const respuesta = await Axios.post(import.meta.env.VITE_HTTPGENEROS);
        setOpciones(respuesta.data);
      } catch (error) {
        console.error("Error al obtener opciones desde el servidor:", error);
      }
    };
    obtenerOpcionesDesdeServidor();
  }, []);

  /*Se usa para manejar el cambio en el input de datos de y las banderas, para que solo se 
    activen cuando el contenido sea diferente al de por defecto*/
  useEffect(() => {
    // Esta función se ejecuta cada vez que valorInput cambia
    const contenidoCambiado = Object.keys(valorInput).some(
      (campo) => valorInput[campo] !== valorPorDefecto[campo]
    );
    setContenidoCambiado(contenidoCambiado);
  }, [valorInput, valorPorDefecto]);

  // Función para cambiar el estado de la habilitación del input
  const toggleHabilitarInput = () => {
    setInputHabilitado(!inputHabilitado);
  };

  //Funcion para cambiar el estado de la habilitacion de la seccion para cambiar la contraseña
  const toggleHabilitarContra = () => {
    setContraHabilitado(!contraHabilitado);
  };
  // Función para manejar el cambio en el contenido del input
  const handleInputChange = useCallback((valor, campo) => {
    setValorInput((prevValorInput) => ({
      ...prevValorInput,
      [campo]: valor,
    }));
  }, []);

  //Funcion para manejar el cambio del valor del genero
  const handleChangeGenero = (seleccionado) => {
    const valorGeneroValue = seleccionado;
    handleInputChange(seleccionado.value, "idGenero");
    setGeneroSeleccionado(valorGeneroValue.value);
  };

  //Funcion para manejar el cambio del contenido en el input de la contraseña
  const handlePasswChange = (valor, campo) => {
    setValorInputPassw((prevValorInputPassw) => ({
      ...prevValorInputPassw,
      [campo]: valor,
    }));
    setContraCambiada(true);
  };

  //Funcion para actualizar datos en el sistema
  const actualizarDatos = () => {
    setIsModalPantallaCarga(true);
    //Pasando los valores al backend para que se actualicen en la base de datos
    Axios.post(import.meta.env.VITE_HTTPUPDATE, {
      codigo: valorInput.codigo,
      nombre: valorInput.nombre,
      apellidoPaterno: valorInput.apellidoPaterno,
      apellidoMaterno: valorInput.apellidoMaterno,
      genero: valorInput.idGenero,
    })
      .then((respuesta) => {
        setIsModalPantallaCarga(false);
        if (respuesta.data.mensaje) {
          // Mostrar la notificación de éxito
          notificarExito();
        } else {
          console.log(respuesta.data);
        }
      })

      .catch((error) => console.log(error));
  };

  const actualizarPassw = () => {
    setIsModalPantallaCarga(true);
    //Pasando los valores al backend para que se actualicen en la base de datos
    Axios.post(import.meta.env.VITE_HTTPUPDATEPASSW, {
      codigo: valorInput.codigo,
      passw: valorInputPassw.contrasenia,
    })
      .then((respuesta) => {
        setIsModalPantallaCarga(false);
        //Evaluando si se encuentra loggaedo el usuario
        if (respuesta.data.mensaje) {
          setIsModalOpen(false);
          // Mostrar la notificación de éxito
          notificarExito();
        } else {
          console.log(respuesta.data);
        }
      })
      .catch((error) => console.log(error));
  };

  //Reiniciar el contenido al original cuando se cargaron los datos
  const reiniciarContenido = () => {
    setValorInput({ ...valorPorDefecto });
    setContenidoCambiado(false);
    handleChangeGenero({
      value: valorPorDefecto.idGenero,
      label: valorPorDefecto.genero,
    });
  };

  return (
    <main>
      <div className="Datos">
        <section className="container">
          {/*Contenedor para las notificaciones */}
          <NotifyContainer />
          <div className="tarjeta">
            {/*Boton que cambia entre editar los campos de datos generales y solo verlos  */}
            <button
              className="btn"
              type="button"
              //Cuando se le da clic se llama a la funcio para cambiar la bandera
              onClick={toggleHabilitarInput}
            >
              {/*Se evalua la bandera para cambiar el texto del boton*/}
              {inputHabilitado ? "Regresar" : "Editar"}
            </button>

            <div className="">
              {/*Label que guarda el codigo del usuario */}
              <label className="labelDatos" htmlFor="CodigoLb">
                {Diccionario.codigo}:
              </label>
              <input
                className="inputDatos"
                type="text"
                value={valorInput.codigo}
                //Se deshabilita siempre ya que este campo no puede y no debe ser modificado
                disabled={true}
              />
            </div>

            <div className="">
              {/*Label que guarda el nombre del usuario de la tabla datos generales */}
              <label className="labelDatos" htmlFor="NombreLb">
                {Diccionario.nombre}:
              </label>
              <input
                className="inputDatos"
                type="text"
                value={valorInput.nombre}
                //Cuando el contenido del input cambia llamamos a la funcion que maneja este cambio
                onChange={(e) => handleInputChange(e.target.value, "nombre")}
                //Verificamos la bandera para saber si se quiere editar este campo
                disabled={!inputHabilitado}
              />
            </div>

            <div className="">
              {/*Label que guarda el apellido parterno del usuario */}
              <label className="labelDatos" htmlFor="ApellidoPaLb">
                {Diccionario.apellidoPaterno}:
              </label>
              <input
                className="inputDatos"
                type="text"
                value={valorInput.apellidoPaterno}
                onChange={(e) =>
                  handleInputChange(e.target.value, "apellidoPaterno")
                }
                disabled={!inputHabilitado}
              />
            </div>
            <div className="">
              {/*Label que guarda el apellido materno del usuario */}
              <label className="labelDatos" htmlFor="CodigoLb">
                {Diccionario.apellidoMaterno}:
              </label>
              <input
                className="inputDatos"
                type="text"
                value={valorInput.apellidoMaterno}
                onChange={(e) =>
                  handleInputChange(e.target.value, "apellidoMaterno")
                }
                disabled={!inputHabilitado}
              />
            </div>

            <div className="">
              {/*Label que guarda el genero del usuario */}
              <label className="labelDatos">Genero:</label>
              {/*Aqui al evaluar la bandera si quiere editar el campo, en lugar de habilitar
              el input en su lugar se oculta para posteriormente mostar un React-Select */}
              <input
                type="text"
                className="inputDatos"
                value={valorInput.genero}
                //Como no se usara el input para recibir algo se deshabilita todo el tiempo
                disabled={true}
                //Evaluando la bandera para ocultar el input en caso de que quiera editar los datos
                hidden={inputHabilitado}
              />

              {/*Evaluando la bandera para mostar el select en lugar del input de las opciones de los generos */}
              <div hidden={!inputHabilitado}>
                {/*Select donde se guardan los generos existentes en la base de datos */}
                <Select
                  className="Select"
                  onChange={handleChangeGenero}
                  //Pasando las opciones obtenidas en el backend
                  options={opciones.map((opcion) => ({
                    value: opcion.idgenero,
                    label: opcion.genero,
                  }))}
                  //Cambiando el value del componente para poder limpiarlo y mostrarlo de forma correcta
                  value={
                    opciones.find((option) => option.idgenero === valorGenero)
                      ? {
                          value: valorGenero,
                          label: opciones.find(
                            (option) => option.idgenero === valorGenero
                          ).genero,
                        }
                      : null
                  }
                  placeholder={valorPorDefecto.genero}
                  theme={temaSelect}
                  styles={selectCustomStyle}
                />
              </div>
            </div>

            {/*Se evaluan las banderas, primero la de contenido cambiado cuando se detecta que el contenido tanto de los inputs
            como del select difiere del original y la segunda de inputHabilitado para saber que se está en la opcion de modicar
            datos*/}
            {contenidoCambiado === true && inputHabilitado && (
              <>
                {/*Boton que se muesta solo cuando el contenido se cambió, para confirmar que se quiere cambiar los datos*/}
                <button
                  className="btn"
                  type="button"
                  onClick={handleDatosUpdate}
                >
                  {Diccionario.confirmarCambio}
                </button>
                {/*Boto que se muestra para reiniciar el contenido al estado original cuando se ejecutó la carga de datos desde
            la base de datos*/}
                <button
                  className="btn"
                  type="button"
                  onClick={reiniciarContenido}
                >
                  {Diccionario.reiniciarContenido}
                </button>
              </>
            )}
            {/*Evaluando la bandera si se quiere editar o no los datos */}
            {inputHabilitado ? (
              <div>
                <div className="">
                  {/*Boton para habilitar el submenu para ingresar una nueva contraseña */}
                  <button
                    className="btn"
                    type="button"
                    onClick={toggleHabilitarContra}
                  >
                    {Diccionario.cambiarContraseña}
                  </button>
                </div>
                {/*Evaluando banderas para habilitar la edicion de la contraseña del usuario */}
                {contraHabilitado === true && (
                  <div>
                    <div className="">
                      {/*Label para la nueva contraseña */}
                      <label className="labelDatos">
                        {Diccionario.nuevaContraseña}
                      </label>
                      {/*Input que guarda la nueva contraseña ingresada por el usuario */}
                      <input
                        className="inputDatos"
                        value={valorInputPassw.contrasenia}
                        type="password"
                        onChange={(e) =>
                          handlePasswChange(e.target.value, "contrasenia")
                        }
                      />
                    </div>

                    <div className="">
                      {/*Label para confirmar la contraseña y evaluar que ambas contraseñas sean iguales */}
                      <label className="labelDatos">
                        {Diccionario.confirmarContraseña}
                      </label>
                      <input
                        className="inputDatos"
                        value={valorInputPassw.contraseniaCorroborar}
                        type="password"
                        onChange={(e) =>
                          handlePasswChange(
                            e.target.value,
                            "contraseniaCorroborar"
                          )
                        }
                      />
                    </div>
                    {/*Evaluando primero si ambos campos de la nueva contraseña coinciden*/}
                    {valorInputPassw.contrasenia ===
                      valorInputPassw.contraseniaCorroborar &&
                      //Evaluando si la contraseña mide mas que cero
                      valorInputPassw.contrasenia.length > 0 &&
                      //Evaluando si la contraseña a comparar mide mas que cero
                      valorInputPassw.contraseniaCorroborar.length > 0 && (
                        //Boton para confirmar el cambio de contraseña
                        <button
                          className="btn"
                          type="button"
                          onClick={handlePasswUpdate}
                        >
                          {Diccionario.confirmarCambioContraseña}
                        </button>
                      )}
                  </div>
                )}
              </div>
            ) : (
              //Label de la contraseña cuando no se quiere editar
              <div className="">
                {/*Label que guarda una contraseña random no es significativo solo se usa de modo cosmetico*/}
                <label className="labelDatos" htmlFor="ContraseLb">
                  {Diccionario.contrasenia}
                </label>
                <input
                  className="inputDatos"
                  type="password"
                  value={
                    "01110000 01110101 01110100 01101111 00100000 01100101 01101100 00100000 01110001 01110101" +
                    "01100101 00100000 01101100 01101111 00100000 01101100 01100101 01100001"
                  }
                  disabled={true}
                />
              </div>
            )}
          </div>

          {/* Modal de confirmación */}
          <UpdateConfirmationModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmUpdate}
            parametro={parametro}
          />
          <PantallaCargaModal modalIsOpen={isModalPantallaCargaOpen} />
        </section>
      </div>
    </main>
  );
};

export default DatosDinamicos;
