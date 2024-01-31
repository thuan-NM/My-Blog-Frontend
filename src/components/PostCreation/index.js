import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { Input,message  } from 'antd';

const PostCreation = ({closeModal}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { TextArea } = Input;

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPost = {
      title: title,
      hashtags: hashtags.split(","), // "vietnam,giaoduc,sachgiaokhoa"
      content: content,
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
      closeModal();
  };

  return (
    <div className="form-container">
      <form>
        <div className="title mb-3">
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-control text-left"
          ></input>
        </div>
        <div className="hashtag mb-3">
          <label htmlFor="hashtag">Hashtags: </label>
          <input
            type="text"
            id="hashtag"
            value={hashtags} //"music,student"
            onChange={(event) => setHashtags(event.target.value)}
            className="form-control text-left"
          ></input>
        </div>
        <div className="content mb-3">
          <label htmlFor="content">Content: </label>
          <TextArea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="form-control text-left mb-5"
            autoSize
          />
        </div>
        <div className=" d-flex justify-content-around">
          <button className="Buy" onClick={handleCreatePost}>Create Post</button>
          <button type="button" className="Cancel" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PostCreation;