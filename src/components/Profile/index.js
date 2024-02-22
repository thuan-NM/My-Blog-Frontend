import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { message } from 'antd';
import axios from 'axios';

const Profile = ({ user,updateUser,isModalOpen,setIsModalOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      setSelectedImage(info.file.originFileObj);
    }
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
      updateUser()
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
        message.error("Change picture fail! ",error);
        console.error('Error updating profile picture:', error);
      }
    }
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="user_profile">
      <div className="user-pro-img">
        <img src={user.profilePictureUrl || `images/userava.jpg`} />
        <div className="add-dp" id="OpenImgUpload">
          <label><i className="fas fa-camera" onClick={() => setIsModalOpen(!isModalOpen)}></i></label>
        </div>
        <div className={`post-popup job_post ${isModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
          <div className="post-project">
            <h3>Update Picture</h3>
            <div className="post-project-fields">
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}></Button>
              </Upload>
              <button className="submit-but" onClick={onSubmit}>Submit<i className="ms-2 bi bi-check-circle-fill"></i></button>
            </div>
            <button onClick={() => setIsModalOpen(!isModalOpen)}><i className="la la-times-circle-o"></i></button>
          </div>
        </div>
      </div>
      <div className="user_pro_status">
        <ul className="flw-status">
          <li>
            <span>Following</span>
            <b>34</b>
          </li>
          <li>
            <span>Followers</span>
            <b>155</b>
          </li>
        </ul>
      </div>
      <ul className="social_links">
        <li><a href="#" title=""><i className="la la-globe"></i> www.example.com</a></li>
        <li><a href="#" title=""><i className="fab fa-facebook-square"></i> Http://www.facebook.com/john...</a></li>
        <li><a href="#" title=""><i className="fab fa-twitter"></i> Http://www.Twitter.com/john...</a></li>
        <li><a href="#" title=""><i className="fab fa-google-plus-square"></i> Http://www.googleplus.com/john...</a></li>
        <li><a href="#" title=""><i className="fab fa-behance-square"></i> Http://www.behance.com/john...</a></li>
        <li><a href="#" title=""><i className="fab fa-pinterest"></i> Http://www.pinterest.com/john...</a></li>
        <li><a href="#" title=""><i className="fab fa-instagram"></i> Http://www.instagram.com/john...</a></li>
        <li><a href="#" title=""><i className="fab fa-youtube"></i> Http://www.youtube.com/john...</a></li>
      </ul>
    </div>
  );
};

export default Profile;
