
import { Link } from "react-router-dom";

const CompanyItem = ({ company, onAddFriend, onRemoveFriend, isFriend, viewed, isActive }) => {
  return (
    <div class="col-lg-3 col-md-4 col-sm-6 col-12">
      <div class="company_profile_info">
        <div class="company-up-info">
          <img src="images/favicon.png" alt="" />
          <h3>{company.companyname}</h3>
          <h4></h4>
          <ul>
            <li><a href="#" title="" class="follow">Follow</a></li>
            <li><a href="#" title="" class="message-us"><i class="fa fa-envelope"></i></a></li>
          </ul>
        </div>
        <a href="user-profile.html" title="" class="view-more-pro">View Profile</a>
      </div>
    </div>
  );
};

export default CompanyItem;
