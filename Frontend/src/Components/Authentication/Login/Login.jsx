import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.userId);
        navigate(`/taskmanager/${data.userId}`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("An error occurred while logging in");
      console.log('Error', error);
    }
  }

  return (
    <div className="login-main-container">
      <div className="login-container">
        <form onSubmit={onLogin} className="login-form">
          <h1 className="login-heading">Login</h1>

          <div className="input-container">
            <label htmlFor="name" className="input-label">Name: </label>
            <input 
              id="name" 
              type="name" 
              className="input-field"
              placeholder="Enter your name" 
              autoComplete="true" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">Password: </label>
            <input 
              id="password" 
              type="password" 
              className="input-field"
              placeholder="Enter your password" 
              autoComplete="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">Login</button>
            <Link to={'/register'} className="btn-register">Register</Link>
          </div>
        </form>
        <img src="https://workona.com/static/tasks-hero-be2e5c85c6074292a992ad42232645e5.png" alt="Task Manager" className="login-image" />
      </div>
    </div>
  )
}

export default Login;
