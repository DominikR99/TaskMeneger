import React, { useState, useEffect } from 'react';
import './Header.css';
import { CiFilter } from "react-icons/ci";
import TaskModal from './TaskModal';
import axios from 'axios';

const Header = ({username, modalOpen, setStatus}) => {
  const [members, setGroupMembers] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    modalOpen({isModalOpen});
    axios.get(`http://localhost:8080/api/group/members?username=${username}`)
      .then(response => {
        console.log(response.data);
        if (response && response.data) {
          setGroupMembers(response.data);
        } else {
          console.error("Failed to fetch group members");
        }
      })
      .catch(error => {
        console.error("Failed to fetch group members", error);
      });
  };

  const closeModal = () => {
    modalOpen(false);
    setIsModalOpen(false);
  };

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  const handleFilterItemClick = (filterValue) => {
    if (filterValue === null) {
      setStatus(filterValue)
  }
  else{
    setStatus(filterValue.toString())
    console.log(filterValue.toString())
  }
    modalOpen(false);
  };

  return (
    <div className="header">
      <div className='content'>
        <p className="title">TASKS</p>
        <button className='btn_filter'  onClick={toggleFilter}>
          <CiFilter size={20} />
          Filter
        </button>
        {isFilterOpen && (
          <div className="filter-dropdown">
            <button className="btn_filter_option"  onClick={() => handleFilterItemClick(null)}>All</button>
            <button className="btn_filter_option" onClick={() => handleFilterItemClick('In Progress')}>In Progress</button>
            <button className="btn_filter_option" onClick={() => handleFilterItemClick('Done')}>Done</button>
            <button className="btn_filter_option" onClick={() => handleFilterItemClick('Undone')}>Undone</button>
          </div>
        )}
        <button className='btn_task' onClick={openModal}>Add new task</button>
        <TaskModal isOpen={isModalOpen} onRequestClose={closeModal} members={members} username={username} />
      </div>
    </div>
  );
};

export default Header;