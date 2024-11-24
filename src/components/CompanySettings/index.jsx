import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { message, Input, InputNumber, Button } from "antd";
import companyServices from "../../services/company.services";
import companyAuthService from "../../services/companyAuth.services";

const CompanySettings = ({ isSettingsModalOpen, setIsSettingsModalOpen }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("profile"); // Set the initial tab to 'profile'

  // Company update states
  const [email, setEmail] = useState(user.email || "");
  const [companyname, setCompanyName] = useState(user.companyname || "");
  const [field, setField] = useState(user.field || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [numberOfEmployees, setNumberOfEmployees] = useState(
    user.numberOfEmployees || 0
  );
  // ... other states

  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: user.socialMediaLinks?.facebook || "",
    websiteUrl: user.socialMediaLinks?.websiteUrl || "",
  });
  const [country, setCountry] = useState(user.location?.country || "");
  const [addresses, setAddresses] = useState(
    user.location?.address
      ? user.location.address.map((addr) => addr || "")
      : [""]
  );

  const [loading, setLoading] = useState(false);

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handle updating company information
  const handleUpdateCompany = async () => {
    setLoading(true);
    try {
      const updatedCompany = {
        email,
        companyname,
        field,
        phoneNumber,
        numberOfEmployees,
        socialMediaLinks,
        location: {
          country,
          address: addresses,
        },
      };

      const response = await companyServices.updateCompanyWithId(
        updatedCompany,
        user._id
      );

      if (response.isSuccess) {
        message.success("Thông tin công ty đã được cập nhật thành công!");
        updateUser(response.data); // Update the company in the AuthContext
        setIsSettingsModalOpen(false);
      } else {
        message.error(response.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      message.error("Đã xảy ra lỗi trong quá trình cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      message.error("Vui lòng nhập cả mật khẩu cũ và mới.");
      return;
    }

    setLoading(true);
    try {
      const response = await companyAuthService.changePassword(user._id, {
        currentPassword: oldPassword,
        newPassword,
      });

      if (response.isSuccess) {
        message.success("Mật khẩu đã được cập nhật thành công!");
        setIsSettingsModalOpen(false);
      } else {
        message.error(response.message || "Cập nhật mật khẩu thất bại!");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Cập nhật mật khẩu thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, ""]);
  };

  const handleRemoveAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleAddressChange = (value, index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value || "";
    setAddresses(updatedAddresses);
  };

  return (
    <div
      className={`post-popup h-[450px] ${
        isSettingsModalOpen
          ? "active animate__animated animate__faster zoomIn"
          : "animate__animated animate__faster zoomOut"
      }`}
    >
      <div className="w-full h-[450px] overflow-hidden">
        <h3 className="w-full bg-[#e44d3a] text-white text-center text-[18px] font-medium py-[20px]">
          Cập nhật thông tin
        </h3>
        <button
          onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
          className="absolute top-[-23px] right-[-23px] text-white text-[25px] z-10"
          title="Đóng"
        >
          <i className="la la-times-circle-o"></i>
        </button>
        {/* Tab control */}
        <ul className="sign-control !mb-0 bg-white text-center p-[10px] !rounded-none">
          <li
            data-tab="profile"
            className={`!mr-2 ${currentTab === "profile" ? "current" : ""}`}
            onClick={() => setCurrentTab("profile")}
          >
            <button title="Thông tin công ty">Thông tin công ty</button>
          </li>
          <li
            data-tab="password"
            className={currentTab === "password" ? "current" : ""}
            onClick={() => setCurrentTab("password")}
          >
            <button title="Thay đổi mật khẩu">Thay đổi mật khẩu</button>
          </li>
        </ul>

        {/* Content based on currentTab */}
        {currentTab === "profile" ? (
          <div className="post-project-fields overflow-y-auto h-75">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="companyname">Tên công ty:</label>
                <input
                  type="text"
                  id="companyname"
                  placeholder="Tên công ty"
                  value={companyname}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="field">Lĩnh vực:</label>
                <input
                  type="text"
                  id="field"
                  placeholder="Lĩnh vực"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="phoneNumber">Số điện thoại:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="numberOfEmployees">Số lượng nhân viên:</label>
                <input
                  type="number"
                  id="numberOfEmployees"
                  placeholder="Số lượng nhân viên"
                  min="0"
                  value={numberOfEmployees}
                  onChange={(e) => setNumberOfEmployees(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label>Địa chỉ:</label>
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="address-field flex items-center mb-2"
                  >
                    <input
                      type="text"
                      placeholder={`Địa chỉ ${index + 1}`}
                      value={address}
                      onChange={(e) =>
                        handleAddressChange(e.target.value, index)
                      }
                      className="flex-grow mb-1"
                    />
                    <i
                      className="ms-3 bi bi-trash-fill cursor-pointer text-black"
                      onClick={() => handleRemoveAddress(index)}
                    ></i>
                  </div>
                ))}
                <Button
                  className="bg-[#e44d3a] text-white mb-2 border-none font-medium"
                  type="dashed"
                  onClick={handleAddAddress}
                >
                  Thêm địa chỉ
                </Button>
              </div>
              <div className="col-lg-12">
                <div className="social-link-field">
                  <label htmlFor="facebook">Facebook:</label>
                  <input
                    type="text"
                    id="facebook"
                    placeholder="Facebook URL"
                    value={socialMediaLinks.facebook}
                    onChange={(e) =>
                      setSocialMediaLinks({
                        ...socialMediaLinks,
                        facebook: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="social-link-field">
                  <label htmlFor="websiteUrl">Website:</label>
                  <input
                    type="text"
                    id="websiteUrl"
                    placeholder="Website URL"
                    value={socialMediaLinks.websiteUrl}
                    onChange={(e) =>
                      setSocialMediaLinks({
                        ...socialMediaLinks,
                        websiteUrl: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <label htmlFor="country">Quốc gia:</label>
                <input
                  type="text"
                  id="country"
                  placeholder="Quốc gia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <ul>
                  <li>
                    <button
                      className="!bg-[#e44d3a] text-white"
                      onClick={handleUpdateCompany}
                      disabled={loading}
                    >
                      {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsSettingsModalOpen(false)}>
                      Hủy bỏ
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="post-project-fields overflow-y-auto">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="oldPassword">Mật khẩu cũ:</label>
                <input
                  type="password"
                  id="oldPassword"
                  placeholder="Nhập mật khẩu cũ"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="newPassword">Mật khẩu mới:</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <ul>
                  <li>
                    <button onClick={handleUpdatePassword} disabled={loading}>
                      {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsSettingsModalOpen(false)}>
                      Hủy bỏ
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;
