import React, { useEffect, useState } from "react";
import "./index.css";
import { callCurrentUserDashboard } from "../../services/api.js";
import ClassCards from "../Classes/ClassItem/Index.jsx";
import {Empty} from "antd";
import Item from "../exam/ListExam/Item.jsx";
import ExamCards from "../exam/ExamCards/Index.jsx";

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
                    <h3>Đề thi gần đây</h3>
                </div>
                {(!userDashboard?.recentClasses || userDashboard?.recentClasses.length === 0) ? (
                    <Empty description="Không thấy lớp học"/>
                ) : (
                    <div className="recent-list">
                        <ExamCards exams={userDashboard.recentExam}/>
                    </div>
                )}
            </div>

            <div className="recent-access">
                <div className="recent-header">
                    <h3>Lớp học gần đây</h3>
                </div>

                {(!userDashboard?.recentClasses || userDashboard?.recentClasses.length === 0) ? (
                    <Empty description="Không thấy lớp học"/>
                ) : (
                    <div className="recent-list">
                        <ClassCards classes={userDashboard.recentClasses}/>
                    </div>
                )}
            </div>
        </div>
    );
};

const mockData = [
    {title: "Tin 4 web-mb", date: "07/10/2024", questions: 141, attempts: 112, author: "Đức Duy"},
    {title: "Từ vựng", date: "05/10/2024", questions: 36, attempts: 9, author: "tiếng anh 1"},
    {title: "ATTT - GK", date: "04/10/2024", questions: 49, attempts: 10, author: "ATTT"},
    {title: "Logic.thh", date: "03/10/2024", questions: 100, attempts: 79, author: "huyen huong"}
];

export default Home;
