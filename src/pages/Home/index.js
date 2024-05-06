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


function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth()
  const pageSize = 5;
  const { showPostLists, hashtagResults, handleHashtags, setHashtagResults, setShowPostLists } = useHashtags();
  const { handleSearchPost, searchTerm, searchResults, showPostListsWithSearch, setSearchTerm, setSearchResults, setShowPostListsWithSearch } = useSearch();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3001/posts/?page=${currentPage}&pageSize=${pageSize}`);
        setPosts(postResponse.data.data);
        settotalPages(postResponse.data.totalPages)
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
                  {user && (<div className="user-data full-width">
                    <div className="user-profile">
                      <div className="username-dt">
                        <div className="usr-pic">
                          <img src={user.profilePictureUrl || `images/userava.jpg`} />
                        </div>
                      </div>
                      <div className="user-specs">
                        <h3>{user.companyname != null ? user.companyname : user.lastName}</h3>
                        <span>Graphic Designer at Self Employed</span>
                      </div>
                    </div>
                    <ul className="user-fw-status">
                      <li>
                        <h4>Following</h4>
                        <span>34</span>
                      </li>
                      <li>
                        <h4>Followers</h4>
                        <span>155</span>
                      </li>
                      <li>
                        <Link href="my-profile.html" title="">View Profile</Link>
                      </li>
                    </ul>
                  </div>)}
                  <Suggestions />
                  <div className="tags-sec full-width">
                    <ul>
                      <li><Link href="#" title="">Help Center</Link></li>
                      <li><Link to={"/about"} >About</Link></li>
                      <li><Link href="#" title="">Privacy Policy</Link></li>
                      <li><Link href="#" title="">Community Guidelines</Link></li>
                      <li><Link href="#" title="">Cookies Policy</Link></li>
                      <li><Link href="#" title="">Career</Link></li>
                      <li><Link href="#" title="">Language</Link></li>
                      <li><Link href="#" title="">Copyright Policy</Link></li>
                    </ul>
                    <div className="cp-sec">
                      <img src="images/myfavicon.png" alt="" width={30} height={30}/>
                      <p>Copyright 2019</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-8 no-pd">
                <div className="main-ws-sec">
                  <div className="post-topbar">
                    <div className="user-picy">
                      <img src={user.profilePictureUrl || `images/userava.jpg`} />
                    </div>
                    <div className="post-st">
                      <ul>
                        <li><button className="post_project" href="#" title="">Post a Project</button></li>
                        <li><button className="post-jb" onClick={handleShowJobModal}>Post a Job</button></li>
                      </ul>
                    </div>
                  </div>
                  <div className="posts-section">
                    {posts.map((post, index) => (
                      <React.Fragment key={post._id}>
                        {index === 2 && (
                          <div className="top-profiles">
                            <div className="pf-hd">
                              <h3>Top Profiles</h3>
                              <i className="la la-ellipsis-v"></i>
                            </div>
                            <div className="profiles-slider slick-initialized slick-slider">
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
                    <img src="images/myfavicon.png" alt="" />
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