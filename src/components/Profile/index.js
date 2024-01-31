import React, { useState } from 'react';
import { Button, Modal,message } from 'antd';
import axios from 'axios';

const Profile = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const onSubmit = async () => {
    try {
      if (!selectedImage) {
        console.error('Please choose an image');
        return;
      }

      const formData = new FormData();
      formData.append('profilePicture', selectedImage);

      const response = await axios.post(`http://localhost:3001/users/update-picture/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUpdatedPicture(response.data.profilePictureUrl);

      // Reset the selected image
      setSelectedImage(null);
      message.success("Change picture success!");
      // If the server successfully updates the profile picture, you can handle any necessary logic here
      console.log('Profile picture updated successfully.');
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.error('Internal Server Error:', error.response.data);
      // Handle the error appropriately
    } else {
      console.error('Error updating profile picture:', error);
    }}
  };

  const imagePath = process.env.PUBLIC_URL + '/images/userava.jpg';

  return (
    <div className="card p-0 profile-container">
      <div className="card-body">
        <div className="text-left">
          <img
            src={user.profilePictureUrl || imagePath}
            alt="Profile Picture"
            style={{ width: '200px', height: '200px', borderRadius: '50%' }}
          />
          <Button className="btn-modal" onClick={showModal}>
            {<i className="bi bi-camera-fill"></i>}
          </Button>
        </div>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <div className="modal-container">
              <div className="title-modal">Update Picture Here</div>
              <hr></hr>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                className="modal-input"
              />
              <hr></hr>
              <button className="modal-item" onClick={onSubmit}>Upload</button>
            </div>
        </Modal>   
      <hr/>
        <div className="card-text username-container">
          <i className="bi bi-person-circle me-2"></i>
          <p>
            {user.firstName} {user.lastName}
          </p>
        </div>
        <hr />
        {user.dob && (
          <div className="card-text">
            <i className="bi bi-cake2 me-2"></i>
            {user.dob}
          </div>
        )}
        <hr />
        {user.address && (
          <div className="card-text">
            <i className="bi bi-geo-alt me-2"></i>
            {user.address}
          </div>
        )}
        <hr />
        <div className="card-text">
          <i className="bi bi-envelope me-2"></i>
          {user.email}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Profile;
