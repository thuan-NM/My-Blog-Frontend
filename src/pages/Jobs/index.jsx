import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCreation from "../../components/PostCreation";
import PostItem from "../../components/PostItem";
import Suggestions from "../../components/Suggestion";
import { message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import "../../jquery.range.css"
import { InputNumber, Slider, Switch } from "antd";
import TopProfile from "../../components/TopProfile";
import TopJob from "../../components/TopJob";
import MostInterest from "../../components/MostInterest";
import postServices from "../../services/post.services";

function Jobs() {
    const { role } = useAuth()
    const [currentPage, setCurrentPage] = useState(1);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth()
    const [minInputValue, setMinInputValue] = useState(0)
    const [maxInputValue, setMaxInputValue] = useState(500000)
    const [skills, setSkills] = useState("");
    const [workType, setWorkType] = useState("");
    const [location, setLocation] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isPostsLoading, setIsPostsLoading] = useState(false)

    const defaultFilter = {
        skills: [""],
        workType: "",
        minInputValue: 0,
        maxInputValue: 500000,
        location: "",
        companyName: "",
        sortBy: "newest"
    }
    const [filter, setFilter] = useState(defaultFilter);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleResetFilter = () => {
        setFilter(defaultFilter);
        setIsPostsLoading(true); // Đánh dấu rằng bộ lọc đã được reset
    };


    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await postServices.getFilterPost(filter, {
                    Authorization: `Bearer ${token}`,
                });

                if (postResponse.isSuccess) {
                    setPosts(postResponse.data);
                    setTotalPages(Math.ceil(postResponse.totalCount / 20)); // Giả sử mỗi trang có 20 bài viết
                    setIsLoading(false);

                    if (isPostsLoading) {
                        message.success({
                            content: "Lọc thành công",
                            key: "filter",
                            style: { marginTop: '8vh' },
                            duration: 2,
                        });
                        setIsPostsLoading(false); // Đặt lại trạng thái
                    }
                } else {
                    // Nếu phản hồi không thành công từ backend
                    message.error({
                        content: postResponse.message || "Lọc thất bại",
                        key: "filter",
                        style: { marginTop: '8vh' },
                        duration: 2,
                    });
                    setIsLoading(false);
                    setIsPostsLoading(false); // Đặt lại trạng thái
                }
            } catch (error) {
                setIsLoading(false);
                if (isPostsLoading) {
                    message.error({
                        content: "Có lỗi xảy ra khi lọc",
                        key: "filter",
                        style: { marginTop: '8vh' },
                        duration: 2,
                    });
                    setIsPostsLoading(false); // Đặt lại trạng thái
                }
                console.error('Error in getFilterPost:', error);
            }
        };
        fetchPost();
    }, [filter, isPostsLoading, token]);



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

    const onChange = (value) => {
        setMinInputValue(value[0]);
        setMaxInputValue(value[1]);
    };
    const handleFilter = async (e) => {
        e.preventDefault();
        message.loading({ content: "Đang lọc...", key: "filter" }); // Show loading message

        const newfilter = {
            skills: skills.split(","),
            workType: workType,
            minInputValue: minInputValue,
            maxInputValue: maxInputValue,
            location: location,
            companyName: companyName,
            sortBy: sortBy
        };
        setFilter(newfilter);
        setIsPostsLoading(true);
    };
    return (
        <div>
            <main>
                <div className={`main-section ${(isJobModalOpen || isProjectModalOpen) ? "overlay" : ""}`}>
                    <div className="container">
                        <div className="main-section-data">
                            <div className="row">
                                <div className="col-lg-3 pd-left-none no-pd">
                                    <div className="filter-secs">
                                        <div className="filter-heading">
                                            <div className="filter-title">
                                                <h3>Bộ lọc</h3>
                                            </div>
                                            <button onClick={handleResetFilter}>Xóa bộ lọc</button>
                                        </div>
                                        <div className="paddy">
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Sắp xếp theo</h3>
                                                </div>
                                                <form className="job-tp">
                                                    <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                                                        <option value="newest">Mới nhất</option>
                                                        <option value="mostLikes">Được yêu thích nhất</option>
                                                    </select>
                                                </form>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Tên công ty</h3>
                                                    <button onClick={() => setCompanyName("")}>Xóa</button>
                                                </div>
                                                <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                                                    <input
                                                        type="text"
                                                        name="companyName"
                                                        placeholder="Tên công ty"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} // Prevent Enter key refresh
                                                    />
                                                </form>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Loại hình công việc</h3>
                                                    <button onClick={() => { setWorkType("") }}>Xóa</button>
                                                </div>
                                                <form className="job-tp">
                                                    <select onChange={(e) => setWorkType(e.target.value)} value={workType}>
                                                        <option>Chọn loại hình</option>
                                                        <option>At office</option>
                                                        <option>Remote</option>
                                                        <option>Hybrid</option>
                                                    </select>
                                                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                </form>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Các kỹ năng</h3>
                                                    <button onClick={() => setSkills("")}>Xóa</button>
                                                </div>
                                                <form>
                                                    <input type="text" name="search-skills" placeholder="Tìm skills ..." value={skills} onChange={(e) => { setSkills(e.target.value) }} />
                                                </form>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Lương / giờ ($)</h3>
                                                </div>
                                                <div className="rg-slider">
                                                    <InputNumber
                                                        style={{
                                                            margin: '0 10px',
                                                        }}
                                                        value={minInputValue}
                                                        onChange={(value) => setMinInputValue(value)}
                                                    />
                                                    <span> - </span>
                                                    <InputNumber
                                                        style={{
                                                            margin: '0 10px',
                                                        }}
                                                        value={maxInputValue}
                                                        onChange={(value) => setMaxInputValue(value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Khu vực (Country)</h3>
                                                    <button onClick={() => setLocation("")}>Xóa</button>
                                                </div>
                                                <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                                                    <input
                                                        type="text"
                                                        placeholder="Nhập tên khu vực"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} // Prevent Enter key refresh
                                                    />
                                                </form>
                                            </div>
                                            <button className="w-full bg-red-600 text-white font-medium text-[16px] py-1.5 px-2.5 inline-block rounded-md" onClick={handleFilter}>Lọc công việc</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-8 no-pd">
                                    <div className="main-ws-sec">
                                        {role === "company" ?
                                            (<div className="post-topbar">
                                                <div className="user-picy">
                                                    <img className="!w-14 !h-14 rounded-full" src={user.profilePictureUrl || `../images/userava.jpg`} />
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
                                            {posts.map((post) => (
                                                <PostItem post={post} key={post._id} />
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
        </div>
    );
}

export default Jobs;
