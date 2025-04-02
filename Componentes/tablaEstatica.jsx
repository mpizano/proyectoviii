//Librerias de react
import React, { useEffect, useState } from "react";
//Importanto otros componentes creados para el proyecto
import { codigo } from "./getData.jsx";
import { NavBar } from "./NavBar.jsx";
//Importando el diccionario de datos
import Diccionario from "../Recursos/DiccionarioTerminos.js";
//Librerias para las peticiones http al backend
import Axios from "axios";
import "./DatosGenerales.css";

export const TablaDatosGenerales = () => {
    //Variables para guardar el resultado de la consulta sql del backend
    const [datos, fijadatos] = useState({});

    //Usando la funcion del backend para hacer una consulta
    Axios.defaults.withCredentials = true;
    useEffect(() => {
        Axios.post(Diccionario.httpRutaDatosGenerales, {
            codigo: codigo,
        })
            .then((respuesta) => {
                if (respuesta.data.mensaje) {
                    alert(respuesta.data.mensaje);
                } else {
                    //Asignando el resultado devuelto por el backend en la variable
                    fijadatos(respuesta.data[0]);
                }
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <main>
            <>
                {/*Usando el componente NavBar */}
                <NavBar></NavBar>
                <div className="Datos">
                    <div className="card">
                        {/*Iniciando el frontend de la tabla */}

                        <table className="table">
                            {/*Seccion de las columnas*/}
                            <thead>
                                <tr>
                                    {/*Declarando el nombre de los campos principales */}
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    <th>Apellido Paterno</th>
                                    <th>Apellido Materno</th>
                                </tr>
                            </thead>
                            {/*Seccion de las filas */}
                            <tbody>
                                <tr>
                                    {/*Pasando los campos obtenidos en la consulta */}
                                    <td>{datos.codigo}</td>
                                    <td>{datos.nombre}</td>
                                    <td>{datos.apellidoPaterno}</td>
                                    <td>{datos.apellidoMaterno}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        </main>
    );
};
