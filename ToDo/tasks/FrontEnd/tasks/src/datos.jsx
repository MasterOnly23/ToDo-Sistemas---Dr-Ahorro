import PropTypes from "prop-types";

import { parse } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";

TablaDatos.propTypes = {
  tasks: PropTypes.array.isRequired,
  priorityOrder: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  setDeleteMessages: PropTypes.func.isRequired,
  setScreenChange: PropTypes.func.isRequired,
  screenChange: PropTypes.func.isRequired,
  taskData: PropTypes.func.isRequired,
  setTaskData: PropTypes.func.isRequired,
  setIdTask: PropTypes.func.isRequired,
  idTask: PropTypes.func.isRequired,
  searchedTasks: PropTypes.array.isRequired,
};

const apiUrl = "http://192.168.0.74:3501/api";

export function TablaDatos({
  tasks,
  filters,
  priorityOrder,
  fetchData,
  setDeleteMessages,
  setScreenChange,
  screenChange,
  taskData,
  setTaskData,
  setIdTask,
  idTask,
  shouldReloadData,
  searchedTasks
}) {
  const [columnaOrden, setColumnaOrden] = useState("");
  const [ordenUp, setOrdenUp] = useState(true);

  const cambiaOrden = (columna) => {
    console.log(columna);
    if (columna === columnaOrden) {
      setOrdenUp(!ordenUp);
    } else {
      setColumnaOrden(columna);
      setOrdenUp(true);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(
      (task) =>
        (!filters.prioridad || task.prioridad === filters.prioridad) &&
        (!filters.agente || task.agente === filters.agente) &&
        (!filters.estado || task.estado === filters.estado)
    )
    .sort((a, b) => {
      const fechaA = parse(
        a.fecha_modificacion,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        new Date(),
        { locale: es }
      );
      const fechaB = parse(
        b.fecha_modificacion,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        new Date(),
        { locale: es }
      );
      // console.log("fechas" + " " + fechaA, fechaB);

      if (columnaOrden === "Fecha") {
        if (fechaA < fechaB) {
          return ordenUp ? -1 : 1;
        }
        if (fechaA > fechaB) {
          return ordenUp ? 1 : -1;
        }
        return 0;
      } else if (columnaOrden === "Prioridad") {
        const indexA = priorityOrder.indexOf(a.prioridad);
        const indexB = priorityOrder.indexOf(b.prioridad);

        let comparacion = indexA - indexB;
        if (!ordenUp) {
          comparacion *= -1;
        }

        return comparacion;
      }
    });

  const handleDelete = async (taskId) => {
    try {
      const confirmed = window.confirm(
        "Estás seguro de que deseas eliminar la tarea?"
      );
      if (confirmed) {
        await axios.delete(apiUrl + `/tasks/delete/${taskId}/`);
        fetchData(); // Actualizar la lista de tareas después de la eliminación
        setDeleteMessages("Tarea eliminada Exitosamente 🫡");
      } else {
        console.log("eliminacion cancelada");
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      setDeleteMessages("Error al eliminar la tarea 😭");
    }
  };

  const editarTask = async (taskId) => {
    try {
      const response = await axios.get(apiUrl + `/tasks/edit/${taskId}/`);
      setTaskData(response.data);
    } catch (error) {
      console.error("Error al obtener el formulario:", error);
    }
  };

  const handleEditTask = (taskId) => {
    console.log(`id: ${taskId}`);
    editarTask(taskId);
    setIdTask(taskId);
    setScreenChange("edit");
  };

  useEffect(() => {
    console.log(`id2: ${idTask}`);
  }, [idTask]);

  return (
    <div className="tareas">
      <div className="tittle-table">
        <h1 className="tareas">Tareas</h1>
      </div>
      <table className="tareas-tabla table table-striped-columns">
        <thead>
          <tr>
            <th>Tarea</th>
            <th onClick={() => cambiaOrden("Prioridad")}>
              Prioridad{" "}
              {columnaOrden === "Prioridad" ? (
                ordenUp ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}{" "}
            </th>
            <th>Agente</th>
            <th>Estado</th>
            <th>Comentario</th>
            <th onClick={() => cambiaOrden("Fecha")}>
              Fecha de Modificacion{" "}
              {columnaOrden === "Fecha" ? (
                ordenUp ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}{" "}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {searchedTasks.length === 0
            ? filteredAndSortedTasks.map((task) => (
                <tr key={task.id}>
                  <td className="text-center">{task.tarea}</td>
                  <td className="text-center">{task.prioridad}</td>
                  <td className="text-center">{task.agente}</td>
                  <td className="text-center">{task.estado}</td>
                  <td>{task.comentario}</td>
                  <td className="text-center">
                    {format(new Date(task.fecha_modificacion), "dd-MMM-yy", {
                      locale: es,
                    }).toUpperCase()}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-abm"
                      onClick={() => handleEditTask(task.id)}>
                      <img
                        src="/iconos/editar.png"
                        alt="editar"
                        className="btn-icon"
                      />
                    </button>
                    <button
                      className="btn btn-danger btn-abm"
                      onClick={() => handleDelete(task.id)}>
                      <img
                        src="/iconos/eliminar.png"
                        alt="eliminar"
                        className="btn-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))
            : searchedTasks.map((task) => (
                <tr key={task.id}>
                  <td className="text-center">{task.tarea}</td>
                  <td className="text-center">{task.prioridad}</td>
                  <td className="text-center">{task.agente}</td>
                  <td className="text-center">{task.estado}</td>
                  <td className="text-center">{task.comentario}</td>
                  <td className="text-center">
                    {format(new Date(task.fecha_modificacion), "dd-MMM-yy", {
                      locale: es,
                    }).toUpperCase()}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-abm"
                      onClick={() => handleEditTask(task.id)}>
                      <img
                        src="/iconos/editar.png"
                        alt="editar"
                        className="btn-icon"
                      />
                    </button>
                    <button
                      className="btn btn-danger btn-abm"
                      onClick={() => handleDelete(task.id)}>
                      <img
                        src="/iconos/eliminar.png"
                        alt="eliminar"
                        className="btn-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
