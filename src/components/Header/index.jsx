import './index.css';
import React, { useState, useEffect } from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import { Menu, MenuItem, IconButton, Fade, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Modal,Typography,Col,Row, notification } from 'antd';
// import { Modal, Card, Row, Col, Typography } from "antd";
const { Title, Text } = Typography;

import { CodeOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';

const Header = ({ isSidebarOpen }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isProfile, setIsProfile] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCreateMenuClick = () => {
        setOpenDialog(true)
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
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
                <button className="report-button">
                    <BugReportIcon className="icon" />
                    Báo lỗi
                </button>
                {/* Nút Tạo đề thi */}
                <button className="create-button" onClick={showModal}>
                    <AddBoxIcon className="icon" />
                    Tạo đề thi
                </button>
                <IconButton onClick={handleAvatarClick}>
                    {/* <img
                        src="https://via.placeholder.com/30"
                        alt="User"
                        className="profile-avatar"
                    /> */}
                          <Avatar
        style={{
          backgroundColor: "red",
          verticalAlign: 'middle',
        }}
        size="large"
        gap={1}
      >
        K
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
                style={{textAlign:"center"}}
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
                            onClick={() => notification.error({message:"Chức năng tạo dề thi từ AI đang được phát triển"})}
                        >
                            <FileTextOutlined style={{ fontSize: "40px", color: "#722ed1" }} />
                            <Title level={4} style={{ marginTop: "10px" }}>
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
                            onClick={() => {closeModal();navigate("/workspace/exams/create-with-file?tab=upload_file_quiz")}}
                        >
                            <CodeOutlined style={{ fontSize: "40px", color: "#13c2c2" }} />
                            <Title level={4} style={{ marginTop: "10px" }}>
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
                            onClick={() => {closeModal();navigate("/workspace/exams/news")}}
                        >
                            <EditOutlined style={{ fontSize: "40px", color: "#fadb14" }} />
                            <Title level={4} style={{ marginTop: "10px" }}>
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
                    <MenuItem onClick={() => handleClose(true)}>
                        <BadgeIcon className="icon" />
                        Hồ sơ
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(false)}>
                        <LogoutIcon className="icon" />
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Header;
