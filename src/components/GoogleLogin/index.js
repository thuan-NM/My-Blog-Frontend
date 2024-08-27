import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import authServices from '../../services/auth.services';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from "../../contexts/AuthContext";

const clientId = '216765626838-4hlcbvu5uqmnvar12i82v5oueltfb0f1.apps.googleusercontent.com'; // Thay thế bằng Google Client ID của bạn

const GoogleLoginButton = () => {
    const navigate = useNavigate();
	const { login } = useAuth();

    const handleLoginSuccess = async (credentialResponse) => {
        const decodedToken = jwtDecode(credentialResponse.credential);
        console.log('Login Success:', credentialResponse.credential);
        // Bạn có thể sử dụng thông tin người dùng từ decodedToken
        try {
            const res = await authServices.signInWithGoogle(credentialResponse.credential)
            if (res.isSuccess === 1) {
                const { user, token } = res;
                login(user, token);
                message.success(res.message)
                navigate("/")
            }
        }
        catch (error) {
            console.log(error)
            message.error(error.response.data.message)
        }
    };

    const handleLoginError = () => {
        console.error('Login Error');
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    prompt="select_account" // Luôn hiển thị tùy chọn đăng nhập
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
