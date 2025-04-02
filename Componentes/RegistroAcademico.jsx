import React, { useState, useEffect, useRef } from "react";
//Libreria para la navegacion entre paginas
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
//Libreria para el uso del componente Select que mostrara un menu con opciones
import Select from "react-select";
//Libreria para el uso de axios como api de comunicacion con el backend
import axios from "axios";
import Diccionario from "../Recursos/DiccionarioTerminos.js";
//Importando lo requerido para las notificaciones
import {
  //Importando el componente contenedor de la notificacion
  NotifyContainer,
  //Diferenetes tipos de notificaciones
  notificarCamposFaltantes,
  notificarEmailEnviado,
  notificarError,
  notificarErrorInputs,
} from "./notificacion.tsx";
//Temas y estilos personalisables para algunos componentes
import { selectCustomStyle, temaSelect } from "./Modals/Styles.tsx";
//Modal para la pantalla de carga
import { PantallaCargaModal } from "./Modals/PantallaCargaModal.jsx";
//Modal para la pantalla de confirmacion
import ConfirmacionModal from "./Modals/ConfirmacionModal.jsx";
//Modal para la pantalla de contacto
import EmailModal from "./Modals/ContactanosModal.jsx";
//Importando el captcha
import { Captcha2 } from "./Captcha.jsx";
import "./Css componentes/Botones.css";

