import React from "react";

// ModalStyles.ts
interface ModalStyles {
  overlay: React.CSSProperties;
  content: React.CSSProperties;
}

//Tema para los selects
export const temaSelect = (theme) => ({
  ...theme,
  borderRadius: 10,
  colors: {
    ...theme.colors,
    primary25: "orange",
    primary: "black",
  },
});

export const styles = {
  control: (base) => ({
    ...base,
    "&:hover": {
      cursor: "pointer",
    },
  }),
};

//Estilo personalizado para los selects
export const selectCustomStyle = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    height: "50px",
    border: "1px solid black",
    boxShadow: state.isFocused ? null : null,
    cursor: "pointer"
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "50px",
    padding: "0px",
  }),

  input: (provided, state) => ({
    ...provided,
    justifyContent: "center",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "50px",
    icon: "50px"
  }),
};

//Estilo usado en el modal de confirmacion
export const modalConfirmacionStyles: ModalStyles = {
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    animation: "appear 1s ease-out",
  },
};

//Estilo usado para el model de confirmacion de actualizacion de datos
export const modalUpdateConfirmacionStyle: ModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "400px",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

//Estilo usado en el modal de pantalla de carga
export const modalPantallaCargaStyle: ModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

//Estilo para el modal de la seleccion de modalidad de registro
export const modalModalidadRegistroStyle: ModalStyles = {
  //Estilo para el contenido fuera del modal
  overlay: {
    backgroundColor: "rgb(0,0,0,0.40)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 1,
  },
  //Estilo para el contenido del modal
  content: {
    position: "relative",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    width: "90%",
    height: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

//Estilos personalizados para un boton color gris
export const greyButtonStyle: React.CSSProperties = {
  backgroundColor: "lightgray",
  color: "black",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  marginLeft: "10px",
  transition: "background-color 0.3s ease",
};

//Estilos personalizados para un boton de color azul
export const blueButtonStyle: React.CSSProperties = {
  backgroundColor: "blueviolet",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  marginLeft: "10px",
  transition: "background-color 0.3s ease",
};

//Estilos para el modal de advertencia al salir
export const modalAdvertenciaStyle: ModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid black",
    background: "white",
    overflow: "auto",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

export default modalConfirmacionStyles;
