import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSearch } from "../../contexts/SearchContext";
import SearchBar from "../SearchBar";

const Header = () => {
	const [isOpened, setIsOpened] = useState(false);
	const [isNotiOpened, setIsNotiOpened] = useState(false);
	const [isRpsActive, setIsRpsActive] = useState(false);
	//const {handleSearchPost,searchTerm,searchResults,showPostListsWithSearch,setSearchTerm,setSearchResults,setShowPostListsWithSearch} = useSearch();
	const { user, logout } = useAuth();
	const storedToken = localStorage.getItem('token');
	const handleOpenMenu = () => {
		setIsOpened(!isOpened);
	}
	const handleLogout = () => {
		logout();
		setIsOpened(!isOpened);
	}
	return (
		<header>
			<div className="container">
				<div className="header-data">
					<div className="logo">
						<Link to={"/"}><img src="images/logo.png" alt="" /></Link>
					</div>
					<SearchBar
					// searchTerm={searchTerm}
					// setSearchTerm={setSearchTerm}
					// handleSearch={handleSearchPost}
					/>
					<nav className={`${isRpsActive?"active":""}`}>
						<ul>
							<li>
								<Link to={"/"} title="">
									<span><img src="images/icon1.png" alt="" /></span>
									Trang chủ
								</Link>
							</li>
							<li>
								<Link to={"/companies"}>
									<span><img src="images/icon2.png" alt="" /></span>
									Công ty
								</Link>
							</li>
							<li>
								<a href="projects.html" title="">
									<span><img src="images/icon3.png" alt="" /></span>
									Dự án
								</a>
							</li>
							<li>
								<Link to={"/users"}>
									<span><img src="images/icon4.png" alt="" /></span>
									Người dùng
								</Link>
							</li>
							<li>
								<Link to={"/jobs"}>
									<span><img src="images/icon5.png" alt="" /></span>
									Công việc
								</Link>
							</li>
							<li>
								<a href="#" title="" className="not-box-openm">
									<span><img src="images/icon6.png" alt="" /></span>
									Tin nhắn
								</a>
							</li>
							<li>
								<Link className="not-box-open" onClick={() => setIsNotiOpened(!isNotiOpened)}>
									<span><img src="images/icon7.png" alt="" /></span>
									Thông báo
								</Link>
								<div className={`notification-box noti ${isNotiOpened ? "active animate__animated animate__faster slideInDown" : "animate__animated animate__faster slideOutUp"}`} id="notification">
									<div className="nt-title">
										<h4>Cài đặt</h4>
										<a title="">Xóa tất cả</a>
									</div>
									<div className="nott-list">
										<div className="notfication-details">
											<div className="noty-user-img">
											</div>
											<div className="notification-info">
												<h3><a href="#" title="">Jassica William</a> Đã bình luận vào bài viết của bạn.</h3>
												<span>2 phút trước</span>
											</div>
										</div>
										<div className="notfication-details">
											<div className="noty-user-img">
												
											</div>
											<div className="notification-info">
												<h3><a href="#" title="">Jassica William</a> Đã bình luận vào bài viết của bạn.</h3>
												<span>2 phút trước</span>
											</div>
										</div>
										<div className="notfication-details">
											<div className="noty-user-img">
												
											</div>
											<div className="notification-info">
												<h3><a href="#" title="">Jassica William</a> Đã bình luận vào bài viết của bạn.</h3>
												<span>2 phút trước</span>
											</div>
										</div>
										<div className="notfication-details">
											<div className="noty-user-img">
												
											</div>
											<div className="notification-info">
												<h3><a href="#" title="">Jassica William</a> Đã bình luận vào bài viết của bạn.</h3>
												<span>2 phút trước</span>
											</div>
										</div>
										<div className="view-all-nots">
											<a href="#" title="">Xem tất cả thông báo</a>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</nav>
					<div className="menu-btn">
						<Link onClick={()=>setIsRpsActive(!isRpsActive)}><i className="fa fa-bars"></i></Link>
					</div>
					{storedToken == null ? (<div className="user-account">
						<div className="user-info">
							<Link className="ms-3" to={"/auth"}>Sign In Here</Link>
						</div>
					</div>) :
						(<div className="user-account">
							<div className="user-info" onClick={handleOpenMenu}>
								<img src={!user.profilePictureUrl ? "images/userava.jpg" : user.profilePictureUrl} />
								<i className="la la-sort-down"></i>
							</div>
							<div className={`user-account-settingss ${isOpened ? "active animate__animated animate__faster slideInDown" : "animate__animated animate__faster slideOutUp"}`}>
								<h3>Trang cá nhân<Link to={"/myprofile"} onClick={handleOpenMenu}><i className="ms-5 bi bi-arrow-right-circle"></i></Link></h3>
								<h3>Trạng thái hoạt động</h3>
								<ul className="on-off-status">
									<li>
										<div className="fgt-sec">
											<input type="radio" name="cc" id="c5" />
											<label htmlFor="c5">
												<span></span>
											</label>
											<small>Online</small>
										</div>
									</li>
									<li>
										<div className="fgt-sec">
											<input type="radio" name="cc" id="c6" />
											<label htmlFor="c6">
												<span></span>
											</label>
											<small>Offline</small>
										</div>
									</li>
								</ul>
								<h3>Tùy chỉnh trạng thái</h3>
								<div className="search_form">
									<form>
										<input type="text" name="search" />
										<button type="submit">Ok</button>
									</form>
								</div>
								<h3>Cài đặt</h3>
								<ul className="us-links mb-3">
									<li><a href="profile-account-setting.html" title="">Cài đặt tài khoản</a></li>
									<li><a href="#" title="">Quyền riêng tư</a></li>
									<li><a href="#" title="">Câu hỏi thường gặp</a></li>
									<li><a href="#" title="">Điều khoản sử dụng</a></li>
								</ul>
								{(storedToken != null) ? (<h3 className="tc"><button onClick={handleLogout}>Đăng xuất</button></h3>) : (
									<h3 className="tc"><Link to={"/auth"} className="mt-5"><button onClick={() => setIsOpened(!isOpened)}>Sign In</button></Link></h3>
								)}

							</div>
						</div>)}
				</div>
			</div>
		</header>
	)
}
export default Header