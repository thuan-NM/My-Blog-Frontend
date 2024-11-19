import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import PostCreation from "../../components/PostCreation";
import PostItem from "../../components/PostItem";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import Suggestions from "../../components/Suggestion";
import TopProfile from "../../components/TopProfile";
import { useHashtags } from "../../contexts/HashtagContext";
import { useSearch } from "../../contexts/SearchContext";
import { useAuth } from "../../contexts/AuthContext";
import TopJob from "../../components/TopJob";
import MostInterest from "../../components/MostInterest";
import PostServices from "../../services/post.services"
import UserCard from "../../components/UserCard";

function Home() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await PostServices.getJobsList();
        setPosts(postResponse.data);
        settotalPages(postResponse.totalPages);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [posts]);
  
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
  const handleShowJobModal = (e) => {
    e.preventDefault();
    setIsJobModalOpen(!isJobModalOpen);
  };
  const handleShowProjectModal = (e) => {
    e.preventDefault();
    setIsProjectModalOpen(!isProjectModalOpen);
  };
  return (
    <main>
      <div className={`main-section ${(isJobModalOpen || isProjectModalOpen) ? "overlay" : ""}`}>
        <div className="container">
          <div className="main-section-data">
            <div className="row">
              <div className="col-lg-3 col-md-4 pd-left-none no-pd">
                <div className="main-left-sidebar no-margin">
                  <UserCard user={user} />
                  <Suggestions />
                  <div className="tags-sec full-width">
                    <ul>
                      <li><a href="help-center.html" title="">Trung tâm hỗ trợ</a></li>
                      <li><Link to={"/about"} title="">Về chúng tôi</Link></li>
                      <li><a href="#" title="">Chính sách bảo mật |</a></li>
                      <li><a href="#" title="">Cộng đồng</a></li>
                      <li><a href="#" title="">Cookies |</a></li>
                      <li><a href="#" title="">Hồ sơ</a></li>
                      <li><a href="forum.html" title="">Diễn đàn</a></li>
                      <li><a href="#" title="">Ngôn ngữ</a></li>
                      <li><a href="#" title="">Chính sách bản quyền</a></li>
                    </ul>
                    <div className="cp-sec">
                      <img src="../images/myfavicon.png" alt="" width={30} height={30} />
                      <p>Copyright 2019</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-8 no-pd">
                <div className="main-ws-sec">
                  {role === "company" ?
                    (<div className="post-topbar">
                      <div className="user-picy">
                      <img className="!w-14 !h-14 rounded-full bg-neutral-100 object-contain" src={user.profilePictureUrl || `../images/userava.jpg`} />
                      </div>
                      <div className="post-st">
                        <ul>
                          <li><button className="post-jb" onClick={handleShowJobModal}>Đăng một công việc</button></li>
                        </ul>
                      </div>
                    </div>) : (<div className="post-topbar"><div className="user-picy">
                      <img src="../images/myfavicon.png" alt="" />
                    </div></div>)}
                  <div className="posts-section">
                    {posts.map((post, index) => (
                      <React.Fragment key={post._id}>
                        {index === 2 && (
                          <div className="top-profiles">
                            <div className="relative w-full border-b-1 border-[#d2d2d2] p-[20px]">
                              <h3 className="text-black text-[20px] font-[600]">Người dùng hàng đầu</h3>
                            </div>
                            <div className="w-full slick-initialized slick-slider">
                              <TopProfile />
                            </div>
                          </div>)}
                        <PostItem post={post}></PostItem>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-3 pd-right-none no-pd">
                <div className="right-sidebar">
                  <div className="widget widget-about">
                    <img className="!mx-auto" src="images/myfavicon.png" alt="" />
                    <h3>Theo Dõi Ngay Meow IT</h3>
                    <span>Lương chỉ được trả theo số giờ làm</span>
                    <div className="sign_link">
                      <h3><Link to={"/auth"} title="">Đăng Ký Ngay</Link></h3>
                      <Link to={"/about"} title="">Xem thêm</Link>
                    </div>
                  </div>
                  <TopJob />
                  <MostInterest />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PostCreation isJobModalOpen={isJobModalOpen} handleShowJobModal={handleShowJobModal} isProjectModalOpen={isProjectModalOpen} handleShowProjectModal={handleShowProjectModal} />
    </main>
  );
}

export default Home;