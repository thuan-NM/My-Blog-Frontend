import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TopJob from "../../components/TopJob";
import MostInterest from "../../components/MostInterest";
import postServices from "../../services/post.services";

function JobDetail() {
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [job, setJob] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await postServices.getJobsWithId(postId)
                setJob(postResponse.data);
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
            <div className={`main-section ${(isJobModalOpen || isProjectModalOpen) ? "overlay" : ""}`}>
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
                                        <div className="detail_price"><i class="bi bi-coin mr-4"></i>{job.price}$/giờ</div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <button className="apply_job">Ứng Tuyển Ngay</button>
                                            <div>
                                                <button className="react_button"><i className={`fas fa-heart`}></i></button>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column justify-content-center">
                                            <div className="detail_companyname"><i class="bi bi-geo-alt"></i>{job.location}</div>
                                            <div className="detail_companyname"><i class="bi bi-person-workspace"></i>{job.workType}</div>
                                            <div className="detail_companyname"><i class="bi bi-clock"></i>{job.createdAt}</div>
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
                                    <div className="detail_sec_title">Job Description</div>
                                    <div className='detail_job_description'>
                                        <ul>
                                            {paragraphs.map((p) => (
                                                <li key={p}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 pd-right-none no-pd">
                                <div className="right-sidebar">
                                    <div className="widget">
                                        <div>
                                            <img src={job.author.userdata.profilePictureUrl} alt="" />
                                        </div>
                                        <div>
                                            <p>
                                                {job.author.userdata.companyname}
                                            </p>
                                            <Link>
                                            Xem thông tin công ty
                                            </Link>
                                        </div>
                                    </div>
                                    {/* <TopJob />
                                    <MostInterest /> */}
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