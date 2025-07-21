import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const MyProfile = () => {
  const [me, setMe] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", mobile: "", skill: "", image: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/myprofile", {
        headers: { "x-token": token },
      });
      setMe(res.data);
      setFormData({
        fullName: res.data.fullName,
        mobile: res.data.mobile,
        skill: res.data.skill,
        image: res.data.image || "",
      });
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put("http://localhost:5000/updateprofile", formData, {
        headers: { "x-token": token },
      });
      alert("Profile updated successfully.");
      setMe(res.data.user);
    } catch (err) {
      alert("Profile update failed.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/deleteprofile", {
        headers: { "x-token": token },
      });
      alert("Your profile has been deleted.");
      localStorage.removeItem("token");
      window.location.href = "/register";
    } catch (err) {
      alert("Failed to delete profile.");
      console.error(err);
    }
  };

  if (!me) return <p className="loading">Loading...</p>;

  return (
    <div className="my-profile-container">
      <h2>My Profile</h2>
      {formData.image && <img src={formData.image} alt="Avatar" className="profile-img" />}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <p><strong>Name:</strong>
        <input name="fullName" value={formData.fullName} onChange={handleInputChange} />
      </p>
      <p><strong>Mobile:</strong>
        <input name="mobile" value={formData.mobile} onChange={handleInputChange} />
      </p>
      <p><strong>Skill:</strong>
        <input name="skill" value={formData.skill} onChange={handleInputChange} />
      </p>
      <button className="btn update-btn" onClick={handleUpdate}>Update Profile</button>
      <button className="delete-btn" onClick={handleDelete}>Delete My Profile</button>
    </div>
  );
};

export default MyProfile;
