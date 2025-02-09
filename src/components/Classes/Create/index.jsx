import React, { useState } from "react";
import { Modal, Input, Button, notification } from "antd";
import {callCreateClass} from "../../../services/api.js";

const CreateClassModel = ({ isOpen, setIsOpen }) => {
    const [className, setClassName] = useState("");

    const handleSubmit = async () => {
        const resUserDetail = await callCreateClass(className);
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
            title="Tạo mới lớp học"
            visible={isOpen}
            onCancel={() => setIsOpen(false)}
            onOk={handleSubmit}
            okText="Gửi"
            cancelText="Hủy"
        >
            <Input
                placeholder="Tên lớp học..."
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{ marginBottom: 10 }}
            />
        </Modal>
    );
};

export default CreateClassModel;
