import './index.css';
import React, { useState, useEffect } from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import { Menu, MenuItem, IconButton, Fade, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Avatar } from 'antd';
import ReportBugModal from "../Report/index.jsx";

const Header = ({ isSidebarOpen }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isProfile, setIsProfile] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleReportBug = () => {
        setIsModalOpen(true);
    };

    const handleCreateMenuClick = () => {
        navigate("/quiz")
    };

    const handleClose = (profile) => {
        setAnchorEl(null);
        setIsProfile(profile);
    };

    const handleCreateMenuClose = () => {
        setOpenDialog(false);
    };

    const handleDialogOptionClick = (option) => {
        navigate("/quiz")
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
                    <BugReportIcon className="icon" onClick={handleReportBug}/>
                    Báo lỗi
                </button>

                <ReportBugModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}/>
                {/* Nút Tạo đề thi */}
                <button className="create-button" onClick={handleCreateMenuClick}>
                    <AddBoxIcon className="icon"/>
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
                        <BadgeIcon className="icon"/>
                        Hồ sơ
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(false)}>
                        <LogoutIcon className="icon"/>
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Header;
