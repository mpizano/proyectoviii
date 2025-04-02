import React from "react";
import Modal from "react-modal";
//Importando componente para navegacion entre paginas
import { useNavigate } from "react-router-dom";
//Importando hoja de estilos para botones
import { modalModalidadRegistroStyle } from "./Styles";
import { IoMdCloseCircle } from "react-icons/io";
import "../Css componentes/Botones.css";
import { Link } from "react-router-dom";
Modal.setAppElement("#root");

const ModalidadRegistroModal = ({
  isOpen,
  onSelect,
  opciones,
  regresarA,
  categoria,
}) => {
  //Declarando el uso de navegacion entre paginas
  const navigate = useNavigate();

  //Funcion para cambiar de pagina cuando se cierra el modal
  const manejarCierre = () => {
    // Navega a la página principal
    navigate(regresarA);
  };

  return (
    <Modal
      isOpen={isOpen}
      //Cuando se le pide al modal que se cierre se manda a llamar a la funcion para cambiar de pagina
      onRequestClose={manejarCierre}
      //Evitando que el modal se cierre cuando se da click fuera del modal
      shouldCloseOnOverlayClick={false}
      //Estilos para el modal
      style={modalModalidadRegistroStyle}
    >
      {/*Icono para regresar a la pagina deseada */}
      <IoMdCloseCircle
        className="absolute -top-2 -left-2 m-1 text-5xl text-red-600 hover:text-red-400 cursor-pointer"
        onClick={manejarCierre}
      />
      <h2>Modalidad de {categoria}</h2>
      <p>Seleccione su modalidad de {categoria}</p>
      <div>
        {/*Boton que al presionar devuelve el valor de estudiante */}
        <button className="botonAzul" onClick={() => onSelect("Estudiante")}>
          {opciones[0]}
        </button>
        {/*Boton que al presionar devuelve el valor de academico*/}
        <button className="botonRojo" onClick={() => onSelect("Academico")}>
          {opciones[1]}
        </button>
      </div>
      {/*Agregando una opcion extra solo para las inscripciones */}
      {categoria === "Inscripcion" && (
        <Link className="mt-4 font-semibold bg-deep-purple-400 rounded py-2 text-white px-3 no-underline hover:bg-deep-purple-600">
          Revisar estado de inscripcion
        </Link>
      )}
    </Modal>
  );
};

export default ModalidadRegistroModal;
