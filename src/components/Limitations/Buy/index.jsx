import React, { useState } from "react";
import { callBuyLimitation } from "../../../services/api.js";
import { notification } from "antd";
import { FaChalkboardTeacher, FaClipboardList, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import "./BuyLimitationModal.css";
import {RiAiGenerate} from "react-icons/ri";

const BuyLimitationModal = ({ limitation, isOpen, setIsOpen }) => {
    const paymentTypes = [
        { name: "VN_PAY", img: "https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg" },
        { name: "MOMO", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj4DcLo3V_-SgkelON0Qsr-D5G2zvYcOtBIg&s" },
        { name: "ZALO_PAY", img: "https://img.utdstc.com/icon/653/fdd/653fdd44e6ee33b689f8dfe18ec741c75d8e25230adab2588d7e107847efcc68:200" },
    ];

    const [amount, setAmount] = useState(1);
    const [paymentType, setPaymentType] = useState("VN_PAY");

    const handleBuy = async () => {
        const res = await callBuyLimitation(limitation.id, limitation.type, amount, paymentType);
        if (res?.success){
            localStorage.setItem("paymentId", res?.data?.requestId)
            window.location.href = res?.data?.qrUrl;
        } else notification.error(res.message);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Mua gói giới hạn</h2>
                <div className="modal-content">
                    <h3>{limitation.code} - {limitation.name}</h3>

                    {limitation.createClass > 0 && (<p><FaChalkboardTeacher/> Tạo lớp: {limitation.createClass} lượt</p>)}
                    {limitation.createExamNormally > 0 && (
                        <p><FaClipboardList/> Tạo đề thi (Thủ công và Nhập từ file): {limitation.createExamNormally} lượt</p>
                    )}
                    {limitation.createExamByAI > 0 && (
                        <p><RiAiGenerate/> Tạo đề thi Bằng AI: {limitation.createExamByAI} lượt</p>
                    )}
                    {limitation.memberPerClass > 0 && (
                        <p><FaUsers/> Giới hạn thành viên/lớp: +{limitation.memberPerClass} thành viên</p>
                    )}

                    <div className="price-section">
                        {limitation.salePercentage > 0 ? (
                            <>
                                <p className="old-price">
                                    <FaMoneyBillWave/> {limitation.price.toLocaleString()} VND
                                </p>
                                <p className="discounted-price">
                                    <FaMoneyBillWave/> {Math.round(limitation.price - limitation.price * (limitation.salePercentage / 100)).toLocaleString()} VND
                                    <span className="sale-badge"> -{limitation.salePercentage}%</span>
                                </p>
                            </>
                        ) : (
                            <p className="final-price">
                                <FaMoneyBillWave/> {limitation.price.toLocaleString()} VND
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="monthAmount">Số lượng:</label>
                        <input
                            type="number"
                            id="monthAmount"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
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
                                    <img src={type.img} alt={type.name}/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="total-amount">
                        Tổng tiền: <span>{((limitation.price - limitation.price * (limitation.salePercentage / 100)) * amount).toLocaleString()} VND</span>
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
