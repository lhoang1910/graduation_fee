import React, { useState } from "react";
import { callCreateClass } from "../../../services/api.js";
import "./create.css";
import {notification} from "antd";

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
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Thêm mới</h2>
                    <button className="modal-close" onClick={() => setIsOpen(false)}>&times;</button>
                </div>
                <div className="modal-body">
                    <label className="modal-label" htmlFor="className">Tên lớp học</label>
                    <input
                        id="className"
                        className="modal-input"
                        type="text"
                        placeholder="Nhập tên lớp học"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                </div>
                <div className="modal-footer">
                    <button className="modal-button confirm" onClick={handleSubmit}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default CreateClassModel;