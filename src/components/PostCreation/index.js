import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {message  } from 'antd';

const PostCreation = ({isJobModalOpen,handleShowJobModal,isProjectModalOpen,handleShowProjectModal}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [typeOfJob,setTypeOfJob] = useState("Full Time");
  const [experience,setExperience] = useState("")
  const [price,setPrice] = useState("");
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
      // lay user -> author
      user: user,
    };
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:3001/posts", newPost ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Create a new post successful");
        if (res.status === 401) {
          // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
          navigate("/auth");
        }
        setTitle("");
        setHashtags("");
        setContent("");
        message.success("Create post successfully");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
          navigate("/auth");
        }
      });
      if(isJobModalOpen==true) handleShowJobModal(e);
      else handleShowProjectModal(e)
  };

  return (
    <div className={`post-popup job_post ${isJobModalOpen?"active animate__animated animate__faster zoomIn":"animate__animated animate__faster zoomOut"}`}>
        <div className="post-project">
          <h3>Post a job</h3>
          <div className="post-project-fields">
            <form>
              <div className="row">
                <div className="col-lg-12">
                  <input type="text" id="title" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
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
                <div className="col-lg-12">
                  <input type="text" id="skills" placeholder="Skills" value={skills} onChange={(e) => setSkills(e.target.value)}/>
                </div>
                <div className="col-lg-6">
                  <div className="price-br">
                    <input type="text" id="price" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    <i className="la la-dollar"></i>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="inp-field">
                    <select onChange={(e) => setTypeOfJob(e.target.value)} value={typeOfJob}>
                      <option>Full Time</option>
                      <option>Part time</option>
                      <option>Hourly</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12">
                  <textarea id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className="col-lg-12">
                  <ul>
                    <li><button className="active" onClick={handleCreatePost}>Post</button></li>
                    <li><button onClick={handleShowJobModal}>Cancel</button></li>
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