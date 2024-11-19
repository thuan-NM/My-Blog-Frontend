import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import postServices from "../../services/post.services";

const PostCreation = ({ isJobModalOpen, handleShowJobModal }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  // const [description, setDescription] = useState("");
  // const [typeOfJob, setTypeOfJob] = useState("Full Time");
  // const [experience, setExperience] = useState("Fresher Developer");
  const [price, setPrice] = useState(0);
  const [workType, setWorkType] = useState("At office");
  const [location, setLocation] = useState("");
  const [createdAt, setCreatedAt] = useState(Date.now);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalFileOpen, setIsModalFileOpen] = useState(false);
  const { user } = useAuth();

  const newPostData = {
    title,
    skills: skills.split(","),  // Convert skills to array
    location,
    price,
    workType,
    user: user,
    createdAt: createdAt,
  };

  // const handleFile = (info) => {
  //   if (info.file.status === 'done') {
  //     setSelectedFile(info.file.originFileObj);
  //   }
  // };

  return (
    <div className={`post-popup job_post ${isJobModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
      <div className="post-project">
        <h3>Đăng công việc</h3>
        <div className="post-project-fields">
            <div className="row">
              <div className="col-lg-12">
                <input type="text" id="title" placeholder="Tên công việc" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="col-lg-6">
                <div className="price-br">
                  <input type="text" id="price" placeholder="Lương" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <i className="la la-dollar"></i>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="inp-field">
                  <select onChange={(e) => setWorkType(e.target.value)} value={workType}>
                    <option>At office</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select> 
                </div>
              </div>
              <div className="col-lg-12">
                <input type="text" id="skills" placeholder="Kỹ năng" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div className="col-lg-12">
                <input type="text" id="location" placeholder="Địa chỉ" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="col-lg-12">
                <ul>
                  <li>
                    <NavLink
                      to={{
                        pathname: "/jobcreation",
                      }}
                      state={{ newPostData }} // Truyền dữ liệu qua state của NavLink
                    >
                      <button className="active">Tiếp tục</button>
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={handleShowJobModal}>Hủy bỏ</button>
                  </li>
                </ul>
              </div>
            </div>
        </div>
        <button onClick={handleShowJobModal}><i className="la la-times-circle-o"></i></button>
      </div>
    </div>
  );
};

export default PostCreation;