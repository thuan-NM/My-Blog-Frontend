import React, { useState } from "react";
import { w3cwebsocket as WebSocket } from "websocket";
import { useAuth } from "../../contexts/AuthContext";
import ConversationBox from "../ConversationBox";

const ChatComponent = ({ datauser, activeConversation, setActiveConversation }) => {

  const handleChat = (e) => {
    e.preventDefault();
    if (activeConversation === datauser._id) {
      // Close the chat if clicked again
      setActiveConversation(null);
    } else {
      // Open the chat for the clicked user
      setActiveConversation(datauser._id);
    }
  };

  return (
    <>
      <div className={`conversations-item ${activeConversation === datauser._id ? "conversations-active" : ""}`} onClick={handleChat}>
        <div className="conversations-avatar">
          <img
            src={datauser.profilePictureUrl || '../images/userava.jpg'}
            alt=""
          />
        </div>
        <div className="conversations-info">
          <div className="conversations-name">
            <h3>{datauser.lastName}</h3>
          </div>
          <div className="conversations-recent-message">
            <p>Tin nhắn gần đây</p>
          </div>
        </div>
      </div>
      {activeConversation === datauser._id && ( // Only render if activeConversation matches datauser._id
        <ConversationBox
          datauser={datauser}
          isChatting={true}
          setIsChatting={() => setActiveConversation(null)} // Set chat to close when closed
        />
      )}
    </>
  );
};

export default ChatComponent;