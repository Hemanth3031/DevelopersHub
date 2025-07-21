import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    skill: "",
    password: "",
    confirmPassword: "",
    image: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result }); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await axios.post("http://localhost:5000/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} required />
          <input name="skill" placeholder="Skill" value={form.skill} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
          
          <button type="submit">Sign Up</button>
        </form>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
