import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostEditing from '../../components/EditPost';
import { Button, Modal } from 'antd';
import { usePost } from '../../contexts/PostContext';
import Comment from '../../components/Comment';
import ReactionItem from '../../components/Reaction';
import { useAuth } from '../../contexts/AuthContext';
import "./style.css"

function PostDetail() {
  const imagePath = process.env.PUBLIC_URL + '/images/userava.jpg';
  const navigate=useNavigate();
  const {user} = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {handleDelete}=usePost();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthor,setIsAuthor] = useState(false)
  console.log(user._id)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3001/posts/${postId}`);
        setPost(postResponse.data.data);
        const isAuthor = user._id === postResponse.data.data.author._id;
        setIsAuthor(isAuthor);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId,user]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    // Fetch the updated post data
    const updatedPostData = await axios.get(`http://localhost:3001/posts/${postId}`);
    setPost(updatedPostData.data.data);
  };
  return (
    <div >
      {isLoading ? (
        <h4>Loading ...</h4>
      ) : (
        <div className="post-detail-container">
          <div className="detail-container">
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <img
                  src={post.author.userdata.profilePictureUrl || imagePath}
                  alt="User Avatar"
                  className="rounded-circle m-2"
                  width="60"
                  height="60"
                /> 
                <div>
                  <h3>{post.author.userdata.firstName} {post.author.userdata.lastName}</h3>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div>
                {isAuthor&&(
                  <Button className="buy" onClick={showModal}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="detail-content-container">
              <h3>{post.title}</h3>
              <hr></hr>
              <div>
                <p className="detail-content ms-4" dangerouslySetInnerHTML={{ __html: post.description.replace(/\n/g,'<br>') }}></p>
              </div>
            </div>   
            <Modal className="modal-container" title="Update Form" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
              <PostEditing post={post} closeModal={handleOk}/>
            </Modal>
            <ReactionItem postId={post._id}/>
            <ul className="skill-tags">
                {post.skills.map((item) => (
                    <li onClick={() => handleHashtags(item)} key={item}>
                      <a>{item}</a>
                    </li>
                  ))}
              </ul>
          </div>
          {/* <button onClick={console.log(1)}>Delete</button> */}
          <Comment postId={post._id}/>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
