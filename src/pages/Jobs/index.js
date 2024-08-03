import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import PostCreation from "../../components/PostCreation";
import PostItem from "../../components/PostItem";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import Suggestions from "../../components/Suggestion";
import { useHashtags } from "../../contexts/HashtagContext";
import { useSearch } from "../../contexts/SearchContext";
import { useAuth } from "../../contexts/AuthContext";
import "../../jquery.range.css"
import { InputNumber, Slider, Switch } from "antd";
import TopProfile from "../../components/TopProfile";
import TopJob from "../../components/TopJob";
import MostInterest from "../../components/MostInterest";


function Jobs() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [totalPages, settotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth()
    const [minInputValue, setMinInputValue] = useState(0)
    const [maxInputValue, setMaxInputValue] = useState(500000)
    const [skills, setSkills] = useState("");
    const [typeOfJob, setTypeOfJob] = useState("");
    const [workType, setWorkType] = useState("");
    const [country, setCountry] = useState("");
    const [input, setInput] = useState(true);
    const [experience, setExperience] = useState("");
    const defaultFilter = {
        skills: [""],
        typeOfJob: "",
        workType: "",
        minInputValue: 0,
        maxInputValue: 500000,
        country: "",
        experience: ""
    }
    const [filter, setFilter] = useState(defaultFilter);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await axios.post(`https://my-blog-server-ua7q.onrender.com/posts/filter`, filter, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const suggestionResponse = await axios.get(`https://my-blog-server-ua7q.onrender.com/users`);
                setSuggestions(suggestionResponse.data.data)
                setPosts(postResponse.data.data);
                settotalPages(postResponse.data.totalPages)
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [filter]);

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
    const handleFilter = (e) => {
        e.preventDefault()
        const newfilter = {
            skills: skills.split(","),
            typeOfJob: typeOfJob,
            workType: workType,
            minInputValue: minInputValue,
            maxInputValue: maxInputValue,
            country: country,
            experience: experience,
        }
        setFilter(newfilter)
    }
    return (
        <div><div className="search-sec">
            <div className="container">
                <div className="search-box">
                    <form>
                        <input type="text" name="search" placeholder="Search keywords" />
                        <button>Search</button>
                    </form>
                </div>
            </div>
        </div>
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
                                            <button onClick={() => setFilter(defaultFilter)}>Xóa bộ lọc</button>
                                        </div>
                                        <div className="paddy">
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
                                                    <h3>Loại hợp đồng</h3>
                                                    <button onClick={() => setTypeOfJob("")}>Xóa</button>
                                                </div>
                                                <form className="job-tp">
                                                    <select onChange={(e) => setTypeOfJob(e.target.value)} value={typeOfJob}>
                                                        <option value={""}>Chọn loại hợp đồng</option>
                                                        <option>Hourly</option>
                                                        <option>Part Time</option>
                                                        <option>Full Time</option>
                                                    </select>
                                                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
                                                        <option>Onsite</option>
                                                        <option>Remote</option>
                                                        <option>Hybrid</option>
                                                    </select>
                                                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                </form>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Lương / giờ ($)</h3>
                                                </div>
                                                <div className="rg-slider">
                                                    <InputNumber
                                                        style={{
                                                            margin: '0 16px',
                                                        }}
                                                        value={minInputValue}
                                                        onChange={(value) => setMinInputValue(value)}
                                                    />
                                                    <span> - </span>
                                                    <InputNumber
                                                        style={{
                                                            margin: '0 16px',
                                                        }}
                                                        value={maxInputValue}
                                                        onChange={(value) => setMaxInputValue(value)}
                                                    />
                                                    <Slider range defaultValue={[minInputValue, maxInputValue]} onChange={onChange} value={[minInputValue, maxInputValue]} max={1000} step={10} />
                                                </div>
                                                <div className="rg-limit mt-0">
                                                    <h4>1</h4>
                                                    <h4>1000+</h4>
                                                </div>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Kinh nghiệm</h3>
                                                    <button onClick={() => { setExperience("") }}>Xóa</button>
                                                </div>
                                                <form className="job-tp">
                                                    <select onChange={(e) => setExperience(e.target.value)} value={experience}>
                                                        <option value={""}>Chọn mức độ kinh nghiệm</option>
                                                        <option>Fresher Developer</option>
                                                        <option>Junior Developer</option>
                                                        <option>Middle Developer</option>
                                                        <option>Senior Developer</option>
                                                        <option>Team Leader</option>
                                                        <option>Tester</option>
                                                    </select>
                                                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                </form>
                                            </div>
                                            <div className="filter-dd">
                                                <div className="filter-ttl">
                                                    <h3>Khu vực</h3>
                                                    <button onClick={() => { setCountry("") }}>Xóa</button>
                                                </div>
                                                <form className="job-tp">
                                                    {input ? (
                                                        <select onChange={(e) => { setCountry(e.target.value) }} value={country}>
                                                            <option value={""}>Chọn một khu vực</option>
                                                            <option>Mỹ</option>
                                                            <option>Anh</option>
                                                            <option>Việt Nam</option>
                                                        </select>
                                                    ) : (
                                                        <input placeholder="Nhập tên khu vực" value={country} onChange={(e) => { setCountry(e.target.value) }}></input>
                                                    )}
                                                    <button className="search-btn" onClick={handleFilter}>Lọc</button>
                                                </form>
                                                <Switch
                                                    checked={input}
                                                    checkedChildren="Lựa chọn"
                                                    unCheckedChildren="Nhập"
                                                    onChange={() => {
                                                        setInput(!input);
                                                    }}
                                                    className="mt-3"
                                                />

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
                                                    <li><button className="post_project" href="#" title="">Đăng một dự án</button></li>
                                                    <li><button className="post-jb" onClick={handleShowJobModal}>Đăng một công việc</button></li>
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
                                        <Suggestions />
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