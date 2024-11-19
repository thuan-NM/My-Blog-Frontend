import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import "animate.css"; // Import animate.css for animations
import ChatComponent from "../ChatComponent";
import { useAuth } from "../../contexts/AuthContext";
import userServices from "../../services/user.services";
import { FaComments, FaTimes, FaSearch } from "react-icons/fa";
import { Spin, Input, Badge, message } from "antd";
import { debounce } from "lodash";

const { Search } = Input;

// Header Component
const Header = ({ onClose,isChatting }) => (
  <div className={`${isChatting ? "" : "opacity-0" } flex items-center justify-between bg-custom-red text-white px-4 py-2 flex-shrink-0 rounded-t-lg`}>
    <h3 className="text-lg font-semibold">Tin nhắn</h3>
    <button onClick={onClose} aria-label="Đóng hộp chat">
      <FaTimes />
    </button>
  </div>
);

// SearchBar Component
const SearchBar = ({ onSearch, loading }) => (
  <div className="px-4 py-2 flex items-center border-b flex-shrink-0">
    <Search
      placeholder="Tìm kiếm người dùng..."
      onSearch={onSearch}
      enterButton={<FaSearch />}
      loading={loading}
      allowClear
      aria-label="Tìm kiếm người dùng"
    />
  </div>
);

// ConversationList Component
const ConversationList = memo(
  ({
    data,
    loading,
    activeConversation,
    setActiveConversation,
    newMessageCounts,
    resetNewMessageCount,
    notifyNewMessage,
    userId,
  }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full p-4">
          <Spin />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          Không có cuộc trò chuyện nào
        </div>
      );
    }

    return data.map((datauser) => (
      <ChatComponent
        datauser={datauser}
        key={datauser._id}
        activeConversation={activeConversation}
        setActiveConversation={(userId) => {
          setActiveConversation(userId);
          resetNewMessageCount(userId);
        }}
        newMessageCounts={newMessageCounts}
        notifyNewMessage={notifyNewMessage}
        userid={userId}
      />
    ));
  }
);

const ChatBox = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessageCounts, setNewMessageCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for search
  const chatBoxRef = useRef(null);

  // Debounced fetch users
  const fetchUsers = useCallback(
    debounce(async (search) => {
      try {
        setLoading(true);
        let response;
        if (search) {
          response = await userServices.getUsersWithSearch(search);
        } else {
          response = await userServices.getUsersList();
        }
        const filteredUsers = response.data.filter((u) => u._id !== user._id);
        setData(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Có lỗi xảy ra khi tải người dùng.");
      } finally {
        setLoading(false);
      }
    }, 500),
    [user]
  );

  useEffect(() => {
    if (user) {
      fetchUsers(searchTerm);
    }
    // Cleanup debounce on unmount
    return () => {
      fetchUsers.cancel();
    };
  }, [user, searchTerm, fetchUsers]);

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const notifyNewMessage = useCallback((userId) => {
    setNewMessageCounts((prev) => ({
      ...prev,
      [userId]: prev[userId] ? prev[userId] + 1 : 1,
    }));
  }, []);

  const resetNewMessageCount = useCallback((userId) => {
    setNewMessageCounts((prev) => ({
      ...prev,
      [userId]: 0,
    }));
  }, []);

  const handleChatToggle = useCallback(
    (e) => {
      e.preventDefault();
      setIsChatting((prev) => !prev);
    },
    [setIsChatting]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsChatting(false);
      }
    };

    if (isChatting) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatting]);

  return (
    <div className="fixed bottom-4 right-4" ref={chatBoxRef}>
      {/* Chat Toggle Button */}
      {!isChatting && (
        <Badge
          count={Object.values(newMessageCounts).filter((count) => count > 0).length}
          size="small"
          offset={[0, 0]}
          showZero={false}
        >
          <button
            className="w-16 h-16 bg-custom-red text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleChatToggle}
            aria-label="Mở hộp chat"
          >
            <FaComments size={24} />
          </button>
        </Badge>
      )}

      {/* Chat Box */}
      <div
        className={`mt-4 w-80 bg-white rounded-lg shadow-lg flex flex-col transition-all duration-300 ${isChatting ? "max-h-96 " : "max-h-0 "
          }`}
      >
        {/* Header */}
        <Header onClose={handleChatToggle} isChatting={isChatting}/>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            data={data}
            loading={loading}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            newMessageCounts={newMessageCounts}
            resetNewMessageCount={resetNewMessageCount}
            notifyNewMessage={notifyNewMessage}
            userId={user._id}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
