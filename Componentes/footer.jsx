import React from "react";
import Diccionario from "../Recursos/DiccionarioTerminos";
import "./Css componentes/Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <p>© {Diccionario.anio} placeholder</p>
    </footer>
  );
};

export default Footer;
