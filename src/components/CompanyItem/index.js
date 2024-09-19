
import { Link } from "react-router-dom";

const CompanyItem = ({ company, onAddFriend, onRemoveFriend, isFriend, viewed, isActive }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
      <div className="company_profile_info">
        <div className="company-up-info">
          <div className="company-item-avt">
          <source srcSet={company.profilePictureUrl} type="image/svg+xml" />
          <img src={company.profilePictureUrl} alt="..."/>
          </div>
          {/* <img src={company.profilePictureUrl} alt="" width={100} height={100} className="rounded img-fluid img-thumbnail" /> */}
          <h3>{company.companyname}</h3>
          <h4></h4>
          <ul>
            <li><a href="#" title="" className="follow">Follow</a></li>
            <li><a href="#" title="" className="message-us"><i className="fa fa-envelope"></i></a></li>
          </ul>
        </div>
        <Link to={`/companyprofile/${company._id}`}>Xem trang cá nhân</Link>
      </div>
    </div>
  );
};

export default CompanyItem;
