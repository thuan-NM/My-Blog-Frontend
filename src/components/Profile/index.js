import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { message } from 'antd';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Profile = ({ user, updateUser, isModalPicOpen, setIsModalPicOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const storedToken = localStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
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
        message.error("Change picture fail! ", error);
        console.error('Error updating profile picture:', error);
      }
    }
    setIsModalPicOpen(!isModalPicOpen);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <div className="user_profile">
      <div className="user-pro-img">
        <img src={user.profilePictureUrl || `images/userava.jpg`}/>
        {(user._id==decodedToken.userId)&&(<div className="add-dp" id="OpenImgUpload">
          <label><i className="fas fa-camera" onClick={() => setIsModalPicOpen(!isModalPicOpen)}></i></label>
        </div>)}
        <div className={`post-popup job_post ${isModalPicOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
          <div className="post-project">
            <h3>Update Picture</h3>
            <div className="post-project-fields">
              <ImgCrop rotationSlider className="crop">
                <Upload
                  action="https://api.cloudinary.com/v1_1/dca8kjdlq/upload"
                  listType="picture-card"
                  onChange={handleImageChange}
                  onPreview={onPreview}
                  data={{
                    upload_preset: "sudykqqg",
                  }}
                >
                {<UploadOutlined />}
                </Upload>
              </ImgCrop>
              <button className="submit-but" onClick={onSubmit}>Submit<i className="ms-2 bi bi-check-circle-fill"></i></button>
            </div>
            <button onClick={() => setIsModalPicOpen(!isModalPicOpen)}><i className="la la-times-circle-o"></i></button>
          </div>
        </div>
      </div>
      <div className="user_pro_status">
        <ul className="flw-status">
          <li>
            <span>Đang theo dõi</span>
            <b>34</b>
          </li>
          <li>
            <span>Người theo dõi</span>
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
