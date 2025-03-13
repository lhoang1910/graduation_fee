import React, { useState, useEffect } from 'react';
import { Spin, DatePicker, Card, Col, Row, Statistic, notification, Typography } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined, DollarCircleOutlined, AlertOutlined, TrophyOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import dayjs from 'dayjs';
import {callAdminDashboard} from "../../services/api.js";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const getFirstDayOfYear = () => dayjs().startOf("year");
const getLastDayOfYear = () => dayjs().endOf("year");

const AdminDashBoard = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(getFirstDayOfYear);
    const [endDate, setEndDate] = useState(getLastDayOfYear);

    const handleDateChange = (dates) => {
        setStartDate(dates?.[0] || getFirstDayOfYear());
        setEndDate(dates?.[1] || getLastDayOfYear());
    };

    const fetchAdminDashboardData = async () => {
        try {
            setLoading(true);
            const res = await callAdminDashboard({startDate: startDate, endDate: endDate});
            if (res?.success) {
                setData(res?.data);
            }
        } catch (error) {
            notification.error({ message: 'Error', description: error?.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDashboardData();
    }, []);

    const revenueData = [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 },
        { month: 'Apr', revenue: 22000 },
        { month: 'May', revenue: 25000 },
        { month: 'Jun', revenue: 30000 },
    ];

    return (
        <Spin spinning={loading} size="large" tip="Đang tải dữ liệu...">
            <div style={{padding: 20}}>
                <motion.div
                    initial={{opacity: 0, y: -30, scale: 0.8}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                >
                    <Title
                        level={2}
                        style={{
                            textAlign: 'center',
                            marginBottom: 20,
                            fontWeight: 'bold',
                            fontSize: '2.5rem',
                            background: 'linear-gradient(90deg, #1890ff, #ff4d4f)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0px 4px 10px rgba(24, 144, 255, 0.3)',
                        }}
                    >
                        ADMIN DASHBOARD
                    </Title>
                </motion.div>

                <Row justify="center" style={{marginBottom: 20}}>
                    <RangePicker
                        value={[startDate, endDate]}
                        onChange={handleDateChange}
                        format="DD/MM/YYYY"
                    />
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <motion.div whileHover={{scale: 1.05}}>
                            <Card bordered={false} style={{background: '#f6ffed', borderLeft: '5px solid #52c41a'}}>
                                <Statistic title="Tổng số người dùng" value={data?.totalUser} prefix={<UserOutlined/>}/>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col span={8}>
                        <motion.div whileHover={{scale: 1.05}}>
                            <Card bordered={false} style={{background: '#e6f7ff', borderLeft: '5px solid #1890ff'}}>
                                <Statistic title="Tổng số lớp học" value={data?.totalClass} prefix={<BookOutlined/>}/>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col span={8}>
                        <motion.div whileHover={{scale: 1.05}}>
                            <Card bordered={false} style={{background: '#fff7e6', borderLeft: '5px solid #faad14'}}>
                                <Statistic title="Tổng số đề thi" value={data?.totalExam} prefix={<FileTextOutlined/>}/>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{marginTop: 20}}>
                    <Col span={8}>
                        <motion.div whileHover={{scale: 1.05}}>
                            <Card bordered={false} style={{background: '#fff1f0', borderLeft: '5px solid #f5222d'}}>
                                <Statistic title="Tổng số câu hỏi" value={data?.totalQuestion}/>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col span={8}>
                        <motion.div whileHover={{scale: 1.05}}>
                            <Card bordered={false} style={{background: '#e6fffb', borderLeft: '5px solid #13c2c2'}}>
                                <Statistic title="Doanh thu" value={data?.revenue} prefix={<DollarCircleOutlined/>}
                                           suffix="vnđ"/>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col span={8}>
                        <motion.div whileHover={{scale: 1.05}}>
                            <Card bordered={false} style={{background: '#fffbe6', borderLeft: '5px solid #fa8c16'}}>
                                <Statistic title="Tổng số báo lỗi" value={data?.totalReported}
                                           prefix={<AlertOutlined/>}/>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{marginTop: 20}}>
                    <Col span={12}>
                        <Card title="Gói dịch vụ bán chạy nhất" bordered={false} style={{background: '#f0f5ff'}}>
                            <p><TrophyOutlined/> <strong>Mã gói:</strong> {data?.bestSeller?.code}</p>
                            <p><TrophyOutlined/> <strong>Tên gói:</strong> {data?.bestSeller?.name}</p>
                            <p><TrophyOutlined/> <strong>Giá:</strong> {data?.bestSeller?.price} vnđ</p>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Biểu đồ doanh thu" bordered={false}>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Spin>
    );
}

export default AdminDashBoard;
