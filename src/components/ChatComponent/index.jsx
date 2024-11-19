// ChatComponent.jsx
import React, { useEffect, useState } from "react";
import ConversationBox from "../ConversationBox";
import { FaUserCircle } from "react-icons/fa";
import messageServices from "../../services/message.services";

const ChatComponent = ({ datauser, activeConversation, setActiveConversation, newMessageCounts, userid }) => {
  const [recentMessage, setRecentMessage] = useState(""); // Store recent message text

  useEffect(() => {
    const fetchRecentMessage = async () => {
      const roomId = [userid, datauser._id].sort().join("_"); // Unique room ID
      try {
        const response = await messageServices.getRecentMessage(roomId);
        setRecentMessage(response.data || "No messages yet");
      } catch (error) {
        console.error("Error fetching recent message:", error);
        setRecentMessage("Error loading message");
      }
    };

    fetchRecentMessage();
  }, [datauser._id]);

  const handleChat = (e) => {
    e.preventDefault();
    setActiveConversation(activeConversation === datauser._id ? null : datauser._id);
  };

  return (
    <>
      <div
        className={`flex items-center p-3 !py-2 cursor-pointer hover:bg-gray-200 ${activeConversation === datauser._id ? "bg-gray-200" : ""
          } relative`}
        onClick={handleChat}
      >
        <div className="flex-shrink-0 ">
          {datauser.profilePictureUrl ? (
            <img
              src={datauser.profilePictureUrl}
              alt=""
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <FaUserCircle className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div className="ml-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold">{datauser.lastName}</h3>
            <p className="text-sm text-gray-500 underline ml-1">
              {recentMessage.timestamp ? new Date(recentMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) : ""}</p>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {recentMessage.text || "Không có tin nhắn gần nhất"}
          </p>
        </div>
        {newMessageCounts[datauser._id] > 0 && (
          <span className="absolute top-3 right-3 bg-custom-red text-white rounded-full px-2 py-1 text-xs">
            {newMessageCounts[datauser._id]}
          </span>
        )}
      </div>
      {activeConversation === datauser._id && (
        <ConversationBox
          datauser={datauser}
          isChatting={true}
          setIsChatting={() => setActiveConversation(null)}
          notifyNewMessage={() => { }}
        />
      )}
    </>
  );
};

export default ChatComponent;
