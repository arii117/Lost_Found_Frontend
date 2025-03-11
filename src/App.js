import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Admin from './Admin';
import './App.css';
import backgroundImage from './bg1.jpg';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phoneNo: '',
    itemName: '',
    description: '',
    date: '',
    roomNo: '',
    type: '', // 'lost' or 'found'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/lost', formData);
      if (response.status === 201) {
        alert('Item submitted successfully');
        setFormData({
          name: '',
          rollNo: '',
          email: '',
          phoneNo: '',
          itemName: '',
          description: '',
          date: '',
          roomNo: '',
          type: '',
        });
      }
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Failed to submit item');
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <div className="form-page">
                <div className="image-container">
                  <img src={backgroundImage} alt="Lost and Found" />
                </div>
                <div className="form-container">
                  <h1>Fill the Form<Nav /></h1>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Roll No:</label>
                      <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone No:</label>
                      <input
                        type="text"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Item Lost:</label>
                      <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date:</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Room No:</label>
                      <input
                        type="text"
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleChange}
                      />
                    </div>
                    <button className="submit-button" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            }
          />
          <Route path="/admin" element={<Admin />} /> {/* Route to Admin component */}
        </Routes>
      </div>
    </Router>
  );
}

function Nav() {
  const location = useLocation();
  return (
    <nav className="nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <i className="fas fa-home"></i> Home
      </Link>
      <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
        <i className="fas fa-user-shield"></i> Admin
      </Link>
    </nav>
  );
}

export default App;
