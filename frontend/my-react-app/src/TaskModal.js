import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

const TaskModal = ({ isOpen, onRequestClose, members, username }) => {
  const [description, setDescription] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());

  const handleAddTask = () => {
    if (!description || !selectedMember) {
      alert('Please fill in all fields');
      return;
    }

    const currentDate = new Date();


    let newStatus = '';
    if (currentDate && dueDate) {
      const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const dueDateWithoutTime = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (currentDateWithoutTime.getTime() > dueDateWithoutTime.getTime()) {
        newStatus = "Undone";
      } else {
        newStatus = "In Progress";
      }
    
    }

    // Wywołanie API, aby dodać nowe zadanie do backendu
    axios.post('http://localhost:8080/api/tasks/addTask', null, {
      params: {
        username: username,
        name: selectedMember.label,
        date: dueDate.toString(),
        description: description.toString(),
        status: newStatus.toString()
      },
    })
      .then(response => {
        console.log('Task added successfully:', response.data);
        onRequestClose();
      })
      .catch(error => {
        console.error('Failed to add task:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Task Modal"
    >
      {/* Treść modalu */}
      <div className='add_task_modal'>
        <h2 style={{ marginLeft: 10 + "px" }}>Add New Task</h2>

        <label>
          <p className='label'>Description</p>
          <input type="text" className='entry' style={{ width: 30 + "%" }} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          <p className='label'>Member</p>
          <Select
            options={members.map((member, index) => ({ value: index, label: member }))}
            value={selectedMember}
            onChange={(selectedOption) => setSelectedMember(selectedOption)}
            styles={{
              control: (provided) => ({
                ...provided,
                width: '30%',
                marginLeft: '5px',
                border: '1px solid black'
              }),
            }}
          />
        </label>
        <label>
          <p className='label'>Due Date</p>
          <DatePicker
            className='entry'
            selected={dueDate}
            //dateFormat="yyyy-MM-dd"
            onChange={(date) => setDueDate(date)}
          />
        </label>
      </div>
      <br />
      <button className='btn_form' onClick={handleAddTask}>Add Task</button>
      <button className='btn_form' onClick={onRequestClose}>Cancel</button>

    </Modal>
  );
};

export default TaskModal;