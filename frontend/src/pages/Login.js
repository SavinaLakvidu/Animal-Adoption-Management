// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import styles from "./Login.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // login returns { user, accessToken, refreshToken }
      const res = await login(data.email, data.password);

      toast.success("Login successful!");

      const role = (res.user?.role || "").toUpperCase();
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Login</h2>

        <label htmlFor="email" className={styles.loginLabel}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={styles.loginInput}
          required
          autoComplete="email"
        />

        <label htmlFor="password" className={styles.loginLabel}>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`${styles.loginInput} ${styles.passwordInput}`}
            required
            autoComplete="current-password"
          />
          <span
            className={styles.passwordToggle}
            onClick={() => setShowPassword((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button type="submit" className={styles.loginButton}>Login</button>

        <p className={styles.loginFooter}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.loginRegisterLink}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
