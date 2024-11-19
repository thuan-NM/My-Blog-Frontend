import React, { useState } from "react";
import { message } from "antd";
import CompanyAuthServices from "../../services/companyAuth.services";
import { Link, useNavigate } from "react-router-dom"

const SignUpCompany = () => {
  const [step, setStep] = useState(1); // Quản lý bước hiện tại
  const [formData, setFormData] = useState({
    companyname: "",
    email: "",
    password: "",
    confirmPassword: "",
    field: "",
    phoneNumber: "",
    numberOfEmployees: 0,
    location: {
      country: "",
      address: "",
    },
    socialMediaLinks: {
      websiteUrl: "",
    },
  });
  const navigate = useNavigate()
  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialMediaLinks: {
        ...formData.socialMediaLinks,
        [name]: value,
      },
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await CompanyAuthServices.signUp(formData);
      if (res.isSuccess === 1) {
        message.success(res.message);
        navigate("/auth")
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="sign_in_sec animated fadeIn mt-5">
      <div className="company_signup_tab">
        <ul>
          <li className={step === 1 ? "current" : ""}>
            <button onClick={() => setStep(1)}>Step 1</button>
          </li>
          <li className={step === 2 ? "current" : ""}>
            <button onClick={() => setStep(2)}>Step 2</button>
          </li>
          <li className={step === 3 ? "current" : ""}>
            <button onClick={() => setStep(3)}>Step 3</button>
          </li>
        </ul>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="dff-tab current">
          <h3>Step 1: Basic Information</h3>
          <form className="row">
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="companyname"
                  value={formData.companyname}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                />
                <i className="la la-building"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
                <i className="fa fa-envelope"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
                <i className="la la-lock"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                />
                <i className="la la-lock"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <button className="px-2" onClick={handleNextStep}>Tiếp tục</button>
              <Link to={"/auth"}>
                <button className="px-2 ml-5">Về trang đăng nhập</button>
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Contact Information */}
      {step === 2 && (
        <div className="dff-tab current">
          <h3>Step 2: Company Details</h3>
          <form className="row">
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
                <i className="la la-phone"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="country"
                  value={formData.location.country}
                  onChange={handleLocationChange}
                  placeholder="Country"
                />
                <i className="la la-globe"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  placeholder="Address"
                />
                <i className="la la-map-marker"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field hidden">
                <input disabled
                />
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <button className="px-2" onClick={handlePrevStep}>Trở về</button>
              <button className="px-2 mx-4" onClick={handleNextStep}>Tiếp tục</button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Media and Social Links */}
      {step === 3 && (
        <div className="dff-tab current">
          <h3>Step 3: Media and Social Links</h3>
          <form className="row">
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  placeholder="Field"
                />
                <i className="la la-briefcase"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="number"
                  name="numberOfEmployees"
                  value={formData.numberOfEmployees}
                  onChange={handleInputChange}
                  placeholder="Number of Employees"
                />
                <i className="la la-users"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field">
                <input
                  type="text"
                  name="websiteUrl"
                  value={formData.socialMediaLinks.websiteUrl}
                  onChange={handleSocialMediaChange}
                  placeholder="Website URL"
                />
                <i className="la la-globe"></i>
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <div className="sn-field hidden">
                <input disabled
                />
              </div>
            </div>
            <div className="col-lg-12 no-pdd">
              <button className="px-2"onClick={handlePrevStep}>Trở về</button>
              <button className="px-2 mx-4" onClick={handleSubmit}>Đăng ký</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUpCompany;
