import React from "react";
import ChatComponent from "../ChatComponent";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const ChatBox = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useQuery(
        ["users", user],
        () =>
            axios
                .get(
                    `http://localhost:3001/users`)
                .then((response) => response.data),
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching posts: {error.message}</p>;
    }

    if (data.data.length === 0 || data === null) {
        return <p>No results found.</p>;
    }

    if (user == null || user.friendRequests == null) {
        return <p>No results found1.</p>;
    }
    return (
        <div class="chatbox-list">
            {/* {data.data.map((datauser) =>
            (user && user._id && user._id != datauser._id && ( */}
                <ChatComponent datauser={user}/>
            {/* )))} */}
        </div>
    )
}

export default ChatBox