import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PostItem from "../../components/PostItem";
import Profile from "../../components/Profile";
import OverviewModal from "../../components/OverviewModal"
import { jwtDecode } from "jwt-decode";
import Suggestions from "../../components/Suggestion";
import { Link } from "react-router-dom";
import Overview from "../../components/Overview";
import CoverPicture from "../../components/CoverPicture";
import postServices from "../../services/post.services";
import overviewServices from "../../services/overview.services";
import companyServices from "../../services/company.services";
import KeySkill from "../../components/KeySkill";
import KeySkillModal from "../../components/KeySkillModal";
import KeySkillServices from "../../services/keyskill.services";
import ManageJobItem from "../../components/ManageJobItem";
import InterviewSchedule from "../../components/InterviewSchedule";
import ManageJob from "../../components/ManageJob";
import CompanySettings from "../../components/CompanySettings";
import ManageInterview from "../../components/ManageInterview";

function MyCompanyProfile() {
  const { user, updateUser, role } = useAuth();
  const storedToken = localStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const [activeButton, setActiveButton] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [overview, setOverview] = useState("");
  const [keyskill, setKeySkill] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isKeySkillModalOpen, setIsKeySkillModalOpen] = useState(false);
  const [isModalPicOpen, setIsModalPicOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isExpEditOpen, setIsExpEditOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [isEduEditOpen, setIsEduEditOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const isAuthor = true;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await postServices.getJobsWithCompany(decodedToken.companyId)
        const overviewResponse = await overviewServices.getOverviewWithCompanyID(decodedToken.companyId)
        const keyskillResponse = await KeySkillServices.getKeySkillsWithCompanyID(decodedToken.companyId)
        setOverview(overviewResponse.data)
        setKeySkill(keyskillResponse.data)
        setPosts(postResponse.data);
        setIsLoading(false);
      } catch (error) { }
    };
    fetchPost();
  }, [posts, user, overview, experiences, educations, keyskill]);

  if (!user || isLoading) {
    return (
      <div className="process-comm">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isOverviewModalOpen ||
        isKeySkillModalOpen ||
        isModalPicOpen ||
        isExpModalOpen ||
        isExpEditOpen ||
        isEduModalOpen ||
        isEduEditOpen ||
        isSettingsModalOpen
        ? "overlay animate__animated fadeIn"
        : ""
        }`}
    >
      <CoverPicture user={user} isAuthor={isAuthor} />
      <main>
        <div className="main-section">
          <div className="container">
            <div className="main-section-data">
              <div className="row">
                <div className="col-lg-3">
                  <div className="main-left-sidebar">
                    <Profile
                      user={user}
                      updateUser={updateUser}
                      isModalPicOpen={isModalPicOpen}
                      setIsModalPicOpen={setIsModalPicOpen}
                      role={role}
                      isAuthor={isAuthor}
                    />
                    <Suggestions />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="main-ws-sec">
                    <div className="user-tab-sec rewivew">
                      <h3>
                        {user.companyname}
                      </h3>
                      <hr></hr>
                      <div className="star-descp">
                        <span>{user.field}</span>
                        <hr></hr>
                      </div>
                      <div className="tab-feed st2 settingjb">
                        <ul>
                          <li
                            data-tab="feed-dd"
                            className={`${activeButton == "feed"
                              ? "active animate__animated animate__faster zoomIn"
                              : "animate__animated animate__faster slideIn"
                              }`}
                          >
                            <Link onClick={() => setActiveButton("feed")}>
                              <img src="images/ic1.png" alt="" />
                              <span>Bảng tin</span>
                            </Link>
                          </li>
                          <li
                            data-tab="info-dd"
                            className={`${activeButton == "info"
                              ? "active animate__animated animate__faster zoomIn"
                              : ""
                              }`}
                          >
                            <Link onClick={() => setActiveButton("info")}>
                              <img src="images/ic2.png" alt="" />
                              <span>Thông tin</span>
                            </Link>
                          </li>
                          <li
                            data-tab="saved-jobs"
                            className={`${activeButton == "jobs"
                              ? "active animate__animated animate__faster zoomIn"
                              : ""
                              }`}
                          >
                            <Link onClick={() => setActiveButton("jobs")}>
                              <img src="images/ic4.png" alt="" />
                              <span>Công việc</span>
                            </Link>
                          </li>
                          <li
                            data-tab="my-bids"
                            className={`${activeButton == "my-bids"
                              ? "active animate__animated animate__faster zoomIn"
                              : ""
                              }`}
                          >
                            <Link onClick={() => setActiveButton("my-bids")}>
                              <img src="images/ic5.png" alt="" />
                              <span>Xếp Lịch</span>
                            </Link>
                          </li>
                          <li
                            data-tab="portfolio-dd"
                            className={`${activeButton == "portfolio"
                              ? "active animate__animated animate__faster zoomIn"
                              : ""
                              }`}
                          >
                            <Link onClick={() => setActiveButton("portfolio")}>
                              <img src="images/ic3.png" alt="" />
                              <span>Portfolio</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="product-feed-tab" id="saved-jobs">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            id="mange-tab"
                            data-toggle="tab"
                            href="#mange"
                            role="tab"
                            aria-controls="home"
                            aria-selected="true"
                          >
                            Manage Jobs
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="saved-tab"
                            data-toggle="tab"
                            href="#saved"
                            role="tab"
                            aria-controls="profile"
                            aria-selected="false"
                          >
                            Saved Jobs
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="contact-tab"
                            data-toggle="tab"
                            href="#applied"
                            role="tab"
                            aria-controls="applied"
                            aria-selected="false"
                          >
                            Applied Jobs
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="cadidates-tab"
                            data-toggle="tab"
                            href="#cadidates"
                            role="tab"
                            aria-controls="contact"
                            aria-selected="false"
                          >
                            Applied candidates
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="mange"
                          role="tabpanel"
                          aria-labelledby="mange-tab"
                        ></div>
                        <div
                          className="tab-pane fade"
                          id="saved"
                          role="tabpanel"
                          aria-labelledby="saved-tab"
                        ></div>
                        <div
                          className="tab-pane fade"
                          id="applied"
                          role="tabpanel"
                          aria-labelledby="applied-tab"
                        ></div>
                        <div
                          className="tab-pane fade"
                          id="cadidates"
                          role="tabpanel"
                          aria-labelledby="cadidates-tab"
                        ></div>
                      </div>
                    </div>
                    <div className={`product-feed-tab ${activeButton == "feed"
                      ? "current animate__animated animate__faster fadeIn"
                      : "animate__animated animate__faster fadeOut"
                      }`}
                      id="feed-dd"
                    >
                      <div className="posts-section">
                        {posts.length !== 0 ? (
                          posts.map(
                            (post) =>
                              post.author.id == decodedToken.companyId && (
                                <PostItem key={post._id} post={post} />
                              )
                          )
                        ) : (
                          <div className="bg-white rounded shadow-md p-6 text-center">
                            <p>Chưa có công việc nào được đăng</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`product-feed-tab ${activeButton == "my-bids"
                      ? "current animate__animated animate__faster fadeIn"
                      : "animate__animated animate__faster fadeOut"
                      }`}
                      id="my-bids"
                    >
                      <ManageInterview />
                    </div>
                    <div className={`product-feed-tab ${activeButton == "info" ? "current" : ""}`} >
                      <Overview
                        overview={overview}
                        isOverviewModalOpen={isOverviewModalOpen}
                        setIsOverviewModalOpen={setIsOverviewModalOpen}
                        isAuthor={isAuthor}
                      />
                      <OverviewModal
                        user={user}
                        role={role}
                        overview={overview}
                        isOverviewModalOpen={isOverviewModalOpen}
                        setIsOverviewModalOpen={setIsOverviewModalOpen}
                        setOverview={setOverview}
                      />
                      <KeySkill
                        keyskill={keyskill}
                        isKeySkillModalOpen={isKeySkillModalOpen}
                        setIsKeySkillModalOpen={setIsKeySkillModalOpen}
                        isAuthor={isAuthor}
                      />
                      <KeySkillModal
                        user={user}
                        role={role}
                        keyskill={keyskill}
                        isKeySkillModalOpen={isKeySkillModalOpen}
                        setIsKeySkillModalOpen={setIsKeySkillModalOpen}
                        setKeySkill={setKeySkill}
                      />
                    </div>
                    <div className={`product-feed-tab ${activeButton == "jobs"
                      ? "current animate__animated animate__faster fadeIn"
                      : "animate__animated animate__faster fadeOut"
                      }`}
                      id="saved-jobs"
                    >
                      <ManageJob />
                    </div>
                    <div className={`product-feed-tab ${activeButton == "portfolio"
                      ? "current animate__animated animate__faster fadeIn"
                      : "animate__animated animate__faster fadeOut"
                      }`}
                      id="portfolio-dd"
                    >
                      <div className="portfolio-gallery-sec">
                        <h3>Portfolio</h3>
                        <div className="portfolio-btn">
                          <a href="#" title="">
                            <i className="fas fa-plus-square"></i> Thêm
                            Portfolio
                          </a>
                        </div>
                        <div className="gallery_pf">
                          <div className="row"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="right-sidebar">
                    <div className="message-btn">
                      <button onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}>
                        <i className="fas fa-cog"></i>Cài đặt
                      </button>
                    </div>
                    <div className="widget widget-portfolio">
                      <div className="wd-heady">
                        <h3>Portfolio</h3>
                      </div>
                      <div className="pf-gallery"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CompanySettings isSettingsModalOpen={isSettingsModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen} />
      </main>
    </div>
  );
}

export default MyCompanyProfile;