export const RegistroAcademico = () => {
  //Varibles para los inputs ddel formulario
  const [datosForm, setDatosForm] = useState({
    apellidoMaterno: "",
    apellidoPaterno: "",
    codigo: "",
    email: "",
    nombre: "",
  });

  //Variables que guarda las opciones del backend para los selects
  const [opcionesCu, setOpcionesCu] = useState([]);
  const [opcionesDependencias, setOpcionesDependencias] = useState([]);
  const [opcionesNombramientos, setOpcionesNombramiento] = useState([]);

  //Variables que guardan la opcion seleccionada en el select por el usuario
  const [cuSeleccionado, setCuSeleccionado] = useState("");
  const [dependenciaSeleccionado, setDependenciaSeleccionado] = useState("");
  const [nombramientoSeleccionado, setNombramientoSeleccionado] = useState("");

  //Banderas de control sobre lo ingresado en los inputs
  const [existeCodigo, setExisteCodigo] = useState(false);
  const [esEmailValido, setEsEmailValido] = useState(true);
  const [esCodigoValido, setEsCodigoValido] = useState(true);
  //Banderas para lo modals
  const [modalCargaIsOpen, setModalCargaIsOpen] = useState(false);
  const [modalConfirmacionIsOpen, setModalConfirmacionIsOpen] = useState(false);
  const [modalContactoIsOpen, setModalContactoIsOpen] = useState(false);
  //Bandera para el resultado del captcha
  const [banderaCaptcha, setBanderaCaptcha] = useState(true);

  //Funcion para manajear la bandera obtenida por el captcha
  const manejarBanderaCaptcha = (bandera) => {
    setBanderaCaptcha(bandera);
  };
  //Funcion para cerrar el modal de email
  const cerrarModalContacto = () => {
    setModalContactoIsOpen(false);
  };
  //Funcion para cambiar el estado del modal de la pantalla de confirmacion
  const cerrarConfirmacionModal = () => {
    setModalConfirmacionIsOpen(false);
  };
  //Referencia al input del codigo
  const inputRefCodigo = useRef(null);

  axios.defaults.withCredentials = true;

  //Efecto para cargar las opciones de centros universitarios al inicio de la renderizacion de la pagina
  useEffect(() => {
    const obtenerOpcionesDesdeServidor = async () => {
      try {
        //Ejecutando dos consultas del backend al mismo tiempo en una promesa para que se resuelvan
        //al mismo tiempo
        const [respuestaCu, respuestaNombramiento] = await Promise.all([
          axios.get(import.meta.env.VITE_HTTPCENTROSUNIVERSITARIOS),
          axios.get(import.meta.env.VITE_HTTPNOMBRAMIENTOS),
        ]);
        setOpcionesCu(respuestaCu.data);
        setOpcionesNombramiento(respuestaNombramiento.data);
      } catch (error) {
        console.error("Error al obtener opciones desde el servidor:", error);
      }
    };
    obtenerOpcionesDesdeServidor();
  }, []);

  //Funcion que maneja cada cambio en los inputs
  const manejarCambioInput = (e) => {
    //Se obtiene el valor del input
    const { name, value } = e.target;
    let newValue = value;

    //Funcion para validar el nombre, apellidoPaterno, apellidoMaterno
    const validarCadena = (value) => {
      const sanitizedInput = value.replace(/[^a-zá-ú\s]+/gi, "");
      newValue = sanitizedInput;
    };

    //Funcion para validar el codigo
    const validarCodigo = (value) => {
      setExisteCodigo(false);
      //Expresion regular que verifica que el codigo tenga una longitud de por lo menos 7 caracteres
      //aceptando que el primero y ultimo caracter puedan ser letras
      const regex = /^[a-zA-Z0-9]\d{5,13}[a-zA-Z0-9]{1}$/;
      //Se prueba el valor
      setEsCodigoValido(regex.test(value));
    };

    //Se especifica a que funcion le corresponde cada campo a evaluar
    const verificacionDeEstado = {
      codigo: validarCodigo,
      email: validarEmail,
      nombre: validarCadena,
      apellidoPaterno: validarCadena,
      apellidoMaterno: validarCadena,
    };

    //Se pasa el nombre del campo que se esta modificando y se obtiene la funcion a ejecutar
    const funcion = verificacionDeEstado[name];
    if (funcion) {
      //Ejecutando la funcion que se obtuvo con el nombre del parametro
      funcion(value);
    }

    //Se modifica el valor del input del campo que se requiere con el nuevo valor verificado
    setDatosForm({
      ...datosForm,
      [name]: newValue,
    });
  };

  //Funcion para validar el email
  const validarEmail = (e) => {
    const newEmail = e;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEsEmailValido(emailRegex.test(newEmail));
  };

  //Funcion para manejar el cambio de seleccion de dependencia
  const manejarSeleccionDependencia = (e) => {
    const dependenciaSeleccionadoValue = e;
    setDependenciaSeleccionado(dependenciaSeleccionadoValue);
  };

  //Funcion para manejar el cambio de seleccion de nombramiento
  const manejarNombramientoSeleccionado = (e) => {
    const nombramientoValue = e;
    setNombramientoSeleccionado(nombramientoValue);
  };

  //Funcion para manejar el cambio de seleccion del centro universitario,
  //ademas se obtendran todas las dependencias que pertecenen al centro universitario
  const manejarSeleccionCu = (e) => {
    //Evaluando que no se ejecute denuevo al volver a seleccionar las misma opcion
    if (cuSeleccionado.value !== e.value) {
      const cuSeleccionadoValue = e;
      setCuSeleccionado(cuSeleccionadoValue);
      //Limpiando las dependencias cuando se cambia de centro universitarios
      setDependenciaSeleccionado("");
      const obtenerOpcionesDependencias = async () => {
        try {
          //Mandando la consulta al backend
          const respuesta = await axios.post(
            import.meta.env.VITE_HTTPOPCIONESDEPENDENCIAS,
            {
              cu: cuSeleccionadoValue.Id,
            }
          );
          if (respuesta.error) {
            console.log(respuesta.error);
          } else {
            //Obteniendo las opciones regresadas por el backend
            const datosCombinados = [
              ...respuesta.data.areas,
              ...respuesta.data.departamentos,
              ...respuesta.data.divisiones,
              ...respuesta.data.unidades,
              ...respuesta.data.coordinaciones,
            ];
            setOpcionesDependencias(datosCombinados);
          }
        } catch (error) {
          console.error(error);
        }
      };
      obtenerOpcionesDependencias();
    }
  };

  //Funcion para verificar si existe el codigo registrado en el sistema
  const verificarExistencia = async () => {
    setExisteCodigo(false);
    try {
      //Consultando al backend
      const respuesta = await axios.post(
        import.meta.env.VITE_HTTPEXISTECODIGO,
        {
          codigo: datosForm.codigo,
        }
      );
      if (respuesta.error) {
        console.log(respuesta.error);
      } else {
        //Evaluando si se encontro en el sistema
        if (respuesta.data[0].existe) {
          //Si se encontro se despliega el mensaje y se pasa el focus al input del codigo
          setExisteCodigo(true);
          inputRefCodigo.current.focus();
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Funcion para comprobar la informacion del formulario antes de enviarlo al backend
  const comprobarInformacion = async () => {
    //Se obtienen los campos que estan vacios
    const camposVacios = Object.values(datosForm).every(
      (campo) => campo !== ""
    );
    //Variables para saber cuando los selects no estan llenos con la seleccion del usuario
    const selectsVariables = [
      cuSeleccionado,
      dependenciaSeleccionado,
      nombramientoSeleccionado,
      camposVacios,
    ];
    //Validando el contenido de los selects y el de campos vacios de los inputs
    if (
      !selectsVariables.every((variable) => variable && variable.length !== 0)
    ) {
      notificarCamposFaltantes();
      return false;
    }
    //Validando si el codigo e email es valido
    if (!esCodigoValido || !esEmailValido) {
      notificarErrorInputs("Solucione sus errores antes de continuar");
      return false;
    }
    //Validando si el codigo ingresado se encuentra registrado en el sistema
    try {
      if (await verificarExistencia()) {
        notificarError("Codigo ya registrado");
        return false;
      }
    } catch (error) {
      notificarError("Error al verificar existencia: " + error.message);
      throw error;
    }
    return true;
  };

  //Funcion ejecutada cuando el usuario quiere enviar el formulario
  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      //Se valida la informacion de usuario
      if ((await comprobarInformacion()) === true) {
        //Se muestra la pantalla de carga
        setModalCargaIsOpen(true);
        //Se envian los datos ingresados al backend
        const respuesta = await axios.post(
          import.meta.env.VITE_HTTPSOLICITUDCUENTA,
          {
            //Recabando la informacion del usuario
            codigo: datosForm.codigo,
            //Concatenando los campos del nombre del usuario
            nombreCompleto: {
              nombre: datosForm.nombre,
              apellidoPaterno: datosForm.apellidoPaterno,
              apellidoMaterno: datosForm.apellidoMaterno,
            },
            email: datosForm.email,
            //obteniendo los campos de los selects para guarda tanto la llave como el contenido
            cu: {
              id: cuSeleccionado.Id,
              label: cuSeleccionado.label,
              value: cuSeleccionado.value,
            },
            dependencia: {
              label: dependenciaSeleccionado.label,
              value: dependenciaSeleccionado.value,
            },
            nombramiento: {
              label: nombramientoSeleccionado.label,
              value: nombramientoSeleccionado.value,
            },
            tipoSolicitud: "Academico",
          }
        );
        //Se cierra la pantalla de carga
        setModalCargaIsOpen(false);
        //Una vez resuelta la peticion se evalua si fue exitosa
        if (respuesta.status === 200) {
          //Se notifica que se envio un email
          notificarEmailEnviado();
          //Se abre la pantalla de confirmacion
          setModalConfirmacionIsOpen(true);
        } else if (respuesta.status === 500) {
          //Se notifica si hubo un error
          notificarError(respuesta.data.mensaje);
        }
      }
    } catch (error) {
      //Se cierra la pantalla de carga
      setModalCargaIsOpen(false);
      notificarError(`Hubo un error en el servidor: ${error}`);
    }
  };

  return (
    <main>
      <div className="Registro">
        <NotifyContainer />
        <div className="contenedor-centrado">
          <div className="tarjeta-registro">
            <h2>{Diccionario.registroAcademico}</h2>
            {/*Formulario para ingresar los datos de la solicitud de una cuenta */}
            <form
              name="FormularioCuenta"
              className="contenedor-columna-centro"
              //Cuando se da al boton de enviar la solicitud se ejecuta la verificacion de la informacion
              onSubmit={enviarFormulario}
              autoComplete="off"
            >
              <label>{Diccionario.codigo}</label>
              <input
                type="text"
                name="codigo"
                value={datosForm.codigo}
                onChange={manejarCambioInput}
                //Referencia a este componente para poder ajustar el focus
                ref={inputRefCodigo}
                //Cuando el codigo ingresado existe en el sistema el borde del componente se pone en rojo
                style={{
                  border: existeCodigo ? "2px solid red" : null,
                }}
                placeholder="Código"
                className="input-redondeado"
              />
              {/*Cuando el formato ingresado del codigo no coincide con la validacion de la expresion regular
                              se muestra el mensaje hasta que se corriga */}
              {!esCodigoValido && (
                <span style={{ color: "red" }}>
                  {Diccionario.formatoCodigoNoValido}
                </span>
              )}
              {/*Cuando existe el codigo  */}
              {existeCodigo && (
                <span style={{ color: "red" }}>{Diccionario.codigoExiste}</span>
              )}
              <label>{Diccionario.nombreCompleto}</label>
              {/*Inputs para el llenado del nombre del solicitante
                              se valida que solo acepten caracteres y espacios */}

              <input
                type="text"
                name="nombre"
                value={datosForm.nombre}
                onChange={manejarCambioInput}
                placeholder={Diccionario.nombre}
                className="input-redondeado"
              />
              <input
                type="text"
                name="apellidoPaterno"
                value={datosForm.apellidoPaterno}
                onChange={manejarCambioInput}
                placeholder={Diccionario.apellidoPaterno}
                className="input-redondeado"
              />
              <input
                type="text"
                name="apellidoMaterno"
                value={datosForm.apellidoMaterno}
                onChange={manejarCambioInput}
                placeholder={Diccionario.apellidoMaterno}
                className="input-redondeado"
              />
              {/*Input para el correo electronico del solicitante se evalua que siga el formato de un email comun
                              no se aceptan espacios */}
              <label>{Diccionario.correoElectronico}</label>
              <input
                type="text"
                name="email"
                placeholder="Correo Electronico"
                value={datosForm.email}
                onChange={manejarCambioInput}
                className="input-redondeado"
              />
              {/*Cuando el formato del email no es valido se depliega el mensaje hasta que se corrija */}
              {!esEmailValido && (
                <span style={{ color: "red" }}>
                  {Diccionario.correoNoValido}
                </span>
              )}
              {/*Select con las opciones para los centros universitarios */}
              <label>{Diccionario.dependencia}</label>
              <section className="select-96">
                <Select
                  onChange={manejarSeleccionCu}
                  value={cuSeleccionado}
                  //Pasandole las opciones obtenidas del backend
                  options={opcionesCu.map((opcion) => ({
                    Id: opcion.IdCu,
                    value: opcion.Acronimo,
                    label: opcion.Nombre,
                  }))}
                  placeholder={Diccionario.centrosUniversitarios}
                  //Pasando un tema personalizado para cambiar el
                  theme={temaSelect}
                  //Se le pasa un estilo personalizado para poder cambiar el tamaño del componente
                  styles={selectCustomStyle}
                ></Select>
              </section>
              {/*Select que guarda las opciones de las dependencias segun el centro universitario que se
                              eligio enteriormente */}
              <section className="select-96">
                <Select
                  onChange={manejarSeleccionDependencia}
                  value={dependenciaSeleccionado}
                  options={opcionesDependencias.map((opcion) => ({
                    value: opcion.Id,
                    label: opcion.Nombre,
                  }))}
                  placeholder={Diccionario.seleccioneDependencia}
                  theme={temaSelect}
                  styles={selectCustomStyle}
                ></Select>
              </section>
              <label>{Diccionario.nombramiento}</label>
              {/*Select que guarda las opciones de los nombremientos de la base de datos */}
              <section className="select-96">
                <Select
                  onChange={manejarNombramientoSeleccionado}
                  value={nombramientoSeleccionado}
                  options={opcionesNombramientos.map((opcion) => ({
                    value: opcion.IdNombramiento,
                    label: opcion.Nombramiento,
                  }))}
                  placeholder={Diccionario.seleccioneNombramiento}
                  theme={temaSelect}
                  styles={selectCustomStyle}
                ></Select>
              </section>
              {/*Boton que al presionar enviarla los datos del formulario a validar y posteriormente al backend */}
              {banderaCaptcha === false && (
                <Button type="submit" hidden={banderaCaptcha}>
                  {Diccionario.enviarSolicitud}
                </Button>
              )}
              {/*Se agrego el renderizado condicional porque el componente del captcha no se puede renderizar
               mas de una vez para que funcione correctamente*/}
              {!modalContactoIsOpen && (
                <Captcha2 manejarBanderaCaptcha={manejarBanderaCaptcha} />
              )}
            </form>
            <div className="contenedor-columna-centro">
              {/*Link para regresar a la pagina de login */}
              <Link to="/Login" className="link-navegacion">
                {Diccionario.yaTienesCuenta}
              </Link>
              <button
                onClick={() => setModalContactoIsOpen(true)}
                className="boton-sin-fondo"
              >
                ¿Tienes Problemas? <br />
                Contactanos
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/*Seccion de modals aqui se establece el componente recipiente del modal*/}
        <div>
          {/*Modal para la pantalla de carga*/}
          <PantallaCargaModal modalIsOpen={modalCargaIsOpen} />
          {/*Modal para la pantalla de confirmacion */}
          <ConfirmacionModal
            isOpen={modalConfirmacionIsOpen}
            onClose={cerrarConfirmacionModal}
          />
          {/*Modal para el contacto por email a soporte */}
          <EmailModal
            isOpen={modalContactoIsOpen}
            onClose={cerrarModalContacto}
          />
        </div>
      </div>
    </main>
  );
};
