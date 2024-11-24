// src/pages/JobDetailEditing.js

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import postServices from "../../services/post.services";
import jobstatusServices from "../../services/jobstatus.services";
import { useAuth } from "../../contexts/AuthContext";
import PostItem from "../../components/PostItem";
import CompanyIntroduce from "../../components/CompanyIntroduce";
import DOMPurify from 'dompurify';
import JobForm from "../../components/JobForm"; // Import the shared JobForm component

function isHtml(input) {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(input);
}

const JobDetailEditing = () => {
    const { role, user } = useAuth(); // Get user info from context
    const [job, setJob] = useState({});
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false); // State for application status
    const [editableJob, setEditableJob] = useState({
        title: '',
        price: '',
        location: {
            address: ''
        },
        workType: '',
        description: '',
        skills: [],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState(null);
    const { postId } = useParams(); // Get postId from URL params

    useEffect(() => {
        const fetchPostAndStatus = async () => {
            try {
                // Fetch the job details
                const postResponse = await postServices.getJobsWithId(postId);
                setJob(postResponse.data);
                setEditableJob({
                    title: postResponse.data.title || '',
                    price: postResponse.data.price || '',
                    location: { address: postResponse.data.location.address || '' },
                    workType: postResponse.data.workType || '',
                    description: postResponse.data.description || '',
                    skills: postResponse.data.skills || [],
                });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setEditableJob((prev) => ({
                ...prev,
                location: { ...prev.location, [field]: value },
            }));
        } else if (name === 'skills') {
            // Assuming skills are comma-separated
            setEditableJob((prev) => ({
                ...prev,
                skills: value.split(',').map(skill => skill.trim()),
            }));
        } else {
            setEditableJob((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle changes from ReactQuill
    const handleDescriptionChange = (content, delta, source, editor) => {
        setEditableJob((prev) => ({
            ...prev,
            description: content,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        setError(null);

        try {
            // Prepare the updated job data
            const updatedJob = {
                title: editableJob.title,
                price: editableJob.price,
                "location.address": editableJob.location,
                workType: editableJob.workType,
                description: editableJob.description,
                skills: editableJob.skills,
            };
            console.log(updatedJob);
            // Call the update service
            await postServices.updatePostWithId(updatedJob, postId);

            // Refetch the job details to ensure data consistency
            const postResponse = await postServices.getJobsWithId(postId);
            setJob(postResponse.data);
            setEditableJob({
                title: postResponse.data.title || '',
                price: postResponse.data.price || '',
                location: { address: postResponse.data.location.address || '' },
                workType: postResponse.data.workType || '',
                description: postResponse.data.description || '',
                skills: postResponse.data.skills || [],
            });

            setIsEditing(false);
        } catch (err) {
            console.error("Error updating job:", err);
            setError("Failed to update job. Please try again.");
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleCancelEdit = () => {
        // Revert changes by resetting editableJob to original job details
        setEditableJob({
            title: job.title || '',
            price: job.price || '',
            location: { address: job.location.address || '' },
            workType: job.workType || '',
            description: job.description || '',
            skills: job.skills || [],
        });
        setIsEditing(false);
        setError(null);
    };

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

    return (
        <main>
            <div className="main-section">
                <div className="container">
                    <div className="main-section-data">
                        <div className="row">
                            {/* Main Content Area */}
                            <div className="col-lg-8 col-md-4 pd-left-none no-pd">
                                <div className="detail_sec">
                                    {/* Toggle between View and Edit Mode */}
                                    {isEditing ? (
                                        <JobForm
                                            editableJob={editableJob}
                                            handleInputChange={handleInputChange}
                                            handleDescriptionChange={handleDescriptionChange}
                                            handleSubmit={handleUpdate}
                                            isSubmitting={loadingUpdate}
                                            error={error}
                                            modules={JobForm.modules}
                                            formats={JobForm.formats}
                                            isEditing={isEditing}
                                            handleCancel={handleCancelEdit}
                                        />
                                    ) : (
                                        <>
                                            {/* Job Details View */}
                                            <div>
                                                {role === "company" && user._id === job.author.userdata._id && (
                                                    <div className="flex flex-row justify-between">
                                                        <h2>{job.title}</h2>
                                                        <button
                                                            className="edit-info"
                                                            onClick={() => setIsEditing(true)}
                                                        >
                                                            <i className="bi bi-pencil-fill w-auto h-auto"></i>
                                                        </button>
                                                    </div>
                                                )}
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
                                                    {/* Show Edit button if the user is the author and in "company" role */}
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
                                        </>
                                    )}
                                </div>

                                {/* Job Description */}
                                {!isEditing && (
                                    <div className="detail_sec mt-4">
                                        <div className="detail_sec_title">Mô tả công việc</div>
                                        <div className="text-gray-500 leading-5 text-left overflow-hidden text-ellipsis break-words whitespace-pre-wrap ml-1 flex flex-col">
                                            {isHtml(job.description) ? (
                                                // If description is HTML, display it directly
                                                <div
                                                    className="prose prose-lg max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(job.description),
                                                    }}
                                                />
                                            ) : (
                                                // If description is plain text, add bullet points
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
                                )}

                                {/* Similar Jobs Section */}
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

                                {/* Related Job Posts */}
                                <div className="posts-section">
                                    {relatedJobs.map((post) => (
                                        <div key={post._id}>
                                            <PostItem post={post} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Company Sidebar */}
                            <div className="col-lg-4 pd-right-none no-pd">
                                <CompanyIntroduce job={job.author.userdata} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// Define ReactQuill modules and formats for JobForm
JobDetailEditing.modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

JobDetailEditing.formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
];

export default JobDetailEditing;
