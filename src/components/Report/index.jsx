import React, { useState } from "react";
import {Modal, Input, notification, Button} from "antd";
import { callCreateReport } from "../../services/api.js";
import {EditOutlined, MessageOutlined} from "@ant-design/icons";

const ReportBugModal = ({ isOpen, setIsOpen }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        const resUserDetail = await callCreateReport(title, content);
        if (resUserDetail?.success) {
            notification.success({
                message: resUserDetail?.message,
            });
            setIsOpen(false);
        } else {
            notification.error({
                message: resUserDetail?.message,
            });
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "1.5rem" }}>
                    <MessageOutlined style={{ fontSize: "1.8rem" }} />
                    <span>Báo lỗi & Góp ý</span>
                </div>
            }
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={[
                <Button key="cancel" size="large" onClick={() => setIsOpen(false)}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" size="large" onClick={handleSubmit}>
                    Gửi
                </Button>,
            ]}
            style={{ fontSize: "1.2rem" }}
        >
            <Input
                prefix={<EditOutlined style={{ fontSize: "1.5rem" }} />}
                placeholder="Tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    marginBottom: 15,
                    borderRadius: 10,
                    padding: "12px",
                    fontSize: "1.3rem",
                }}
            />
            <Input.TextArea
                placeholder="Nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                    marginBottom: 15,
                    borderRadius: 10,
                    padding: "12px",
                    fontSize: "1.3rem",
                }}
                rows={5}
            />
        </Modal>
    );
};

export default ReportBugModal;
