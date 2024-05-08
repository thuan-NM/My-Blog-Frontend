import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd"

const ExperienceModal = ({user,isExpModalOpen,setIsExpModalOpen,expId}) => {
    const [subject,setSupject] = useState("");
    const [description,setDescription] = useState("");

	const handleModal = (e) => {
        e.preventDefault();
        setIsExpModalOpen(!isExpModalOpen)
    }

	const handleAdd = (e) => {
        e.preventDefault();
        const newExp = {
            subject: subject,
			description:description,
            // lay user -> author
            user: user,
        };
        const token = localStorage.getItem("token");
        axios
            .post("http://localhost:3001/experiences", newExp, {
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
                setSupject("");
				setDescription("");
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
        <div className={`overview-box ${isExpModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
			<div className="overview-edit">
				<h3>Kinh nghiệm</h3>
				<form>
					<input type="text" name="subject" placeholder="Chủ đề" onChange={(e)=>{setSupject(e.target.value)}}/>
					<textarea onChange={(e)=>{setDescription(e.target.value)}}></textarea>
					<button type="submit" className="save" onClick={handleAdd}>Thêm</button> 	
					<button type="submit" className="cancel" onClick={handleModal}>Hủy bỏ</button>
				</form>
				<Link className="close-box"onClick={handleModal}><i className="la la-close" ></i></Link>
			</div>
		</div>
    )
}

export default ExperienceModal;