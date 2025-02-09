import React, { useState } from "react";
import { Modal, Input, notification } from "antd";
import { callCreateReport } from "../../services/api.js";

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
            title="Báo lỗi & Góp ý"
            visible={isOpen}
            onCancel={() => setIsOpen(false)}
            onOk={handleSubmit}
            okText="Gửi"
            cancelText="Hủy"
        >
            <Input
                placeholder="Tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input.TextArea
                placeholder="Nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ marginBottom: 10 }}
                rows={4}
            />
        </Modal>
    );
};

export default ReportBugModal;
