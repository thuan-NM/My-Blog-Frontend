import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import PostItem from "../../components/PostItem";
import UserItem from "../../components/UserItem";
import ChangePassword from "../../components/ChangePassword";
import MyInfo from "../../components/MyInfo";
import Profile from "../../components/Profile";
import OverviewModal from "../../components/OverviewModal";
import Experience from "../../components/Experience";
import { useHashtags } from "../../contexts/HashtagContext";
import { useFriend } from "../../contexts/FriendContext";
import { jwtDecode } from "jwt-decode";
import Suggestions from "../../components/Suggestion";
import { Link } from "react-router-dom";
import Overview from "../../components/Overview";
import Education from "../../components/Education";
import ExperienceModal from "../../components/ExperienceModal";
import ExperienceEdit from "../../components/ExperienceEdit";
import EducationModal from "../../components/EducationModal";
import EducationEdit from "../../components/EducationEdit";
import ManageJob from "../../components/ManageJob";
import { EuroCircleOutlined } from "@ant-design/icons"
import CoverPicture from "../../components/CoverPicture";
import postServices from "../../services/post.services";
import overviewServices from "../../services/overview.services";
import experienceServices from "../../services/experience.services";
import educationServices from "../../services/education.services";
import UserSettings from "../../components/UserSettings";
import AppliedJobs from "../../components/AppliedJobs";

function MyProfile() {
	const { user, updateUser, role } = useAuth();
	const storedToken = localStorage.getItem('token');
	const decodedToken = jwtDecode(storedToken);
	const [activeButton, setActiveButton] = useState("jobs");
	const [posts, setPosts] = useState([]);
	const [overview, setOverview] = useState([]);
	const [experiences, setExperiences] = useState([])
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
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const isAuthor = true;

	const handleButtonClick = (buttonName) => {
		setActiveButton(buttonName);
	};

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const postResponse = await postServices.getJobsWithUser(decodedToken.userId)
				const overviewResponse = await overviewServices.getOverviewWithUserID(decodedToken.userId)
				const experiencesResponse = await experienceServices.getExperiencesWithUserId(decodedToken.userId)
				const educationResponse = await educationServices.getEducationsWithUserId(decodedToken.userId)
				setEducations(educationResponse.data)
				setExperiences(experiencesResponse.data)	
				setOverview(overviewResponse.data)
				setPosts(postResponse.data);
				setIsLoading(false);
			} catch (error) {
			}
		};
		fetchPost();
	}, [posts, user, overview, experiences, educations]);

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

	if (user == null) {
		return <p>No results found1.</p>;
	}
	return (
		<div className={`${(isOverviewModalOpen || isModalPicOpen || isExpModalOpen || isExpEditOpen || isEduModalOpen || isEduEditOpen || isSettingsModalOpen) ? "overlay animate__animated fadeIn" : ""}`}>
			<CoverPicture user={user} isAuthor={isAuthor}/>
			<main>
				<div className="main-section">
					<div className="container">
						<div className="main-section-data">
							<div className="row">
								<div className="col-lg-3">
									<div className="main-left-sidebar">
										<Profile user={user} updateUser={updateUser} isModalPicOpen={isModalPicOpen} setIsModalPicOpen={setIsModalPicOpen} isAuthor={isAuthor}/>
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
													<li data-tab="saved-jobs" className={`${activeButton == "jobs" ? "active animate__animated animate__faster zoomIn" : ""}`}>
														<Link onClick={() => setActiveButton("jobs")}>
															<img src="images/ic4.png" alt="" />
															<span>Công việc</span>
														</Link>
													</li>
													<li data-tab="info-dd" className={`${activeButton == "info" ? "active animate__animated animate__faster zoomIn" : ""}`}>
														<Link onClick={() => setActiveButton("info")}>
															<img src="images/ic2.png" alt="" />
															<span>Thông tin</span>
														</Link>
													</li>
													<li data-tab="portfolio-dd" className={`${activeButton == "portfolio" ? "active animate__animated animate__faster zoomIn" : ""}`}>
														<Link onClick={() => setActiveButton("portfolio")}>
															<img src="images/ic3.png" alt="" />
															<span>Portfolio</span>
														</Link>
													</li>
													<li data-tab="rewivewdata" className={`${activeButton == "rewivewdata" ? "active animate__animated animate__faster zoomIn" : ""}`}>
														<Link onClick={() => setActiveButton("rewivewdata")}>
															<img src="images/review.png" alt="" />
															<span>Đánh giá</span>
														</Link>
													</li>
												</ul>
											</div>
										</div>
										<div className={`product-feed-tab ${activeButton == "info" ? "current" : ""}`}>
											<Overview overview={overview} isOverviewModalOpen={isOverviewModalOpen} setIsOverviewModalOpen={setIsOverviewModalOpen} isAuthor={isAuthor} />
											<OverviewModal user={user} role={role} overview={overview} isOverviewModalOpen={isOverviewModalOpen} setIsOverviewModalOpen={setIsOverviewModalOpen} setOverview={setOverview}/>
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
															<div className="usy-name">
																<h3>Rock William</h3>
																<div className="epi-sec epi2">
																	<ul className="descp review-lt">
																		<li><img src="images/icon8.png" alt="" /><span>Epic Coder</span></li>
																		<li><img src="images/icon9.png" alt="" /><span>India</span></li>
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
																<img src="images/resources/bg-img4.png" alt="" />
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
																<img src="images/resources/bg-img4.png" alt="" />
																<input className="reply" type="text" placeholder="Trả lời" />
																<a className="replybtn" href="#">Gửi</a>

															</div>
														</div>

													</div>
												</div>
											</div>
										</div>
										<div className={`product-feed-tab ${activeButton == "jobs" ? "current animate__animated animate__faster fadeIn" : "animate__animated animate__faster fadeOut"}`} id="saved-jobs">
											<AppliedJobs />
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
									</div>
								</div>
								<div className="col-lg-3">
									<div className="right-sidebar">
										<div className="message-btn">
											{/* <Link to={"/user-account-settings"}><i className="fas fa-cog"></i>Cài đặt</Link> */}
											<button onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}>
												<i className="fas fa-cog"></i>Cài đặt
											</button>
										</div>
										<div className="widget widget-portfolio">
											<div className="wd-heady">
												<h3>Portfolio</h3>
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
				<UserSettings isSettingsModalOpen={isSettingsModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen}/>
			</main>
		</div>
	)
}

export default MyProfile;