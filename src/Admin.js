import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const API_URL = process.env.REACT_APP_API_URL;

function Admin() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState({});
  const [newFoundItem, setNewFoundItem] = useState({
    itemName: '',
    image: null,
    date: '',
    roomNo: '',
  });
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchLostItems();
      fetchFoundItems();
    }
  }, [authenticated]);

  const fetchLostItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/lost`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLostItems(response.data);
    } catch (error) {
      console.error('Error fetching lost items:', error);
      alert('Failed to fetch lost items');
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/found`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFoundItems(response.data);
    } catch (error) {
      console.error('Error fetching found items:', error);
      alert('Failed to fetch found items');
    }
  };

  const checkMatches = () => {
    const matchResults = {};
    lostItems.forEach((lostItem) => {
      const regex = new RegExp(`\\b${lostItem.itemName.replace(/\s+/g, '\\s*')}\\b`, 'i');
      matchResults[lostItem._id] = foundItems.some(
        (foundItem) => regex.test(foundItem.itemName)
      );
    });
    setMatches(matchResults);
  };

  const sendEmail = async (lostItem) => {
    const foundItem = foundItems.find(
      (item) => item.itemName === lostItem.itemName
    );
    if (foundItem) {
      try {
        const emailData = {
          to: lostItem.email,
          subject: `Found item: ${foundItem.itemName}`,
          text: `Dear ${lostItem.name},\n\nWe are pleased to inform you that your lost item "${foundItem.itemName}" has been found!\n\nItem Details:\nFound in Room: ${foundItem.roomNo}\nDate Found: ${foundItem.date}\n\nPlease visit the founder's desk to collect your item.\n\nBest regards,\nLost and Found Team`
        };

        const response = await axios.post(
          `${API_URL}/send-email`,
          emailData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.message === 'Email sent successfully') {
          alert('Email sent successfully to ' + lostItem.email);
        } else {
          throw new Error('Unexpected response from server');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
        alert(`Failed to send email: ${errorMessage}`);
      }
    } else {
      alert('No matching found item to send email about');
    }
  };

  const handleNewFoundItemChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setNewFoundItem({ ...newFoundItem, [name]: e.target.files[0] });
    } else {
      setNewFoundItem({ ...newFoundItem, [name]: value });
    }
  };

  const handleNewFoundItemSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newFoundItem) {
      formData.append(key, newFoundItem[key]);
    }

    try {
      const response = await axios.post(`${API_URL}/found`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFoundItems([...foundItems, response.data]);
      alert('New found item added successfully');
      setNewFoundItem({
        itemName: '',
        image: null,
        date: '',
        roomNo: '',
      });
    } catch (error) {
      console.error('Error adding new found item:', error);
      alert('Failed to add new found item');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { password });
      localStorage.setItem('token', response.data.token);
      setAuthenticated(true);
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Incorrect password. Please try again.');
    }
  };

  useEffect(() => {
    if (lostItems.length && foundItems.length) {
      checkMatches();
    }
  }, [lostItems, foundItems]);

  if (!authenticated) {
    return (
      <div className="admin-login">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      {/* Lost Items Table */}
      <h2>Lost Items</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Item Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Room No</th>
            <th>Match</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lostItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.rollNo}</td>
              <td>{item.email}</td>
              <td>{item.phoneNo}</td>
              <td>{item.itemName}</td>
              <td>{item.description}</td>
              <td>{item.date}</td>
              <td>{item.roomNo}</td>
              <td>{matches[item._id] ? 'Match found' : 'No match'}</td>
              <td>
                {matches[item._id] ? (
                  <button className="blue-button" onClick={() => sendEmail(item)}>
                    Send Email
                  </button>
                ) : (
                  'No action needed'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
