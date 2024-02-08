import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddToGroupModal from './AddToGroupModal'; // Załóżmy, że plik ten istnieje
import './Sidebar.css';

const Sidebar = ({ username }) => {
  const [groupMembers, setGroupMembers] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Wywołanie API dla pobrania danych o członkach grupy
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
  }, [username]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);

    // Po zamknięciu modalu ponownie załaduj dane grupy
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

  return (
    <div className="sidebar">
      <p className="small-text">Welcome</p>
      <p className="large-text">{username}</p>
      <p className="small-text">Group</p>
      {groupMembers.map((member, index) => (
        <p key={index} className="medium-text">{member}</p>
      ))}
      <button className="sidebar-button" onClick={openModal}>Add to group</button>

      <AddToGroupModal isOpen={isModalOpen} onRequestClose={closeModal} username={username} />
    </div>
  );
};

export default Sidebar;