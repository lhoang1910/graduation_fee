import React, { useState } from "react";
import { callBuyLimitation } from "../../../services/api.js";
import { notification } from "antd";
import { FaChalkboardTeacher, FaClipboardList, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import "./BuyLimitationModal.css";

const BuyLimitationModal = ({ limitation, isOpen, setIsOpen }) => {
    const paymentTypes = [
        { name: "VN_PAY", img: "https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg" },
        { name: "MOMO", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj4DcLo3V_-SgkelON0Qsr-D5G2zvYcOtBIg&s" },
        { name: "ZALO_PAY", img: "https://img.utdstc.com/icon/653/fdd/653fdd44e6ee33b689f8dfe18ec741c75d8e25230adab2588d7e107847efcc68:200" },
    ];

    const [monthAmount, setMonthAmount] = useState(1);
    const [paymentType, setPaymentType] = useState("VN_PAY");

    const handleBuy = async () => {
        const res = await callBuyLimitation(limitation.id, monthAmount, paymentType);
        if (res?.success){
            // notification.success(res.message)
            window.location.href = res?.data;
        } else notification.error(res.message);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Mua gói giới hạn</h2>
                <div className="modal-content">
                    <h3>{limitation.limitationName} - {limitation.limitationCode}</h3>
                    <p><FaChalkboardTeacher /> Số lần tạo lớp tối đa: {limitation.createClass} lần</p>
                    <p><FaClipboardList /> Số lần tạo đề thi tối đa: {limitation.createExam} lần</p>
                    <p><FaUsers /> Số thành viên tối đa / 1 lớp: {limitation.maxMemberPerClass} thành viên</p>
                    <p><FaMoneyBillWave /> Giá: {limitation.price.toLocaleString()} VND / tháng</p>

                    <div className="form-group">
                        <label htmlFor="monthAmount">Số tháng:</label>
                        <input
                            type="number"
                            id="monthAmount"
                            min="1"
                            value={monthAmount}
                            onChange={(e) => setMonthAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phương thức thanh toán:</label>
                        <div className="payment-options">
                            {paymentTypes.map((type) => (
                                <div
                                    key={type.name}
                                    className={`payment-option ${paymentType === type.name ? "selected" : ""}`}
                                    onClick={() => setPaymentType(type.name)}
                                >
                                    <img src={type.img} alt={type.name} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="total-amount">
                        Tổng tiền: <span>{(limitation.price * monthAmount).toLocaleString()} VND</span>
                    </div>

                    <div className="modal-actions">
                        <button className="btn-buy" onClick={handleBuy}>Mua</button>
                        <button className="btn-close" onClick={() => setIsOpen(false)}>Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyLimitationModal;
