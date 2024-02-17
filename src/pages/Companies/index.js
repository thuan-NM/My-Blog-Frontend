import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import { useQuery, useQueryClient } from "react-query";
import Pagination from "../../components/Pagination";
import { useFriend } from "../../contexts/FriendContext";
import { useSearch } from "../../contexts/SearchContext";;
import { useAuth } from "../../contexts/AuthContext";// Điều chỉnh đường dẫn tới auth-context của bạn
import CompanyItem from "../../components/CompanyItem";

function Companies() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { handleAcceptFriendRequest, handleRemoveFriend, handleSendFriendRequest } = useFriend();
  const { handleSearchFriend, searchTerm, searchResults, showFriendLists, setSearchTerm, setSearchResults, setShowFriendLists } = useSearch();
  const { user } = useAuth();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const { data, isLoading, error } = useQuery(
    ["companies", currentPage, user],
    () =>
      axios
        .get(
          `http://localhost:3001/companies?page=${currentPage}&pageSize=${pageSize}`
        )
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
  const searchTermInfo = searchTerm;
return (
    <section class="companies-info">
      <div class="container">
        <div class="company-title">
          <h3>All Companies</h3>
        </div>
        <div class="companies-list">
          <div class="row">
          {data.data.map((curCompany) => 
             // Check if the user is logged in before displaying the information
             ( user && user._id && user._id != curCompany._id && (
                 <CompanyItem
                     key={curCompany._id}
                     company={curCompany}
                     onAddFriend={() => {handleSendFriendRequest(curCompany)}}
                     onRemoveFriend={() => {handleRemoveFriend(curCompany._id)}}
                     isFriend={user.friend && user.friend.some((friend) => friend._id === curCompany._id)}
                 />
             ))
           )} 
          </div>
        </div>
        <div class="process-comm">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Companies;