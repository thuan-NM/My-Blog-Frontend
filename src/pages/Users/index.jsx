import React, { useEffect, useState } from "react";
import axios from "axios";
import UserItem from "../../components/UserItem";
import SearchBar from "../../components/SearchBar";
import { useQuery, useQueryClient } from "react-query";
import Pagination from "../../components/Pagination";
import { useFriend } from "../../contexts/FriendContext";
import { useSearch } from "../../contexts/SearchContext";;
import { useAuth } from "../../contexts/AuthContext";// Điều chỉnh đường dẫn tới auth-context của bạn
import userServices from "../../services/user.services";

function Users() {
  const { handleAcceptFriendRequest, handleRemoveFriend, handleSendFriendRequest } = useFriend();
  const { handleSearchFriend, searchTerm, searchResults, showFriendLists, setSearchTerm, setSearchResults, setShowFriendLists } = useSearch();
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    return <div className="process-comm">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  }

  if (user == null) {
    return <p>No results found1.</p>;
  }
  const searchTermInfo = searchTerm;
  return (

    <section className="companies-info">
      <div className="container">
        <div className="company-title">
          <h3>Tất cả người dùng</h3>
        </div>
        <div className="companies-list">
          <div className="row">
            {data.map((curUser) =>
            // Check if the user is logged in before displaying the information
            (user && user._id && user._id != curUser._id && (
              <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={curUser._id}>
                <UserItem
                  userdata={curUser}
                />
              </div>
            ))
            )}
          </div>
        </div>
        <div className="process-comm">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Users;