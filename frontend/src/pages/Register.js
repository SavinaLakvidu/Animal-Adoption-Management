import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Register.module.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const register = async (name, email, password) => {
    const res = await API.post("/user/register", { name, email, password });
    return res;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await register(data.name, data.email, data.password);

      toast.success("Registration successful!");
      localStorage.setItem("token", res.data.token);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      if (err.message === "User already exists" || 
          err.response?.data?.message === "User already exists") {
        alert("A user with this email already exists. Please log in.");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <section className={styles.registerWrapper}>
      <div className={styles.registerBox}>
        <h2 className={styles.registerTitle}>Create an Account</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {/* Name */}
          <div>
            <label htmlFor="name" className={styles.formLabel}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={styles.formInput}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={styles.formInput}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className={styles.inputWrapper}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`${styles.formInput} ${styles.passwordInput}`}
              required
              autoComplete="new-password"
            />
            <div
              onClick={() => setShowPassword(prev => !prev)}
              className={styles.passwordToggle}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.inputWrapper}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`${styles.formInput} ${styles.passwordInput}`}
              required
              autoComplete="new-password"
            />
            <div
              onClick={() => setShowConfirm(prev => !prev)}
              className={styles.passwordToggle}
            >
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>

        <p className={styles.registerFooter}>
          Already have an account? <Link to="/login" className={styles.registerLink}>Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
