import {Button, Spin, Table, Typography, DatePicker, Input, Space, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {callAdminPaymentList} from "../../../services/api.js";
import {ArrowLeftOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import { motion } from "framer-motion";
import {FaEye} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {LuPrinter} from "react-icons/lu";
import AdminPaymentDetail from "./Detail/index.jsx";

const {Title} = Typography;
const {RangePicker} = DatePicker;

const AdminPayments = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [paymentType, setPaymentType] = useState(null);
    const navigate = useNavigate();

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const requestParams = {
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                startPaidDate: dateRange ? dateRange[0].startOf("day").valueOf() : null,
                endPaidDate: dateRange ? dateRange[1].endOf("day").valueOf() : null,
                status: statusFilter,
                paymentType: paymentType,
            };

            const response = await callAdminPaymentList(requestParams);

            setTableData(response?.data?.content || []);
            setTotalItems(response?.data?.totalElements || 0);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTableData();
    }, [currentPage, pageSize, searchingKeys, dateRange, statusFilter, paymentType]);


    const handleView = (record) => {
        setSelectedPayment(record);
        setIsModalVisible(true);
    }

    const handleClearFilters = () => {
        setPageSize(10);
        setCurrentPage(1);
        setSearchingKeys(null);
        setPaymentType(null)
        setStatusFilter(null);
        setDateRange(null);
        fetchTableData();
    }

    const paymentsColumn = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Mã Người Dùng",
            dataIndex: "userCode",
            key: "userCode",
        },
        {
            title: "Tên Người Dùng",
            dataIndex: "userFullName",
            key: "userFullName",
        },
        {
            title: "Số Tiền Thanh Toán",
            dataIndex: "price",
            key: "price",
            render: (price) => price.toLocaleString("vi-VN") + " VND",
        },
        {
            title: "Thời Gian Tạo Hóa Đơn",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (date) => dayjs(date).format("HH:mm DD/MM/YYYY"),
        },
        {
            title: "Thời Hạn Thanh Toán",
            dataIndex: "paymentDate",
            key: "paymentDate",
            render: (date) => dayjs(date).format("HH:mm DD/MM/YYYY"),
        },
        {
            title: "Cổng Thanh Toán",
            dataIndex: "paymentType",
            key: "paymentType",
        },
        {
            title: "Trạng Thái Hóa Đơn",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color = status === "Đã thanh toán" ? "green" : "red";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div
                    style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                    }}
                >
                    <Button
                        type="primary"
                        icon={<FaEye size={18} />}
                        onClick={() => handleView(record)}
                        style={{
                            background: "#1890ff",
                            borderColor: "#1890ff",
                            color: "#fff",
                            minWidth: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            boxShadow: "0px 4px 10px rgba(24, 144, 255, 0.3)",
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    background: "#f5f5f5",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={2} style={{margin: 0, color: "#1890ff"}}>
                    QUẢN LÝ HÓA ĐƠN
                </Title>

                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined/>}
                    style={{
                        background: "#ff4d4f",
                        borderColor: "#ff4d4f",
                        fontWeight: "bold",
                        borderRadius: "6px",
                    }}
                    onClick={() => navigate("/")}
                >
                    Trở về
                </Button>
            </motion.div>

            <Space style={{marginBottom: 16, width: "100%", display: "flex", justifyContent: "space-between"}}>
                <Input
                    placeholder="Nhập từ khóa tìm kiếm..."
                    prefix={<SearchOutlined/>}
                    allowClear
                    style={{width: 250}}
                    value={searchingKeys}
                    onChange={(e) => setSearchingKeys(e.target.value)}
                />

                <Space>
                    <RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => setDateRange(dates)}
                    />

                    <Button icon={<ReloadOutlined/>} onClick={handleClearFilters}>
                        Xóa bộ lọc
                    </Button>
                </Space>
            </Space>

            {/* BẢNG NGƯỜI DÙNG */}
            <Table
                columns={paymentsColumn}
                dataSource={tableData}
                pagination={{
                    total: totalItems,
                    pageSize: pageSize,
                    current: currentPage,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
                locale={{emptyText: "Không tìm thấy dữ liệu nào!"}}
            />

            <AdminPaymentDetail
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                paymentData={selectedPayment}
            />
        </Spin>
    )
}

export default AdminPayments