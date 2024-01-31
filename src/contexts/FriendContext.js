// FriendContext.js
import React, { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; 

const FriendContext = createContext();

export const useFriend = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
    const { user,login } = useAuth();
    const token = localStorage.getItem("token");
    const handleSendFriendRequest = (friend) => {
        axios
        .put(
        `http://localhost:3001/users/${user._id}/send-friend-request`,
        { friend },
        { headers: { Authorization: `Bearer ${token}` } }
        )
    };

    const handleAcceptFriendRequest = (friendRequest, acceptRequest) => {
        // Chấp nhận hoặc từ chối lời mời kết bạn
        axios.put(
        `http://localhost:3001/users/${user._id}/accept-friend-request`,
        { friendRequest, acceptRequest },
        { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
        const updatedUser = response.data.data;// Assume the updated user is returned from the server
        login(updatedUser, token); // Cập nhật thông tin người dùng trong AuthContext
        })
    };

    const handleRemoveFriend = (friendId) => {
        // Chấp nhận hoặc từ chối lời mời kết bạn
        axios.put(
        `http://localhost:3001/users/${user._id}/remove-friend`,
        { friendId},
        { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
        const updatedUser = response.data.data;// Assume the updated user is returned from the server
        login(updatedUser, token); // Cập nhật thông tin người dùng trong AuthContext
        })
    };

    const values = {
        handleAcceptFriendRequest,
        handleRemoveFriend,
        handleSendFriendRequest,
    };

  return (
    <FriendContext.Provider value={values}>
      {children}
    </FriendContext.Provider>
  );
};
