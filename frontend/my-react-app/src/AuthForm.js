import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onLogin, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleLoginClick = () => {
      // Wywołanie funkcji przekazanej przez propa do obsługi logowania
      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      }
      onLogin({ username, password });
    };
  
    const handleRegisterClick = () => {
      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      }
      onRegister({ username, password });
    };
  
    return (
        <div className='login_content'>
            <form>
                <p className='login_title'>Login/Register</p>
                <label><p className='label'>Group name</p>
                    <input type="text" className='entry' value={username} onChange={handleUsernameChange} />
                </label>
                <br />
                <label>
                    <p className='label'>Password</p>
                    <input type="password" className='entry' value={password} onChange={handlePasswordChange} />
                </label>
                <br />
                <button type="button" className='btn_form' onClick={handleLoginClick}>
                    Login
                </button>
                <button type="button" className='btn_form' onClick={handleRegisterClick}>
                    Register
                </button>
            </form>
        </div>
    );
  };

export default AuthForm;