import React, { useEffect, useState } from "react";
import Profile from "../../components/Profile";
import Experience from "../../components/Experience";
import { jwtDecode } from "jwt-decode";
import Suggestions from "../../components/Suggestion";
import { Link } from "react-router-dom";
import Overview from "../../components/Overview";
import Education from "../../components/Education";
import ExperienceModal from "../../components/ExperienceModal";
import ExperienceEdit from "../../components/ExperienceEdit";
import EducationModal from "../../components/EducationModal";
import EducationEdit from "../../components/EducationEdit";
import { EuroCircleOutlined } from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom";
import overviewServices from "../../services/overview.services";
import experienceServices from "../../services/experience.services";
import educationServices from "../../services/education.services";
import userServices from "../../services/user.services";

function UserProfile() {
  const { id } = useParams();
  const storedToken = localStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const [overview, setOverview] = useState("");
  const [experiences, setExperiences] = useState([])
  const [activeButton, setActiveButton] = useState("info");
  const [educations, setEducations] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isModalPicOpen, setIsModalPicOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isExpEditOpen, setIsExpEditOpen] = useState(false);
  const [selectedExperience, setSelectExperience] = useState();
  const [selectedEducation, setSelectEducation] = useState();
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [isEduEditOpen, setIsEduEditOpen] = useState(false);
  const [user, setUser] = useState();
  const isAuthor = decodedToken.userId === id;
  const navigate = useNavigate();
  if (id == decodedToken.userId) {
    navigate("/myprofile")
  }
  console.log(isAuthor)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userres = await userServices.getUsersWithId(id)
        const overviewResponse = await overviewServices.getOverviewWithUserID(id)
        const experiencesResponse = await experienceServices.getExperiencesWithUserId(id)
        const educationResponse = await educationServices.getEducationsWithUserId(id)
        setEducations(educationResponse.data)
        setExperiences(experiencesResponse.data)
        setOverview(overviewResponse.data)
        setUser(userres.data)
        setIsLoading(false);
      } catch (error) {
      }
    };
    fetchPost();
  }, [user, overview, experiences, educations]);

  if (isLoading) {
    return (
      <div className="process-comm">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>)
  }

  return (
    <div className={`${(isOverviewModalOpen || isModalPicOpen || isExpModalOpen || isExpEditOpen || isEduModalOpen || isEduEditOpen) ? "overlay animate__animated fadeIn" : ""}`}>
      <section className="cover-sec">
        <img src={user.coverPictureUrl || `../images/cover-img.jpg`} alt="" />
      </section>
      <main>
        <div className="main-section">
          <div className="container">
            <div className="main-section-data">
              <div className="row">
                <div className="col-lg-3">
                  <div className="main-left-sidebar">
                    <Profile user={user} isModalPicOpen={isModalPicOpen} setIsModalPicOpen={setIsModalPicOpen} isAuthor={isAuthor}/>
                    <Suggestions />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="main-ws-sec">
                    <div className="user-tab-sec rewivew">
                      <h3>{user.firstName} {user.lastName}</h3>
                      <hr></hr>
                      <div className="star-descp">
                        <span>{user.position[0]||"Freelancer"}</span>
                        <hr></hr>
                      </div>
                      <div className="tab-feed st2 settingjb">
                        <ul>
                          <li data-tab="info-dd" className={`${activeButton == "info" ? "active animate__animated animate__faster zoomIn" : ""}`}>
                            <Link onClick={() => setActiveButton("info")}>
                              <img src="../images/ic2.png" alt="" />
                              <span>Thông tin</span>
                            </Link>
                          </li>
                          <li data-tab="portfolio-dd" className={`${activeButton == "portfolio" ? "active animate__animated animate__faster zoomIn" : ""}`}>
                            <Link onClick={() => setActiveButton("portfolio")}>
                              <img src="../images/ic3.png" alt="" />
                              <span>Portfolio</span>
                            </Link>
                          </li>
                          <li data-tab="rewivewdata" className={`${activeButton == "rewivewdata" ? "active animate__animated animate__faster zoomIn" : ""}`}>
                            <Link onClick={() => setActiveButton("rewivewdata")}>
                              <img src="../images/review.png" alt="" />
                              <span>Đánh giá</span>
                            </Link>
                          </li>
                          <li data-tab="payment-dd" className={`${activeButton == "payment" ? "active animate__animated animate__faster zoomIn" : ""}`}>
                            <Link onClick={() => setActiveButton("payment")}>
                              <img src="../images/ic6.png" alt="" />
                              <span>Thu nhập</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="product-feed-tab" id="saved-jobs">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                          <a className="nav-link active" id="mange-tab" data-toggle="tab" href="#mange" role="tab" aria-controls="home" aria-selected="true">Manage Jobs</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" id="saved-tab" data-toggle="tab" href="#saved" role="tab" aria-controls="profile" aria-selected="false">Saved Jobs</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" id="contact-tab" data-toggle="tab" href="#applied" role="tab" aria-controls="applied" aria-selected="false">Applied Jobs</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" id="cadidates-tab" data-toggle="tab" href="#cadidates" role="tab" aria-controls="contact" aria-selected="false">Applied cadidates</a>
                        </li>
                      </ul>
                      <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="mange" role="tabpanel" aria-labelledby="mange-tab">
                        </div>
                        <div className="tab-pane fade" id="saved" role="tabpanel" aria-labelledby="saved-tab">
                        </div>
                        <div className="tab-pane fade" id="applied" role="tabpanel" aria-labelledby="applied-tab">
                        </div>
                        <div className="tab-pane fade" id="cadidates" role="tabpanel" aria-labelledby="cadidates-tab">
                        </div>
                      </div>
                    </div>
                    <div className={`product-feed-tab ${activeButton == "info" ? "current" : ""}`}>
                      <Overview overview={overview} isOverviewModalOpen={isOverviewModalOpen} setIsOverviewModalOpen={setIsOverviewModalOpen} isAuthor={isAuthor} />
                      <Experience selectedExperience={selectedExperience} setSelectExperience={setSelectExperience} isExpEditOpen={isExpEditOpen} setIsExpEditOpen={setIsExpEditOpen} experiences={experiences} setIsExpModalOpen={setIsExpModalOpen} isExpModalOpen={isExpModalOpen} isAuthor={isAuthor} />
                      <ExperienceModal user={user} setIsExpModalOpen={setIsExpModalOpen} isExpModalOpen={isExpModalOpen} />
                      <ExperienceEdit user={user} isExpEditOpen={isExpEditOpen} setIsExpEditOpen={setIsExpEditOpen} Exp={selectedExperience} />
                      <Education isLoading={isLoading} setSelectEducation={setSelectEducation} selectedEducation={selectedEducation} setIsEduModalOpen={setIsEduModalOpen} isEduModalOpen={isEduModalOpen} educations={educations} isEduEditOpen={isEduEditOpen} setIsEduEditOpen={setIsEduEditOpen} isAuthor={isAuthor} />
                      <EducationModal setIsLoading={setIsLoading} user={user} setIsEduModalOpen={setIsEduModalOpen} isEduModalOpen={isEduModalOpen} />
                      <EducationEdit user={user} isEduEditOpen={isEduEditOpen} setIsEduEditOpen={setIsEduEditOpen} selectedEducation={selectedEducation} />
                    </div>
                    <div className={`product-feed-tab ${activeButton == "rewivewdata" ? "current animate__animated animate__faster fadeIn" : "animate__animated animate__faster fadeOut"}`} id="rewivewdata">
                      <div className="posts-section">
                        <div className="post-bar reviewtitle">
                          <h2>Đánh giá</h2>
                        </div>
                        <div className="post-bar ">
                          <div className="post_topbar">
                            <div className="usy-dt">
                              <img src="../images/resources/bg-img3.png" alt="" />
                              <div className="usy-name">
                                <h3>Rock William</h3>
                                <div className="epi-sec epi2">
                                  <ul className="descp review-lt">
                                    <li><img src="../images/icon8.png" alt="" /><span>Epic Coder</span></li>
                                    <li><img src="../images/icon9.png" alt="" /><span>India</span></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="job_descp mngdetl">
                            <div className="star-descp review">
                              <ul>
                                <li><i className="fa fa-star"></i></li>
                                <li><i className="fa fa-star"></i></li>
                                <li><i className="fa fa-star"></i></li>
                                <li><i className="fa fa-star"></i></li>
                                <li><i className="fa fa-star-half-o"></i></li>
                              </ul>
                              <a href="#" title="">5.0 of 5 Reviews</a>
                            </div>
                            <div className="reviewtext">
                              <p>Bạn là nhất, nhất bạn, bạn nhất</p>
                              <hr />
                            </div>

                            <div className="post_topbar post-reply">
                              <div className="usy-dt">
                                <img src="../images/resources/bg-img4.png" alt="" />
                                <div className="usy-name">
                                  <h3>John Doe</h3>
                                  <div className="epi-sec epi2">
                                    <p><i className="la la-clock-o"></i>3 phút trước</p>
                                    <p className="tahnks">Củm ưn :)</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="post_topbar rep-post rep-thanks">
                              <hr />
                              <div className="usy-dt">
                                <img src="../images/resources/bg-img4.png" alt="" />
                                <input className="reply" type="text" placeholder="Trả lời" />
                                <a className="replybtn" href="#">Gửi</a>

                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`product-feed-tab ${activeButton == "portfolio" ? "current animate__animated animate__faster fadeIn" : "animate__animated animate__faster fadeOut"}`} id="portfolio-dd">
                      <div className="portfolio-gallery-sec">
                        <h3>Portfolio</h3>
                        <div className="portfolio-btn">
                          <a href="#" title=""><i className="fas fa-plus-square"></i> Thêm Portfolio</a>
                        </div>
                        <div className="gallery_pf">
                          <div className="row">
                          </div>
                          {/* list hình portfolio */}
                        </div>
                      </div>
                    </div>
                    <div className={`product-feed-tab ${activeButton == "payment" ? "current animate__animated animate__faster fadeIn" : "animate__animated animate__faster fadeOut"}`} id="payment-dd">
                      <div className="billing-method">
                        <ul>
                          <li>
                            <h3>Phương thức thanh toán</h3>
                            <a href="#" title=""><i className="fa fa-plus-circle"></i></a>
                          </li>
                          <li>
                            <h3>Xem hoạt động</h3>
                            <a href="#" title="">Xem tất cả</a>
                          </li>
                          <li>
                            <h3>Tổng tiền</h3>
                            <span>$0.00</span>
                          </li>
                        </ul>
                        <div className="lt-sec">
                          <img src="../images/lt-icon.png" alt="" />
                          <h4>Các sao kê của bạn</h4>
                          <a title=""><EuroCircleOutlined className="p-0 m-0 me-2" />Bấm vào </a>
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
                        <img src="../images/photo-icon.png" alt="" />
                      </div>
                      <div className="pf-gallery">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserProfile;