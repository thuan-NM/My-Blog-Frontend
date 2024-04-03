import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Slider from "react-slick";
import { useAuth } from "../../contexts/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopJob = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useQuery(
        ["posts"],
        () =>
            axios
                .get(
                    `http://localhost:3001/posts/topjob`)
                .then((response) => response.data),
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching posts: {error.message}</p>;
    }

    if (data.data.length === 0 || data === null) {
        return <p>No results found.</p>;
    }

    if (user == null || user.friendRequests == null) {
        return <p>No results found1.</p>;
    }
    return (
        <div className="widget widget-jobs">
            <div className="sd-title">
                <h3>Việc Làm Hàng Đầu</h3>
                <i className="la la-ellipsis-v"></i>
            </div>
            <div className="jobs-list">
                {data.data.map((post) =>
                    <div className="job-info">
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

export default TopJob;
