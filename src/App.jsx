import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// const API_BASE_URL = "http://localhost:3050/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dateOfBirth: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${API_BASE_URL}`, formData);
      setMessage("User added successfully!");
      setFormData({ username: "", email: "", dateOfBirth: "" });
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        setMessage("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        setMessage("Error deleting user", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🎂 Birthday Reminder App</h1>
          <p>Never forget to wish your customers a happy birthday!</p>
        </header>

        {message && (
          <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="content">
          <div className="form-section">
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>

          <div className="users-section">
            <h2>Registered Users ({users.length})</h2>
            {Array.isArray(users) && users.length === 0 ? (
              <p className="no-users">No users registered yet.</p>
            ) : (
              <div className="users-grid">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p className="user-email">{user.email}</p>
                      <p className="user-dob">
                        Birthday: {formatDate(user.dateOfBirth)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;