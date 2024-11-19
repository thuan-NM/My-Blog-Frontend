// ConversationBox.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaSearch,
  FaMinusSquare,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data"; // Import dữ liệu emoji
import messageServices from "../../services/message.services";
import { Button, Tooltip, Dropdown, Input, message as AntdMessage } from "antd";
import Highlighter from "react-highlight-words"; // Import Highlighter

const { Search } = Input;

const ConversationBox = ({
  datauser,
  isChatting,
  setIsChatting,
  notifyNewMessage,
}) => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const [message, setMessage] = useState(""); // Tin nhắn hiện tại
  const [receivedMessages, setReceivedMessages] = useState([]); // Danh sách tin nhắn nhận được
  const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối Socket.IO
  const [isTyping, setIsTyping] = useState(false); // Trạng thái đang viết tin nhắn
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Hiển thị bộ chọn emoji
  const socketRef = useRef(null); // Socket.IO instance
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null); // Tham chiếu đến cuối tin nhắn để cuộn xuống
  const typingTimeoutRef = useRef(null); // Tham chiếu để quản lý timeout khi người dùng ngừng viết tin nhắn
  const emojiPickerRef = useRef(null); // Tham chiếu cho bộ chọn emoji
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // Chỉ số kết quả hiện tại

  // Ref riêng cho container tin nhắn
  const messagesContainerRef = useRef(null);

  // Refs để cuộn đến các kết quả tìm kiếm
  const matchRefs = useRef([]);

  useEffect(() => {
    console.log("ConversationBox mounted or dependencies changed");
    const roomId = [user._id, datauser._id].sort().join("_"); // Tạo room ID duy nhất cho cuộc trò chuyện
    console.log("Room ID:", roomId);

    socketRef.current = io("http://localhost:3001", {
      query: { userId: user._id },
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
      socket.emit("join_room", { room: roomId }); // Tham gia vào room
    });

    socket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setReceivedMessages((prevMessages) => {
        // Kiểm tra nếu tin nhắn đã tồn tại dựa trên _id
        const exists = prevMessages.some((msg) => msg._id === data._id);
        if (!exists) {
          console.log("Adding new message:", data);
          return [...prevMessages, data];
        }
        console.log("Message already exists:", data._id);
        return prevMessages;
      });
      if (!isChatting) {
        notifyNewMessage(datauser._id); // Gọi hàm thông báo tin nhắn mới
      }
    });

    socket.on("typing", (data) => {
      console.log("Typing event:", data);
      if (data.userId !== user._id) {
        setIsTyping(true);
        // Đặt lại trạng thái typing sau 3 giây nếu không có sự kiện typing mới
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    // Lấy tất cả tin nhắn từ cơ sở dữ liệu khi mở cuộc trò chuyện
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages from backend");
        const response = await messageServices.getMessage(roomId)

        console.log("Messages fetched:", response.data);
        setReceivedMessages(response.data);
        setIsLoading(false);
        scrollToBottom();
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching messages:", error);
        AntdMessage.error("Không thể tải tin nhắn.");
      }
    };

    fetchMessages();

    // Cleanup function
    return () => {
      console.log("ConversationBox unmounted");
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [datauser._id, user._id, isChatting, notifyNewMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [receivedMessages]);

  useEffect(() => {
    // Thêm sự kiện lắng nghe click trên toàn bộ tài liệu
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-button") // Kiểm tra nếu click không phải nút emoji
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const scrollToMessage = useCallback((msgId) => {
    const messageElement = document.getElementById(`msg-${msgId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.warn(`Element with id msg-${msgId} not found.`);
    }
  }, []);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (message.trim() === "") return;

      console.log("Sending message:", message);

      const roomId = [user._id, datauser._id].sort().join("_"); // Tạo room ID duy nhất cho cuộc trò chuyện
      console.log("Sending to room:", roomId);

      const messageData = {
        room: roomId,
        sender: user._id,
        text: message,
        timestamp: new Date(),
      };

      socketRef.current.emit("send_message", messageData); // Gửi tin nhắn
      setMessage(""); // Reset tin nhắn sau khi gửi
      socketRef.current.emit("typing_stop", { room: roomId }); // Thông báo ngừng viết tin nhắn
      setShowEmojiPicker(false); // Ẩn bộ chọn emoji sau khi gửi tin
      scrollToBottom();
    },
    [message, user._id, datauser._id, scrollToBottom]
  );

  const handleTyping = useCallback(
    (e) => {
      setMessage(e.target.value);
      const roomId = [user._id, datauser._id].sort().join("_");
      socketRef.current.emit("typing_start", { room: roomId }); // Thông báo bắt đầu viết tin nhắn

      // Đặt lại timeout khi người dùng ngừng viết
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("typing_stop", { room: roomId });
      }, 3000);
    },
    [user._id, datauser._id]
  );

  const addEmoji = useCallback((emoji) => {
    setMessage((prev) => prev + emoji.native);
  }, []);

  const searchInMessages = useCallback(async () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setCurrentMatchIndex(0);
      return;
    }

    try {
      // Sử dụng tìm kiếm trên client để đơn giản hóa
      const matches = receivedMessages.filter((msg) =>
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(matches);
      setCurrentMatchIndex(0);

      if (matches.length > 0) {
        // Cuộn đến kết quả đầu tiên
        setTimeout(() => {
          if (matches[0]._id) {
            scrollToMessage(matches[0]._id);
          }
        }, 100);
      } else {
        AntdMessage.info("Không tìm thấy kết quả nào.");
      }
    } catch (error) {
      console.error("Error searching messages:", error);
      AntdMessage.error("Có lỗi xảy ra khi tìm kiếm.");
    }
  }, [searchTerm, receivedMessages, scrollToMessage]);

  const handleNextMatch = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % searchResults.length;
    setCurrentMatchIndex(nextIndex);
    if (searchResults[nextIndex]._id) {
      scrollToMessage(searchResults[nextIndex]._id);
    }
  }, [searchResults, currentMatchIndex, scrollToMessage]);

  const handlePrevMatch = useCallback(() => {
    if (searchResults.length === 0) return;
    const prevIndex =
      (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentMatchIndex(prevIndex);
    if (searchResults[prevIndex]._id) {
      scrollToMessage(searchResults[prevIndex]._id);
    }
  }, [searchResults, currentMatchIndex, scrollToMessage]);

  // Menu cho Dropdown Search sử dụng dropdownRender
  const menu = (
    <div className="p-4 bg-white shadow-lg rounded-lg w-80">
      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={searchInMessages}
          className="mr-2"
        />
        <Button onClick={searchInMessages}>
          <FaSearch />
        </Button>
      </div>
      {/* Hiển thị thông tin và nút điều hướng nếu có kết quả */}
      {searchResults.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <span>
            {currentMatchIndex + 1} / {searchResults.length} kết quả
          </span>
          <div className="flex space-x-2">
            <Tooltip title="Trước">
              <Button
                onClick={handlePrevMatch}
                disabled={searchResults.length === 0}
                icon={<FaArrowLeft />}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Tiếp theo">
              <Button
                onClick={handleNextMatch}
                disabled={searchResults.length === 0}
                icon={<FaArrowRight />}
                size="small"
              />
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`fixed bottom-0 right-0 w-full sm:w-80 md:w-96 bg-white shadow-lg rounded-t-lg ${isChatting ? "block" : "hidden"
        } transition-all duration-300 ease-in-out z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-custom-red text-white px-4 py-3 rounded-t-lg">
        <div className="flex items-center">
          <img
            src={datauser.profilePictureUrl || `../images/userava.jpg`}
            alt={`${datauser.lastName}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="text-lg font-semibold">{datauser.lastName}</h3>
            <span className="text-sm text-green-300">Online</span>
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          {/* Search Icon */}
          <Tooltip title="Search Messages">
            <Dropdown
              dropdownRender={() => menu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                title="Search"
                className="text-white focus:outline-none"
                aria-label="Tìm kiếm tin nhắn"
              >
                <FaSearch />
              </button>
            </Dropdown>
          </Tooltip>
          {/* Minimize Icon */}
          <Tooltip title="Minimize">
            <button
              title="Minimize"
              onClick={() => setIsChatting(false)}
              className="ml-1 text-white focus:outline-none"
              aria-label="Thu nhỏ hộp chat"
            >
              <FaMinusSquare />
            </button>
          </Tooltip>
          {/* Close Icon */}
          <Tooltip title="Close">
            <button
              title="Close"
              onClick={() => setIsChatting(false)}
              className="ml-1 text-white focus:outline-none"
              aria-label="Đóng hộp chat"
            >
              <FaTimes />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="p-4 h-80 overflow-y-scroll bg-gray-50 "
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          receivedMessages.map((msg) => {
            const isMatch = searchTerm
              ? msg.text.toLowerCase().includes(searchTerm.toLowerCase())
              : false;
            const isCurrentMatch =
              searchResults[currentMatchIndex]?._id === msg._id;

            return (
              <div
                key={msg._id} // Sử dụng msg._id thay vì index
                id={`msg-${msg._id}`} // Đặt id để cuộn đến khi click kết quả tìm kiếm
                className={`mb-4 flex ${msg.sender === user._id ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === user._id
                      ? "bg-gray-200 text-black ml-2"
                      : "bg-gray-200 text-black mr-2"
                    } ${isMatch ? "border-l-4 border-blue-500" : ""}`}
                >
                  <Highlighter
                    highlightClassName="bg-yellow-200"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={msg.text}
                  />
                  <span className="text-xs block text-right mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-800 italic">
              Đang viết...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="border-t p-3 bg-gray-100 relative">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-12 left-4 z-10">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
        <form onSubmit={sendMessage} className="flex items-center">
          <button
            type="button"
            className="text-gray-500 mr-2 emoji-button focus:outline-none"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Thêm biểu tượng cảm xúc"
          >
            <FaSmile />
          </button>
          <button type="button" className="text-gray-500 mr-2" aria-label="Đính kèm tệp">
            <FaPaperclip />
          </button>
          <textarea
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={handleTyping}
            disabled={!isConnected}
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none h-10 focus:outline-none focus:ring-2 focus:ring-custom-red"
            aria-label="Nhập tin nhắn"
          ></textarea>
          <button
            type="submit"
            disabled={!isConnected}
            className="ml-2 text-custom-red hover:text-red-700 focus:outline-none"
            aria-label="Gửi tin nhắn"
          >
            <FaPaperPlane size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationBox;
