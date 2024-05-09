import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../../contexts/AuthContext';
import { Input } from 'antd';
import { Link } from "react-router-dom";

const Comment = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { TextArea } = Input;


  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const commentsResponse = await axios.get(`http://localhost:3001/comments/${postId}`);
        setComments(commentsResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId, comments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/comments', {
        user,
        postId,
        content: newComment,
      });

      // Clear the comment input field
      setNewComment("");
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    }
  };
  if (isLoading) {
    return (
      <div className="process-comm">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>)
  }

  return (
    <div className="comment-section animate__animated animate__fast animate__fadeIn">
      <div className="comment-sec">
        <ul>
          {comments.comments.map((comment) => (
            <li key={comment._id}>
              <div className="comment-list">
                <Link to={`/userprofile/${comment.author._id}`} className="bg-img">
                  <img src={comment.author.profilePictureUrl || `images/userava.jpg`} alt="" width="40"/>
              </Link>
                <div className="comment">
                  <Link to={`/userprofile/${comment.author._id}`}>
                    <h3>{comment.author.firstName} {comment.author.lastName}</h3>
                  </Link>
                  <span><img src="images/clock.png" alt=""></img> {comment.createdAt}</span>
                  <p>{comment.content}</p>
                  <a href="#" title=""><i className="fa fa-reply-all"></i>Trả lời</a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <a className="plus-ic">
        <i className="la la-plus"></i>
      </a>
      <div className="post-comment">
        <div className="cm_img">
          <img src={`${user.profilePictureUrl}`} alt="" />
        </div>
        <div className="comment_box">
          <form>
            <input type="text" placeholder="Nhập bình luận" value={newComment} onChange={(e) => setNewComment(e.target.value)}>
            </input>
            <button className="edit-info" onClick={handleCommentSubmit}>Gửi</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Comment;
