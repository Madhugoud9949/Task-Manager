import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        console.log('User Registered');
        navigate('/'); // Use navigate to redirect to the login page
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while registering');
    }
  }

  return (
    <div className="registration-main-container">
      <div className="registration-container">
        <form onSubmit={onRegister} className="register-form">
          <h1>Register</h1>

          {error && <p className="error-message">{error}</p>}

          <div className="input-container">
            <label htmlFor="name">Name: </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              autoComplete="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-register">Register</button>
            <Link to={'/'} className="btn-login">Login</Link>
          </div>
        </form>
        <img src="https://workona.com/static/tasks-hero-be2e5c85c6074292a992ad42232645e5.png" alt="Registration" className="registration-image" />
      </div>
    </div>
  );
}

export default Register;
