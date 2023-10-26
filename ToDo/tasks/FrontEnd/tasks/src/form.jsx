import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from "react";

const apiUrl = "http://192.168.0.74:3501/api"

export function EditTask ({tasks, setScreenChange,screenChange, taskData, setTaskData, idTask, setIdTask,shouldReloadData,
    fetchData,}) {

    const handleInputChange = (e) => {
        console.log(`solo ${e}`);
        console.log(`con target ${e.target}`);
        const {name, value} = e.target;
        setTaskData({ ...taskData, [name]: value});
    }

    const handleInputSumbit = async () => {  // hacemos un put para actualizar datos
        
        try {
            const confirmed = window.confirm('Estás seguro de que deseas guardar los cambios?');
            if (confirmed) {
            await axios.put(apiUrl+`/tasks/edit/${idTask}/`, taskData)
            fetchData();
            setScreenChange("tasks")
            } else {
                console.log('modificacion cancelada')
            }
        }
        catch (error){
            console.log('Error al actualizar los datos', error);
        }
    }



    return (
        <div className="container-add container-edit">
        <form action="#" className="form-add form-gap" onSubmit={handleInputSumbit}>
              <div className="form-container form-gap form-edit">
                <div className="form1 form-gap">
                  <div className="prio-container">
                    <label htmlFor="tarea">Tarea:</label>
                    <input
                      type="text"
                      name="tarea"
                      id="tarea"
                      htmlFor="tarea"
                      className="tarea"
                      value={taskData.tarea}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="prio-container">
                    <label htmlFor="prioridad">Prioridad:</label>
                    <div className={"select-wrapper"}>
                      <select
                        id="prioridad"
                        name="prioridad"
                        value={taskData.prioridad}
                        onChange={handleInputChange}
                        required>
                        <option>-------------</option>
                        <option value="Urgente">Urgente</option>
                        <option value="Para Hoy">Para Hoy</option>
                        <option value="Cuando Puedas">Cuando Puedas</option>
                        <option value="Puede Esperar">Puede Esperar</option>
                      </select>
                    </div>
                  </div>
                  <div className="prio-container">
                    <label htmlFor="agente">Agente:</label>
                    <div className={"select-wrapper"}>
                      <select
                        id="agente"
                        name="agente"
                        value={taskData.agente}
                        onChange={handleInputChange}
                        required>
                        <option>-------</option>
                        <option value="Jairo">Jairo</option>
                        <option value="Felipe">Felipe</option>
                        <option value="Ezequiel">Ezequiel</option>
                        <option value="Joaquin">Joaquin</option>
                      </select>
                    </div>
                  </div>
                  <div className="prio-container">
                    <label htmlFor="estado">Estado:</label>
                    <div className={"select-wrapper"}>
                      <select
                        id="estado"
                        name="estado"
                        value={taskData.estado}
                        onChange={handleInputChange}
                        required>
                        <option>-------</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </div>
                  </div>
                  <div className="prio-container">
                  <label htmlFor="comentario">Comentario:</label>
                  <textarea
                    name="comentario"
                    id="comentario"
                    value={taskData.comentario}
                    onChange={handleInputChange}
                    cols="20"
                    rows="1"
                    placeholder="Comentario..."

                    ></textarea>
                </div>
                </div>
              </div>
                <div className='btns-edit'>
              <button type="submit" className='btn-edit btn-add-submit'>Guardar</button>
              <button type="reset" onClick={() => setScreenChange("tasks") } className='btn-edit btn-warning'>Cancelar</button>
              </div>
            </form>
            </div>
    )
}


EditTask.propTypes = {
    tasks: PropTypes.array.isRequired,
  };