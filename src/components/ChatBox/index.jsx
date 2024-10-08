// ChatBox.jsx
import React, { useEffect, useState } from "react";
import ChatComponent from "../ChatComponent";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import userServices from "../../services/user.services";

const ChatBox = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null); // New state to track active conversation
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

  const handleChat = (e) => {
    e.preventDefault();
    setIsChatting(!isChatting);
  };

  if (isLoading) {
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

  if (!user) {
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
  return (
    <div className="chatbox-list">
      <div className="chat-bubble" onClick={handleChat}>
        <img src={`images/chat.png`} alt="" />
      </div>
      <div
        className={`conversations-list ${
          isChatting
            ? "active animate__animated animate__faster zoomIn"
            : "animate__animated animate__faster zoomOut"
        }`}
      >
        <div className="con-title mg-3">
          <div className="conversations-title">
            <h3>Chat with others</h3>
          </div>
          <div className="st-icons">
            <button href="#" title="">
              <i className="la la-cog"></i>
            </button>
            <button onClick={handleChat} className="close-chat">
              <i className="la la-minus-square"></i>
            </button>
            <button onClick={handleChat} className="close-chat">
              <i className="la la-close"></i>
            </button>
          </div>
        </div>
        <div className="conversations-hist">
          {data.map(
            (datauser) =>
              user &&
              user._id &&
              user._id !== datauser._id && (
                <ChatComponent 
                datauser={datauser} 
                key={datauser._id} 
                activeConversation={activeConversation}
                setActiveConversation={setActiveConversation}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
