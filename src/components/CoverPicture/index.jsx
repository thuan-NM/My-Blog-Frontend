import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import userServices from '../../services/user.services';
import companyServices from '../../services/company.services';

const CoverPicture = ({ user, isAuthor }) => {
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [isModalCoverPicOpen, setIsModalCoverPicOpen] = useState(false);
    const { updateUser, role } = useAuth();

    const handleCoverImageChange = (info) => {
        setFileList([...info.fileList]);
        setSelectedCoverImage(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
    };

    const onSubmitCoverImage = async () => {
        try {
            if (!selectedCoverImage) {
                message.error('Please choose an image');
                return;
            }
            const formData = new FormData();
            formData.append('coverPicture', selectedCoverImage);

            if (role === "company") {
                await companyServices.updateCoverPictureWithId(formData, user._id);
            } else {
                await userServices.updateCoverPictureWithId(formData, user._id);
            }
            updateUser();
            setSelectedCoverImage(null);
            setFileList([]);
            message.success({
                content: "Cập nhật ảnh bìa thành công",
                style: { marginTop: '8vh' },
                duration: 2,
            });
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.error('Internal Server Error:', error.response.data);
            } else {
                message.error("Change cover picture failed!");
                console.error('Error updating cover picture:', error);
            }
        }
        setIsModalCoverPicOpen(!isModalCoverPicOpen);
    };

    const uploadProps = {
        multiple: false,
        beforeUpload: () => false,
        onChange: handleCoverImageChange,
        fileList: fileList,
        accept: 'image/*',
        listType: 'picture-card',
        showUploadList: true,
    };

    return (
        <>
            <section className="cover-sec">
                <img src={user.coverPictureUrl || `../images/cover-img.jpg`} alt="Cover" />
                {isAuthor && (
                    <div className="add-pic-box">
                        <div className="container">
                            <div className="row no-gutters">
                                <div className="col-lg-12 col-sm-12">
                                    <input type="file" style={{ display: 'none' }} />
                                    <label htmlFor="file" onClick={() => setIsModalCoverPicOpen(!isModalCoverPicOpen)}>Change Image</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {isAuthor && (
                <div className='text-center'>
                    <div className={`post-popup job_post ${isModalCoverPicOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
                        <div className="post-project">
                            <h3>Update Cover Picture</h3>
                            <div className="post-project-fields">
                                <Upload {...uploadProps}>
                                    {fileList.length >= 1 ? null : <UploadOutlined />}
                                </Upload>
                                <button className="submit-but" onClick={onSubmitCoverImage}>Submit<i className="ms-2 bi bi-check-circle-fill"></i></button>
                            </div>
                            <button onClick={() => setIsModalCoverPicOpen(!isModalCoverPicOpen)}><i className="la la-times-circle-o"></i></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoverPicture;
