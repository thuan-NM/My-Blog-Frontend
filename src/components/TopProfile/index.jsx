import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useAuth } from "../../contexts/AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import userServices from "../../services/user.services";
import UserItem from "../UserItem";

const TopProfile = () => {
    const settings = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 800,
        cssEase: "linear",
        dots: false,
        swipeToSlide: false,
        nextArrow: false,
        prevArrow: false,
    };
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await userServices.getUsersList();
                setData(usersResponse.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [data]);

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

    if (user == null || isLoading) {
        return <p>No results found1.</p>;
    }
    return (
        <div className="slider-container">
            <Slider {...settings}>
                {data.map((curUser) =>
                // Check if the user is logged in before displaying the information
                (user && user._id && user._id != curUser._id && (
                    <div className="!h-full scale-[0.95]" key={curUser._id}>
                        <UserItem userdata={curUser} />
                        {/* <img src={curUser.profilePictureUrl || `../images/userava.jpg`} />
                        <h3>{curUser.lastName}</h3>
                        <span>Graphic Designer</span>
                        <ul>
                            <li><a href="#" title="" className="follow">Theo dõi</a></li>
                            <li><a href="#" title="" className="message-us"><i className="fa fa-envelope"></i></a></li>
                            <li><a href="#" title="" className="hire-us">Tuyển</a></li>
                        </ul>
                        <Link to={`/userprofile/${curUser._id}`}>Xem trang cá nhân</Link> */}
                    </div>
                ))
                )}
            </Slider >
        </div>

    );
}

export default TopProfile;
