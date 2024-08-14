// ChatBox.jsx
import React, { useEffect, useState } from 'react';
import ChatComponent from '../ChatComponent';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import userServices from '../../services/user.services';

const ChatBox = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const { data, isLoading, error } = useQuery(
    //     ["users", user],
    //     () => axios.get(`${process.env.REACT_APP_API_URL}users`).then((response) => response.data),
    // );

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const userResponse = await userServices.getUsersList();
                setData(userResponse.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [data]);

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
            {data.map((datauser) => (
                user && user._id && user._id !== datauser._id && (
                    <ChatComponent datauser={datauser} key={datauser._id} />
                )
            ))}
        </div>
    );
};

export default ChatBox;
