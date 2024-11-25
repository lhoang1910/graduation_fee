import React from 'react';
import './index.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <img
                src="https://studio.eduquiz.vn/assets/images/errors/404.svg"
                alt="404 Not Found"
                className="not-found-image"
            />
            <h1>Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.</h1>
            <p>Không tìm thấy trang</p>
            <p>Rất xin lỗi, trang web này hiện không tồn tại.</p>
            <button onClick={() => window.location.href = '/'} className="back-home-btn">
                Quay lại trang chủ
            </button>
        </div>
    );
};

export default NotFound;
