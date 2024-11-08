import React, { useState } from "react";
import SignUp from "../../components/Signup";
import SignIn from "../../components/Signin";
import Footer from "../../components/Footer";

function Register() {
  const [currentTab, setCurrentTab] = useState("tab-1");
  const handleTabClick = (tab) => {
    setCurrentTab(tab);
  };
  const imagePath = process.env.PUBLIC_URL + '/images';

  return (
    <div className="wrapper">
      <div className="sign-in-page">
        <div className="signin-popup">
          <div className="signin-pop">
            <div className="row">
              <div className="col-lg-6">
                <div className="cmp-info">
                  <div className="cm-logo">
                    <p><strong>"MeowWorking Center"</strong>, is a global freelancing platform and social networking where businesses and independent professionals connect and collaborate remotely</p>
                  </div>
                  <img src={`${imagePath}/cm-main-img.png`} alt="" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="login-sec">
                  <ul className="sign-control mb-4">
                    <li
                      data-tab="tab-1"
                      className={`animated fadeIn ${currentTab === "tab-1" ? "current" : ""}`}
                      onClick={() => handleTabClick("tab-1")}
                    >
                      <button title="">Đăng nhập</button>
                    </li>
                    <li
                      data-tab="tab-2"
                      className={`animated fadeIn ${currentTab === "tab-2" ? "current" : ""}`}
                      onClick={() => handleTabClick("tab-2")}
                    >
                      <button title="">Đăng ký</button>
                    </li>
                  </ul>
                  {currentTab == "tab-1" ? <SignIn /> : <SignUp setCurrentTab={setCurrentTab} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Register;
