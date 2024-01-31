import React from 'react';
import { Dropdown, Space } from 'antd';
import { Link } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';


const PostItem = ({ post, handleHashtags }) => {
  const { handleDelete } = usePost();
  const { user } = useAuth();

  const isAuthor = post.author._id === user._id;

  const items = [
    {
      key: '1',
      label: (
        <Link className="dropdown-item" to={`/posts/${post._id}`}>
          View Post
        </Link>
      ),
    },
    isAuthor && {
      key: '2',
      label: (
        <Link className="dropdown-item" to={`/posts/${post._id}`}>
          Update Post
        </Link>
      ),
    },
    isAuthor && {
      key: '3',
      label: (
          <p onClick={() => handleDelete(post)} className="dropdown-item">Delete Post</p>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="post-item card">
      <div className="d-flex justify-content-end">
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space className="options-toggle">
              ☰
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* Content */}
      <div className="card-body mb-0">
        <p className="card-title fw-bolder mt-0">{post.title}</p>
        <p className="card-text fw-normal mt-1 mb-2">{post.content}</p>
        <p className="card-text fst-italic mb-0">Hashtag: 
          {post.hashtags.map((item) => (
            <button className="mx-1 hashtag-button fst-italic mt-2" onClick={() => handleHashtags(item)} key={item}>
              {"#" + item + ""}
            </button>
          ))}
        </p>
        <p className="card-text fst-italic">@{post.author.userdata.firstName} {post.author.userdata.lastName} đã đăng</p>
      </div>
    </div>
  );
};

export default PostItem;
