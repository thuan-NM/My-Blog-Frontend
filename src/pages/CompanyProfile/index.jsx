import React, { useEffect, useState } from "react";
import PostItem from "../../components/PostItem";
import Profile from "../../components/Profile";
import { jwtDecode } from "jwt-decode";
import Suggestions from "../../components/Suggestion";
import { Link, useParams, useNavigate } from "react-router-dom";
import Overview from "../../components/Overview";
import CoverPicture from "../../components/CoverPicture";
import postServices from "../../services/post.services";
import overviewServices from "../../services/overview.services";
import companyServices from "../../services/company.services";
import KeySkill from "../../components/KeySkill";
import KeySkillServices from "../../services/keyskill.services";

function CompanyProfile() {
  const { id } = useParams();
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
  const [company, setCompany] = useState();
  const isAuthor = decodedToken.companyId === id;
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id == decodedToken.companyId) {
          navigate("/mycompanyprofile")
        }
        const companyResponse = await companyServices.getCompanyWithId(id)
        const postResponse = await postServices.getJobsWithCompany(id)
        const overviewResponse = await overviewServices.getOverviewWithCompanyID(id)
        const keyskillResponse = await KeySkillServices.getKeySkillsWithCompanyID(id)
        setCompany(companyResponse.data)
        setOverview(overviewResponse.data)
        setKeySkill(keyskillResponse.data)
        setPosts(postResponse.data);
        setIsLoading(false);
      } catch (error) { }
    };
    fetchPost();
  }, [posts, company, overview, experiences, educations, keyskill]);

  if (!company || isLoading) {
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
          isEduEditOpen
          ? "overlay animate__animated fadeIn"
          : ""
        }`}
    >
      <CoverPicture user={company} isAuthor={isAuthor} />
      <main>
        <div className="main-section">
          <div className="container">
            <div className="main-section-data">
              <div className="row">
                <div className="col-lg-3">
                  <div className="main-left-sidebar">
                    <Profile
                      user={company}
                      isModalPicOpen={isModalPicOpen}
                      setIsModalPicOpen={setIsModalPicOpen}
                    />
                    <Suggestions />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="main-ws-sec">
                    <div className="user-tab-sec rewivew">
                      <h3>
                        {company.companyname}
                      </h3>
                      <hr></hr>
                      <div className="star-descp">
                        <span>{company.field}</span>
                        <hr></hr>
                      </div>
                      <div className="tab-feed st2 settingjb">
                        <ul>
                          <li data-tab="feed-dd"
                            className={`${activeButton == "feed"
                                ? "active animate__animated animate__faster zoomIn"
                                : "animate__animated animate__faster slideIn"
                              }`}
                          >
                            <Link onClick={() => setActiveButton("feed")}>
                              <img src="../images/ic1.png" alt="" />
                              <span>Bảng tin</span>
                            </Link>
                          </li>
                          <li data-tab="info-dd"
                            className={`${activeButton == "info"
                                ? "active animate__animated animate__faster zoomIn"
                                : ""
                              }`}
                          >
                            <Link onClick={() => setActiveButton("info")}>
                              <img src="../images/ic2.png" alt="" />
                              <span>Thông tin</span>
                            </Link>
                          </li>
                          <li data-tab="portfolio-dd"
                            className={`${activeButton == "portfolio"
                                ? "active animate__animated animate__faster zoomIn"
                                : ""
                              }`}
                          >
                            <Link onClick={() => setActiveButton("portfolio")}>
                              <img src="../images/ic3.png" alt="" />
                              <span>Portfolio</span>
                            </Link>
                          </li>
                          <li data-tab="rewivewdata"
                            className={`${activeButton == "rewivewdata"
                                ? "active animate__animated animate__faster zoomIn"
                                : ""
                              }`}
                          >
                            <Link
                              onClick={() => setActiveButton("rewivewdata")}
                            >
                              <img src="../images/review.png" alt="" />
                              <span>Đánh giá</span>
                            </Link>
                          </li>
                        </ul>
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
                              post.author.id == id && (
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
                    <div className={`product-feed-tab ${activeButton == "info" ? "current" : ""}`} >
                      <Overview
                        overview={overview}
                        isOverviewModalOpen={isOverviewModalOpen}
                        setIsOverviewModalOpen={setIsOverviewModalOpen}
                        isAuthor={isAuthor}
                      />
                      <KeySkill
                        keyskill={keyskill}
                        isKeySkillModalOpen={isKeySkillModalOpen}
                        setIsKeySkillModalOpen={setIsKeySkillModalOpen}
                        isAuthor={isAuthor}
                      />
                    </div>
                    <div className={`product-feed-tab ${activeButton == "rewivewdata"
                      ? "current animate__animated animate__faster fadeIn"
                      : "animate__animated animate__faster fadeOut"
                      }`}
                      id="rewivewdata"
                    >
                      <div className="posts-section">
                        <div className="post-bar reviewtitle">
                          <h2>Đánh giá</h2>
                        </div>
                        <div className="post-bar ">
                          <div className="post_topbar">
                            <div className="usy-dt">
                              <div className="usy-name">
                                <h3>Rock William</h3>
                                <div className="epi-sec epi2">
                                  <ul className="descp review-lt">
                                    <li>
                                      <img src="../images/icon8.png" alt="" />
                                      <span>Epic Coder</span>
                                    </li>
                                    <li>
                                      <img src="../images/icon9.png" alt="" />
                                      <span>India</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="job_descp mngdetl">
                            <div className="star-descp review">
                              <ul>
                                <li>
                                  <i className="fa fa-star"></i>
                                </li>
                                <li>
                                  <i className="fa fa-star"></i>
                                </li>
                                <li>
                                  <i className="fa fa-star"></i>
                                </li>
                                <li>
                                  <i className="fa fa-star"></i>
                                </li>
                                <li>
                                  <i className="fa fa-star-half-o"></i>
                                </li>
                              </ul>
                              <a href="#" title="">
                                5.0 of 5 Reviews
                              </a>
                            </div>
                            <div className="reviewtext">
                              <p>Bạn là nhất, nhất bạn, bạn nhất</p>
                              <hr />
                            </div>

                            <div className="post_topbar post-reply">
                              <div className="usy-dt">
                                <img
                                  src="../images/resources/bg-img4.png"
                                  alt=""
                                />
                                <div className="usy-name">
                                  <h3>John Doe</h3>
                                  <div className="epi-sec epi2">
                                    <p>
                                      <i className="la la-clock-o"></i>3 phút
                                      trước
                                    </p>
                                    <p className="tahnks">Củm ưn :)</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="post_topbar rep-post rep-thanks">
                              <hr />
                              <div className="usy-dt">
                                <img
                                  src="../images/resources/bg-img4.png"
                                  alt=""
                                />
                                <input
                                  className="reply"
                                  type="text"
                                  placeholder="Trả lời"
                                />
                                <a className="replybtn" href="#">
                                  Gửi
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
      </main>
    </div>
  );
}

export default CompanyProfile;
