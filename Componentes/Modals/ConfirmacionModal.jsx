import Modal from "react-modal";
import React from "react";
import modalConfirmacionStyles from "./Styles";
import "../Css componentes/Botones.css";
Modal.setAppElement("#root");

//Modal de confirmacion
const ConfirmacionModal = (props) => {
  const handleClose = () => {
    props.onClose();
    window.location.reload();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={handleClose}
      // Evita que el modal se cierre al hacer clic fuera de él
      shouldCloseOnOverlayClick={false}
      //Estilo para el modal
      style={modalConfirmacionStyles}
      contentLabel="Confirmación"
    >
      {/*Contenido del modal*/}
      <h2>
        <span style={{ animation: "pulse 2s infinite" }}>👍</span> ¡Hemos recibido su solicitud!
      </h2>
      <div className="contenido">
        <p>
        Próximamente, recibirá actualizaciones sobre el estado de la misma  <br />
        en el correo electrónico que nos proporcionó
        </p>
        <p>
          En breve recibira un correo de confirmacion con los datos <br />
          de su solicitud.
        </p>
      </div>
      {/*Boton para cerrar el modal y recargar la pagina */}
      <button className="botonAzul" onClick={handleClose}>
        Cerrar
      </button>
    </Modal>
  );
};

export default ConfirmacionModal;
