// src/pages/Home/Home.js

import React, { useState, useRef, useEffect  } from "react";
import { Link } from "react-router-dom";
import PostCreation from "../../components/PostCreation";
import PostItem from "../../components/PostItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Suggestions from "../../components/Suggestion";
import TopProfile from "../../components/TopProfile";
import { useAuth } from "../../contexts/AuthContext";
import TopJob from "../../components/TopJob";
import MostInterest from "../../components/MostInterest";
import PostServices from "../../services/post.services";
import UserCard from "../../components/UserCard";
import { useInfiniteQuery } from "react-query";

function Home() {
  const { user, role } = useAuth();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollY); // Lưu vị trí cuộn của body
  };

  // Sử dụng useInfiniteQuery để quản lý fetching dữ liệu
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery(
      ["posts"],
      async ({ pageParam = 1 }) => {
        const response = await PostServices.getJobsList(pageParam, 20);
        return response;
      },
      {
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.page < lastPage.totalPages) {
            return lastPage.page + 1;
          } else {
            return undefined;
          }
        },
      }
    );

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    // Lắng nghe sự kiện cuộn
    window.addEventListener("scroll", handleScroll);

    // Khi rời trang Home, khôi phục trạng thái cuộn ban đầu
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, scrollPosition); // Cuộn về vị trí đã lưu
  }, [allPosts]);

  // Hàm xử lý mở/đóng modal
  const handleShowJobModal = (e) => {
    e.preventDefault();
    setIsJobModalOpen(!isJobModalOpen);
  };
  const handleShowProjectModal = (e) => {
    e.preventDefault();
    setIsProjectModalOpen(!isProjectModalOpen);
  };

  if (isLoading) {
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

  if (isError) {
    return (
      <div className="process-comm">
        <p>Error fetching posts: {error.message}</p>
      </div>
    );
  }
  
  return (
    <div>
      <main>
        <div className={`main-section ${
            isJobModalOpen || isProjectModalOpen ? "overlay" : ""
          }`}
        >
          <div className="container">
            <div className="main-section-data">
              <div className="row">
                {/* Sidebar Trái */}
                <div className="col-lg-3 col-md-4 pd-left-none no-pd">
                  <div className="main-left-sidebar no-margin">
                    <UserCard user={user} />
                    <Suggestions />
                    <div className="tags-sec full-width">
                      <ul>
                        <li>
                          <a href="help-center.html" title="">
                            Trung tâm hỗ trợ
                          </a>
                        </li>
                        <li>
                          <Link to={"/about"} title="">
                            Về chúng tôi
                          </Link>
                        </li>
                        <li>
                          <a href="#" title="">
                            Chính sách bảo mật |
                          </a>
                        </li>
                        <li>
                          <a href="#" title="">
                            Cộng đồng
                          </a>
                        </li>
                        <li>
                          <a href="#" title="">
                            Cookies |
                          </a>
                        </li>
                        <li>
                          <a href="#" title="">
                            Hồ sơ
                          </a>
                        </li>
                        <li>
                          <a href="forum.html" title="">
                            Diễn đàn
                          </a>
                        </li>
                        <li>
                          <a href="#" title="">
                            Ngôn ngữ
                          </a>
                        </li>
                        <li>
                          <a href="#" title="">
                            Chính sách bản quyền
                          </a>
                        </li>
                      </ul>
                      <div className="cp-sec">
                        <img
                          src="../images/myfavicon.png"
                          alt=""
                          width={30}
                          height={30}
                        />
                        <p>Copyright 2019</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khu vực hiển thị các bài viết */}
                <div className="col-lg-6 col-md-8 no-pd">
                  <div className="main-ws-sec">
                    {role === "company" ? (
                      <div className="post-topbar">
                        <div className="user-picy">
                          <img
                            className="!w-14 !h-14 rounded-full bg-neutral-100 object-contain"
                            src={
                              user.profilePictureUrl || `../images/userava.jpg`
                            }
                            alt="User Avatar"
                          />
                        </div>
                        <div className="post-st">
                          <ul>
                            <li>
                              <button
                                className="post-jb"
                                onClick={handleShowJobModal}
                              >
                                Đăng một công việc
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="post-topbar">
                        <div className="user-picy">
                          <img
                            src="../images/myfavicon.png"
                            alt="User Avatar"
                          />
                        </div>
                      </div>
                    )}
                    <div className="posts-section">
                      <InfiniteScroll
                        className="overflow-y-hidden"
                        dataLength={allPosts.length}
                        next={fetchNextPage}
                        hasMore={hasNextPage}
                        scrollThreshold={0.9}
                        loader={
                          <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                          </div>
                        }
                        endMessage={
                          <p className="text-center w-full">
                            <b>Đã tải hết bài viết.</b>
                          </p>
                        }
                      >
                      <div className="overflow-y-hidden overflow-x-hidden">
                          {allPosts.map((post, index) => (
                            <React.Fragment key={`${post._id}-${index}`}>
                              {index === 2 && (
                                <div className="top-profiles">
                                  <div className="relative w-full border-b-1 border-[#d2d2d2] p-[20px]">
                                    <h3 className="text-black text-[20px] font-[600]">Người dùng hàng đầu</h3>
                                  </div>
                                  <div className="w-full slick-initialized slick-slider">
                                    <TopProfile />
                                  </div>
                                </div>
                              )}
                              <PostItem post={post} />
                            </React.Fragment>
                          ))}
                        </div>
                      </InfiniteScroll>
                    </div>
                  </div>
                </div>
                {/* Sidebar Phải */}
                <div className="col-lg-3 pd-right-none no-pd">
                  <div className="right-sidebar">
                    <div className="widget widget-about">
                      <img
                        className="!mx-auto"
                        src="images/myfavicon.png"
                        alt="Company Logo"
                      />
                      <h3>Theo Dõi Ngay Meow IT</h3>
                      <span>Lương chỉ được trả theo số giờ làm</span>
                      <div className="sign_link">
                        <h3>
                          <Link to={"/auth"} title="Đăng Ký Ngay">
                            Đăng Ký Ngay
                          </Link>
                        </h3>
                        <Link to={"/about"} title="Xem thêm">
                          Xem thêm
                        </Link>
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
        {/* Modal Đăng Công việc hoặc Dự án */}
        <PostCreation
          isJobModalOpen={isJobModalOpen}
          handleShowJobModal={handleShowJobModal}
          isProjectModalOpen={isProjectModalOpen}
          handleShowProjectModal={handleShowProjectModal}
        />
      </main>
    </div>
  );
}

export default Home;
