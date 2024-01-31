// MyInfo.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyInfo = ({ userId }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleKeyPress = (e) => {
    // Kiểm tra xem phím Enter đã được nhấn
    if (e.key === 'Enter') {
      handleUpdate();
    }
  };
  
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${userId}`);
        setUser(response.data.data);
        setEmail(response.data.data.email);
        setFirstName(response.data.data.firstName || "");
        setLastName(response.data.data.lastName || "");
        setAddress(response.data.data.address || "");
        setDOB(response.data.data.dob || "");
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/users/${userId}`,
        {
          email,
          firstName,
          lastName,
          dob,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Failed to update user');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="my-info-container text-center">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      
      <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="form-group">
        <label htmlFor="dob">Date Of Birth</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDOB(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleUpdate} onKeyPress={handleKeyPress}>Update Info</button>
    </div>
  );
};

export default MyInfo;
