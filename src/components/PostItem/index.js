import React, { useEffect, useState } from 'react';
import { message, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import Comment from '../Comment';
import ApplyModal from '../ApplyModal';
import { jwtDecode } from 'jwt-decode';
import reactionServices from '../../services/reaction.services';
import commentServices from '../../services/comment.services';
import jobstatusServices from '../../services/jobstatus.services';


const PostItem = ({ post, handleHashtags }) => {
  const { handleDelete } = usePost();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reactionStats, setReactionStats] = useState({
    totalReactions: 0,
    reactions: {},
  });
  const [isCommentFieldOpen, setIsCommentFieldOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const { user } = useAuth();
  const storedToken = localStorage.getItem('token');
  let decodedToken;
  if (storedToken) {
    decodedToken = jwtDecode(storedToken);
  }

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleReaction = async () => {
    try {
      // Call the backend API to handle the reaction
      await reactionServices.postReaction(user._id, post._id)
    } catch (error) {
      console.error('Error handling reaction:', error);
      message.error('Failed');
    }
  };

  useEffect(() => {
    const fetchReactionStats = async () => {
      try {
        const reactionStatsResponse = await reactionServices.getReactionsWithPostId(post._id)
        const commentsResponse = await commentServices.getCommentsWithPostId(post._id)
        setComments(commentsResponse.data);
        setReactionStats(reactionStatsResponse.data);
        setIsLoading(false);
        if (user != null && storedToken != null) {
          const data = {
            postid: post._id,
            userid: decodedToken.userId
          }
          const response = await jobstatusServices.getUsersAppliedJob(data);
          setApplicationStatus(response.data);
        }
        else {
          setApplicationStatus("guest");
        }
      } catch (error) {
        console.error('Error fetching reaction stats:', error);
      }
    };

    fetchReactionStats();
  }, [comments, reactionStats, applicationStatus]);

  if (isLoading || !user) {
    return (
      <div className="process-comm">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>)
  }

  const paragraphs = post.description.split('\n')

  return (
    <div className="post-bar">
      <div className="post_topbar">
        <Link to={`/userprofile/${post.author.userdata._id}`} className="usy-dt">
          <img src={post.author.userdata.profilePictureUrl || `images/userava.jpg`} alt="" width="40"
            height="40" />
          <div className="usy-name">
            <h3>{post.author.userdata.firstName} {post.author.userdata.lastName}</h3>
            <span><img src="images/clock.png" alt="" />{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </Link>
      </div>
      <div className="epi-sec">
        <ul className="descp">
          <li><img src="images/icon8.png" alt="" /><span>{post.experience}</span></li>
          <li><img src="images/icon9.png" alt="" /><span>{post.author.userdata.country}</span></li>
        </ul>
        <ul className="bk-links">
          <li><a href="#" title=""><i className="la la-bookmark"></i></a></li>
          <li><a href="#" title=""><i className="la la-envelope"></i></a></li>
          {
            (user._id !== post.author.userdata._id) && (applicationStatus != "guest") ? (
              <li>
                <Button
                  className="bid_now"
                  onClick={showModal}
                  disabled={applicationStatus && applicationStatus !== 'Denied'}
                >
                  {applicationStatus && applicationStatus !== 'Denied' ? 'Đã nộp' : 'Ứng tuyển'}
                </Button>
              </li>
            ) : <li></li>
          }
        </ul>
      </div>
      <div className="job_descp">
        <h3>{post.title}</h3>
        <ul className="job-dt">
          <li><a href="#" title="">{post.typeOfJob}</a></li>
          <li><span>${post.price} / giờ</span></li>
        </ul>
        {paragraphs.map((p) => (
          <p key={p}>- {p}</p>
        ))}
        {/* <p>{post.description}</p> */}
        <ul className="skill-tags">
          {post.skills.map((item) => (
            <li onClick={() => handleHashtags(item)} key={item}>
              <a>{item}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="job-status-bar">
        <div className="like-com">
          <button className={`${reactionStats.reactions.some(reaction => reaction.userId === user._id) ? "active" : ""}`} onClick={handleReaction}><i className={`fas fa-heart`}></i>Yêu thích</button>
          <span className="ms-1 me-4">{reactionStats.totalReactions}</span>
          <button onClick={() => setIsCommentFieldOpen(!isCommentFieldOpen)}><i className="fas fa-comment-alt"></i>Bình luận {comments.totalComments}</button>
        </div>
        <a href="#"><i className="fas fa-eye"></i>Lượt xem: 50</a>
      </div>
      {isCommentFieldOpen && <Comment postId={post._id} />}
      <>
        <Modal
          title="Thông tin ứng tuyển"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          footer={[]}
        >
          <ApplyModal postId={post._id} onOk={handleOk} />
        </Modal>
      </>

    </div>
  );
};

export default PostItem;
