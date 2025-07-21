import React from "react";
import { Link } from "react-router-dom";
import './App.css';


const Home = () => (
  <div className="home-container">
    <h1>Welcome to Developer Hub</h1>
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </nav>
  </div>
);

export default Home;
