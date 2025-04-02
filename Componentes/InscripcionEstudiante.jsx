import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { modalAdvertenciaStyle, temaSelect } from "./Modals/Styles";
//Libreria para el uso de axios como api de comunicacion con el backend
import axios from "axios";
import Diccionario from "../Recursos/DiccionarioTerminos.js";
import Select from "react-select";
//Componente para mostrar un texto sobre algun componente
import { Tooltip } from "react-tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa";
import Mensajes from "../Recursos/Mensajes.js";
const MultiStepForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  //Titulos de los pasos
  const stepTitles = ["Datos Generales", "Cursos", "Documentos", "Finalizar"];
  const mensajesAyuda = [
    "<div><label>Datos personales preferentemente</br> los mas actualizados<label/></div>",
    "<div><label>Información de los cursos a los que desea inscribirse</label></div>",
  ];
  //Pasos que han sido completados
  const [pasosCompletados, setPasosCompletados] = useState([1]);
  // Estado para manejar los errores en los pasos
  const [erroresPasos, setErroresPasos] = useState({});
  //Datos ingresados por el usuario
  const [data, setData] = useState({
    codigo: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    email: "",
    genero: "",
    telefono: "",
    cu: "",
    carrera: "",
    tabla: [
      { col1: "", col2: "", col3: "" }, // Ejemplo de fila inicial
    ],
  });
  const navigate = useNavigate();

  //Effect para evitar que se recarge la pagina
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Si hay cambios no guardados, puedes mostrar una advertencia
      const message =
        "Tienes cambios no guardados. ¿Estás seguro de que deseas salir?";
      event.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //Avanzar al siguiente paso
  const siguientePaso = () => {
    setStep((prevStep) => {
      // Se asgina un nuevo paso, incrementando el paso actual
      const newStep = prevStep + 1;
      //Se asigna que el paso ha sido completado al arreglo de pasos completados
      setPasosCompletados((prevCompleted) => [
        ...new Set([...prevCompleted, newStep]),
      ]);
      return newStep;
    });
  };

  //Regresar un paso del que se encuentra actualmente
  const prevStep = () => {
    setStep(step - 1);
  };

  //Para navegar directamente a un paso en especifico desde la barra de progreso
  const goToStep = (stepNumber) => {
    if (pasosCompletados.includes(stepNumber) || stepNumber === step) {
      setStep(stepNumber);
    }
  };

  //Funcion para renderizar el paso que se desea ver
  const renderStep = () => {
    //se evalua el paso a renderizar
    switch (step) {
      case 1:
        return (
          //Los pasos deben de tener la variable de datos para poder almacenar su contenido
          //a traves de todo el ciclo ademas de los errores para asignar cuando un paso de
          //completa con errores
          <Step1
            data={data}
            setData={setData}
            erroresPasos={erroresPasos}
            setErroresPasos={setErroresPasos}
          />
        );
      case 2:
        return (
          <Step2
            data={data}
            setData={setData}
            erroresPasos={erroresPasos}
            setErroresPasos={setErroresPasos}
          />
        );
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  //Funcion para salir al menu principal
  const salir = () => {
    navigate("/");
  };

  //Funcion que alerta antes de salir del la pagina actual
  const alertarSalir = () => {
    setIsOpen(true);
  };

  return (
    <div className="pt-14 min-w-screen">
      <div className="tarjeta-inscripciones">
        {
          //Icono de cierre que se mostrara en la esquina izuqierda superior de la tarjeta
          <IoMdCloseCircle
            className="icono-esquina-izquierda"
            onClick={alertarSalir}
          />
        }
        <div className="contenedor-centrado">
          {/*Se muestra el titulo que segun el indice del paso en el que se encuentra actualmente*/}
          <h1 className="contenedor-centrado">
            <FaCircleInfo
              className="icono-ayuda"
              data-tooltip-id="my-tooltip"
              data-tooltip-html={`${mensajesAyuda[step - 1]}`}
              data-tooltip-variant="dark"
            />
            {stepTitles[step - 1]}
          </h1>
        </div>
        {/*Contenedor de la barra de progreso */}
        <div className="contenedor-barra-progreso espacio-entre-campos">
          {
            //Se mapean los titulos y se le asigna el color correspondiente a su estado
            stepTitles.map((_, index) => {
              const stepNumber = index + 1;
              //Se evalua el color del progreso para cada seccion
              let backgroundColor;
              if (stepNumber === step) {
                backgroundColor = "blue"; // Azul para el paso que se encuentra actualmente
              } else if (erroresPasos[stepNumber]) {
                backgroundColor = "red"; // Rojo para los pasos que tengan errores
              } else if (pasosCompletados.includes(stepNumber)) {
                backgroundColor = "#17bf6b"; // Verde para los pasos completados
              } else {
                backgroundColor = "#e0e0df"; // Gris para los pasos no completados
              }
              return (
                //Se muestra la seccion para el numero de pasos que se mapearon
                <div
                  //Se agrega una key con el indice correspondiente al indice en el arreglo de titulos
                  key={index}
                  //Se agrega la opcion de al darle clic a la seccion se dirija a esa seccion
                  onClick={() => goToStep(stepNumber)}
                  className="seccion-progreso"
                  //Se agrega un estilo aparte de su clase para poder hacerlo dinamico segun las condiciones que se den
                  style={{
                    //Se usa la variable para el color de fondo segun corresponda con su estado actual
                    backgroundColor,
                    //Se agrega una opcion para cambiar el cursor del mouse para saber cuando se puede hacer click en la seccion
                    cursor:
                      pasosCompletados.includes(stepNumber) ||
                      stepNumber === step
                        ? "pointer"
                        : "not-allowed",
                  }}
                />
              );
            })
          }
        </div>
        {/*Se usa la funcion para renderizar el paso en el que se encuentra actualmente*/}
        {renderStep()}
        {/*Despues del contenido de cada paso se agregan los botones de navegacion */}
        <div className="contenedor-centro">
          {
            /*Se condiciona el renderizado de los botones segun el numero de paso en el que se encuentra*/
            //Boton para regresar un paso se oculta al estar en el primer paso
            step > 1 && (
              <button className="boton-gris" onClick={prevStep}>
                Regresar
              </button>
            )
          }
          {
            //boton para navegar al siguiente paso se derendiza al llegar al ultimo paso
            step < stepTitles.length && (
              <button className="boton-gris" onClick={siguientePaso}>
                Siguiente
              </button>
            )
          }
          {
            //boton para enviar los datos de los pasos se oculta si no se encuentra en el ultimo paso
            step === stepTitles.length && (
              <button
                className="boton-gris"
                onClick={() => alert("Form submitted!")}
              >
                Enviar
              </button>
            )
          }
        </div>
      </div>
      {/*Modal para alertar antes de salir de la pagina de inscripciones*/}
      <Modal
        isOpen={isOpen}
        //cuando se quiere cerrar el modal se actualiza la bandera que los mantiene abierto
        onRequestClose={() => {
          setIsOpen(false);
        }}
        //Se agregan las opciones de cerrar el modal cuado se hace clic fuera del modal y cuando se aprieta la tecla de esc
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        //Estilo personalizado para el modal
        style={modalAdvertenciaStyle}
      >
        {/*Contenido del modal*/}
        <h1>Advertencia</h1>
        <label>{Diccionario.alertaSalir}</label>
        <div className="mt-3">
          {/*Boton para cancelar y cerrar el modal*/}
          <button
            className="boton-borde-azul"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancelar
          </button>
          {/*Boton para navegar a la pagina de inicio y cerrar el modal automaticamente */}
          <button className="boton-borde-rojo" onClick={salir}>
            Salir
          </button>
        </div>
      </Modal>
      {/*Componente base para el uso del texto sobre componentes */}
      <Tooltip id="my-tooltip" />
    </div>
  );
};

//Primer paso recibe los datos a guardar y el arreglo de errores
const Step1 = ({ data, setData, erroresPasos, setErroresPasos }) => {
  //bandera para saber el estado de los datos que requieren un control
  const [esValido, setEsValido] = useState({
    codigo: true,
    curp: true,
    email: true,
  });

  //Variables que guarda las opciones del backend para los selects
  const [opcionesCu, setOpcionesCu] = useState([]);
  const [opcionesCarrera, setOpcionesCarrera] = useState([]);

  //Effect para mantener las evaluaciones de los campos al incio del renderizado del componente
  useEffect(() => {
    const campos = ["codigo", "curp", "email"];
    //Se evaluan los campos que contengan algo
    campos.forEach((campo) => {
      if (data[campo].length > 0) {
        validarCampo(campo, data[campo]);
      }
    });
  }, []);

  //Efecto para cargar las opciones de centros universitarios al inicio de la renderizacion de la pagina
  useEffect(() => {
    const obtenerOpcionesDesdeServidor = async () => {
      try {
        //Ejecutando dos consultas del backend al mismo tiempo en una promesa para que se resuelvan
        //al mismo tiempo
        const respuestaCu = await axios.get(
          import.meta.env.VITE_HTTPCENTROSUNIVERSITARIOS
        );
        setOpcionesCu(respuestaCu.data);
      } catch (error) {
        console.error("Error al obtener opciones desde el servidor:", error);
      }
    };
    obtenerOpcionesDesdeServidor();
  }, []);

  //Effect para guardar el error en el paso al cambiar al siguiente paso
  useEffect(() => {
    return () => {
      /*Se evalua el objeto esValido y dentro de el se busca que alguno de sus atributos contenga
      al menos un falso para agregar el paso actual al arreglo de errores*/
      const currenterroresPasos = { ...erroresPasos };
      if (Object.values(esValido).includes(false)) {
        //Se agrega el paso uno como el que tiene error
        currenterroresPasos[1] = true;
      }else{
        currenterroresPasos[1] = false;
      }
      setErroresPasos(currenterroresPasos);
    };
  }, [esValido]);

  //Funcion para manejar el cambio de seleccion del centro universitario,
  //ademas se obtendran todas las dependencias que pertecenen al centro universitario
  const manejarSeleccionCu = async (e) => {
    // Evitando que se ejecute las misma consulta si se selecciona el mismo
    if (data.cu.value !== e.value) {
      const cuSeleccionadoValue = e;
      setData({ ...data, cu: cuSeleccionadoValue });
      //Limpiando la seleccion de la carrera cuando se cambia de centro universitario
      setData({ ...data, carrera: "" });
      try {
        // Enviando la solictud a la base de datos
        const respuesta = await axios.post(import.meta.env.VITE_HTTPCARRERAS, {
          cu: cuSeleccionadoValue.Id,
        });
        if (respuesta.error) {
          console.log(respuesta.error);
        } else {
          setOpcionesCarrera(respuesta.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  //Funcion para manejar el cambio de seleccion de dependencia
  const manejarSeleccionCarrera = (e) => {
    const carreraSeleccionadoValue = e;
    setData({
      ...data,
      carrera: carreraSeleccionadoValue,
    });
  };

  //Expresiones regulares para la validacion de codigo, curp y email
  const regexConfig = {
    codigo: /^[a-zA-Z0-9]\d{5,13}[a-zA-Z0-9]{1}$/,
    curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    telefono: /^\(\d{2}\) \d{4} \d{4}$/,
  };

  const validarCampo = (campo, valor) => {
    const regexConfigMap = {
      codigo: regexConfig.codigo,
      curp: regexConfig.curp,
      email: regexConfig.email,
    };

    let nuevoValor = valor;

    // Limpiar y formatear valores según el campo
    const cleanValueMap = {
      codigo: (v) => v,
      curp: (v) => v.toUpperCase(),
      telefono: (v) => {
        // Solo conservar dígitos
        let soloDigitos = v.replace(/[^0-9]/g, "");

        // Limitar la longitud a 10 dígitos
        if (soloDigitos.length > 10) {
          soloDigitos = soloDigitos.slice(0, 10);
        }

        // Formatear según la longitud de los dígitos ingresados
        const parte1 = soloDigitos.slice(0, 2); // (XX
        const parte2 = soloDigitos.slice(2, 6); // XXXX
        const parte3 = soloDigitos.slice(6, 10); // XXXX

        let telefonoFormateado = `(${parte1}`;
        if (parte2) telefonoFormateado += `) ${parte2}`;
        if (parte3) telefonoFormateado += ` ${parte3}`;

        return telefonoFormateado;
      },
      email: (v) => v,
      default: (v) => v.replace(/[^a-zá-ú\s]+/gi, ""),
    };

    const cleanValue = cleanValueMap[campo] || cleanValueMap.default;
    nuevoValor = cleanValue(valor);

    // Si el campo tiene una expresión regular asociada, validarla
    const regex = regexConfigMap[campo];
    if (regex) {
      setEsValido((prevState) => ({
        ...prevState,
        [campo]: regex.test(nuevoValor),
      }));
    }

    return nuevoValor;
  };

  //Funcion para manejar el cambio en los inputs
  const manejarInput = (e) => {
    const { name, value } = e.target;
    const funcion = validarCampo(name, value);
    setData({ ...data, [name]: funcion });
  };

  return (
    <div className="contenedor-centro">
      {/*Formulario para los datos generales */}
      <form className="contenedor-formulario-inscripciones">
        <span className="texto-rojo">*&nbsp;Campos Obligatorios</span>
        <label>
          <span className="texto-rojo">&nbsp;*</span> Codigo
        </label>
        {/*El input se evalua segun la bandera de si es valido o no y
         se le asigna la clase de estilo que le corresponde a cada caso*/}
        <input
          name="codigo"
          value={data.codigo}
          onChange={manejarInput}
          className={`${
            esValido.codigo ? "input-linea-azul" : "input-linea-rojo"
          }`}
          autoFocus
        />
        <label>
          <span className="texto-rojo">&nbsp;*</span> Nombre
        </label>
        {/*Al contenido del input se le quitan caracteres no permitidos */}
        <input
          name="nombre"
          value={data.nombre}
          onChange={manejarInput}
          className="input-linea-azul"
        />
        <label>
          <span className="texto-rojo">&nbsp;*</span> Apellido Paterno
        </label>
        {/*Al contenido del input se le quitan caracteres no permitidos */}
        <input
          name="apellidoPaterno"
          value={data.apellidoPaterno}
          onChange={manejarInput}
          className="input-linea-azul"
        />
        <label>
          <span className="texto-rojo">&nbsp;*</span> Apellido Materno
        </label>
        {/*Al contenido del input se le quitan caracteres no permitidos */}
        <input
          name="apellidoMaterno"
          value={data.apellidoMaterno}
          onChange={manejarInput}
          className="input-linea-azul"
        />
        <label>
          <span className="texto-rojo">&nbsp;*</span> Curp
        </label>
        {/*Se evalua si es valido */}
        <input
          name="curp"
          value={data.curp}
          onChange={manejarInput}
          className={`${
            esValido.curp ? "input-linea-azul" : "input-linea-rojo"
          } `}
        />
        <label>
          <span className="texto-rojo">&nbsp;*</span> Email
        </label>
        {/*Se evalua si es valido */}
        <input
          name="email"
          value={data.email}
          onChange={manejarInput}
          className={`${
            esValido.email ? "input-linea-azul" : "input-linea-rojo"
          }`}
        />
        <label>
          <span className="texto-rojo">&nbsp;*</span> Telefono
        </label>
        {/*Al contenido del input se le quitan caracteres no permitidos */}
        <input
          name="telefono"
          value={data.telefono}
          onChange={manejarInput}
          className="input-linea-azul"
        />
        <label className="seccion-titulo">
          <span className="texto-rojo">&nbsp;*</span> Carrera
        </label>
        <Select
          onChange={manejarSeleccionCu}
          value={data.cu.label}
          //Pasandole las opciones obtenidas del backend
          options={opcionesCu.map((opcion) => ({
            Id: opcion.IdCu,
            value: opcion.Acronimo,
            label: opcion.Nombre,
          }))}
          placeholder={Diccionario.centrosUniversitarios}
          className="select-90"
          //Tema personalizado para cambiar el estilo del select
          theme={temaSelect}
        ></Select>
        <Select
          onChange={manejarSeleccionCarrera}
          value={data.carrera}
          //Pasandole las opciones obtenidas del backend
          options={opcionesCarrera.map((opcion) => ({
            value: opcion.IdCarrera,
            label: opcion.NombreCarrera.toLowerCase(),
          }))}
          placeholder={Diccionario.seleccioneCarrera}
          className="select-90"
          //Tema personalizado para cambiar el estilo del select
          theme={temaSelect}
        ></Select>
      </form>
    </div>
  );
};

const Step2 = ({ data, setData, erroresPasos, setErroresPasos }) => {
  // Estado que almacena las filas de la tabla
  const [rows, setRows] = useState(data.tabla);
  const [cursoSeleccionado, setEsCursoSeleccionado] = useState(false);
  const [cursoObjetivo, setCursoObjetivo] = useState("");
  const mensajeAyuda = "";

  // Función para manejar cambios en los inputs
  const handleInputChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [name]: value } : row))
    );
  }, []);

  // Función para agregar una nueva fila
  const handleAddRow = useCallback(() => {
    setRows((prevRows) => [...prevRows, { col1: "", col2: "", col3: "" }]);
  }, []);

  // Función para eliminar una fila
  const handleDeleteRow = useCallback((index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  }, []);

  // useEffect para sincronizar rows con setData
  useEffect(() => {
    setData((prevData) => ({ ...prevData, tabla: rows }));
  }, [rows, setData]);

  //Funcion para fijar el curso objetivo una vez seleccionado
  const fijarCursoObjetivo = (e) => {
    setCursoObjetivo(e.target.name);
    setEsCursoSeleccionado(true);
  };

  return (
    <div className="min-h-96">
      {!cursoSeleccionado && (
        <div className="flex gap-6 items-center justify-center border-black border-[1px] p-14">
          <button
            className="bg-light-blue-500"
            onClick={fijarCursoObjetivo}
            name="Coursera"
          >
            Coursera
          </button>
          <button className="" onClick={fijarCursoObjetivo} name="Edx">
            Edx
          </button>
          <FaQuestion
            data-tooltip-id="my-tooltip"
            data-tooltip-html={Mensajes.ayudaCursos}
            data-tooltip-variant="info"
          />
        </div>
      )}
      {cursoSeleccionado && (
        <div className="flex flex-col items-center justify-center">
          <table>
            <thead>
              <tr>
                <th className="flex items-center gap-2">
                  Link
                  <FaQuestion
                    data-tooltip-id="my-tooltip"
                    data-tooltip-html={Mensajes.ayudaLinks}
                    data-tooltip-variant="info"
                    className="text-blue-500"
                  />
                </th>
                <th>Pais</th>
                <th>Institución</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="col1"
                      value={row.col1}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="col2"
                      value={row.col2}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="col3"
                      value={row.col3}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDeleteRow(index)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRow}>Agregar fila</button>
        </div>
      )}
      <Tooltip id="my-tooltip" clickable="true" noArrow="true" />
    </div>
  );
};

const Step3 = () => (
  <div>
    <h2>Step 3</h2>
    <input type="email" placeholder="Email Address" />
  </div>
);

const Step4 = () => (
  <div>
    <h2>Step 3</h2>
    <input type="email" placeholder="Email Address" />
  </div>
);

export default MultiStepForm;
