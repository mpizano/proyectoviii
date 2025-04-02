import React from "react";
import { FaHome } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { BiBullseye } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
const Sidebar = ({ sidebarToggle }) => {
    return (
        
        <div
            className={`w-64 bg-gray-800 fixed h-full px-4 py-2`}
        >
            <div className="my-2 mb-4">
                <h1 className="text-2x text-white font-bold">Dashboard</h1>
            </div>
            <hr />
            <ul className="mt-3 text-white font-bold">
                <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                    <a href="" className="px-4">
                        <FaHome className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Inicio
                    </a>
                </li>
                <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                    <a href="" className="px-4">
                        <FiUserPlus className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Cuentas
                    </a>
                </li>
                <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                    <a href="" className="px-4">
                        <BiBullseye className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Otros
                    </a>
                </li>
                <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                    <a href="" className="px-4">
                        <CiSettings className="inline-block w-6 h-6 mr-2 -mt-2" />
                        Ajustes
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
