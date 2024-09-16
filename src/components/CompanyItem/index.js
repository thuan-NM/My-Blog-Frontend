
import { Link } from "react-router-dom";

const CompanyItem = ({ company, onAddFriend, onRemoveFriend, isFriend, viewed, isActive }) => {
  return (
    <div class="col-lg-3 col-md-4 col-sm-6 col-12">
      <div class="company_profile_info">
        <div class="company-up-info">
          <picture >
            <source srcset={company.profilePictureUrl} type="image/svg+xml" />
            <img src={company.profilePictureUrl} class="img-fluid img-thumbnail" alt="..."/>
          </picture>
          {/* <img src={company.profilePictureUrl} alt="" width={100} height={100} className="rounded img-fluid img-thumbnail" /> */}
          <h3>{company.companyname}</h3>
          <h4></h4>
          <ul>
            <li><a href="#" title="" class="follow">Follow</a></li>
            <li><a href="#" title="" class="message-us"><i class="fa fa-envelope"></i></a></li>
          </ul>
        </div>
        <Link to={`/companyprofile/${company._id}`}>Xem trang cá nhân</Link>
      </div>
    </div>
  );
};

export default CompanyItem;
