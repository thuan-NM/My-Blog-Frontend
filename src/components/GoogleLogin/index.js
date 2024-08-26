import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const clientId = '216765626838-4hlcbvu5uqmnvar12i82v5oueltfb0f1.apps.googleusercontent.com'; // Thay thế bằng Google Client ID của bạn

const GoogleLoginButton = () => {
    const handleLoginSuccess = (credentialResponse) => {
        const decodedToken = jwtDecode(credentialResponse.credential);
        console.log('Login Success:', decodedToken);
        // Bạn có thể sử dụng thông tin người dùng từ decodedToken
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
