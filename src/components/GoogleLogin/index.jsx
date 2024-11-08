import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import authServices from '../../services/auth.services';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from "../../contexts/AuthContext";

const clientId = '216765626838-4hlcbvu5uqmnvar12i82v5oueltfb0f1.apps.googleusercontent.com'; // Replace with your Google Client ID

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            // Ensure the credential exists
            if (!credentialResponse.credential) {
                throw new Error('No credential returned from Google login');
            }

            // Decode the token to get user details if needed
            const decodedToken = jwtDecode(credentialResponse.credential);
            console.log('Login Success:', decodedToken);

            // Send the credential to your backend for further verification
            const res = await authServices.signInWithGoogle(credentialResponse.credential);
            if (res.isSuccess === 1) {
                const { user, token } = res;
                login(user, token);
                message.success(res.message);
                navigate("/");
            } else {
                message.error(res.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Error during login process:', error);
            message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    const handleLoginError = () => {
        console.error('Login Error');
        message.error('Đăng nhập bằng Google gặp sự cố.');
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div style={buttonWrapperStyle}>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    prompt="select_account" // Always show account selection prompt
                />
            </div>
        </GoogleOAuthProvider>
    );
};

// Optional: Custom styles for button wrapper (if you need additional styling)
const buttonWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
};

export default GoogleLoginButton;
