import React, { useState } from "react";
import Footer from "../../components/Footer";
import SignUpCompany from "../../components/SignUpCompany";

function CompanyAuth() {
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
                  <SignUpCompany></SignUpCompany>
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

export default CompanyAuth;
