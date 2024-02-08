// App.js
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import Task from './Task';
import AuthForm from './AuthForm';
import './App.css';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isModalAddTaskOpen, setisModalAddTaskOpen] = useState(false);
  const [status, setStatus] = useState(null);

  const handleLogin = (user) => {
    // Wywołanie API dla logowania
    axios.post('http://localhost:8080/api/users/login', user)
      .then(response => {
        if (response && response.data) {
          // Ustawienie zalogowanego użytkownika w stanie
          setLoggedInUser(user.username);
        } else {
          console.error("Login failed");
        }
      })
      .catch(error => {
        console.error("Login failed", error);
        alert("Incorrect username or password. Please try again.");
      });
  };

  const handleRegister = (user) => {
    // Wywołanie API dla rejestracji
    axios.post('http://localhost:8080/api/users/register', user)
      .then(response => {
        if (response && response.data) {
          // Ustawienie zalogowanego użytkownika w stanie
          setLoggedInUser(user.username);
        } else {
          console.error("User already exists!");
        }
      })
      .catch(error => {
        console.error("User already exists!", error);
        alert("User already exists! Please try a different username.");
      });
  };

  const handleModalOpen = (isOpen) => {
    setisModalAddTaskOpen(isOpen)

  };

  const handleStatus = (newStatus) => {
    setStatus(newStatus)

  };

  return (

    <div>
      {loggedInUser ? (
        <div className="app">
          <Sidebar username={loggedInUser} />
          <Header username={loggedInUser} modalOpen = {handleModalOpen} setStatus={handleStatus}/>
          {isModalAddTaskOpen ? false : <Task username={loggedInUser} status={status}/>}
        </div>
      ) : (

        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />

      )}
    </div>
  );
};

export default App;
