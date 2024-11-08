import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import postServices from "../../services/post.services";
import jobstatusServices from "../../services/jobstatus.services";
import { useAuth } from "../../contexts/AuthContext";
import PostItem from "../../components/PostItem";
import CompanyIntroduce from "../../components/CompanyIntroduce";
import DOMPurify from 'dompurify';

function isHtml(input) {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(input);
}

function JobDetail() {
    const { role, user } = useAuth(); // Get user info from context
    const [job, setJob] = useState({});
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false); // New state for application status
    const { postId } = useParams(); // Get postId from URL params

    useEffect(() => {
        const fetchPostAndStatus = async () => {
            try {
                // Fetch the job details
                const postResponse = await postServices.getJobsWithId(postId);
                setJob(postResponse.data);

                // Fetch related jobs
                const relatedResponse = await postServices.getRelatedJobsWithId(postId);
                setRelatedJobs(relatedResponse.data);

                // Check if the user has already applied for this job
                if (role === "user") {
                    const applicationResponse = await jobstatusServices.getUsersAppliedJob({
                        postid: postId,
                        userid: user._id,
                    });
                    setHasApplied(applicationResponse.data !== null); // If a result is returned, user has applied
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching job details or application status:", error);
                setIsLoading(false);
            }
        };

        fetchPostAndStatus();
    }, [postId, role, user]); // Removed hasApplied from dependencies

    if (isLoading || !role) {
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

    const paragraphs = job.description ? job.description.split('\n') : [];

    return (
        <main>
            <div className="main-section">
                <div className="container">
                    <div className="main-section-data">
                        <div className="row">
                            <div className="col-lg-8 col-md-4 pd-left-none no-pd">
                                <div className="detail_sec">
                                    <div>
                                        <h2>{job.title}</h2>
                                        <div className="detail_companyname">{job.author?.userdata.companyname}</div>
                                        <div className="detail_price"><i className="bi bi-coin mr-4"></i>{job.price}$/giờ</div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between mb-4">
                                            {/* Conditionally render the Apply button only if the user is not a company */}
                                            {role !== "company" && (
                                                <Link
                                                    className={`apply_job w-full text-center ${hasApplied ? "disabled !bg-neutral-300 !text-black" : ""}`}
                                                    to={hasApplied ? "#" : `/jobapplication/${job._id}`}
                                                    onClick={hasApplied ? (e) => e.preventDefault() : undefined}
                                                >
                                                    {hasApplied ? "Đã Nộp Đơn" : "Ứng Tuyển Ngay"}
                                                </Link>
                                            )}
                                        </div>
                                        <div className="d-flex flex-column justify-content-center">
                                            <div className="detail_companyname"><i className="bi bi-geo-alt"></i>{job.location.address}</div>
                                            <div className="detail_companyname"><i className="bi bi-person-workspace"></i>{job.workType}</div>
                                            <div className="detail_companyname"><i className="bi bi-clock"></i>{new Date(job.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="mr-3">Skills:</span>
                                        <ul className="job_skills">
                                            {job.skills && job.skills.map((item) => (
                                                <li key={item}>
                                                    <a href="#">{item}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Job description */}
                                <div className="detail_sec mt-4">
                                    <div className="detail_sec_title">Mô tả công việc</div>
                                    {/* <div className="detail_job_description">
                                        <ul>
                                            {paragraphs.map((p, index) => (
                                                <li key={index}>{p}</li>
                                            ))}
                                        </ul>
                                    </div> */}
                                    <div className="text-gray-500 leading-5 text-left overflow-hidden text-ellipsis break-words whitespace-pre-wrap ml-1 flex flex-col">
                                        {isHtml(job.description) ? (
                                            // Nếu mô tả là HTML, hiển thị trực tiếp
                                            <div
                                                className="prose prose-lg max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(job.description),
                                                }}
                                            />
                                        ) : (
                                            // Nếu mô tả là văn bản thuần, thêm dấu chấm đầu dòng
                                            <div className="prose prose-lg max-w-none">
                                                <ul className="list-disc list-inside p-0">
                                                    {job.description.split('\n').map((line, index) => (
                                                        line.trim() !== '' && <li key={index}>{line}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>



                                {/* Similar jobs section */}
                                <div className="my-4">
                                    <div className="detail_sec_title mb-4">Các công việc tương tự cho bạn:</div>
                                    <div className="detail_sec">
                                        <div className="detail_job_description">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h1>Nhận thông tin công việc tương tự qua email</h1>
                                                <div>
                                                    <button className="detail_regis">
                                                        <i className="bi bi-bell-fill"></i>Đăng ký
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Related job posts */}
                                <div className="posts-section">
                                    {relatedJobs.map((post) => (
                                        <div key={post._id}>
                                            <PostItem post={post} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Company sidebar */}
                            <CompanyIntroduce job={job.author.userdata} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default JobDetail;
