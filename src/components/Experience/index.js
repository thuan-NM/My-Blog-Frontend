import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd"

const Experience = ({ isAuthor, setIsExpModalOpen, isExpModalOpen, isExpEditOpen, setIsExpEditOpen, setSelectExperience, selectedExperience, experiences }) => {

    const handleSelect = (exp) => {
        setIsExpEditOpen(!isExpEditOpen);
        setSelectExperience(exp);
    }

    const handleDelete = (exp) => {
        setSelectExperience(exp);
        const token = localStorage.getItem("token");
        axios
            .delete(`http://localhost:3001/experiences/${exp._id}`, {
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

    return (
        <div className="user-profile-ov st2 animate__animated animate__fast zoomIn" >
            <h3>
                <Link className="exp-bx-open">Kinh nghiệm</Link>
                {isAuthor && (
                    <Link className="exp-bx-open" onClick={() => setIsExpModalOpen(!isExpModalOpen)}>
                        <button className="edit-info"><i className="bi bi-plus-circle-fill ms-2"></i></button>
                    </Link>)}
            </h3>
            {experiences.map((experience) => (
                <div className="ms-2 animate__animated fadeIn" key={experience._id}>
                    <h4>{experience.subject}
                        {isAuthor && (
                            <>
                                <button className="edit-info" onClick={() => handleSelect(experience)}><i className="bi bi-pencil-fill" ></i></button>
                                <button className="edit-info" onClick={() => handleDelete(experience)}><i className="ms-3 bi bi-trash-fill" ></i></button>
                            </>
                        )}
                    </h4>
                    <p>{experience.description}</p>
                </div>
            ))}
        </div>
    )
}

export default Experience;