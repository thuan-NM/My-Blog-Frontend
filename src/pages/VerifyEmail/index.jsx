import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Footer from "../../components/Footer";

function VerifyEmail() {
    const imagePath = process.env.PUBLIC_URL + '/images';

    const [message, setMessage] = useState('');
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/auth/verify-email?token=${token}`);
                // const res = await axios.get(`http://localhost:3001/companyauth/verify-email?token=${token}`);
                setMessage(res.data.message);
            } catch (error) {
                setMessage('Failed to verify email. Invalid or expired token.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage('No token provided.');
        }
    }, [token]);

    return (
        <div className="wrapper">
            <div className="sign-in-page">
                <div className="signin-popup">
                    <div className="signin-pop">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="cmp-info">
                                    <div className="cm-logo">
                                        <p><strong>"MeowWorking Center"</strong>, is a global freelancing platform and social networking where businesses and independent professionals connect and collaborate remotely</p>
                                    </div>
                                    <img src={`${imagePath}/cm-main-img.png`} alt="" />
                                </div>
                            </div>
                            <div className="d-flex col-lg-6 align-items-center justify-content-center">
                                <div className="d-flex flex-column text-center align-items-center">
                                    <h1 className="mb-5" style={{ fontSize: '24px' }}>{message}</h1>
                                    <div className='animate__animated animate__slow animate__headShake animate__infinite my-3'>
                                        <i className="bi bi-check-circle-fill icon-success" style={{ fontSize: '64px' }}></i>
                                    </div>
                                    <Link to={"/auth"}><button className='verifybutton'>
                                        Đăng nhập ngay
                                    </button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default VerifyEmail;
