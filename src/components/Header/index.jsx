import './index.css';
import React, {useState, useEffect} from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import {Menu, MenuItem, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@mui/material';
import {useNavigate} from "react-router-dom";
import ReportBugModal from "../Report/index.jsx";
import {Avatar, Card, Modal, Typography, Col, Row} from 'antd';

const {Title, Text} = Typography;

import {CodeOutlined, EditOutlined, FileTextOutlined} from '@ant-design/icons';
import ServicePackage from "../CurrentLimitation/index.jsx";
import {callCurrentUserLimitation} from "../../services/api.js";
import {MdOutlineDashboardCustomize} from "react-icons/md";

const Header = ({isSidebarOpen}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isProfile, setIsProfile] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isLimitationModalOpen, setIsLimitationModalOpen] = useState(false);
    const [limitation, setLimitation] = useState(null);
    const navigate = useNavigate();

    const fetchUserLimitation = async () => {
        const res = await callCurrentUserLimitation();
        return res?.data;
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleReportBug = () => {
        setIsReportModalOpen(true);
    };

    const handleClose = (profile) => {
        setAnchorEl(null);
        setIsProfile(profile);
    };

    const handleCreateMenuClose = () => {
        setOpenDialog(false);
    };

    const handleDialogOptionClick = (option) => {
        setOpenDialog(true)
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isProfile !== null) {
            if (isProfile) {
                navigate('/profile');
            } else {
                localStorage.removeItem('access_token');
                navigate('/login');
            }
            setIsProfile(null);
        }
    }, [isProfile, navigate]);

    return (
        <div className={`header ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
            {/* Nội dung Header */}
            <div className="search-bar-container">
                {/* Thanh tìm kiếm */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đề thi"
                        className="search-input"
                    />
                </div>
            </div>

            {/* Các nút và Avatar */}
            <div className="action-buttons">
                <button className="report-button" onClick={handleReportBug}>
                    <BugReportIcon className="header-icon" onClick={handleReportBug}/>
                    Báo lỗi
                </button>

                <ReportBugModal isOpen={isReportModalOpen} setIsOpen={setIsReportModalOpen}/>
                {/* Nút Tạo đề thi */}
                <button className="create-button" onClick={showModal}>
                    <AddBoxIcon className="header-icon"/>
                    Tạo đề thi
                </button>
                <ServicePackage isOpen={isLimitationModalOpen} setIsOpen={setIsLimitationModalOpen}
                                limitation={limitation}/>
                <IconButton onClick={handleAvatarClick}>
                    <Avatar
                        style={{
                            backgroundColor: "red",
                            verticalAlign: 'middle',
                        }}
                        size="large"
                        gap={1}
                    >
                        {localStorage.getItem("FirstNameChar").trim().charAt(0).toUpperCase()}
                    </Avatar>
                </IconButton>

                <Dialog open={openDialog} onClose={handleCreateMenuClose}>
                    <DialogTitle>Chọn phương thức tạo đề thi</DialogTitle>
                    <DialogContent>
                        <Button onClick={() => handleDialogOptionClick('Tạo thủ công')} fullWidth>
                            Tạo thủ công
                        </Button>
                        <Button onClick={() => handleDialogOptionClick('Import từ file')} fullWidth>
                            Import từ file (PDF, Word, Excel)
                        </Button>
                        <Button onClick={() => handleDialogOptionClick('Trợ lý AI')} fullWidth>
                            Trợ lý AI
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCreateMenuClose} color="secondary">
                            Hủy
                        </Button>
                    </DialogActions>
                </Dialog>
                <Modal
                    title="Tạo đề thi mới"
                    open={isModalOpen}
                    onCancel={closeModal}
                    footer={null}
                    width={800}
                    style={{textAlign: "center"}}
                >
                    <Row gutter={16} justify="center">
                        {/* Card 1 */}
                        <Col span={8}>
                            <Card
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                }}
                                onClick={() => {
                                    closeModal();
                                    navigate("workspace/exams/create-with-ai")
                                }}
                            >
                                <FileTextOutlined style={{fontSize: "40px", color: "#722ed1"}}/>
                                <Title level={4} style={{marginTop: "10px"}}>
                                    Trợ lý AI
                                </Title>
                                <Text>Tạo đề thi nhanh hơn với trợ lý AI</Text>
                            </Card>
                        </Col>

                        {/* Card 2 */}
                        <Col span={8}>
                            <Card
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                }}
                                onClick={() => {
                                    closeModal();
                                    navigate("/workspace/exams/create-with-file?tab=upload_file_quiz")
                                }}
                            >
                                <CodeOutlined style={{fontSize: "40px", color: "#13c2c2"}}/>
                                <Title level={4} style={{marginTop: "10px"}}>
                                    Import từ file
                                </Title>
                                <Text>Tạo đề thi nhanh bằng cách import file pdf hoặc docx</Text>
                            </Card>
                        </Col>

                        {/* Card 3 */}
                        <Col span={8}>
                            <Card
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                }}
                                onClick={() => {
                                    closeModal();
                                    navigate("/workspace/exams/news")
                                }}
                            >
                                <EditOutlined style={{fontSize: "40px", color: "#fadb14"}}/>
                                <Title level={4} style={{marginTop: "10px"}}>
                                    Trình soạn thảo
                                </Title>
                                <Text>Tạo đề thi từ đầu và chỉnh sửa thủ công</Text>
                            </Card>
                        </Col>
                    </Row>
                </Modal>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {localStorage.getItem("role") === "Quản trị viên" && (<MenuItem onClick={() => navigate("/admin")}>
                        <MdOutlineDashboardCustomize className="icon"/>
                        Admin Dashboard
                    </MenuItem>)}
                    <MenuItem onClick={() => handleClose(true)}>
                        <BadgeIcon className="icon"/>
                        Hồ sơ
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose(false)
                        localStorage.clear();
                    }}>
                        <LogoutIcon className="icon"/>
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Header;
