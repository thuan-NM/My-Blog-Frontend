import React from 'react'
import { Link } from 'react-router-dom'

const CompanyIntroduce = ({job}) => {
    return (
        <div className="col-lg-4 pd-right-none no-pd">
            <div className="right-sidebar">
                <div className="company_intro">
                    <div className="company_intro_title">
                        <img src={job.author?.userdata.profilePictureUrl} alt="" />
                        <div className="company_intro_info">
                            <p>{job.author?.userdata.companyname}</p>
                            <Link className='!underline !text-neutral-400 hover:!text-[#e44d3a]'>Xem thông tin công ty</Link>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Company type:</div>
                            <div>{job.author?.userdata.field}</div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Company size:</div>
                            <div>{job.author?.userdata.numberOfEmployees}</div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Country:</div>
                            <div>{job.author?.userdata.location.country}</div>
                        </div>
                        <div className="d-flex justify-content-between intro_item">
                            <div className="intro_item_name">Address:</div>
                            <ul>
                                {job.author?.userdata.location.address.map((item) => (
                                    <li className="intro_item_content" key={item}><i className="bi bi-dot"></i>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyIntroduce
