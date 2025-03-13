import React, { useState } from "react";
import { Modal, Button, Descriptions, Tag } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, CalendarOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const UserDetailModal = ({ visible, onClose, user }) => {
    return (
        <Modal
            title="👤 Thông Tin Chi Tiết Người Dùng"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            centered
        >
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã Người Dùng" labelStyle={{ fontWeight: "bold" }}>
                    <IdcardOutlined /> {user?.code}
                </Descriptions.Item>
                <Descriptions.Item label="Họ & Tên" labelStyle={{ fontWeight: "bold" }}>
                    <UserOutlined /> {user?.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại" labelStyle={{ fontWeight: "bold" }}>
                    <PhoneOutlined /> {user?.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Email" labelStyle={{ fontWeight: "bold" }}>
                    <MailOutlined /> {user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Giới Tính" labelStyle={{ fontWeight: "bold" }}>
                    {user?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Sinh Nhật" labelStyle={{ fontWeight: "bold" }}>
                    <CalendarOutlined /> {dayjs(user?.birthDay).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Vai Trò" labelStyle={{ fontWeight: "bold" }}>
                    <TeamOutlined /> {user?.role}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Tham Gia" labelStyle={{ fontWeight: "bold" }}>
                    <CalendarOutlined /> {dayjs(user?.createdAt).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái" labelStyle={{ fontWeight: "bold" }}>
                    {user?.active ? (
                        <Tag icon={<CheckCircleOutlined />} color="green">
                            Khả dụng
                        </Tag>
                    ) : (
                        <Tag icon={<CloseCircleOutlined />} color="red">
                            Vô hiệu
                        </Tag>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default UserDetailModal;
