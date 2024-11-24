import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import userServices from '../../services/user.services';
import companyServices from '../../services/company.services';
import followServices from '../../services/follow.services';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile = ({ user, updateUser, isModalPicOpen, setIsModalPicOpen, isAuthor, role }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [followers, setFollowers] = useState({});
  const [following, setFollowing] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { updateUser: authUpdateUser } = useAuth();

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const followersResponse = await followServices.getFollowers(user._id);
        const followingResponse = await followServices.getFollowing(user._id);
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching followers/following:', error);
      }
    };
    fetchFollow();
  }, [user._id]);

  const handleImageChange = (info) => {
    setFileList([...info.fileList]);
    setSelectedImage(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
  };

  const onSubmit = async () => {
    try {
      if (!selectedImage) {
        message.error('Please choose an image');
        return;
      }

      const formData = new FormData();
      formData.append('profilePicture', selectedImage);

      if (role === "company") {
        await companyServices.updatePictureWithId(formData, user._id);
      } else {
        await userServices.updatePictureWithId(formData, user._id);
      }

      updateUser();
      authUpdateUser();
      setSelectedImage(null);
      setFileList([]);

      message.success({
        content: "Đổi ảnh đại diện thành công",
        style: { marginTop: '8vh' },
        duration: 2,
      });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.error('Internal Server Error:', error.response.data);
      } else {
        message.error("Change picture failed!");
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
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" alt="Preview" />`);
  };

  return (
    <div className="user_profile">
      <div className="user-pro-img">
        <img src={user.profilePictureUrl || `../images/userava.jpg`} alt="Profile" />
        {isAuthor && (
          <div className="add-dp" id="OpenImgUpload">
            <label>
              <i
                className="fas fa-camera"
                onClick={() => setIsModalPicOpen(!isModalPicOpen)}
              ></i>
            </label>
          </div>
        )}
        {isModalPicOpen && (
          <div
            className={`post-popup job_post ${
              isModalPicOpen
                ? 'active animate__animated animate__faster zoomIn'
                : 'animate__animated animate__faster zoomOut'
            }`}
          >
            <div className="post-project">
              <h3>Cập nhật ảnh đại diện</h3>
              <div className="post-project-fields">
                <ImgCrop rotationSlider className="crop">
                  <Upload
                    listType="picture-card"
                    onChange={handleImageChange}
                    onPreview={onPreview}
                    beforeUpload={() => false}
                    fileList={fileList}
                  >
                    {fileList.length >= 1 ? null : <UploadOutlined />}
                  </Upload>
                </ImgCrop>
                <button className="submit-but" onClick={onSubmit}>
                  Tải lên<i className="ms-2 bi bi-check-circle-fill"></i>
                </button>
              </div>
              <button onClick={() => setIsModalPicOpen(!isModalPicOpen)}>
                <i className="la la-times-circle-o"></i>
              </button>
            </div>
          </div>
        )}
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
      {user.companyname && (
        <ul className="social_links">
          {user.socialMediaLinks.websiteUrl && (
            <li>
              <Link
                target="_blank"
                to={`${user.socialMediaLinks.websiteUrl}`}
                title=""
              >
                <i className="la la-globe"></i>
                {user.socialMediaLinks.websiteUrl}
              </Link>
            </li>
          )}
          {user.socialMediaLinks.facebook && (
            <li>
              <Link
                target="_blank"
                to={`${user.socialMediaLinks.facebook}`}
                title=""
              >
                <i className="fab fa-facebook-square"></i>
                {user.socialMediaLinks.facebook}
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Profile;
