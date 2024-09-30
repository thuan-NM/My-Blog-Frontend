import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { message } from 'antd';
import userServices from '../../services/user.services';
import companyServices from '../../services/company.services';
import followServices from '../../services/follow.services';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile = ({ user, updateUser, isModalPicOpen, setIsModalPicOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [followers, setFollowers] = useState({})
  const [following, setFollowing] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useAuth();
  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const followersResponse = await followServices.getFollowers(user._id);
        const followingResponse = await followServices.getFollowing(user._id);
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchFollow();
  }, [followers, following, user]);


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

      // Determine whether to use userServices or companyServices based on the token
      if (role=="company") {
        const response = await companyServices.updatePictureWithId(formData, user._id);
      } else {
        const response = await userServices.updatePictureWithId(formData, user._id);
      }
      updateUser();
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
        <img src={user.profilePictureUrl || `images/userava.jpg`} />
        {(user._id === user.userId || user._id === user.companyId) && (
          <div className="add-dp" id="OpenImgUpload">
            <label>
              <i className="fas fa-camera" onClick={() => setIsModalPicOpen(!isModalPicOpen)}></i>
            </label>
          </div>
        )}
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
            <b>{following.followingCount}</b>
          </li>
          <li>
            <span>Người theo dõi</span>
            <b>{followers.followersCount}</b>
          </li>
        </ul>
      </div>
      {role === "company" && (
        <ul className="social_links">
          {user.socialMediaLinks.websiteUrl && (
            <li><Link target="_blank" to={`${user.socialMediaLinks.websiteUrl}`} title=""><i className="la la-globe"></i>{user.socialMediaLinks.websiteUrl}</Link></li>
          )}
          {user.socialMediaLinks.facebook && (
            <li><Link target="_blank" to={`${user.socialMediaLinks.facebook}`} title=""><i className="fab fa-facebook-square"></i>{user.socialMediaLinks.facebook}</Link></li>
          )}
        </ul>
      )}

    </div>
  );
};

export default Profile;
