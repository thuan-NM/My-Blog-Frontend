import React, { useEffect, useState } from "react";
import { useFriend } from "../../contexts/FriendContext";
import { useSearch } from "../../contexts/SearchContext";;
import { useAuth } from "../../contexts/AuthContext";// Điều chỉnh đường dẫn tới auth-context của bạn
import CompanyItem from "../../components/CompanyItem";
import companyServices from "../../services/company.services";

function Companies() {
  const { handleAcceptFriendRequest, handleRemoveFriend, handleSendFriendRequest } = useFriend();
  const { handleSearchFriend, searchTerm, searchResults, showFriendLists, setSearchTerm, setSearchResults, setShowFriendLists } = useSearch();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [data, setData] = useState([]);
  useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await companyServices.getCompaniesList();
              setData(response.data);
              setIsLoading(false);
          } catch (error) {
              setIsLoading(false);
          }
      };
      fetchUsers();
  }, [data]);

  if (isLoading) {
    return (
      <div className="process-comm">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>)
  }

  if (user == null) {
    return <p>No results found1.</p>;
  }
  return (
    <section className="companies-info">
      <div className="container">
        <div className="company-title">
          <h3>Tất cả Công ty</h3>
        </div>
        <div className="companies-list">
          <div className="row">
            {data.map((curCompany) =>
            // Check if the user is logged in before displaying the information
            (user && user._id && user._id != curCompany._id && (
              <CompanyItem
                key={curCompany._id}
                company={curCompany}
                onAddFriend={() => { handleSendFriendRequest(curCompany) }}
                onRemoveFriend={() => { handleRemoveFriend(curCompany._id) }}
                isFriend={user.friend && user.friend.some((friend) => friend._id === curCompany._id)}
              />
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
export default Companies;