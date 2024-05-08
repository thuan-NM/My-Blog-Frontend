import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd"
import { DatePicker, Space } from 'antd';


const EducationModal = ({setIsLoading,user, setIsEduModalOpen, isEduModalOpen}) => {
    const [school,setSchool] = useState("");
    const [from,setFrom] = useState(null);
    const [to,setTo] = useState(null);
    const [degree,setDegree] = useState("");
    const [description,setDescription] =useState("");

	const handleModal = (e) => {
        e.preventDefault();
        setIsEduModalOpen(!isEduModalOpen)
    }

	const handleAdd = (e) => {
        e.preventDefault();
        const newEdu = {
            school: school,
            from:from,
            to:to,
            degree:degree,
			description:description,
            // lay user -> author
            user: user,
        };
        const token = localStorage.getItem("token");
        axios
            .post("http://localhost:3001/educations", newEdu, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                message.success(res.data.message);
                setSchool("");
				setFrom(null);
                setTo(null);
                setDegree("");
				setDescription("");
                setIsLoading(true);
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
        handleModal(e);
    }

    return (
        <div className={`overview-box ${isEduModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
            <div className="overview-edit">
				<h3>Học vấn</h3>
				<form>
					<input type="text" placeholder="School / University" onChange={(e)=>{setSchool(e.target.value)}}/>
					<div className="datepicky">
						<div className="row mb-4">
							<div className="col-lg-6 no-left-pd">
								<div className="datefm">
                                    <DatePicker onChange={(date) => setFrom(date ? date.format('MM/YYYY') : null)} />
								</div>
							</div>
							<div className="col-lg-6 no-righ-pd">
								<div className="datefm">
                                    <DatePicker onChange={(date) => setTo(date ? date.format('MM/YYYY') : null)} />
								</div>
							</div>
						</div>
					</div>
					<input type="text" placeholder="Degree" onChange={(e)=>{setDegree(e.target.value)}}/>
					<textarea placeholder="Description" onChange={(e)=>{setDescription(e.target.value)}}></textarea>
					<button className="save" onClick={handleAdd}>Thêm</button>
					<button className="cancel"onClick={handleModal}>Hủy bỏ</button>
				</form>
				<Link className="close-box" onClick={handleModal}><i className="la la-close"></i></Link>
			</div>
        </div>
    )
}

export default EducationModal;