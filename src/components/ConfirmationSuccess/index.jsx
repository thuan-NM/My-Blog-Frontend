import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationSuccess = () => {
    return (
        <div className="!h-full mt-40">
            <div className="bg-white px-8 py-12 rounded-lg shadow max-w-lg text-center mx-auto">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                    <div className='animate__animated animate__slow animate__headShake animate__infinite my-3'>
                        <i className="bi bi-check-circle-fill icon-success" style={{ fontSize: '64px' }}></i>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận đơn ứng tuyển thành công!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Bạn đã xác nhận việc ứng tuyển cho công việc thành công <br/>Chúng tôi rất mong đợi để có thể gặp mặt bạn<br/>Vui lòng đợi thông báo về thời gian phỏng vấn, chúng tôi sẽ liên hệ bạn sớm nhất có thể!
                </p>
                <Link to={"/"} className=" px-6 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition duration-300 ease-in-out">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default ConfirmationSuccess;
