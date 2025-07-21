import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./App.css";

const IndProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <p className="loading">Loading profile...</p>;

  return (
    <div className="indprofile-container">
      <h2>{profile.fullName}'s Profile</h2>
      <img
        src={
          profile.image
            ? profile.image
            : "https://via.placeholder.com/100?text=No+Image"
        }
        alt="profile avatar"
        className="indprofile-img fixed-avatar"
      />
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.mobile || "N/A"}</p>
      <p><strong>Skill:</strong> {profile.skill}</p>
      <p><strong>Joined On:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default IndProfile;
