import React, { useState } from "react";
import { callCreateClass } from "../../../services/api.js";
import "./create.css";
import {Button, Input, Modal, notification} from "antd";
import {EditOutlined} from "@ant-design/icons";

const CreateClassModel = ({ isOpen, setIsOpen, onSuccess}) => {
    const [className, setClassName] = useState("");

    const handleSubmit = async () => {
        const resUserDetail = await callCreateClass(className);
        if (resUserDetail?.success) {
            notification.success({
                message: "Thành công",
                description: resUserDetail?.message
            });
            setIsOpen(false);
            onSuccess()
        } else {
            notification.error({
                message: "Thất bại",
                description: resUserDetail?.message
            });
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "1.5rem" }}>
                    <span>TẠO LỚP HỌC</span>
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
                placeholder="Nhập tên lớp học..."
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{
                    marginBottom: 15,
                    borderRadius: 10,
                    padding: "12px",
                    fontSize: "1.3rem",
                }}
            />
        </Modal>
    );
};

export default CreateClassModel;