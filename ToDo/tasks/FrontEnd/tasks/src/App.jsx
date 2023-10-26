import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas); // Agrega los iconos al library

// import { parse } from 'date-fns';
// import { format } from "date-fns";
// import { es } from "date-fns/locale"; // Importa el locale para el idioma español

import "./App.css";
import { useState, useEffect } from "react";

import { TablaDatos } from "./datos.jsx";
import { EditTask } from "./form.jsx";

import axios from "axios";

const apiUrl = "http://192.168.0.74:3501/api";

const initialFormData = {
  tarea: "",
  prioridad: "-------------",
  agente: "-------",
  estado: "Pendiente",
  comentario: "",
};
const priorityOrder = ["Urgente", "Para Hoy", "Cuando Puedas", "Puede Esperar"];

function App() {
  const [screenChange, setScreenChange] = useState("tasks");
  const [taskData, setTaskData] = useState({});
  const [idTask, setIdTask] = useState("");
  const [shouldReloadData, setShouldReloadData] = useState(false);

  const [tasks, setTask] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [filters, setFilters] = useState({
    prioridad: "",
    estado: "",
    agente: "",
  });
  const [deleteMessages, setDeleteMessages] = useState("");
  const [searchedTasks, setSearchedTasks] = useState([]);
  const [formErrors, setFormErrors] = useState({
    tarea: "",
    prioridad: "",
    agente: "",
    estado: "",
    comentario: "",
  });
  const [validForm, setValidForm] = useState(true);

  const uniquePriorities = [...new Set(tasks.map((task) => task.prioridad))];
  console.log(uniquePriorities);
  const uniqueAgent = ["Jairo", "Felipe", "Joaquin", "Ezequiel"];
  const uniqueState = ["Resuelto", "Pendiente", "Cerrado"];

  const handleInputChange = (event) => {
    if (!formSubmitted) {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm =  () => {
    let valid = true;
    const errorsForm = {
      tarea: "",
      prioridad: "",
      agente: "",
      estado: "",
      comentario: "",
    };
    if (formData.tarea.trim() === "") {
      errorsForm.tarea = "La tarea es requerida ⚠️";
      valid = false
    }
    else if (formData.prioridad === "-------------") {
      errorsForm.prioridad = "Seleccione una prioridad valida ⚠️";
      valid = false
    }
    else if (formData.agente === "-------") {
      errorsForm.agente = "Seleccione un agente valido ⚠️";
      valid = false
    }
    else{
      valid = true
    }
    setFormErrors(errorsForm);
    return valid
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita el comportamiento de envío predeterminado del formulario

    validateForm();


    if (validateForm()) {
      try {
        const response = await axios.post(apiUrl + "/tasks/", formData);
        console.log("Tarea agregada con éxito:", response.data);
        setTask([response.data, ...tasks]);
        setFormData(initialFormData);
        setFormSubmitted(true);
      } catch (error) {
        console.error("Error al agregar la tarea:", error);
        event.preventDefault();
        return;
      }
    } else{
      console.log("no estoy entrando al valid")
    }
  };
  useEffect(() => {
    setFormSubmitted(false);
  }, [tasks]);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl + "/tasks/");
      setTask(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    console.log("Name:", name, "Value:", value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    console.log("Filters:", filters);
  };

  useEffect(() => {
    if (deleteMessages) {
      const timer = setTimeout(() => {
        setDeleteMessages(null);
      }, 3550);
      return () => clearTimeout(timer);
    }
  }, [deleteMessages]);

  //barra de busqueda

  const onChangeSearch = (event) => {
    const search = event.target.value;

    if (search.length > 3) {
      const filteredItems = tasks.filter((task) =>
        task.tarea.toLowerCase().includes(search.toLowerCase())
      );
      setSearchedTasks(filteredItems);
      // console.log(searchedTasks);
      // console.log(search);
    }
  };

  const handleSearchSumbit = (event) => {
    event.preventDefault();
  };

  console.log(screenChange);
  console.log(`tarea id en datos ${idTask}`);

  return (
    <>
      <div className="col-12">
        <div className="titulo">
          <a href="http://192.168.0.74:3500/">
            <img src="/img/logo.png" alt="logo DrAhorro" className="img-logo" />
          </a>
          <h1>Area de Sistemas - Dr Ahorro</h1>
        </div>
        <div
          className={`contenedor ${screenChange !== "tasks" ? "ocultar" : ""}`}>
          <div className="container-buscar">
            <form
              action="#"
              className="form-buscar"
              onSubmit={handleSearchSumbit}>
              <input
                type="text"
                name="buscar"
                id="buscar"
                placeholder="  Buscar..."
                onChange={onChangeSearch}
              />
              <button type="button" className="btn-buscar">
                <FontAwesomeIcon
                  icon="fa-solid fa-magnifying-glass"
                  size="xl"
                  className="icon-beat"
                />
              </button>
            </form>
          </div>
          <div className="filtros">
            <div className="filter">
              <label htmlFor="sort">Prioridad:</label>
              <select name="prioridad" onChange={handleFilterChange}>
                <option value="">Todas</option>
                {uniquePriorities.map((priority, index) => (
                  <option key={index} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label htmlFor="sort">Agente:</label>
              <select name="agente" onChange={handleFilterChange}>
                <option value="">Todos</option>
                {uniqueAgent.map((agent, index) => (
                  <option key={index} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label htmlFor="sort">Estado:</label>
              <select name="estado" onChange={handleFilterChange}>
                <option value="">Todos</option>
                {uniqueState.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="container-add">
            <form action="#" className="form-add" onSubmit={handleSubmit}>
              <div className="form-container">
                <div className="form1">
                  <div className="container-input-error">
                    <div className="prio-container">
                      <label htmlFor="tarea">Tarea:</label>
                      <input
                        type="text"
                        name="tarea"
                        id="tarea"
                        htmlFor="tarea"
                        className="tarea"
                        value={formData.tarea}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <span className="text-danger">{formErrors.tarea}</span>
                    </div>
                  </div>
                  <div>
                    <div className="prio-container">
                      <label htmlFor="prioridad">Prioridad:</label>
                      <div className={"select-wrapper"}>
                        <select
                          id="prioridad"
                          name="prioridad"
                          value={formData.prioridad}
                          required
                          onChange={handleInputChange}>
                          <option>-------------</option>
                          <option value="Urgente">Urgente</option>
                          <option value="Para Hoy">Para Hoy</option>
                          <option value="Cuando Puedas">Cuando Puedas</option>
                          <option value="Puede Esperar">Puede Esperar</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <span className="text-danger">
                        {formErrors.prioridad}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="prio-container">
                      <label htmlFor="agente">Agente:</label>
                      <div className={"select-wrapper"}>
                        <select
                          id="agente"
                          name="agente"
                          value={formData.agente}
                          required
                          onChange={handleInputChange}>
                          <option>-------</option>
                          <option value="Jairo">Jairo</option>
                          <option value="Felipe">Felipe</option>
                          <option value="Ezequiel">Ezequiel</option>
                          <option value="Joaquin">Joaquin</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <span className="text-danger">{formErrors.agente}</span>
                    </div>
                  </div>

                  <div className="prio-container">
                    <label htmlFor="estado">Estado:</label>
                    <div className={"select-wrapper"}>
                      <select
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        required
                        onChange={handleInputChange}>
                        {/* <option>-------</option> */}
                        <option value="Pendiente">Pendiente</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form2">
                  <label htmlFor="comentario">Comentario:</label>
                  <textarea
                    name="comentario"
                    id="comentario"
                    cols="1"
                    rows="5"
                    placeholder="Comentario..."
                    value={formData.comentario}
                    onChange={handleInputChange}></textarea>
                </div>
              </div>

              <button type="submit" className="btn-add-submit">
                Agregar
              </button>
            </form>
          </div>
        </div>
        <div
          className={`msg  ${deleteMessages ? "msg-enabled bg-success" : ""}`}>
          <h3>{deleteMessages}</h3>
        </div>

        {screenChange === "tasks" ? (
          <TablaDatos
            tasks={tasks}
            filters={filters}
            priorityOrder={priorityOrder}
            fetchData={fetchData}
            setDeleteMessages={setDeleteMessages}
            setScreenChange={setScreenChange}
            screenChange={screenChange}
            taskData={taskData}
            setTaskData={setTaskData}
            setIdTask={setIdTask}
            idTask={idTask}
            shouldReloadData={shouldReloadData}
            searchedTasks={searchedTasks}
          />
        ) : screenChange === "edit" ? (
          <EditTask
            tasks={tasks}
            setScreenChange={setScreenChange}
            screenChange={screenChange}
            taskData={taskData}
            setTaskData={setTaskData}
            setIdTask={setIdTask}
            idTask={idTask}
            shouldReloadData={shouldReloadData}
            fetchData={fetchData}
          />
        ) : (
          <TablaDatos
            tasks={tasks}
            filters={filters}
            priorityOrder={priorityOrder}
            fetchData={fetchData}
            setDeleteMessages={setDeleteMessages}
            setScreenChange={setScreenChange}
            screenChange={screenChange}
            setIdTask={setIdTask}
            idTask={idTask}
            shouldReloadData={shouldReloadData}
          />
        )}
      </div>
    </>
  );
}

export default App;
