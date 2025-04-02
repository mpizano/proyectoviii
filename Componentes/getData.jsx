import Axios from "axios";
import Diccionario from "../Recursos/DiccionarioTerminos.js";
import { signal } from "@preact/signals-react";

const username = signal("");
const rol = signal("");
const codigo = signal("");
const tipoUsuario = signal("");

const obtenerDatosUsuario = async () => {
    try {
        const respuesta = await Axios.get(import.meta.env.VITE_HTTPCONSULTA, { withCredentials: true });
        if (respuesta.data.Status === Diccionario.loggeado) {
            username.value = respuesta.data.username;
            rol.value = respuesta.data.rol;
            codigo.value = respuesta.data.codigo;
            tipoUsuario.value = respuesta.data.tipoUsuario;
        } else {
            username.value = "No loggeado";
        }
    } catch (error) {
        username.value = "No loggeado";
    }
};

const initializeUserData = async () => {
    await obtenerDatosUsuario();
};

initializeUserData();

export { username, rol, codigo, tipoUsuario };
