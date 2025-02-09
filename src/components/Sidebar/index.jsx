import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaArrowRight,
    FaBook,
    FaChalkboardTeacher, FaChevronDown, FaChevronUp,
    FaClipboardList,
    FaCog,
    FaRegHeart,
    FaUser,
    FaUserAlt
} from "react-icons/fa";
import {MdAssignment, MdLibraryBooks, MdSchool} from "react-icons/md";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isExamOpen, setIsExamOpen] = useState(false);
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header" onClick={() => {
                navigate("/")
            }} style={{cursor: "pointer"}}>
                <img src="https://studio.eduquiz.vn/assets/images/logo_128x128.png" alt="GRADUATION" className="logo"/>
                {isOpen && <h2>GRADUATION</h2>}
            </div>

            <div className="menu">
                <div className="menu-item">
                    <div className="menu-title" onClick={() => navigate("/")}>
                        <FaUser style={{marginRight: '12px', fontSize: '20px'}}/>
                        {isOpen && <span>Cá nhân</span>} {/* Show text only when open */}
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsClassOpen(!isClassOpen)}>
                        <FaChalkboardTeacher style={{marginRight: '12px', fontSize: '20px'}}/>
                        {isOpen && <span>Lớp học</span>} {/* Show text only when open */}
                        {isClassOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px'}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px'}}/>
                        )}
                    </div>
                    {isClassOpen && isOpen && (
                        <ul className="submenu">
                            <li><FaRegHeart
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Lớp học của tôi'}</li>
                            <li><MdLibraryBooks
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Lớp học gần đây'}</li>
                            <li><FaClipboardList
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Lớp học đã tạo'}</li>
                        </ul>
                    )}
                </div>
                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsExamOpen(!isExamOpen)}>
                        <MdAssignment style={{marginRight: '12px', fontSize: '20px'}}/>
                        {isOpen && <span>Đề thi</span>} {/* Show text only when open */}
                        {isExamOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px'}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px'}}/>
                        )}
                    </div>
                    {isExamOpen && isOpen && (
                        <ul className="submenu">
                            <li><FaRegHeart
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Đề thi của tôi'}</li>
                            <li><MdLibraryBooks
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Đề thi gần đây'}</li>
                            <li><FaClipboardList
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Đề thi đã tạo'}</li>
                            <li><FaUserAlt
                                style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Kết quả của tôi'}</li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsServiceOpen(!isServiceOpen)}>
                        <FaCog style={{marginRight: '12px', fontSize: '20px'}}/>
                        {isOpen && <span>Dịch vụ</span>} {/* Show text only when open */}
                        {isServiceOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px'}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px'}}/>
                        )}
                    </div>
                    {isServiceOpen && isOpen && (
                        <ul className="submenu">
                            <li><FaUserAlt style={{marginRight: '10px', fontSize: '18px'}} onClick={() => {
                                navigate("/limitations")
                            }}/>{isOpen && 'Gói giới hạn'}</li>
                            <li><MdSchool style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Khác'}</li>
                            <li><FaBook style={{marginRight: '10px', fontSize: '18px'}}/>{isOpen && 'Mã nguồn'}</li>
                        </ul>
                    )}
                </div>
            </div>

            <div className="footer">
                <p>Hỗ trợ tư vấn</p>
                <p>© Hoang Graduation 2021 - 2024</p>
            </div>

            <button onClick={toggleSidebar} className="toggle-btn">
                {isOpen ? <FaArrowLeft/> : <FaArrowRight/>}
            </button>
        </div>
    );
};

export default Sidebar;
