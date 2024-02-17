import React, { useEffect, useState } from 'react';
import { Dropdown, Space } from 'antd';
import { Link } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';


const PostItem = ({ post, handleHashtags }) => {
  const { handleDelete } = usePost();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reactionStats, setReactionStats] = useState({
    totalReactions: 0,
    reactionCounts: {},
  });
  const { user } = useAuth();

  const isAuthor = post.author._id === user._id;

  const items = [
    {
      key: '1',
      label: (
        <Link className="dropdown-item" to={`/posts/${post._id}`}>
          View
        </Link>
      ),
    },
    isAuthor && {
      key: '2',
      label: (
        <Link className="dropdown-item" to={`/posts/${post._id}`}>
          Edit
        </Link>
      ),
    },
    isAuthor && {
      key: '3',
      label: (
          <p onClick={() => handleDelete(post)} className="dropdown-item">Delete</p>
      ),
    },
    isAuthor && {
      key: '4',
      label: (
          <p onClick={() => handleDelete(post)} className="dropdown-item">Unsaved</p>
      ),
    },
    isAuthor && {
      key: '5',
      label: (
          <p onClick={() => handleDelete(post)} className="dropdown-item">Hide</p>
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const commentsResponse = await axios.get(`http://localhost:3001/comments/${post._id}`);
        setComments(commentsResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, []);

  useEffect(() => {
    const fetchReactionStats = async () => {
      try {
        const reactionStatsResponse = await axios.get(`http://localhost:3001/reactions/${post._id}`);
        setReactionStats(reactionStatsResponse.data.data);
      } catch (error) {
        console.error('Error fetching reaction stats:', error);
      }
    };

    fetchReactionStats();
  }, [0]);
  return (
    <div className="post-bar">
      <div className="post_topbar">
        <div className="usy-dt">
          <img src={post.author.userdata.profilePictureUrl || `images/userava.jpg`} alt="" width="40"
            height="40" />
          <div className="usy-name">
            <h3>{post.author.userdata.firstName} {post.author.userdata.lastName}</h3>
            <span><img src="images/clock.png" alt="" />{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="ed-opts">
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space className="options-toggle">
              <i className="la la-ellipsis-v"></i>
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <div className="epi-sec">
        <ul className="descp">
          <li><img src="images/icon8.png" alt="" /><span>{post.experience}</span></li>
          <li><img src="images/icon9.png" alt="" /><span>{post.author.userdata.country}</span></li>
        </ul>
        <ul className="bk-links">
          <li><a href="#" title=""><i className="la la-bookmark"></i></a></li>
          <li><a href="#" title=""><i className="la la-envelope"></i></a></li>
        </ul>
      </div>
      <div className="job_descp">
        <h3>{post.title}</h3>
        <ul className="job-dt">
          <li><a href="#" title="">{post.typeOfJob}</a></li>
          <li><span>${post.price} / hr</span></li>
        </ul>
        <p>{post.description}</p>
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
            <button><i className="fas fa-heart"></i>Like</button>
            <span className="ms-1 me-4">{reactionStats.totalReactions}</span>
            <button><i className="fas fa-comment-alt"></i>Comment {comments.totalComments}</button>
        </div>
        <a href="#"><i className="fas fa-eye"></i>Views 50</a>
      </div>
    </div>
  );
};

export default PostItem;
