import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Slider from "react-slick";
import { useAuth } from "../../contexts/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const TopProfile = () => {
    const settings = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 800,
        cssEase: "linear"
    };
    const { user } = useAuth();
    const { data, isLoading, error } = useQuery(
        ["users", user],
        () =>
            axios
                .get(
                    `http://localhost:3001/users`
                )
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
        <div>
            <Slider {...settings}>
                {data.data.map((curUser) =>
                // Check if the user is logged in before displaying the information
                (user && user._id && user._id != curUser._id && (
                    <div className="user-profy slick-slide" key={curUser._id}>
                        <img src={curUser.profilePictureUrl || `images/userava.jpg`} />
                        <h3>{curUser.lastName}</h3>
                        <span>Graphic Designer</span>
                        <ul>
                            <li><a href="#" title="" className="follow">Theo dõi</a></li>
                            <li><a href="#" title="" className="message-us"><i className="fa fa-envelope"></i></a></li>
                            <li><a href="#" title="" className="hire-us">Tuyển</a></li>
                        </ul>
                        <Link to={`/userprofile/${curUser._id}`}>Xem trang cá nhân</Link>
                    </div>
                ))
                )}
            </Slider >
        </div >
    );
}

export default TopProfile;
