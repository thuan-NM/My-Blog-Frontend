import React, { useEffect, useState } from 'react';
import { message, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import Comment from '../Comment';
import ApplyModal from '../ApplyModal';
import { jwtDecode } from 'jwt-decode';
import { Avatar, Card, Flex } from 'antd';
import reactionServices from '../../services/reaction.services';
import commentServices from '../../services/comment.services';
import jobstatusServices from '../../services/jobstatus.services';

const PostItem = ({ post, handleHashtags }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reactionStats, setReactionStats] = useState({
    totalReactions: 0,
    reactions: {},
  });
  const { user } = useAuth();
  const storedToken = localStorage.getItem('token');
  let decodedToken;
  if (storedToken) {
    decodedToken = jwtDecode(storedToken);
  }

  const handleReaction = async () => {
    try {
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

      } catch (error) {
        console.error('Error fetching reaction stats:', error);
      }
    };

    fetchReactionStats();
  }, [comments, reactionStats]);

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
    <Card
      bordered={false}
      className='post-bar'>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <Link to={`/userprofile/${post.author.userdata._id}`} className="usy-dt">
              <img src={post.author.userdata.profilePictureUrl || `images/userava.jpg`} alt="" width="40"
                height="40" />
              <div className="usy-name">
                <h3>{post.title}</h3>
                <span>{post.author.userdata.companyname}</span>
              </div>
            </Link>
          </div>
          <div className="like-com">
            <button className={`${reactionStats.reactions.some(reaction => reaction.userId === user._id) ? "active" : ""}`} onClick={handleReaction}><i className={`fas fa-heart`}></i></button>
          </div>
        </div>
        <hr className='border-2 border-dark-subtle' />
        <div>
          <ul className="skill-tags">
            {post.skills.map((item) => (
              <li onClick={() => handleHashtags(item)} key={item}>
                <a>{item}</a>
              </li>
            ))}
            <li><a className='worktype'>
              {post.workType}
            </a></li>
          </ul>
        </div>
        <div className='job_description'>
          {paragraphs.map((p) => (
            <p  key={p}>- {p}</p>
          ))}
        </div>
        <hr className='border-2 border-dark-subtle' />
        <div className='d-flex justify-content-between mx-2'>
          <div>
            <li><span className='price'><strong className='priceitem'>${post.price}/</strong>giờ</span></li>
          </div>
          <div className='d-flex align-items-center'>
            <img src="images/clock.png" className='clockitem' width={15} height={15} />
            <span className='ml-3 price'>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostItem;
