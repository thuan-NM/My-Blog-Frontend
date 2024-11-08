import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { message, DatePicker } from "antd";
import userServices from "../../services/user.services";
import authServices from "../../services/auth.services";
import dayjs from "dayjs";

const UserSettings = ({ isSettingsModalOpen, setIsSettingsModalOpen }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("profile"); // Set the initial tab to 'profile'

  // Profile update states
  const [username, setUserName] = useState(user.username);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [country, setCountry] = useState(user.country);
  const [address, setAddress] = useState(user.address);
  const [dob, setDob] = useState(user.dob ? dayjs(user.dob) : null);
  const [loading, setLoading] = useState(false);

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handle updating user information
  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const updatedUser = {
        username,
        firstName,
        lastName,
        country,
        address,
        dob: dob ? dob.toISOString() : null, // Format date to string if it exists
      };

      const response = await userServices.updateUserWithId(updatedUser, user._id);

      if (response.isSuccess) {
        message.success("Thông tin đã được cập nhật thành công!");
        updateUser(response.data); // Update the user in the AuthContext
        setIsSettingsModalOpen(false);
      } else {
        message.error(response.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Đã xảy ra lỗi trong quá trình cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating the password
  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      message.error("Vui lòng nhập cả mật khẩu cũ và mới.");
      return;
    }

    setLoading(true);
    try {
      const response = await authServices.changePassword(user._id, { currentPassword: oldPassword, newPassword });
  
      if (response.isSuccess) {
        message.success("Mật khẩu đã được cập nhật thành công!");
        setIsSettingsModalOpen(false);
      } else {
        message.error(response.message || "Cập nhật mật khẩu thất bại!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`post-popup h-[450px] ${isSettingsModalOpen ? "active animate__animated animate__faster zoomIn" : "animate__animated animate__faster zoomOut"}`}>
      <div className="w-full h-[450px] overflow-hidden">
        <h3 className="w-full bg-[#e44d3a] text-white text-center text-[18px] font-medium py-[20px]">Cập nhật thông tin</h3>

        <button
          onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
          className="absolute top-[-23px] right-[-23px] text-white text-[25px]"
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
            <button title="Thông tin cá nhân">Thông tin cá nhân</button>
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
                <label htmlFor="username">Tên người dùng:</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Tên người dùng"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <label htmlFor="firstName">Tên:</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Tên"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col-lg-6">
                <label htmlFor="lastName">Họ:</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Họ"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
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
                <label htmlFor="address">Địa chỉ:</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="dob">Ngày sinh:</label>
                <DatePicker className="mt-[5px]"
                  value={dob}
                  onChange={(date) => setDob(date)}
                  placeholder="Chọn ngày sinh"
                />
              </div>
              <div className="col-lg-12">
                <ul>
                  <li>
                    <button className="!bg-[#e44d3a] text-white" onClick={handleUpdateUser} disabled={loading}>
                      {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsSettingsModalOpen(false)}>Hủy bỏ</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="post-project-fields">
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
                    <button onClick={() => setIsSettingsModalOpen(false)}>Hủy bỏ</button>
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

export default UserSettings;
