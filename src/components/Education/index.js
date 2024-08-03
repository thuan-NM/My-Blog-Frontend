import { message } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Link } from "react-router-dom";

const Education = ({ isAuthor, isLoading, setIsEduModalOpen, isEduModalOpen, educations, setSelectEducation, selectedEducation, isEduEditOpen, setIsEduEditOpen }) => {

    const handleSelect = (exp) => {
        setIsEduEditOpen(!isEduEditOpen);
        setSelectEducation(exp);
    }

    const handleDelete = (exp) => {
        setSelectEducation(exp);
        const token = localStorage.getItem("token");
        axios
            .delete(`https://my-blog-server-ua7q.onrender.com/educations/${exp._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                message.success(res.data.message);
                if (res.status === 401) {
                    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
                    navigate("/auth");
                }
            })
            .catch((error) => {
                message.error(error.response.data.message);
                if (error.response && error.response.status === 401) {
                    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
                    navigate("/auth");
                }
            });
    }

    if (isLoading) {
        return (
            <div className="process-comm">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>)
    }

    return (
        <div className="user-profile-ov animate__animated zoomIn">
            <h3><Link className="ed-box-open">Học vấn</Link>
                {isAuthor && (
                    <Link><button className="edit-info" onClick={() => { setIsEduModalOpen(!isEduModalOpen) }}><i className="bi bi-plus-circle-fill ms-2"></i></button></Link>)}
            </h3>
            {educations.map((education) => (
                <div>
                    <h4>{education.degree} at {education.school}
                        {isAuthor && (
                            <>
                                <button className="edit-info" onClick={() => handleSelect(education)}><i className="bi bi-pencil-fill" ></i></button>
                                <button className="edit-info" onClick={() => handleDelete(education)}><i className="ms-3 bi bi-trash-fill" ></i></button>
                            </>
                        )}
                    </h4>
                    <span>{education.from} - {education.to}</span>
                    <p>{education.description}</p>
                </div>
            ))}
        </div>
    )
}

export default Education