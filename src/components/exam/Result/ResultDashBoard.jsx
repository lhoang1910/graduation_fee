import React, {useEffect, useState} from "react";
import {Card, Table, DatePicker, Spin, message, Select, Button} from "antd";
import './index.css'
import {callResultDashBoard} from "../../../services/api.js";
import dayjs from "dayjs";
import {IoCheckmarkDoneOutline} from "react-icons/io5";
import {IoIosTimer} from "react-icons/io";
import {GrScorecard} from "react-icons/gr";
import {ArrowLeftOutlined, EyeOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const {RangePicker} = DatePicker;

const getFirstDayOfMonth = () => dayjs().startOf("month");
const getLastDayOfMonth = () => dayjs().endOf("month");

const ResultDashBoard = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState(getFirstDayOfMonth);
    const [endDate, setEndDate] = useState(getLastDayOfMonth);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const navigate = useNavigate();

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Số đề thi",
            dataIndex: "examCode",
            key: "examCode",
            sorter: true
        },
        {
            title: "Số báo danh",
            dataIndex: "candidateNumber",
            key: "candidateNumber",
            sorter: true,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            sorter: true,
        },
        {
            title: "Mã đề",
            dataIndex: "paperCode",
            key: "paperCode",
            sorter: true,
        },
        {
            title: "Lượt làm",
            dataIndex: "sequenceExecute",
            key: "sequenceExecute",
            sorter: true,
        },
        {
            title: "Thời gian",
            dataIndex: "timeTracking",
            key: "timeTracking",
            sorter: true,
            render: (time) => {
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${minutes} phút ${seconds} giây`;
            },
        },
        {
            title: "Điểm",
            dataIndex: "score",
            key: "score",
            sorter: true,
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{textAlign: "center"}}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined/>}
                        onClick={() => handleViewDetail(record)}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            ),
        },
    ];

    const handleViewDetail = (record) => {
        navigate(`/result/${record.id}`)
    };

    useEffect(() => {
        fetchResultData();
    }, [startDate, endDate, pageSize, pageNumber]);

    const fetchResultData = async () => {
        setLoading(true);
        try {
            const res = await callResultDashBoard({startDate, endDate, pageSize, pageNumber: (pageNumber - 1)});
            setResult(res?.data || []);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu ví hạn mức!");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (dates, dateStrings) => {
        setStartDate(dates?.[0] || getFirstDayOfMonth());
        setEndDate(dates?.[1] || getLastDayOfMonth());
    };

    const handlePageSizeChange = (value) => {
        setPageSize(value);
        setPageNumber(1);
    };

    const handleSortChange = (value) => {
        setIsAscending(value === "asc");
    };

    return (
        <div className="wallet-container">
            <div >
                <div className="header">
                    <h2 >KẾT QUẢ LÀM BÀI CỦA TÔI</h2>
                    <Button
                        type="primary" danger icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/")}
                    >
                        Trở về
                    </Button>
                </div>
            </div>
            {/* Hiển thị thông tin lượt sử dụng */}
            {loading ? (
                <Spin size="large" className="loading-spinner"/>
            ) : (
                <div className="usage-grid">
                    {[
                        {
                            name: "Số lượt đã làm",
                            amount: result?.executedExamAmount,
                            icon: <IoCheckmarkDoneOutline className="icon green"/>,
                            code: "CL01"
                        },
                        {
                            name: "Thời gian đã làm",
                            amount: result?.totalExecutedTime,
                            icon: <IoIosTimer className="icon red"/>,
                            code: "EXNO02"
                        },
                        {
                            name: "Điểm trung bình",
                            amount: result?.averageScore,
                            icon: <GrScorecard className="icon blue"/>,
                            code: "EXAI01"
                        }
                    ].map((item, index) => {
                        let displayedAmount = item.amount;

                        // Nếu là "EXNO02", chuyển đổi thành phút và giây
                        if (item.code === "EXNO02" && typeof item.amount === "number") {
                            const minutes = Math.floor(item.amount / 60);
                            const seconds = Math.round(item.amount % 60);
                            displayedAmount = `${minutes} phút ${seconds} giây`;
                        }

                        return (
                            <Card key={index} className="usage-card">
                                <div className="card-content">
                                    {item.icon}
                                    <span className="usage-title">{item.name}</span>
                                    <p className="usage-amount">
                                        <strong>{displayedAmount || 0}</strong>
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
            <br/><br/>
            {/* Bộ lọc lịch sử */}
            <h2 className="title">Danh sách kết quả</h2>
            <div className="filter-bar">
                <RangePicker value={[startDate, endDate]} onChange={handleDateChange} format="DD/MM/YYYY"/>
                <Select defaultValue={10} className="filter-select" onChange={handlePageSizeChange}>
                    <Select.Option value={5}>5 / trang</Select.Option>
                    <Select.Option value={10}>10 / trang</Select.Option>
                    <Select.Option value={20}>20 / trang</Select.Option>
                </Select>
                <Select defaultValue="desc" className="filter-select" onChange={handleSortChange}>
                    <Select.Option value="desc">Mới nhất</Select.Option>
                    <Select.Option value="asc">Cũ nhất</Select.Option>
                </Select>
            </div>

            {/* Bảng lịch sử */}
            <Table
                columns={columns}
                dataSource={result?.examResults?.content}
                pagination={{
                    pageSize,
                    current: pageNumber,
                    onChange: (page) => setPageNumber(page),
                }}
            />
        </div>
    );
}

export default ResultDashBoard;
