import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import IndProfile from "./IndProfile";
import Login from "./Login";
import Register from "./Register";
import Home from './Home'
import MyProfile from './MyProfile'
import "./App.css"

function App() {
  return (
  
      <Routes>
         <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/indprofile/:id" element={<IndProfile />} />
        <Route path="/myprofile" element={<MyProfile />}/>
      </Routes>
 
  );
}

export default App;
