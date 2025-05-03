import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import {RiCustomerService2Line, RiVipCrownLine} from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { MdWallet } from "react-icons/md";
import { VscHistory } from "react-icons/vsc";
import { LuListTodo } from "react-icons/lu";
import { MdOutlineDisplaySettings } from "react-icons/md";

import {
    FaChalkboardTeacher, FaChevronDown, FaChevronUp,
    FaClipboardList,
    FaCog,
    FaRegHeart,
    FaUser,
    FaCode
} from "react-icons/fa";
import {MdAssignment, MdExplore} from "react-icons/md";
import {SlArrowLeft, SlArrowRight} from "react-icons/sl";
import {QuestionCircleOutlined} from "@ant-design/icons";

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
                    <div className="menu-title" onClick={() => setIsUserOpen(!isUserOpen)}>
                        <FaUser style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Cá nhân</span>}
                        {isOpen && (isUserOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isUserOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("/")}>
                                <IoHome style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Thư viện của tôi'}
                            </li>
                            <li onClick={() => navigate("/limitation-wallet")}>
                                <MdWallet style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Ví của tôi'}
                            </li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsClassOpen(!isClassOpen)}>
                        <FaChalkboardTeacher style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Lớp học</span>}
                        {isOpen && (isClassOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isClassOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("classes/my-class")}>
                                <FaRegHeart style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Lớp học của tôi'}
                            </li>
                            <li onClick={() => navigate("classes/created-class")}>
                                <MdOutlineDisplaySettings style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý lớp học'}
                            </li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsExamOpen(!isExamOpen)}>
                        <MdAssignment style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Đề thi</span>}
                        {isOpen && (isExamOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isExamOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("/exam/explore")}>
                                <MdExplore style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Khám phá'}
                            </li>
                            <li onClick={() => navigate("/exam/created")}>
                                <MdOutlineDisplaySettings
                                    style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Quản lý đề thi'}
                            </li>
                            <li onClick={() => navigate("/question-bank")}>
                                <QuestionCircleOutlined style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Ngân hàng câu hỏi'}
                            </li>
                            <li onClick={() => navigate("/result-dashboard")}>
                                <LuListTodo style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Kết quả của tôi'}
                            </li>
                        </ul>
                    )}
                </div>

                <div className="menu-item">
                    <div className="menu-title" onClick={() => setIsServiceOpen(!isServiceOpen)}>
                        <FaCog style={{marginRight: '12px', fontSize: '30px', cursor: "pointer"}}/>
                        {isOpen && <span style={{cursor: "pointer"}}>Dịch vụ</span>}
                        {isOpen && (isServiceOpen ? (
                            <FaChevronUp style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ) : (
                            <FaChevronDown style={{marginLeft: 'auto', fontSize: '18px', cursor: "pointer"}}/>
                        ))}
                    </div>
                    {isServiceOpen && isOpen && (
                        <ul className="submenu">
                            <li onClick={() => navigate("/limitations")}>
                                <RiVipCrownLine style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Gói giới hạn'}
                            </li>
                            <li onClick={() => navigate("/source-code")}>
                                <FaCode style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Mã nguồn'}
                            </li>
                            <li onClick={() => navigate("/support")}>
                                <RiCustomerService2Line
                                    style={{marginRight: '10px', fontSize: '18px', cursor: "pointer"}}/>
                                {isOpen && 'Liên hệ hỗ trợ'}
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

export default Sidebar;
