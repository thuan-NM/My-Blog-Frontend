import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../../contexts/AuthContext';
import { Input } from 'antd';

const Comment = ({ postId }) => {
  const imagePath = process.env.PUBLIC_URL + '/images/userava.jpg';
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

  const handleCommentSubmit = async () => {
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
  if (comments.length !== 0) {
    comments.forEach(comment => {
      if (comment.author && comment.author.profilePictureUrl === "") {
        comment.author.profilePictureUrl = imagePath;
      }
    });
  }
  return (
    <>
      {isLoading ? (
        <h4>Loading ...</h4>
      ) : (
        <div className="comment-container">
          <div className="d-flex input-container">
            <img
              src={user.profilePictureUrl || imagePath}
              alt="User Avatar"
              className="rounded-circle m-2"
              width="30"
              height="30"
            />
            <TextArea
              className="input-header"
              rows="1"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            //   onKeyPress={handleKeyPress}
              autoSize
            />
            <button className="button-header" onClick={handleCommentSubmit}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
          <div>
            {comments.map((comment) => (
              <div className="comment-item" key={comment._id}>
                <div className="d-flex">
                  <img
                    src={comment.author.profilePictureUrl || imagePath}
                    alt="User Avatar"
                    className="rounded-circle me-3 ms-2"
                    width="30"
                    height="30"
                  />
                  <div>
                    <div className="comment-content">
                      <p className="mt-1">{comment.author.firstName} {comment.author.lastName}:</p>
                      <p className="mt-1 ms-3">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    <hr></hr>
                    <p className="mt-3" dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br>') }}></p> 
                  </div>
                </div>
              </div>
            ))}
            <hr></hr>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
