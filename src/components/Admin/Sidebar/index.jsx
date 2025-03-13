import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import {RiVipCrownLine} from "react-icons/ri";
import {MdOutlineAnalytics, MdOutlineManageAccounts, MdOutlinePayment} from "react-icons/md";

import {FaChevronDown, FaChevronUp, FaCog, FaUserAlt, FaBug} from "react-icons/fa";
import {SlArrowLeft, SlArrowRight} from "react-icons/sl";
import {SiGoogleclassroom} from "react-icons/si";
import {PiExamBold} from "react-icons/pi";
import {BsFillQuestionOctagonFill} from "react-icons/bs";
import {AiOutlineProduct} from "react-icons/ai";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const [isUserOpen, setIsUserOpen] = useState(false);
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
                    <div className="menu-title" onClick={() => {
                        setIsUserOpen(!isUserOpen)
                        navigate("/admin")
                    }}>
                        <MdOutlineAnalytics  style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Dashboard</span>}
                        {isOpen && (isUserOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsClassOpen(!isClassOpen)}>
                        <MdOutlineManageAccounts style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Nghiệp vụ chính</span>}
                        {isOpen && (isClassOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isClassOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("/admin/users")}>
                                <FaUserAlt style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý user'}
                            </li>
                            <li onClick={() => navigate("/admin/classes")}>
                                <SiGoogleclassroom
                                    style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý lớp học'}
                            </li>
                            <li onClick={() => navigate("/admin/exams")}>
                                <PiExamBold
                                    style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý đề thi'}
                            </li>
                            <li onClick={() => navigate("/admin/questions")}>
                                <BsFillQuestionOctagonFill
                                    style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Thư viện câu hỏi'}
                            </li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsExamOpen(!isExamOpen)}>
                        <AiOutlineProduct style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Sản phầm và doanh thu</span>}
                        {isOpen && (isExamOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isExamOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("/admin/service-packages")}>
                                <RiVipCrownLine style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý gói dịch vụ'}
                            </li>
                            <li onClick={() => navigate("/admin/payments")}>
                                <MdOutlinePayment style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý hóa đơn'}
                            </li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsServiceOpen(!isServiceOpen)}>
                        <FaCog style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Bảo trì</span>}
                        {isOpen && (isServiceOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isServiceOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("/admin/reports")}>
                                <FaBug style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Báo lỗi và góp ý'}
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            <div className="footer">
                <p>© Hoang Graduation 2021 - 2024</p>
            </div>

            <button onClick={toggleSidebar} className="toggle-btn">
                {isOpen ? <SlArrowLeft/> : <SlArrowRight/>}
            </button>
        </div>
    );
};

export default AdminSidebar;
