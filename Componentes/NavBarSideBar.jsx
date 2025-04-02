import React, { useState, useRef, useEffect } from "react";
//Datos del usuario
import { username, rol } from "./getData";
//Importando iconos
import { FaHome, FaUsersCog, FaBars } from "react-icons/fa";

import { TbCertificate } from "react-icons/tb";
//Modal para el cierre de sesion
import { ExitModal } from "./Modals/ExitModal";
//Componente para mostrar un texto sobre algun componente
import { Tooltip } from "react-tooltip";
//Componente para navegar entre paginas
import { useNavigate } from "react-router-dom";
const NavBarSideBar = () => {
  //Declarando el uso del componente para navegar entre paginas
  const navigate = useNavigate();
  //Bandera para mostrar u ocultar el modal
  const [abrirMenuLateral, setAbrirMenuLateral] = useState(false);
  //Referencia hacia un componente
  const ref = useRef();
  //Funcion para ir a la pagina Home
  const home = () => {
    navigate("/Home");
  };
  //Funcion para ir a la pagina de Cuentas
  const cuentas = () => {
    navigate("/Cuentas");
  };

  const becas = () => {
    navigate("/")
  }
  //Funcion para verificar cuando se hizo click fuera del componente 
  const manejarClickFuera = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      // Close the menu lateral here
      setAbrirMenuLateral(false);
    }
  };

  //Effect para verificiar cuando se abre el menu lateral
  useEffect(() => {
    //Verificarmos si se abrio el menu laterial
    if (abrirMenuLateral) {
      //Se agrega un verificardor de eventos cuando hay clicks del mouse fuera del componente
      document.addEventListener("mousedown", manejarClickFuera);
    } else {
      //Se remueve el verificador de eventos 
      document.removeEventListener("mousedown", manejarClickFuera);
    }

    //Se limpia el verificador de eventos cuando se desmonta el componente
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, [abrirMenuLateral]);
  
  return (
    <>
      {/*Inicio de la barrade de navegacion */}
      <nav
        //Cuando se abre el menu lateral la barra de navegacion se recorre a la derecha para evitar que se tape el contenido
        className={`flex items-center justify-between p-4 bg-blue-500 ${abrirMenuLateral ? "transform translate-x-64 mr-64" : ""
          }`}
      >
        {/*Contenido de la barra de navegacion*/}
        <div className="flex items-center">
          {/*Icono de barras horizontales */}
          <FaBars
            //Cuando se presiona el icono se abre el menu lateral
            className="me-4 w-8 h-8 cursor-pointer hover:text-white"
            onClick={() => setAbrirMenuLateral(!abrirMenuLateral)}
          />
          {/*Se muestra el nombre y rol del usuario*/}
          <span className="text-white font-bold text-3xl uppercase">
            {username.value + " " + rol.value}
          </span>
        </div>
        {/*Modal para el cierre de sesion */}
        <ExitModal />
      </nav>
      {/*Menu lateral */}
      {abrirMenuLateral && (
        //Seccion para todo el menu lateral
        <div
          className="fixed top-0 left-0 z-50 w-64 h-full bg-gray-800 flex flex-col items-center"
          ref={ref}
        >
          <span>Menú</span>
          {/*Lista para guardar los elementos del menu lateral */}
          <ul className="mt-3 text-white  font-bold mr-18 ">
            {/*Declarando el uso del texto sobre el componente de la lista */}
            <div
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Regreso a la pagina de inicio"
              data-tooltip-variant="dark"
              data-tooltip-float="true"
            >
              {/*Elemento de la lista que guarda un icono que al ser precionado nos regresa a la pagina de inicio */}
              <li
                className="mb-2 flex items-center hover:text-black space-x-2 cursor-pointer hover:shadow hover:bg-blue-500 rounded py-2 mt-16"
                onClick={home}
              >
                {/*Icono de Home */}
                <span className="px-4 text-3xl">
                  <FaHome className="inline-block w-8 h-8 mr-2 -mt-2" />
                  Inicio
                </span>
              </li>
            </div>
            {/*Si el usuario es admin se le agrega al menu las opciones para su uso del administrador */}
            {rol.value === "admin" && (
              <div>
                {/*Elemnto en la lista para navegar a la pagina del manejo de cuentas */}
                <li
                  className="mb-2 flex items-center hover:text-black  space-x-2 cursor-pointer hover:shadow hover:bg-blue-500 rounded py-2"
                  onClick={cuentas}
                >
                  {/*Declarando el uso del texto sobre el icono */}
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Manejo de cuentas"
                    data-tooltip-variant="dark"
                    data-tooltip-float="true"
                  >
                    <span className="px-4 text-3xl ">
                      <FaUsersCog className="inline-block w-8 h-8 mr-2 -mt-2 " />
                      Cuentas
                    </span>
                  </div>
                </li>
              </div>
            )}
            {
              (rol.value === "beca" || rol.value==="admin") &&(
                <div>
                {/*Elemnto en la lista para navegar a la pagina del manejo de cuentas */}
                <li
                  className="mb-2 flex items-center hover:text-black  space-x-2 cursor-pointer hover:shadow hover:bg-blue-500 rounded py-2"
                  onClick={becas}
                >
                  {/*Declarando el uso del texto sobre el icono */}
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Manejo de becas"
                    data-tooltip-variant="dark"
                    data-tooltip-float="true"
                  >
                    <span className="px-4 text-3xl ">
                      <TbCertificate  className="inline-block w-8 h-8 mr-2 -mt-2 " />
                      Becas
                    </span>
                  </div>
                </li>
              </div>
              )
            }
            {/*Componente base para el uso del texto sobre componentes */}
            <Tooltip id="my-tooltip" />
          </ul>
        </div>
      )}
    </>
  );
};

export default NavBarSideBar;
