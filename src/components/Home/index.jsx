import React, { useEffect, useState } from "react";
import "./index.css";
import { callCurrentUserDashboard } from "../../services/api.js";

const Home = () => {
    const [userDashboard, setUserDashboard] = useState(null);

    useEffect(() => {
        const fetchUserDashboard = async () => {
            const res = await callCurrentUserDashboard();
            setUserDashboard(res?.data);
        };
        fetchUserDashboard();
    }, []);

    const getOrDefault = (amount) => {
        return amount ? amount : 0;
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h2>{userDashboard?.fullName}&nbsp;-&nbsp;Dashboard</h2>
                <strong>
                    Tham gia từ&nbsp;: {userDashboard?.createdAt
                    ? new Date(userDashboard?.createdAt).toLocaleDateString("vi-VN")
                    : "Không xác định"}
                </strong>
            </div>

            <div className="summary">
                <div className="summary-box">
                    <div className="icon">📖</div>
                    <div className="content">
                        <p>Số lớp học đã tạo</p>
                        <h3>{getOrDefault(userDashboard?.createdClassAmount)}</h3>
                    </div>
                </div>
                <div className="summary-box">
                    <div className="icon">📄</div>
                    <div className="content">
                        <p>Số đề thi đã tạo</p>
                        <h3>{getOrDefault(userDashboard?.createdExamAmount)}</h3>
                    </div>
                </div>
                <div className="summary-box">
                    <div className="icon">📊</div>
                    <div className="content">
                        <p>Số lớp học đang tham gia</p>
                        <h3>{getOrDefault(userDashboard?.joinedClassAmount)}</h3>
                    </div>
                </div>
                <div className="summary-box">
                    <div className="icon">📋</div>
                    <div className="content">
                        <p>Số đề thi đã làm</p>
                        <h3>{getOrDefault(userDashboard?.doExamAmount)}</h3>
                    </div>
                </div>
            </div>

            <div className="recent-access">
                <div className="recent-header">
                    <h3>Lớp học gần đây</h3>
                </div>
                <div className="recent-list">
                    {mockData.map((item, index) => (
                        <div key={index} className="recent-item">
                            <h4>{item.title}</h4>
                            <p className="date">📅 {item.date}</p>
                            <p className="stats">❓ {item.questions} 📊 {item.attempts}</p>
                            <p className="author">👤 {item.author}</p>
                            <button className="exam-button">Vào ôn thi</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-access">
                <div className="recent-header">
                    <h3>Đề thi gần đây</h3>
                </div>
                <div className="recent-list">
                    {mockData.map((item, index) => (
                        <div key={index} className="recent-item">
                            <h4>{item.title}</h4>
                            <p className="date">📅 {item.date}</p>
                            <p className="stats">❓ {item.questions} 📊 {item.attempts}</p>
                            <p className="author">👤 {item.author}</p>
                            <button className="exam-button">Vào ôn thi</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const mockData = [
    { title: "Tin 4 web-mb", date: "07/10/2024", questions: 141, attempts: 112, author: "Đức Duy" },
    { title: "Từ vựng", date: "05/10/2024", questions: 36, attempts: 9, author: "tiếng anh 1" },
    { title: "ATTT - GK", date: "04/10/2024", questions: 49, attempts: 10, author: "ATTT" },
    { title: "Logic.thh", date: "03/10/2024", questions: 100, attempts: 79, author: "huyen huong" }
];

export default Home;
