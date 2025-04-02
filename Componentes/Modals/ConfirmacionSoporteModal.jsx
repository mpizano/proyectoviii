import Modal from "react-modal";
import React from "react";
import modalConfirmacionStyles from "./Styles";
import "../Css componentes/Botones.css";
Modal.setAppElement("#root");

//Modal de confirmacion
const ConfirmacionSoporteModal = (props) => {
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
        <span style={{ animation: "pulse 2s infinite" }}>👍</span> ¡Su mensaje
        ha sido recibio!
      </h2>
      <div className="modal-body">
        <p>
          Nos pondremos en contacto en el <br />
          correo electronico que nos proporsiono.
        </p>
      </div>
      {/*Boton para cerrar el modal y recargar la pagina */}
      <button className="botonAzul" onClick={handleClose}>
        Cerrar
      </button>
    </Modal>
  );
};

export default ConfirmacionSoporteModal;
