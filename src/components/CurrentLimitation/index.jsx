import React from "react";
import './index.css'
import {useNavigate} from "react-router-dom";

const ServicePackage = ({ isOpen, setIsOpen, limitation }) => {
    const navigate = useNavigate();

    if (!limitation) return null;

    return (
        <>
            {isOpen && (
                <div className="overlay">
                    <div className="card">
                        <h2 className="card-title">Gói giới hạn của bạn</h2>
                        <p className="highlight-text-head">
                            <strong>{limitation.limitationCode} - {limitation.limitationName}</strong>
                        </p>

                        <ul className="card-list">
                            <li>
                                <span className="icon">📚</span>
                                <strong>Số lớp học tối đa:&nbsp;</strong> {limitation.createClass} -&nbsp;
                                <span className="highlight-text">Đã tạo: {limitation.createdClass} lần</span>
                            </li>
                            <li>
                                <span className="icon">📝</span>
                                <strong>Số bài thi tối đa:&nbsp;</strong> {limitation.createExam} -&nbsp;
                                <span className="highlight-text">Đã tạo: {limitation.createdExam} lần</span>
                            </li>
                            <li>
                                <span className="icon">👥</span>
                                <strong>Số thành viên tối đa / lớp:&nbsp;</strong> {limitation.maxMemberPerClass} thành
                                viên
                            </li>
                            <li>
                                <span className="icon">⏳</span>
                                <strong>Ngày hết hạn:&nbsp;</strong>
                                {limitation.expirationDate
                                    ? new Date(limitation.expirationDate).toLocaleDateString("vi-VN")
                                    : "Vô hạn"}
                            </li>
                            <li>
                                <span className="icon">💰</span>
                                <strong>Giá gói:&nbsp;</strong> {limitation.price.toLocaleString()} VNĐ -
                                <span
                                    className="highlight-text"> &nbsp;Số tháng đã mua:&nbsp;{limitation.price > 0 ? limitation.totalPrice / limitation.price : "Vô hạn"}</span>
                            </li>
                            <li>
                                <span className="icon">💸</span>
                                <strong>Tổng tiền:&nbsp;</strong> {limitation.totalPrice.toLocaleString()} VNĐ
                            </li>
                        </ul>
                        <div className="button-container">
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                Đóng
                            </button>
                            <button className="upgrade-btn" onClick={() => {
                                navigate("/limitations")
                                setIsOpen(false)
                            }}>
                                Nâng cấp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServicePackage;
