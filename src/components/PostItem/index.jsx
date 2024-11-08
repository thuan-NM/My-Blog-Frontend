import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Card } from 'antd';
import reactionServices from '../../services/reaction.services';
import DOMPurify from 'dompurify';

const PostItem = ({ post, handleHashtags }) => {
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
      await reactionServices.postReaction(user._id, post._id);
    } catch (error) {
      console.error('Error handling reaction:', error);
      message.error('Failed');
    }
  };

  useEffect(() => {
    const fetchReactionStats = async () => {
      try {
        const reactionStatsResponse = await reactionServices.getReactionsWithPostId(post._id);
        setReactionStats(reactionStatsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reaction stats:', error);
      }
    };

    fetchReactionStats();
  }, [reactionStats]);

  // Cuộn lên đầu khi component được render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="process-comm">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    );
  }

  const paragraphs = post.description.split('\n');
  function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Lấy văn bản thuần từ mô tả
  const plainDescription = stripHtml(post.description);

  // Cắt ngắn mô tả nếu cần (ví dụ: 200 ký tự)
  const shortDescription = plainDescription.length > 200
    ? plainDescription.substring(0, 200) + '...'
    : plainDescription;
  return (
    <Card bordered={false} className="post-bar">
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Link to={`/jobdetail/${post._id}`} className="usy-dt" onClick={() => window.scrollTo(0, 0)}>
              <img
                className="!w-14 !h-14 rounded-full object-scale-down	border border-gray-600 p-1"
                src={post.author.userdata.profilePictureUrl || 'images/userava.jpg'}
                alt=""
              />
              <div className="usy-name">
                <h3>{post.title}</h3>
                <span>{post.author.userdata.companyname}</span>
              </div>
            </Link>
          </div>
          <div className="like-com flex flex-col justify-start items-center">
            <button
              className={`${reactionStats.reactions.some((reaction) => reaction.userId === user._id) ? 'active' : ''
                }`}
              onClick={handleReaction}
            >
              <i className="fas fa-heart"></i>
            </button>
            <p>{reactionStats.totalReactions}</p>

          </div>
        </div>
        <hr className="border-2 border-dark-subtle" />
        <div>
          <ul className="skill-tags">
            {post.skills.map((item) => (
              <li key={item}>
                <a>{item}</a>
              </li>
            ))}
            <li>
              <a className="worktype">{post.workType}</a>
            </li>
          </ul>
        </div>
        <div className="job_description mt-2">
          <p className="text-gray-700">
            {shortDescription}
          </p>
        </div>
        <hr className="border-2 border-dark-subtle" />
        <div className="d-flex justify-content-between mx-2">
          <div>
            <li>
              <span className="price">
                <strong className="priceitem">${post.price}/</strong>giờ
              </span>
            </li>
          </div>
          <div className="d-flex align-items-center">
            <img src="images/clock.png" className="clockitem" width={15} height={15} />
            <span className="ml-3 price">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostItem;
