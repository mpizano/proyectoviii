import React, { useEffect } from "react";
import Modal from "react-modal";
import { zoomies } from "ldrs";
import { modalPantallaCargaStyle } from "./Styles";

export const PantallaCargaModal = ({ modalIsOpen }) => {
  useEffect(() => {
    //Inicializando la animacion
    zoomies.register();
  }, []);
  return (
    <div>
      {/*Modal para mostrar una pantalla de carga, se muestra mientras modalIsOpen sea verdadero */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {}}
        style={modalPantallaCargaStyle}
        contentLabel="Cargando..."
      >
        {/*Cotenido a mostrar en el modal */}
        <h2>Trabajando</h2>
        <p>Espere mientras se completa la operación.</p>
        <div className="loader"></div>
        {/*Animacion de carga y sus opciones de configuracion*/}
        <l-zoomies
          size="150"
          stroke="20"
          bg-opacity="0.5"
          speed="2"
          color="orange"
        />
      </Modal>
    </div>
  );
};


