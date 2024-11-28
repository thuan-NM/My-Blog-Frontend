import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PostCreation from "../../components/PostCreation";
import PostItem from "../../components/PostItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import "../../jquery.range.css";
import { InputNumber } from "antd";
import TopJob from "../../components/TopJob";
import MostInterest from "../../components/MostInterest";
import postServices from "../../services/post.services";
import { useInfiniteQuery } from "react-query";
import LocationAutocomplete from "../../components/LocationAutocomplete";


function Jobs() {
    const { user, role } = useAuth();
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const scrollPositionRef = useRef(0);
    const hasAppliedFilter = useRef(false);

    // Các state cho bộ lọc (input values)
    const [minInputValue, setMinInputValue] = useState(0);
    const [maxInputValue, setMaxInputValue] = useState(500000);
    const [skills, setSkills] = useState("");
    const [workType, setWorkType] = useState("");
    const [location, setLocation] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // State cho bộ lọc đã áp dụng
    const [appliedFilters, setAppliedFilters] = useState({
        minInputValue: 0,
        maxInputValue: 500000,
        skills: "",
        workType: "",
        location: "",
        companyName: "",
        sortBy: "newest",
    });

    // Hàm xử lý mở/đóng modal
    const handleShowJobModal = (e) => {
        e.preventDefault();
        setIsJobModalOpen(!isJobModalOpen);
    };

    // Hàm xử lý reset bộ lọc
    const handleResetFilter = () => {
        setMinInputValue(0);
        setMaxInputValue(500000);
        setSkills("");
        setWorkType("");
        setLocation("");
        setCompanyName("");
        setSortBy("newest");
        setAppliedFilters({
            minInputValue: 0,
            maxInputValue: 500000,
            skills: "",
            workType: "",
            location: "",
            companyName: "",
            sortBy: "newest",
        });
        message.success({
            content: "Đã xóa bộ lọc",
            key: "reset",
            style: { marginTop: '8vh' },
            duration: 2,
        });
    };

    // Hàm xử lý khi người dùng áp dụng bộ lọc
    const handleFilter = () => {
        setAppliedFilters({
            minInputValue,
            maxInputValue,
            skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
            workType,
            location,
            companyName,
            sortBy,
        });
        hasAppliedFilter.current = true;
        message.loading({ content: "Đang lọc...", key: "filter", style: { marginTop: '8vh' }, duration: 2 });
    };

    // Sử dụng useInfiniteQuery để quản lý fetching dữ liệu với bộ lọc đã áp dụng
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery(
        ["jobs", appliedFilters],
        async ({ pageParam = 1 }) => {
            const filter = {
                ...appliedFilters,
                page: pageParam,
                pageSize: 20,
            };
            const response = await postServices.getFilterPost(filter, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
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
        // Chỉ hiển thị message khi `data` thay đổi và bộ lọc thực sự đã được áp dụng
        if (!isLoading && hasAppliedFilter.current && data?.pages?.length > 0) {
            message.success({
                content: "Lọc thành công",
                key: "filter-success",
                style: { marginTop: "8vh" },
                duration: 2, // Thời gian hiển thị thông báo
            });
            hasAppliedFilter.current = false; // Reset lại trạng thái
        }
    }, [data, isLoading]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setPageLoading(true); // Bắt đầu trạng thái loading toàn trang
                await postServices.getFilterPost({ page: 1, pageSize: 20 }); // Fetch dữ liệu ban đầu
                setPageLoading(false); // Tắt trạng thái loading toàn trang
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setPageLoading(false); // Đảm bảo tắt trạng thái loading ngay cả khi có lỗi
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            window.scrollTo(0, scrollPositionRef.current);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            scrollPositionRef.current = window.scrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Khôi phục vị trí cuộn sau khi tải dữ liệu
    useEffect(() => {
        if (scrollPositionRef.current > 0) {
            setTimeout(() => {
                window.scrollTo(0, scrollPositionRef.current);
            }, 0);
        }
    }, [allPosts]);

    if (pageLoading) {
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
                <div className={`main-section ${isJobModalOpen ? "overlay" : ""}`}>
                    <div className="container">
                        <div className="main-section-data">
                            <div className="row">
                                {/* Sidebar Trái */}
                                <div className="col-lg-3 col-md-4 pd-left-none no-pd">
                                    <div className="main-left-sidebar no-margin">
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
                                                        <select
                                                            onChange={(e) => setSortBy(e.target.value)}
                                                            value={sortBy}
                                                        >
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
                                                    <form onSubmit={(e) => e.preventDefault()}>
                                                        <input
                                                            type="text"
                                                            name="companyName"
                                                            placeholder="Tên công ty"
                                                            value={companyName}
                                                            onChange={(e) => setCompanyName(e.target.value)}
                                                        />
                                                    </form>
                                                </div>
                                                <div className="filter-dd">
                                                    <div className="filter-ttl">
                                                        <h3>Loại hình công việc</h3>
                                                        <button onClick={() => setWorkType("")}>Xóa</button>
                                                    </div>
                                                    <form className="job-tp">
                                                        <select
                                                            onChange={(e) => setWorkType(e.target.value)}
                                                            value={workType}
                                                        >
                                                            <option value="">Chọn loại hình</option>
                                                            <option value="At office">At office</option>
                                                            <option value="Remote">Remote</option>
                                                            <option value="Hybrid">Hybrid</option>
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
                                                        <input
                                                            type="text"
                                                            name="search-skills"
                                                            placeholder="Tìm skills ..."
                                                            value={skills}
                                                            onChange={(e) => setSkills(e.target.value)}
                                                        />
                                                    </form>
                                                </div>
                                                <div className="filter-dd">
                                                    <div className="filter-ttl">
                                                        <h3>Lương / giờ ($)</h3>
                                                    </div>
                                                    <div className="rg-slider">
                                                        <InputNumber
                                                            style={{
                                                                margin: "0 10px",
                                                            }}
                                                            min={0}
                                                            max={1000000}
                                                            value={minInputValue}
                                                            onChange={(value) => setMinInputValue(value)}
                                                        />
                                                        <span> - </span>
                                                        <InputNumber
                                                            style={{
                                                                margin: "0 10px",
                                                            }}
                                                            min={0}
                                                            max={1000000}
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
                                                    <form onSubmit={(e) => e.preventDefault()}>
                                                        <LocationAutocomplete
                                                            value={location}
                                                            onChange={(value) => setLocation(value)}
                                                        />
                                                    </form>
                                                </div>
                                                <button
                                                    className="w-full bg-red-600 text-white font-medium text-[16px] py-1.5 px-2.5 inline-block rounded-md"
                                                    onClick={handleFilter}
                                                >
                                                    Lọc công việc
                                                </button>
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
                                                        className="!w-14 !h-14 rounded-full"
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
                                                <div className="h-[50px]">
                                                    <img className="h-full w-full object-scale-down"
                                                        src="../images/myfavicon.png"
                                                        alt="User Avatar"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="posts-section">
                                            {isLoading ? (
                                                <div className="spinner">
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                            ) : (
                                                <InfiniteScroll
                                                    className="overflow-y-hidden"
                                                    dataLength={allPosts.length}
                                                    next={fetchNextPage}
                                                    hasMore={hasNextPage}
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
                                                // Nếu bạn muốn sử dụng một div cuộn cụ thể, hãy thêm thuộc tính scrollableTarget
                                                // scrollableTarget="scrollableDiv"
                                                >
                                                    <div className="overflow-y-hidden overflow-x-hidden">
                                                        {allPosts.map((post, index) => (
                                                            <div key={`${post._id}-${index}`}>
                                                                <PostItem post={post} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </InfiniteScroll>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Phải */}
                                <div className="col-lg-3 pd-right-none no-pd">
                                    <div className="right-sidebar">
                                        <div className="widget widget-about">
                                            <img
                                                className="!mx-auto !w-full !object-scale-down !h-[70px]"
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
                />
            </main>
        </div>
    );
}

export default Jobs;
