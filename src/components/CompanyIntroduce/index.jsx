// src/components/CompanyIntroduce.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { TeamOutlined, GlobalOutlined, HomeOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const CompanyIntroduce = ({ job }) => {
    if (!job) {
        return <div>Thông tin công ty không có sẵn.</div>;
    }

    const company = job;
    console.log(company)
    return (
        <div className="bg-white shadow-md rounded-[4px] p-6 col-4 h-fit">
            <div className="flex items-center mb-4">
                <img
                    src={company.profilePictureUrl}
                    className="w-20 h-20 p-1 border border-gray-600 rounded-full mr-4 object-contain"
                />
                <div>
                    <Link to={`/company/${company._id}`} className="text-xl font-bold">
                        {company.companyname}
                    </Link>
                    <p className="text-gray-600">{company.field}</p>
                </div>
            </div>
            <div className="mb-4">
                <p ><TeamOutlined /> {company.numberOfEmployees}</p>
                <p><GlobalOutlined /> {company.location?.country || "N/A"}</p>
                {company.location?.address.map((address,index) => (<p key={index}><HomeOutlined /> {address || "N/A"}</p>))}

            </div>
            <div className="flex flex-wrap">
                {company.socialMediaLinks.websiteUrl && (
                    <Tag color="blue">
                        <a href={company.socialMediaLinks.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
                    </Tag>
                )}
                {company.socialMediaLinks.facebook && (
                    <Tag color="blue">
                        <a href={company.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                    </Tag>
                )}
                {/* Thêm các liên kết mạng xã hội khác nếu có */}
            </div>
        </div>
    );
};

export default CompanyIntroduce;
