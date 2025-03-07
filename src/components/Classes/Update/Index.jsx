import React, { useState } from "react";
import { callUpdateClass } from "../../../services/api.js";
import "./update.css";
import {notification} from "antd";

const UpdateClassModel = ({ isOpen, setIsOpen, onSuccess, classId}) => {
    const [className, setClassName] = useState("");

    const handleSubmit = async () => {
        const resUserDetail = await callUpdateClass(classId, className);
        if (resUserDetail?.success) {
            notification.success({
                message: "Thành công",
                description: "Cập nhật lớp học thành công"
            });
            setIsOpen(false);
            onSuccess()
        } else {
            notification.error({
                message: "Lỗi cập nhật lớp học",
                description: resUserDetail?.message || "Có lỗi xảy ra"
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Cập nhật</h2>
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

export default UpdateClassModel;