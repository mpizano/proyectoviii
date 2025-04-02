import React, { useEffect, useState } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

export const Captcha2 = (props) => {
  const [mostrarMensajeError, setMostrarMensajeError] = useState(false);
  //Bandera para saber cuando ocultar el captcha
  const [ocultarCaptcha, setOcultarCaptcha] = useState(false);
  const [inputCaptcha, setInputCaptcha] = useState("");

  //Funcion para enviar la bandera al componente padre
  const enviarBanderaAlPadre = (valor) => {
    props.manejarBanderaCaptcha(valor);
  };

  useEffect(() => {
    loadCaptchaEnginge(6, "black", "white");
    enviarBanderaAlPadre(true);
  }, []);

  //Funcion para validar el estado del captcha
  const validarCaptcha = () => {
    //Cuendo el captcha no es valido se muestra un mensaje de error
    if (!validateCaptcha(inputCaptcha)) {
      setMostrarMensajeError(true);
      //Se fija un tiempo para que el mensaje se oculte
      setTimeout(() => {
        setMostrarMensajeError(false);
      }, 800);
      //cuando el captcha es valido se oculta el captcha y se envia la bandera al componente padre
    } else {
      setOcultarCaptcha(true);
      enviarBanderaAlPadre(ocultarCaptcha);
    }
  };

  //Funcion para manejar el cambio del contenido del input
  const manejarCambioInput = (e) => {
    const newValue = e.target.value;
    setInputCaptcha(newValue);
  };

  return (
    <div hidden={ocultarCaptcha}>
      {/*Se renderiza el componente del captcha */}
      <div className="contenedor-centrado">
        {/*Componente del captcha que se puede recargar y se le pasa el parametro del texto 
        para el mensaje de recargar */}
        <LoadCanvasTemplate reloadText="Recargar captcha" />
      </div>
      {/*Mensaje de error con animacion se muestra cuando el captcha es incorrecto */}
      {mostrarMensajeError && (
        <p className={`text-rojo`}>Captcha no valido</p>
      )}
      <div className="espacio-y-2">
        <input
          className="input-redondeado-s"
          placeholder="Ingrese el captcha"
          type="text"
          value={inputCaptcha}
          onChange={manejarCambioInput}
        ></input>
      </div>
      {/*Boton al accionarlo se verifica el contenido del input y validarlo con el captcha */}
      <div className="espacio-y-2">
        <div>
          <button className="boton-blanco" onClick={validarCaptcha}>
            Validar Captcha
          </button>
        </div>
      </div>
    </div>
  );
};
