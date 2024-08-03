import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ userId }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    console.log(userId)
  const handleChangePassword = async (e) => {
    try {
        e.preventDefault();
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('New passwords do not match');
        return;
      }

      const response = await axios.put(
        `https://my-blog-server-ua7q.onrender.com/auth/changepassword/${userId}`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response)

      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Failed to change password');
      setSuccessMessage('');
    }
  };

  return (
    <div className="changepassword-container text-center">
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <div>
            <label>Current Password:</label>
            <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            />
        </div>
        <div>
            <label>New Password:</label>
            <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
        </div>
        <div>
            <label>Confirm New Password:</label>
            <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
        </div>
        <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default ChangePassword;
