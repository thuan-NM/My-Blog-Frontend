import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "react-query";
import PostItem from "../../components/PostItem";
import UserItem from "../../components/UserItem";
import ChangePassword from "../../components/ChangePassword";
import MyInfo from "../../components/MyInfo";
import Profile from "../../components/Profile";
import { useHashtags } from "../../contexts/HashtagContext";
import { useFriend } from "../../contexts/FriendContext";
import { jwtDecode } from "jwt-decode";
import Suggestions from "../../components/Suggestion";
import { Link } from "react-router-dom";

function MyProfile() {
	const { user, updateUser } = useAuth();
	const { handleHashtags } = useHashtags();
	const { handleRemoveFriend } = useFriend();
	const storedToken = localStorage.getItem('token');
	const decodedToken = jwtDecode(storedToken);
	const [activeButton, setActiveButton] = useState("Posts");
	const [posts, setPosts] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const handleButtonClick = (buttonName) => {
		setActiveButton(buttonName);
	};
	useEffect(() => {
		const fetchPost = async () => {
			try {
				const postResponse = await axios.get(`http://localhost:3001/posts/user/${decodedToken.userId}`)
				const suggestionResponse = await axios.get(`http://localhost:3001/users`);
				setSuggestions(suggestionResponse.data.data)
				setPosts(postResponse.data.data);
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
			}
		};
		fetchPost();
	}, [posts]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (user == null || user.friendRequests == null) {
		return <p>No results found1.</p>;
	}
	return (
		//   <div>
		//      <div classNameName="btn-group mt-3 d-flex justify-content-center" role="group" aria-label="Vertical button group">
		//         <button
		//           type="button"
		//           classNameName={`buttonswitch ${activeButton === "Posts" ? 'active' : ''}`}
		//           onClick={() => handleButtonClick("Posts")}>
		//           Post
		//         </button>
		//         <button
		//           type="button"
		//           classNameName={`buttonswitch ${activeButton === "List Friend" ? 'active' : ''}`}
		//           onClick={() => handleButtonClick("List Friend")}>
		//           List Friend
		//         </button>
		//         <button
		//           type="button"
		//           classNameName={`buttonswitch ${activeButton === "My Info" ? 'active' : ''}`}
		//           onClick={() => handleButtonClick("My Info")}>
		//           My Info
		//         </button>
		//         <button
		//           type="button"
		//           classNameName={`buttonswitch ${activeButton === "Change Password" ? 'active' : ''}`}
		//           onClick={() => handleButtonClick("Change Password")}>
		//           Change PassWord
		//         </button>
		//       </div>
		//   <div classNameName="row mt-3 d-flex justify-content-evenly my-profile-container">
		//     <div classNameName="col-4 mt-3">
		//       <Profile user={user}/>
		//     </div>
		//     {activeButton=="List Friend" && (
		//     <div classNameName="col-7 friend-container mt-3">
		//       <h2 classNameName="text-center title-item">Friends</h2>
		//       <ul>
		//         {user.friend.map((friend)=>(
		//           <UserItem key={friend._id} user={friend}
		//           isFriend={user.friend && user.friend.some((user) => user._id === friend._id)}
		//           onRemoveFriend={() => {handleRemoveFriend(friend._id)}}/>
		//         ))}
		//       </ul>
		//     </div> 
		//     )}
		//     {activeButton=="Posts" && (
		//       <div classNameName="col-7 friend-container mt-3">
		//       <h2 classNameName="text-center title-item">Posts</h2>
		//       <ul>
		//         {data.data.length==0 
		//         ?<h4 classNameName="text-center mt-5">You Don't Have Any Post !!!</h4> 
		//         :(
		//           data.data.map((post) => (
		//             <PostItem key={post._id} post={post} handleHashtags={handleHashtags}/>
		//             ))
		//         )}
		//       </ul>
		//   </div>
		//     )}
		//     {activeButton=="Change Password" &&(
		//       <div classNameName="col-7 friend-container mt-3">
		//         <h2 classNameName="text-center title-item">Change Password</h2>
		//         <ChangePassword userId={user._id}/>
		//       </div>
		//     )}
		//     {activeButton == "My Info" && (
		//         <div classNameName="col-7 friend-container mt-3">
		//         <h2 classNameName="text-center title-item">My Info</h2>
		//         <MyInfo userId={user._id}/>
		//         </div>
		//     )}
		//   </div>
		// </div>
		<div>
			<section className="cover-sec">
				<img src="images/cover-img.jpg" alt="" />
				<div className="add-pic-box">
					<div className="container">
						<div className="row no-gutters">
							<div className="col-lg-12 col-sm-12">
								<input type="file" id="file" />
								<label htmlFor="file">Change Image</label>
							</div>
						</div>
					</div>
				</div>
			</section>
			<main>
				<div className="main-section">
					<div className="container">
						<div className="main-section-data">
							<div className="row">
								<div className="col-lg-3">
									<div className="main-left-sidebar">
										<div className="user_profile">
											<div className="user-pro-img">
												<img src={user.profilePictureUrl || `images/userava.jpg`} />
												<div className="add-dp" id="OpenImgUpload">
													<input type="file" id="file" />
													<label htmlFor="file"><i className="fas fa-camera"></i></label>
												</div>
											</div>
											<div className="user_pro_status">
												<ul className="flw-status">
													<li>
														<span>Following</span>
														<b>34</b>
													</li>
													<li>
														<span>Followers</span>
														<b>155</b>
													</li>
												</ul>
											</div>
											<ul className="social_links">
												<li><a href="#" title=""><i className="la la-globe"></i> www.example.com</a></li>
												<li><a href="#" title=""><i className="fab fa-facebook-square"></i> Http://www.facebook.com/john...</a></li>
												<li><a href="#" title=""><i className="fab fa-twitter"></i> Http://www.Twitter.com/john...</a></li>
												<li><a href="#" title=""><i className="fab fa-google-plus-square"></i> Http://www.googleplus.com/john...</a></li>
												<li><a href="#" title=""><i className="fab fa-behance-square"></i> Http://www.behance.com/john...</a></li>
												<li><a href="#" title=""><i className="fab fa-pinterest"></i> Http://www.pinterest.com/john...</a></li>
												<li><a href="#" title=""><i className="fab fa-instagram"></i> Http://www.instagram.com/john...</a></li>
												<li><a href="#" title=""><i className="fab fa-youtube"></i> Http://www.youtube.com/john...</a></li>
											</ul>
										</div>
										<div className="suggestions full-width">
											<div className="sd-title">
												<h3>Suggestions</h3>
												<i className="la la-ellipsis-v"></i>
											</div>
											<div className="suggestions-list">
												{suggestions.map((suggestion) => (user && user._id && user._id != suggestion._id && <Suggestions suggestion={suggestion} key={suggestion._id} />))}
												<div className="view-more">
													<Link href="#" title="">View More</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="main-ws-sec">
										<div className="user-tab-sec rewivew">
											<h3>{user.firstName} {user.lastName}</h3>
											<div className="star-descp">
												<span>Graphic Designer at Self Employed</span>
												<ul>
													<li><i className="fa fa-star"></i></li>
													<li><i className="fa fa-star"></i></li>
													<li><i className="fa fa-star"></i></li>
													<li><i className="fa fa-star"></i></li>
													<li><i className="fa fa-star-half-o"></i></li>
												</ul>
												<a href="#" title="">Status</a>
											</div>
											<div className="tab-feed st2 settingjb">
												<ul>
													<li data-tab="feed-dd" className="active">
														<a href="#" title="">
															<img src="images/ic1.png" alt="" />
															<span>Feed</span>
														</a>
													</li>
													<li data-tab="info-dd">
														<a href="#" title="">
															<img src="images/ic2.png" alt="" />
															<span>Info</span>
														</a>
													</li>
													<li data-tab="saved-jobs">
														<a href="#" title="">
															<img src="images/ic4.png" alt="" />
															<span>Jobs</span>
														</a>
													</li>
													<li data-tab="my-bids">
														<a href="#" title="">
															<img src="images/ic5.png" alt="" />
															<span>Bids</span>
														</a>
													</li>
													<li data-tab="portfolio-dd">
														<a href="#" title="">
															<img src="images/ic3.png" alt="" />
															<span>Portfolio</span>
														</a>
													</li>
													<li data-tab="rewivewdata">
														<a href="#" title="">
															<img src="images/review.png" alt="" />
															<span>Reviews</span>
														</a>
													</li>
													<li data-tab="payment-dd">
														<a href="#" title="">
															<img src="images/ic6.png" alt="" />
															<span>Payment</span>
														</a>
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
										<div className="product-feed-tab current" id="feed-dd">
											<div className="posts-section">
												<div className="process-comm">
													<div className="spinner">
														<div className="bounce1"></div>
														<div className="bounce2"></div>
														<div className="bounce3"></div>
													</div>
												</div>
											</div>
										</div>
										<div className="product-feed-tab" id="my-bids">
											<ul className="nav nav-tabs bid-tab" id="myTab" role="tablist">
												<li className="nav-item">
													<a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Manage Bids</a>
												</li>
												<li className="nav-item">
													<a className="nav-link" id="bidders-tab" data-toggle="tab" href="#bidders" role="tab" aria-controls="contact" aria-selected="false">Manage Bidders</a>
												</li>
												<li className="nav-item">
													<a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">My Active Bids</a>
												</li>
											</ul>
											<div className="tab-content" id="myTabContent">
												<div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
												</div>
												<div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
												</div>
												<div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
												</div>
												<div className="tab-pane fade" id="bidders" role="tabpanel" aria-labelledby="bidders-tab">
												</div>
											</div>
										</div>
										<div className="product-feed-tab" id="info-dd">
										</div>
										<div className="product-feed-tab" id="rewivewdata">
											<div className="posts-section">
												<div className="post-bar reviewtitle">
													<h2>Reviews</h2>
												</div>
												<div className="post-bar ">
													<div className="post_topbar">
														<div className="usy-dt">
															<img src="images/resources/bg-img3.png" alt="" />
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
															<p>Lorem ipsum dolor sit amet, adipiscing elit. Nulla luctus mi et porttitor ultrices</p>
															<hr />
														</div>

														<div className="post_topbar post-reply">
															<div className="usy-dt">
																<img src="images/resources/bg-img4.png" alt="" />
																<div className="usy-name">
																	<h3>John Doe</h3>
																	<div className="epi-sec epi2">
																		<p><i className="la la-clock-o"></i>3 min ago</p>
																		<p className="tahnks">Thanks :)</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="post_topbar rep-post rep-thanks">
															<hr />
															<div className="usy-dt">
																<img src="images/resources/bg-img4.png" alt="" />
																<input className="reply" type="text" placeholder="Reply" />
																<a className="replybtn" href="#">Send</a>

															</div>
														</div>

													</div>
												</div>
											</div>
										</div>
										<div className="product-feed-tab" id="my-bids">
											<div className="posts-section">
												<div className="process-comm">
													<a href="#" title=""><img src="images/process-icon.png" alt="" /></a>
												</div>
											</div>
										</div>
										<div className="product-feed-tab" id="portfolio-dd">
											<div className="portfolio-gallery-sec">
												<h3>Portfolio</h3>
												<div className="portfolio-btn">
													<a href="#" title=""><i className="fas fa-plus-square"></i> Add Portfolio</a>
												</div>
												<div className="gallery_pf">
													<div className="row">
													</div>
													{/* list hình portfolio */}
												</div>
											</div>
										</div>
										<div className="product-feed-tab" id="payment-dd">
											<div className="billing-method">
												<ul>
													<li>
														<h3>Add Billing Method</h3>
														<a href="#" title=""><i className="fa fa-plus-circle"></i></a>
													</li>
													<li>
														<h3>See Activity</h3>
														<a href="#" title="">View All</a>
													</li>
													<li>
														<h3>Total Money</h3>
														<span>$0.00</span>
													</li>
												</ul>
												<div className="lt-sec">
													<img src="images/lt-icon.png" alt="" />
													<h4>All your transactions are saved here</h4>
													<a href="#" title="">Click Here</a>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-3">
									<div className="right-sidebar">
										<div className="message-btn">
											<a href="profile-account-setting.html" title=""><i className="fas fa-cog"></i>Setting</a>
										</div>
										<div className="widget widget-portfolio">
											<div className="wd-heady">
												<h3>Portfolio</h3>
												<img src="images/photo-icon.png" alt="" />
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
			<div className="overview-box" id="overview-box">
			</div>
		</div>

	)
}

export default MyProfile;