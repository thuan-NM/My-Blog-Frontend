import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import postServices from "../../services/post.services";

const MostInterest = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await postServices.getMostInterestJobs();
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [data]);
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (user == null) {
        return <p>No results found1.</p>;
    }
    return (
        <div className="widget widget-jobs">
            <div className="sd-title">
                <h3>Được Quan Tâm Nhất</h3>
                <i className="la la-ellipsis-v"></i>
            </div>
            <div className="jobs-list">
                {data.map((post) =>
                    <div className="job-info" key={post._id}>
                        <div className="job-details">
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                        </div>
                        <div className="hr-rate">
                            <span>${post.price} / hr</span>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default MostInterest;
