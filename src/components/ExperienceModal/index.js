import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd"
import experienceServices from "../../services/experience.services";

const ExperienceModal = ({ user, isExpModalOpen, setIsExpModalOpen, expId }) => {
    const [subject, setSupject] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleModal = (e) => {
        e.preventDefault();
        setIsExpModalOpen(!isExpModalOpen)
    }

    const handleAdd = async (e) => {
        try {
            e.preventDefault();
            const newExp = {
                subject: subject,
                description: description,
                // lay user -> author
                user: user,
            };
            const res = await experienceServices.postExperience(newExp)
            message.success(res.message);
            if (res.status === 401) {
                navigate('/auth');
            }
            setSupject("");
            setDescription("");
        } catch (error) {
            message.error(error.response.data.message);
            if (error.response && error.response.status === 401) {
                navigate('/auth');
            }
        }
        handleModal(e);
    }

    return (
        <div className={`overview-box ${isExpModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
            <div className="overview-edit">
                <h3>Kinh nghiệm</h3>
                <form>
                    <input type="text" name="subject" placeholder="Chủ đề" onChange={(e) => { setSupject(e.target.value) }} />
                    <textarea onChange={(e) => { setDescription(e.target.value) }}></textarea>
                    <button type="submit" className="save" onClick={handleAdd}>Thêm</button>
                    <button type="submit" className="cancel" onClick={handleModal}>Hủy bỏ</button>
                </form>
                <Link className="close-box" onClick={handleModal}><i className="la la-close" ></i></Link>
            </div>
        </div>
    )
}

export default ExperienceModal;