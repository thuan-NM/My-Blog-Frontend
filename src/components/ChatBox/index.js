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
        () => axios.get(`http://localhost:3001/users`).then((response) => response.data),
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching posts: {error.message}</p>;
    }

    if (!data || data.length === 0) {
        return <p>No results found.</p>;
    }

    if (!user || !user.friendRequests) {
        return <p>No results found.</p>;
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
