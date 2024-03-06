import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../../contexts/AuthContext';
import { Input } from 'antd';

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
    return <p>Loading...</p>;
  }
  if (comments.comments.length !== 0) {
    comments.comments.forEach(comment => {
      if (comment.author && comment.author.profilePictureUrl === "") {
        comment.author.profilePictureUrl = imagePath;
      }
    });
  }
  else {
    <h4>ERROR</h4>
  }
  return (
    <div className="comment-section">
      <div className="comment-sec">
        <ul>
          {comments.comments.map((comment) => (
          <li key={comment._id}>
            <div className="comment-list">
              <div className="bg-img">
                <img src={comment.author.profilePictureUrl} alt="" />
              </div>
              <div className="comment">
                <h3>{comment.author.firstName} {comment.author.lastName}</h3>
                <span><img src="images/clock.png" alt=""></img> {comment.createdAt}</span>
                <p>{comment.content}</p>
                <a href="#" title=""><i className="fa fa-reply-all"></i>Reply</a>
              </div>
            </div>
          </li>
          ))}
        </ul>
      </div>
      <a href="#" className="plus-ic">
        <i className="la la-plus"></i>
      </a>
      <div className="post-comment">
        <div className="cm_img">
          <img src={`${user.profilePictureUrl}`} alt="" />
        </div>
        <div className="comment_box">
          <form>
            <input type="text" placeholder="Post a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}>
            </input>
            <button className="edit-info" onClick={handleCommentSubmit}>Send</button>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Comment;
