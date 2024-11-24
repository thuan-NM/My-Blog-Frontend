import React from 'react';
import { Link } from 'react-router-dom';
import { TeamOutlined, DollarCircleOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const JobIntroduce = ({ job }) => {
    if (!job) {
        return <div>Thông tin công việc không có sẵn.</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-[4px] p-6 col-4 h-fit w-full">
            <div className="flex flex-row mb-4 items-center">
                <img
                    src={job.author?.userdata.profilePictureUrl}
                    className="w-20 h-20 p-1 border border-gray-600 rounded-full mr-4 object-contain"
                />
                <div className='flex flex-col'>
                    <p className="text-xl font-bold">{job.title}</p>
                    <p><Link to={`/jobdetail/${job._id}`} className="underline text-neutral-400 hover:text-[#e44d3a]">
                        Xem thông tin chi tiết công việc
                    </Link>
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <p><TeamOutlined /> Đăng bởi: {job.author?.userdata.companyname || "N/A"}</p>
                <p><DollarCircleOutlined /> Lương: {job.price}$/hr</p>
                <p><ClockCircleOutlined /> Hình thức làm việc: {job.workType || "N/A"}</p>
            </div>
            <div className="mb-4">
                <div className='detail_sec p-0 flex items-center'>
                    <p className="font-semibold">Skills:</p>
                    <ul className="job_skills w-fit ">
                        {job.skills && job.skills.map((item) => (
                            <li className="w-fit mt-2" key={item}>
                                <Tag color="blue">{item}</Tag>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mb-4">
                <p><EnvironmentOutlined /> {job.location?.address || "N/A"}</p>
            </div>
        </div>
    );
};

export default JobIntroduce;
