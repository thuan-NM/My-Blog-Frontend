import React, { useState, useEffect } from 'react';
import { usePost } from '../../contexts/PostContext';
import axios from 'axios';

function PostEditing({post, closeModal } ) {

  const {handleUpdate}=usePost();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleSubmitUpdate();
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${post._id}`);
        setContent(response.data.data.content)
        setTitle(response.data.data.title)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [post]);

  
  const handleSubmitUpdate = async () => {
    await handleUpdate(post, closeModal);
  };
  
  useEffect(() => {
    setIsModalOpen(true);
  }, [post]);
  
  return (
    <div className="post-detail">
      {isLoading ? (
        <h4>Loading ...</h4>
      ) : (
            <div>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-control text-left mb-5"
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-control text-left mb-5"
                />
            </div>
            <div className="form-group">
                <label>Author: </label>
                <p className="form-control text-left mb-5 d-flex justify-content-between">{post.author.userdata.firstName} {post.author.userdata.lastName}<i class="bi bi-ban"></i></p>
            </div>
            <div className="form-group">
                <label>Hashtag: </label>
                <p className="form-control text-left mb-5 d-flex justify-content-between">{post.hashtags ? `#${post.hashtags.join("#")}` : ""}<i class="bi bi-ban"></i></p>
            </div>
            <div className="form-group">
                <label>Created At: </label>
                <p className="form-control text-left mb-5 d-flex justify-content-between">{new Date(post.createdAt).toLocaleString()}<i class="bi bi-ban"></i></p>
            </div>

            <button className="update" onClick={handleSubmitUpdate}>Update</button>
        </div>
      )}
    </div>
  );
}

export default PostEditing;