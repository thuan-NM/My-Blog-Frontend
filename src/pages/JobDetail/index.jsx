import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import postServices from "../../services/post.services";
import PostItem from "../../components/PostItem";

function JobDetail() {

    const [job, setJob] = useState({})
    const [relatedJobs, setRelatedJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await postServices.getJobsWithId(postId)
                const relatedResponse = await postServices.getRelatedJobsWithId(postId)
                setJob(postResponse.data);
                setRelatedJobs(relatedResponse.data)
                setIsLoading(false);
            } catch (error) {
            }
        };
        fetchPost();
    }, [job]);

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

    const paragraphs = job.description.split('\n')

    return (
        <main>
            <div className={`main-section`}>
                <div className="container">
                    <div className="main-section-data">
                        <div className="row">
                            <div className="col-lg-8 col-md-4 pd-left-none no-pd">
                                <div className="detail_sec">
                                    <div>
                                        <h2>
                                            {job.title}
                                        </h2>
                                        <div className="detail_companyname">{job.author.userdata.companyname}</div>
                                        <div className="detail_price"><i className="bi bi-coin mr-4"></i>{job.price}$/giờ</div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <Link className="apply_job text-center" to={`/jobapplication/${job._id}`}>Ứng Tuyển Ngay</Link>
                                            <div>
                                                <button className="react_button"><i className={`fas fa-heart`}></i></button>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column justify-content-center">
                                            <div className="detail_companyname"><i className="bi bi-geo-alt"></i>{job.location}</div>
                                            <div className="detail_companyname"><i className="bi bi-person-workspace"></i>{job.workType}</div>
                                            <div className="detail_companyname"><i className="bi bi-clock"></i>{job.createdAt}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="mr-3">Skills:</span>
                                        <ul className="job_skills">
                                            {job.skills.map((item) => (
                                                <li key={item}>
                                                    <a>{item}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="detail_sec mt-4">
                                    <div className="detail_sec_title">Mô tả công việc</div>
                                    <div className='detail_job_description'>
                                        <ul>
                                            {paragraphs.map((p) => (
                                                <li key={p}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="my-4">
                                    <div className="detail_sec_title mb-4">Các công việc tương tự cho bạn:</div>
                                    <div className="detail_sec">
                                        <div className='detail_job_description'>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h1>Nhận thông tin công việc tương tự qua email</h1>
                                                <div>
                                                    <button className="detail_regis">
                                                        <i class="bi bi-bell-fill"></i>Đăng ký
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="posts-section">
                                    {relatedJobs.map((post, index) => (
                                        <React.Fragment key={post._id}>
                                            <PostItem post={post}></PostItem>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-4 pd-right-none no-pd">
                                <div className="right-sidebar">
                                    <div className="company_intro">
                                        <div className="company_intro_title">
                                            <img src={job.author.userdata.profilePictureUrl} alt="" />
                                            <div className="company_intro_info">
                                                <p>
                                                    {job.author.userdata.companyname}
                                                </p>
                                                <Link>
                                                    Xem thông tin công ty
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <div className="d-flex justify-content-between intro_item">
                                                <div className="intro_item_name">Company type:</div>
                                                <div>{job.author.userdata.field}</div>
                                            </div>
                                            <div className="d-flex justify-content-between intro_item">
                                                <div className="intro_item_name">Company size:</div>
                                                <div>{job.author.userdata.numberOfEmployees}</div>
                                            </div>
                                            <div className="d-flex justify-content-between intro_item">
                                                <div className="intro_item_name">Country:</div>
                                                <div>{job.author.userdata.location.country}</div>
                                            </div>
                                            <div className="d-flex justify-content-between intro_item">
                                                <div className="intro_item_name">Address:</div>
                                                <ul>
                                                    {job.author.userdata.location.address.map((item) => (
                                                        <li className="intro_item_content"><i class="bi bi-dot"></i> {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default JobDetail;