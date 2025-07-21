import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/allprofiles", {
          headers: { "x-token": token },
        });
        setProfiles(res.data);
      } catch (err) {
        console.error("Error loading profiles:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProfiles();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { headers: { "x-token": token } }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Developer Profiles</h2>
      <ul className="profile-list">
        {profiles.map((profile) => (
          <li key={profile._id} className="profile-card">
            <img
              src={
                profile.image
                  ? profile.image
                  : "https://via.placeholder.com/80x80.png?text=No+Image"
              }
              alt={`${profile.fullName}'s avatar`}
              className="profile-img"
            />
            <Link to={`/indprofile/${profile._id}`} className="profile-name">
              {profile.fullName}
            </Link>
          </li>
        ))}
      </ul>
      <div className="dashboard-actions">
        <Link to="/MyProfile" className="btn">My Profile</Link>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
