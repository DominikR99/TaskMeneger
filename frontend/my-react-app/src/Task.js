import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import "./Task.css"

const Task = ({ username, status }) => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const statusQueryParam = status ? `&status=${status}` : '';
            const response = await axios.get(`http://localhost:8080/api/tasks/getTasks?username=${username}${statusQueryParam}`);
            setTasks(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const checkStatusTasks = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/tasks/status`);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        checkStatusTasks();
        fetchTasks();
    }, [username, status]); 

    const onCheck = async (taskId) => {
        try {
            // Przygotuj dane do wysłania
            const newStatus = 'Done';  // Lub dowolny inny status, który chcesz przypisać

            // Wywołaj endpoint do aktualizacji statusu
            const response = await axios.put(
                `http://localhost:8080/api/tasks/updateStatus/${taskId}`,
                newStatus,  // Umieść samą wartość "Done" jako string w ciele żądania
                { headers: { 'Content-Type': 'text/plain' } }  // Ustaw nagłówek Content-Type
            );

            console.log(response.data);  // Zaloguj odpowiedź z serwera, jeśli to konieczne
            checkStatusTasks();
            fetchTasks();
        } catch (error) {
            console.error("Failed to update task status", error);
        }
    };

    const onDelete = async (taskId) => {
        try {
            // Wywołaj endpoint do usuwania zadania
            const response = await axios.delete(`http://localhost:8080/api/tasks/deleteTask/${taskId}`);

            if (response && response.data) {
                console.log(response.data);
                checkStatusTasks();
                fetchTasks();
            } else {
                console.error("Failed to delete task");
            }
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    return (
        <div className="task_content_container">
            <div className='single_task'>
                {
                    tasks.map((task) => (
                        
                        <div key={task.id} className="task">
                            <div className='task_content' style={{ backgroundColor: task.status === 'Undone' ? "rgb(228, 108, 108)" : (task.status === 'Done' ? "rgb(79, 209, 79)" : 'initial') }}>
                                <div className='vertical_items'>
                                    <p className='member'>{task.groupMember.name}</p>
                                    <p className='task_description'>{task.description}</p>
                                </div>
                                <p className='date'>{new Date(task.date).toLocaleDateString()}</p>
                                <button className='check_btn' disabled={task.status === 'Done'} style={{ backgroundColor: task.status === 'Done' ? 'rgb(79, 209, 79)' : 'initial' }}
                                    onClick={() => onCheck(task.id)}><FaCheck size={24} color='black' /></button>
                                <button className='delete_btn' onClick={() => onDelete(task.id)}><MdDelete size={24} color='black' /></button>
                            </div>
                        </div>

                    ))
                }
            </div>
        </div>
    );
};

export default Task;