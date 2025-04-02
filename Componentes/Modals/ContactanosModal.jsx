import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import axios from "axios";
//Importando el modal de la pantalla de carga
import { PantallaCargaModal } from "./PantallaCargaModal";
//Importando estilos para los componentes
import { selectCustomStyle, temaSelect } from "./Styles";
//Hoja de estilos para el modal
import "../Css componentes/Botones.css";
//Importando el captcha
import { Captcha2 } from "../Captcha";
import ConfirmacionSoporteModal from "./ConfirmacionSoporteModal";
// Para ayudar con la accesibilidad
Modal.setAppElement("#root");

const EmailModal = ({ isOpen, onClose }) => {
  //Variables para manejar el contenido ingresado en los inputs
  const [emailContent, setEmailContent] = useState("");
  const [email, setEmail] = useState("");
  const [nombreCodigo, setNombreCodigo] = useState("");
  //Variable para desplegar un mensaje cuando hay errores en los campos del formulario
  const [camposVacios, setCamposVacios] = useState("");
  //Varibale para manejar lo seleccionado en el select
  const [opccionSeleccionada, setOpccionSeleccionda] = useState(null);
  //Bandera para evaluar el formato del email
  const [esEmailValido, setEmailValido] = useState(true);
  //Bandera para saber cuando abrir y cerrar el modal
  const [modalCargaIsOpen, setModalCargaIsopen] = useState(false);
  const [modalConfirmacionIsOpen, setModalConfirmacionIsOpen] = useState(false);
  //Bandera recibida por el componente del capt
  const [banderaCaptcha, setBanderaCaptcha] = useState(true);
  //Lista de opciones para el asunto del correo en el select
  const opciones = [
    { value: "Aclaracion", label: "Aclaracion de dudas" },
    { value: "Error", label: "Errores en el sistema" },
    { value: "otro", label: "Otro" },
  ];
  //Funcion para cambiar la bandera que se recibe del captcha
  const manejarBanderaCaptcha = (bandera) => {
    setBanderaCaptcha(bandera);
  };
  //Funcion para manejar el cambio del contenido de la textArea
  const manejarContenidoTextArea = (event) => {
    setEmailContent(event.target.value);
  };

  //Funcion para manejar el cambio de selecion del select
  const manejarSeleccion = (opccionSeleccionada) => {
    setOpccionSeleccionda(opccionSeleccionada);
  };

  //Funcion para validar el email
  const validarEmail = (e) => {
    const newEmail = e.target.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailValido(emailRegex.test(newEmail));
    setEmail(newEmail);
  };

  const handleSubmit = async (e) => {
    // Validar que todos los campos estén llenos
    if (!opccionSeleccionada || !email || !emailContent) {
      setCamposVacios("Todos los campos son obligatorios");
      return;
    }

    // Validar el correo electrónico con expresión regular
    if (!esEmailValido) {
      return;
    }
    setModalCargaIsopen(true);
    try {
      const respuesta = await axios.post(
        import.meta.env.VITE_HTTPEMAILSOPORTE,
        {
          asunto: opccionSeleccionada.label,
          nombreCodigo: nombreCodigo,
          email: email,
          contenido: emailContent,
        }
      );
      //Se cierra la pantalla de carga
      setModalCargaIsopen(false);
      //Una vez resuelta la peticion se evalua si fue exitosa
      if (respuesta.status === 200) {
        setModalConfirmacionIsOpen(true);
      } else if (respuesta.status === 500) {
        console.log(0);
      }
    } catch (error) {
      setModalCargaIsopen(false);
    }
  };

  //Funcion para evaluar lo ingresado en el input de codigo/nombre para que solo se puedan
  //escribir letras o numeros
  const manejarCambioNombreCodigo = (event) => {
    //Reemplazando los caracteres que no se permiten en la cadena
    const sanitizedInput = event.target.value.replace(/[^a-zá-ú0-9\s]+/gi, "");
    setNombreCodigo(sanitizedInput);
  };

  //Funcion para cambiar el estado del modal de la pantalla de confirmacion
  const cerrarConfirmacionModal = () => {
    setModalConfirmacionIsOpen(false);
  };
  //Funcions para la transicion entre la pagina y el modal de contactanos
  const modalTransitionStyles = {
    overlay: {
      transition: "opacity 0.3s ease-in-out",
    },
    content: {
      transition: "opacity 0.3s ease-in-out",
      opacity: 0,
    },
  };
  //Se le asigna el estilo al modal
  const [modalStyle, setModalStyle] = useState(modalTransitionStyles);

  //Effect para revisar cuando el modal se abre y añadile la animacion
  useEffect(() => {
    let newStyle;
    if (isOpen) {
      //Cuando el modal esta abierto el contenido esta totalmente visible
      newStyle = {
        ...modalStyle,
        content: {
          ...modalStyle.content,
          opacity: 1,
        },
      };
    } else {
      //Cuando el modal se cierra el contenido se degrada
      newStyle = {
        ...modalStyle,
        content: {
          ...modalStyle.content,
          opacity: 0,
        },
      };
    }
    setModalStyle(newStyle);
  }, [isOpen]);

  //Funcion para manejar el cierre del modal
  const handleClose = () => {
    //Se empieza la animacion de transcision
    setModalStyle({
      ...modalStyle,
      content: {
        ...modalStyle.content,
        opacity: 0,
      },
    });

    // Se le agrega un delay para esperar a la animacion
    setTimeout(() => {
      onClose(); //Cuando se termina el delay se cierra el modal
    }, 300); //Duracion igual a la transicion para igualar tiempos
  };

  return (
    <>
      {/*Modal para el formato de email para dar soporte*/}
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        contentLabel="Enviar Correo Electrónico"
        className="modal-email"
        overlayClassName="modal-overlay-black"
        style={modalStyle}
      >
        <div className="contenedor-columna-centro">
          <h2 className="encabezado-5">Contacto a Soporte</h2>
          <div className="select-90">
            {/*Select para las opciones del asunto del correo */}
            <Select
              value={opccionSeleccionada}
              onChange={manejarSeleccion}
              options={opciones}
              placeholder="Selecciona el asunto del correo"
              //usando temas importados
              theme={temaSelect}
              styles={selectCustomStyle}
            />
          </div>
          <div className="contenedor-90">
            {/*Input para escribir el codigo */}
            <input
              className="input-redondeado-borde-full"
              type="text"
              value={nombreCodigo}
              onChange={manejarCambioNombreCodigo}
              placeholder="Nombre y Codigo"
            />
            {/*Input para mandar el email al que se le debe responder */}
            <input
              className="input-redondeado-borde-full"
              type="text"
              name="email"
              placeholder="Correo Electronico de contacto"
              value={email}
              onChange={validarEmail}
            />
            {/*Cuando el formato del email no es valido se depliega el mensaje hasta que se corrija */}
            {!esEmailValido && (
              <span className="texto-rojo">Email no valido</span>
            )}
          </div>
          <div className="contenedor-textarea">
            {/*TextArea para el contenido del email con un limite de caracteres  */}
            <textarea
              value={emailContent}
              onChange={manejarContenidoTextArea}
              //Numero maximo de caracteres
              maxLength={300}
              placeholder="Escribe tu mensaje (máximo 300 caracteres)"
              lang="es-MX"
              //Usando estilo importado
              className="textarea-contenido"
            />
          </div>
          {/*Cuando hay campos vacios se muestra el mensaje de "Todos los campos son requeridos" */}
          {camposVacios && <p className="error-message">{camposVacios}</p>}
          {/*Parrafo bajo el TextArea que muestra el limite de caracteres conforme se esbriben */}
          <p>Caracteres restantes: {300 - emailContent.length}</p>
          <div>
            <div>
             
              {/*Declarando el componenete del catpcha y obteniendo la bandera para inicializar el componente */}
              <Captcha2 manejarBanderaCaptcha={manejarBanderaCaptcha} />
            </div>
            {/*Se usa la bandera para ocultar los botones de enviar solo hasta que se resuelve el captcha */}
            <div>
              {banderaCaptcha === false && (
                <>
                  {/*Boton con estilo importando para enviar el formulario al backend */}
                  <button className="botonAzul" onClick={handleSubmit}>
                    Enviar
                  </button>
                  {/*Boton con estilo importando para cerrar el modal */}
                  <button className="botonRojo" onClick={onClose}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/*Modal de pantalla de carga  */}
        <PantallaCargaModal modalIsOpen={modalCargaIsOpen} />
        {/*Modal de pantalla de confirmacion */}
        <ConfirmacionSoporteModal
          isOpen={modalConfirmacionIsOpen}
          onClose={cerrarConfirmacionModal}
        />
      </Modal>
    </>
  );
};

export default EmailModal;
