import React from "react";
//Libreria para las peticiones http al servidor
import Axios from "axios";
//Liberias para la nevegacion entre paginas
import { useNavigate } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

//Barra de navegacion en el que se muestran los datos del usuario y un boton para cerrar la sesion
export const ExitModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  //Variable para navegar entre paginas
  const navigate = useNavigate();

  //Funcion cuando el usuario confirma que quiere cerra la sesion
  const handleConfirmExit = () => {
    //Se borra la cookie
    Axios.get(import.meta.env.VITE_HTTPSALIR)
      .then((respuesta) => {
        //Regresando al inicio
        navigate("/");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {/*Agregando un boton para manejar el cierre de sesion */}
      <Button onClick={handleOpen} variant="gradient">
        Cerrar Sesion
      </Button>
      {/*Modal para verificar si el usuario quiere cerrar la sesion */}
      <Dialog
        open={open}
        size="xs"
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 0 },
        }}
      >
        {/*Cuadro de dialogo*/}
        <DialogHeader>¡Cerrar Sesion!</DialogHeader>
        <DialogBody>
        ¿Está seguro de que desea cerrar la sesión actual? Deberá volver a identificarse.
        </DialogBody>
        <DialogFooter >
          <Button
            variant="filled"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleConfirmExit} >
            <span>Confirmar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
