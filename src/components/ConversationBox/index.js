import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';

const ConversationBox = ({ datauser, isChatting, setIsChatting }) => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const [message, setMessage] = useState(""); // Tin nhắn hiện tại
  const [receivedMessages, setReceivedMessages] = useState([]); // Danh sách tin nhắn nhận được
  const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối Socket.IO
  const socketRef = useRef(null); // Socket.IO instance\
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const roomId = [user._id, datauser._id].sort().join("_"); // Tạo room ID duy nhất cho cuộc trò chuyện

    socketRef.current = io("http://localhost:3001", {
      query: { userId: user._id },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
      socketRef.current.emit("join_room", { room: roomId }); // Tham gia vào room
    });

    socketRef.current.on("receive_message", (data) => {
      console.log("Message received:", data);
      setReceivedMessages((prevMessages) => [...prevMessages, data]); // Cập nhật tin nhắn
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    // Lấy tất cả tin nhắn từ cơ sở dữ liệu khi mở cuộc trò chuyện
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/messages/${roomId}`);
        setReceivedMessages(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [datauser._id, user._id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const roomId = [user._id, datauser._id].sort().join("_"); // Tạo room ID duy nhất cho cuộc trò chuyện

    const messageData = {
      room: roomId,
      sender: user._id,
      text: message,
      timestamp: new Date(),
    };

    socketRef.current.emit("send_message", messageData); // Gửi tin nhắn
    setMessage(""); // Reset tin nhắn sau khi gửi
  };

  return (
    <div
      className={`conversation-box ${isChatting
        ? "active animate__animated animate__faster zoomIn"
        : "animate__animated animate__faster zoomOut"
        }`}
    >
      <div className="con-title mg-3">
        <div className="chat-user-info">
          <img src={datauser.profilePictureUrl || `images/userava.jpg`} alt="" />
          <h3>{datauser.lastName} <span className="status-info"></span></h3>
        </div>
        <div className="st-icons">
          <button title=""><i className="la la-cog"></i></button>
          <button onClick={() => setIsChatting(!isChatting)} className="close-chat"><i className="la la-minus-square"></i></button>
          <button onClick={() => setIsChatting(!isChatting)} className="close-chat"><i className="la la-close"></i></button>
        </div>
      </div>
      <div className="chat-hist">
        {isLoading ? (
          <div className="process-comm">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        ) : (
          receivedMessages.map((msg, index) => (
            <div className={`chat-msg ${msg.sender !== user._id ? "st2" : ""}`} key={index}>
              <p>{msg.text}</p>
              <span>{new Date(msg.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
      <div className="typing-msg">
        <form onSubmit={sendMessage}>
          <textarea
            placeholder="Nhập tin nhắn..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
          ></textarea>
          <button type="submit" disabled={!isConnected}>
            <i className="fa fa-send"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationBox;
