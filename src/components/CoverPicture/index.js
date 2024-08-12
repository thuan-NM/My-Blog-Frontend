import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { message } from 'antd';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import userServices from '../../services/user.services';

const CoverPicture = ({ user }) => {
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [isModalCoverPicOpen, setIsModalCoverPicOpen] = useState(false);
    const { updateUser } = useAuth();
    const handleCoverImageChange = (info) => {
        if (info.file.status === 'done') {
            setSelectedCoverImage(info.file.originFileObj);
        }
    };

    const onSubmitCoverImage = async () => {
        try {
            if (!selectedCoverImage) {
                console.error('Please choose an image');
                return;
            }
            const token = localStorage.getItem('token')
            const formData = new FormData();
            formData.append('coverPicture', selectedCoverImage);

            const response = await userServices.updateCoverPictureWithId(formData,user._id)
            updateUser()
            // Reset the selected image
            setSelectedCoverImage(null);
            message.success("Change cover picture success!");
            // If the server successfully updates the cover picture, you can handle any necessary logic here
            console.log('Cover picture updated successfully.');
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.error('Internal Server Error:', error.response.data);
            } else {
                message.error("Change cover picture fail! ", error);
                console.error('Error updating cover picture:', error);
            }
        }
        setIsModalCoverPicOpen(!isModalCoverPicOpen);
    };

    return (
        <><section className="cover-sec">
            <img src={user.coverPictureUrl || `images/cover-img.jpg`} alt="" />
            <div className="add-pic-box">
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-lg-12 col-sm-12">
                            <input type="file" />
                            <label htmlFor="file" onClick={() => setIsModalCoverPicOpen(!isModalCoverPicOpen)}>Change Image</label>
                        </div>
                    </div>
                </div>
            </div>
        </section>
            <div className='text-center'>
                <div className={`post-popup job_post ${isModalCoverPicOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
                    <div className="post-project">
                        <h3>Update Cover Picture</h3>
                        <div className="post-project-fields">
                            <Upload
                                action="https://api.cloudinary.com/v1_1/dca8kjdlq/upload"
                                listType="picture-card"
                                onChange={handleCoverImageChange}
                                data={{
                                    upload_preset: "sudykqqg", // Thay đổi thành upload preset của bạn
                                }}
                            >
                                {<UploadOutlined />}
                            </Upload>
                            <button className="submit-but" onClick={onSubmitCoverImage}>Submit<i className="ms-2 bi bi-check-circle-fill"></i></button>
                        </div>
                        <button onClick={() => setIsModalCoverPicOpen(!isModalCoverPicOpen)}><i className="la la-times-circle-o"></i></button>
                    </div>
                </div>
            </div ></>
    );
};

export default CoverPicture;
