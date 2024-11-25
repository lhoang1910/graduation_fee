import React, { useState } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [isPersonalOpen, setIsPersonalOpen] = useState(false);
    const [isManagementOpen, setIsManagementOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header" onClick={()=> {navigate("/")}} style={{cursor: "pointer"}}>
                <img src="https://studio.eduquiz.vn/assets/images/logo_128x128.png" alt="GRADUATION" className="logo" />
                {isOpen && <h2>GRADUATION</h2>}
            </div>

            <div className="menu">
                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsPersonalOpen(!isPersonalOpen)}>
                        <i className="icon-user"></i> {isOpen && 'Cá nhân'}
                    </div>
                    {isPersonalOpen && isOpen && (
                        <ul className="submenu">
                            <li><i className="icon-library"></i> Thư viện của tôi</li>
                            <li><i className="icon-recent"></i> Truy cập gần đây</li>
                            <li><i className="icon-favorite"></i> Đề thi yêu thích</li>
                            <li><i className="icon-results"></i> Kết quả thi của tôi</li>
                            <li><i className="icon-explore"></i> Khám phá</li>
                            <li><i className="icon-leaderboard"></i> BXH thi đua</li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsManagementOpen(!isManagementOpen)}>
                        <i className="icon-management"></i> {isOpen && 'Quản lý'}
                    </div>
                    {isManagementOpen && isOpen && (
                        <ul className="submenu">
                            <li><i className="icon-exam"></i> Đề thi</li>
                            <li onClick={() => {navigate("/classes")    }}><i className="icon-classroom" ></i> Lớp học tập</li>
                            <li><i className="icon-category"></i> Chuyên mục</li>
                            <li><i className="icon-package"></i> Gói dịch vụ</li>
                            <li><i className="icon-settings"></i> Cài đặt</li>
                        </ul>
                    )}
                </div>
            </div>

            <div className="footer">
                <p>Hỗ trợ tư vấn</p>
                <p>© Hoang Graduation 2021 - 2024</p>
            </div>

            <button onClick={toggleSidebar} className="toggle-btn">
                {isOpen ? '<' : '>'}
            </button>
        </div>
    );
};

export default Sidebar;
