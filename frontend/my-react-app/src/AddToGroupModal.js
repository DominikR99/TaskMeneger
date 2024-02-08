import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const AddToGroupModal = ({ isOpen, onRequestClose, username }) => {
  const [memberName, setMemberName] = useState('');

  const handleAddMember = () => {
    axios.post('http://localhost:8080/api/group/addMember', null, { 
        params: {
        username: username,
        name: memberName,
      },
    })
      .then(response => {
        console.log('Member added successfully:', response.data);
        onRequestClose();
      })
      .catch(error => {
        console.error('Failed to add member:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add to Group Modal"
    >
      {/* Treść modalu */}
      <h2>Add to Group</h2>
      <label>
      <p className='label'>Member Name</p>
        <input type="text" className='entry' style={{width: 30 + "%"}} value={memberName} onChange={(e) => setMemberName(e.target.value)} />
      </label>
      <br/>
      <button className='btn_form' onClick={handleAddMember}>Add</button>
      <button className='btn_form' onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default AddToGroupModal;