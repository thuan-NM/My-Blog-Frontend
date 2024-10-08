import { DatePicker, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import educationServices from "../../services/education.services";

const EducationEdit = ({ user, isEduEditOpen, setIsEduEditOpen, selectedEducation }) => {
    const [school, setSchool] = useState("");
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [degree, setDegree] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleModal = (e) => {
        e.preventDefault();
        setIsEduEditOpen(!isEduEditOpen)
    }

    const handleEdit = async (e) => {
        try {
            e.preventDefault();
            const newEdu = {
                school: school,
                from: from,
                to: to,
                degree: degree,
                description: description,
                // lay user -> author
                user: user,
            };
            const res = await educationServices.updateEducationWithId(newEdu, selectedEducation._id)
            message.success({
                content: res.message,
                style: { marginTop: '20vh' }, // Di chuyển vị trí thông báo xuống dưới
              });
            if (res.status === 401) {
                navigate('/auth');
            }
            setDegree("");
            setDescription("");
            setFrom("");
            setSchool(null)
            setTo(null)
        } catch (error) {
            message.error(error.response.data.message);
            if (error.response && error.response.status === 401) {
                navigate('/auth');
            }
        }
        handleModal(e);
    }

    return (
        <div className={`overview-box ${isEduEditOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
            <div className="overview-edit">
                <h3>Học vấn</h3>
                <form>
                    <input type="text" placeholder="School / University" onChange={(e) => { setSchool(e.target.value) }} />
                    <div className="datepicky">
                        <div className="row mb-4">
                            <div className="col-lg-6 no-left-pd">
                                <div className="datefm">
                                    <DatePicker onChange={(date) => setFrom(date)} />
                                </div>
                            </div>
                            <div className="col-lg-6 no-righ-pd">
                                <div className="datefm">
                                    <DatePicker onChange={(date) => setTo(date)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="text" placeholder="Degree" onChange={(e) => { setDegree(e.target.value) }} />
                    <textarea placeholder="Description" onChange={(e) => { setDescription(e.target.value) }}></textarea>
                    <button className="save" onClick={handleEdit}>Lưu</button>
                    <button className="cancel" onClick={handleModal}>Hủy bỏ</button>
                </form>
                <Link className="close-box" onClick={handleModal}><i className="la la-close"></i></Link>
            </div>
        </div>
    )
}

export default EducationEdit;