import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import { Upload, message } from 'antd';

const PostCreation = ({ isJobModalOpen, handleShowJobModal, isProjectModalOpen, handleShowProjectModal }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState(""); 
  const [typeOfJob, setTypeOfJob] = useState("");
  const [experience, setExperience] = useState("");
  const [price, setPrice] = useState(0);
  const [workType, setWorkType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalFileOpen, setIsModalFileOpen] = useState(false);
  const { user } = useAuth();

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPost = {
      title: title,
      skills: skills.split(","), // "vietnam,giaoduc,sachgiaokhoa"
      description: description,
      price: price,
      typeOfJob: typeOfJob,
      experience: experience,
      workType: workType,
      // lay user -> author
      user: user,
    };
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:3001/posts", newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        message.success("Create a new post successful");
        if (res.status === 401) {
          // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
          navigate("/auth");
        }
        setTitle("");
        setHashtags("");
        setContent("");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
          navigate("/auth");
        }
      });
    if (isJobModalOpen == true) handleShowJobModal(e);
    else handleShowProjectModal(e)
  };
const handleFile = (info) => {
    if (info.file.status === 'done') {
      setSelectedFile(info.file.originFileObj);
    }
  };

  return (
    <div className={`post-popup job_post ${isJobModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
      <div className="post-project">
        <h3>Đăng công việc</h3>
        <div className="post-project-fields">
          <form>
            <div className="row">
              <div className="col-lg-12">
                <input type="text" id="title" placeholder="Tên công việc" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="col-lg-6">
                <div className="inp-field">
                  <select onChange={(e) => setExperience(e.target.value)} value={experience}>
                    <option>Fresher Developer</option>
                    <option>Junior Developer</option>
                    <option>Middle Developer</option>
                    <option>Senior Developer</option>
                    <option>Team Leader</option>
                    <option>Tester</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="inp-field">
                  <select onChange={(e) => setWorkType(e.target.value)} value={workType}>
                    <option>Onsite</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12">
                <input type="text" id="skills" placeholder="Kỹ năng" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div className="col-lg-6">
                <div className="price-br">
                  <input type="text" id="price" placeholder="Lương" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <i className="la la-dollar"></i>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="inp-field">
                  <select onChange={(e) => setTypeOfJob(e.target.value)} value={typeOfJob}>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Hourly</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12">
                <textarea id="description" placeholder="Mô tả công việc" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="col-lg-12 attach-file">
                <Upload
                    action="https://api.cloudinary.com/v1_1/dca8kjdlq/upload"
                    onChange={handleFile}
                    data={{
                      upload_preset: "sudykqqg", // Thay đổi thành upload preset của bạn
                    }}
                  >
                    {<UploadOutlined />}
                  </Upload>
              </div>
              <div className="col-lg-12">
                <ul>
                  <li><button className="active" onClick={handleCreatePost}>Đăng tải</button></li>
                  <li><button onClick={handleShowJobModal}>Hủy bỏ</button></li>
                </ul>
              </div>
              
            </div>
          </form>
        </div>
        <button onClick={handleShowJobModal}><i className="la la-times-circle-o"></i></button>
      </div>
    </div>
  );
};

export default PostCreation;