import React from "react";
//Librerias para el contenedor donde se muestra la notificacion y animaciones para las notificaciones
import { ToastContainer, toast, Zoom, Flip, Slide,Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Notificacion de exito cuando desaparece la notificacion se recarga la pagina
export const notificarExito = () =>
  toast.success("✔️ Actualización exitosa, espere...", {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    transition: Zoom,
    progress: undefined,
    pauseOnHover: false,
    onClose: () => {
      window.location.reload();
    },
  });

//Notificacion de alta de cuenta
export const notificarExitoAlta = (mensaje: string) =>
  toast.success("✔️ " + mensaje, {
    position: "top-center",
    hideProgressBar: true,
    theme: "dark",
    transition: Zoom,
    progress: undefined,
    pauseOnHover: false,
    closeOnClick: true,
  });

//Notificacion de exito para una accion en general
export const notificarExitoAccion = (mensaje: string) =>
  toast.success("✔️ " + mensaje, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    theme: "colored",
    transition: Zoom,
    progress: undefined,
    pauseOnHover: false,
  });
//Notificacion de error, recibe un mensaje para desplegarlo en la notificacion
export const notificarError = (mensaje: string) =>
  toast.error("" + mensaje, {
    theme: "dark",
    transition: Bounce,
    position: "top-center",
    autoClose: false,
    hideProgressBar: false,
    progress: undefined,
    pauseOnHover: false,
    closeOnClick: true,
    closeButton: true,
    draggable: false,
  });

//Notificacion de campos faltantes en el formulario
export const notificarCamposFaltantes = () =>
  toast.info("Por favor, llene todos los campos.", {
    theme: "colored",
    transition: Flip,
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    progress: undefined,
    pauseOnHover: false,
    closeOnClick: true,
    closeButton: true,
  });

//Notificacion de campos faltantes en el formulario
export const notificarErrorInputs = (mensaje: string) =>
  toast.warning(mensaje, {
    theme: "colored",
    transition: Flip,
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    progress: undefined,
    pauseOnHover: false,
    closeOnClick: true,
    closeButton: true,
  });

//Notificacion cuando un email fue enviado
export const notificarEmailEnviado = () => {
  toast.success("Correo de confirmacion ha sido enviado", {
    position: "top-right",
    hideProgressBar: false,
    transition: Slide,
    progress: undefined,
    pauseOnHover: false,
    closeButton: true,
    theme: "colored",
  });
};

//Notificacion de advertencia con un mensaje
export const notificarAdvertencia=(mensaje:String)=>{
  toast.warning(mensaje, {
    position: "top-center",
    hideProgressBar: true,
    transition: Flip,
    progress: undefined,
    pauseOnHover: false,
    closeButton: true,
    theme: "colored",
    closeOnClick: true,
    autoClose:1000,
  });
}
//Contenedor base para las notificaciones se debe poner este componente para poder
//hacer uso de las notificaciones
export const NotifyContainer = () => (
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    stacked
  />
);

