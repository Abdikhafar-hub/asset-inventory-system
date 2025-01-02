// src/pages/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Assuming the API endpoint for creating a new user is `/Users`
      await api.post('/Users', { username, password });
      alert("Sign-up successful! You can now log in.");
      navigate('/login'); // Redirect to the login page after successful sign-up
    } catch (error) {
      console.error("Sign-up failed:", error);
      alert("An error occurred while trying to sign up.");
    }
  };

  return (
    <div className={styles['signup-container']}>
      <div className={styles.wrapper}>
        <div className={styles['form-wrapper']}>
          <form onSubmit={handleSignUp}>
            <h1 className={styles['main-title']}>Asset Maze</h1>
            <h2>Sign Up</h2>
            <div className={styles['input-group']}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Username</label>
            </div>
            <div className={styles['input-group']}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <div className={styles['input-group']}>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label>Confirm Password</label>
            </div>
            <button type="submit" className={styles['signup-button']}>Sign Up</button>
            <p className={styles['login-link']}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
