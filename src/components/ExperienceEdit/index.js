import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd"

const ExperienceEdit = ({user,isExpEditOpen,setIsExpEditOpen,Exp}) => {
    const [subject,setSupject] = useState("");
    const [description,setDescription] = useState("");

	const handleModal = (e) => {
        e.preventDefault();
        setIsExpEditOpen(!isExpEditOpen)
    }

	const handleEdit = (e) => {
        e.preventDefault();
        const newExp = {
            subject: subject,
			description:description,
            // lay user -> author
            user: user,
        };
        const token = localStorage.getItem("token");
        axios
            .put(`http://localhost:3001/experiences/${Exp._id}`, newExp, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                message.success(res.data.message);
                setSupject("");
				setDescription("");
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
        <div className={`overview-box ${isExpEditOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
			<div className="overview-edit">
				<h3>Kinh nghiệm</h3>
				<form>
					<input type="text" onChange={(e)=>{setSupject(e.target.value)}}/>
					<textarea onChange={(e)=>{setDescription(e.target.value)}}></textarea>
					<button type="submit" className="save" onClick={handleEdit}>Lưu</button> 	
					<button type="submit" className="cancel" onClick={handleModal}>Hủy bỏ</button>
				</form>
				<Link className="close-box"><i className="la la-close" onClick={handleModal}></i></Link>
			</div>
		</div>
    )
}

export default ExperienceEdit;