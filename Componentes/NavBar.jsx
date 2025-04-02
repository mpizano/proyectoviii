import React from "react";
//Libreria para las peticiones http al servidor
import { ExitModal } from "./Modals/ExitModal.jsx";
//Libreria para obtener los datos basicos del usuario
import { username, rol, tipoUsuario } from "./getData.jsx";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

//Barra de navegacion en el que se muestran los datos del usuario y un boton para cerrar la sesion
const NavBar = ({ sidebarToggle, setSideBarToggle }) => {
    return (
        <nav className="bg-gray-800 px-4 py-3 flex justify-between">
            <div className="flex items-center text-xl">
                <FaBars
                    className="text-white me-4 cursor-pointer"
                    onClick={() => console.log(setSideBarToggle(!sidebarToggle))}
                />
                <span className="text-white font-semibold">{username + " " + rol}</span>
            </div>
            <div className="flex items-center gap-x-5">
                <div className="relative md:w-65">
                    <span className="relative md:absolute inset-y-0 left-0 flex items-center pl-2">
                        <button className="p-1 focus:outline-none text-black md:text-white">
                            <FaSearch />
                        </button>{" "}
                    </span>
                    <input
                        type="text"
                        className="w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block"
                    />
                </div>
                <div className="text-white">
                    <FaBell className="w-6 h-6" />
                </div>
                <div className="relative">
                    <button className="text-white group">
                        <FaUserCircle className="w-6 h-6 mt-1" />
                        <div className="z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0">
                            <ul className="py-2 text-sm text-gray-950">
                                <li>
                                    <a href="">Perfil</a>
                                </li>
                                <li>
                                    <a href="">Ajustes</a>
                                </li>
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
           
        </nav>
    );
};

export default NavBar;