import React from "react";
import Modal from "react-modal";
import { modalUpdateConfirmacionStyle } from "./Styles";
import "../Css componentes/Modals/ModalUpdateConfirmacion.css";

Modal.setAppElement("#root");

const UpdateConfirmationModal = ({ isOpen, onClose, onConfirm, parametro }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmar Actualización"
      style={modalUpdateConfirmacionStyle}
      shouldCloseOnOverlayClick={true}
    >
      <div>
        <h2 className="titulo">Confirmar Actualización de {parametro}</h2>
      </div>
      <div>
        <p className="parrafo">
          ¿Estás seguro de que deseas actualizar tus datos?
        </p>
      </div>
      <div>
        <button className="btnConfirmar" onClick={onConfirm}>
          Confirmar
        </button>
        <button className="btnCancelar" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default UpdateConfirmationModal;
