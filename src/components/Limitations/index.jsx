import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaClipboardList, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import {callListLimitation} from "../../services/api.js";
import './index.css'
import {RiVipCrownLine} from "react-icons/ri"

const LimitationList = () => {
    const [limitations, setLimitations] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState("");
    const [startPrice, setStartPrice] = useState("");
    const [endPrice, setEndPrice] = useState("");

    const fetchData = async () => {
        try {
            const res = await callListLimitation(0, 10, searchingKeys, startPrice, endPrice);
            setLimitations(res?.data?.content || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <h2 className="title">
                <RiVipCrownLine className="title-icon" /> Các gói giới hạn
            </h2>
            <div className="filters">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm..."
                    value={searchingKeys}
                    onChange={(e) => setSearchingKeys(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="💰 Giá tối thiểu"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="💰 Giá tối đa"
                    value={endPrice}
                    onChange={(e) => setEndPrice(e.target.value)}
                />
                <button onClick={fetchData}>Lọc</button>
            </div>
            <div className="list">
                {limitations.map((item) => (
                    <div className="card" key={item.id}>
                        <img src="src/assets/premium.jpg" alt="Gói giới hạn" className="card-image" />
                        <h3>{item.limitationName} - {item.limitationCode}</h3>
                        <p><FaChalkboardTeacher /> Số lần tạo lớp tối đa: {item.createClass} lần</p>
                        <p><FaClipboardList /> Số lần tạo đề thi tối đa: {item.createExam} lần</p>
                        <p><FaUsers /> Số thành viên tối đa / 1 lớp: {item.maxMemberPerClass} thành viên</p>
                        <p><FaMoneyBillWave /> Giá: {item.price.toLocaleString()} VND / tháng</p>
                        <button className="buy-button">Mua ngay</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LimitationList;