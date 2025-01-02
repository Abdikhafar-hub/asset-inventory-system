import React, { useState } from "react";
import { loginUser } from "../services/api";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { username, password };

    try {
      const data = await loginUser(credentials);

      if (data.message) {
        setMessage(data.message); // Display error message
      } else {
        setMessage("Login successful!");
        onLogin(data.id);

        // Navigate based on user role
        switch (data.role) {
          case "Admin":
            navigate("/admin-dashboard");
            break;
          case "Procurement Manager":
            navigate("/manager-dashboard");
            break;
          case "Employee":
            navigate("/user-dashboard");
            break;
          default:
            setMessage("Invalid role. Contact admin.");
            break;
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles.wrapper}>
        <div className={`${styles["form-wrapper"]} ${styles["sign-in"]}`}>
          <form onSubmit={handleSubmit}>
            <h1 className={styles["main-title"]}>Asset Maze</h1>
            <h2>Login</h2>
            {message && <p className={styles["error-message"]}>{message}</p>}
            <div className={styles["input-group"]}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Username</label>
            </div>
            <div className={styles["input-group"]}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>
            <div className={styles.remember}>
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>
            <button type="submit" className={styles["login-button"]}>
              Login
            </button>
            <div className={styles["signup-link"]}>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className={styles["signup-btn-link"]}>
                  Sign up
                </Link>
              </p>
            </div>
            <Link to="/" className={styles["home-button"]}>
              Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
