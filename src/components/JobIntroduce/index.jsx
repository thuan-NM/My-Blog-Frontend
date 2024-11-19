import React from 'react'
import { Link } from 'react-router-dom'

const JobIntroduce = ({ job }) => {
    return (
        <div className="col-lg-4 pd-right-none no-pd">
            <div className="right-sidebar">
                <div className="company_intro">
                    <div className="company_intro_title">
                        <div className="company_intro_info">
                            <p className='!text-2xl'>{job.title}</p>
                            <Link to={`/jobdetail/${job._id}`} className='!underline !text-neutral-400 hover:!text-[#e44d3a]'>Xem thông tin chi tiết công việc</Link>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Post by:</div>
                            <div>{job.author?.userdata.companyname}</div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Lương:</div>
                            <div>{job.price}$/hr</div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Hình thức làm việc:</div>
                            <div>{job.workType}</div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Skills:</div>
                            <div className='detail_sec !p-0 w-3/4'>
                                <ul className="job_skills !w-fit">
                                    {job.skills && job.skills.map((item) => (
                                        <li className="w-fit" key={item}>
                                            <a>{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Address:</div>
                            <p className="!text-sm !w-2/3 text-black">{job.location.address}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobIntroduce