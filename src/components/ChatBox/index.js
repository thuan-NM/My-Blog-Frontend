// ChatBox.jsx
import React from 'react';
import ChatComponent from '../ChatComponent';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ChatBox = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useQuery(
        ["users", user],
        () => axios.get(`https://my-blog-server-ua7q.onrender.com/users`).then((response) => response.data),
    );

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

    if (error) {
        return <p>Error fetching posts: {error.message}</p>;
    }

    if (!data || data.length === 0) {
        return <div className="process-comm">
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>;
    }

    if (!user || !user.friendRequests) {
        return <div className="process-comm">
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>;
    }
    return (
        <div className="chatbox-list">
            {data.data.map((datauser) => (
                user && user._id && user._id !== datauser._id && (
                    <ChatComponent datauser={datauser} key={datauser._id} />
                )
            ))}
        </div>
    );
};

export default ChatBox;
