import {Button, Spin, Table, Typography, DatePicker, Input, Space} from "antd";
import React, {useEffect, useState} from "react";
import {callAdminListClass} from "../../../services/api.js";
import {ArrowLeftOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import { motion } from "framer-motion";
import ClassDetailModal from "./Detail/index.jsx";
import {FaEye} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;
const {RangePicker} = DatePicker;

const AdminClasses = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const navigate = useNavigate();

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const requestParams = {
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                createAtFrom: dateRange ? dateRange[0].startOf("day").valueOf() : null,
                createAtTo: dateRange ? dateRange[1].endOf("day").valueOf() : null,
            };

            const response = await callAdminListClass(requestParams);

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
    }, [currentPage, pageSize, searchingKeys, dateRange]);


    const handleView = (record) => {
        setSelectedClass(record);
        setIsModalVisible(true);
    }

    const handleClearFilters = () => {
        setPageSize(10);
        setCurrentPage(1);
        setSearchingKeys(null);
        setDateRange(null);
        fetchTableData();
    }

    const classColumn = [
        {title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => index + 1},
        {title: "Mã lớp học", dataIndex: "classCode", key: "classCode", sorter: true},
        {title: "Tên lớp học", dataIndex: "className", key: "className", sorter: true},
        {title: "Số thành viên", dataIndex: "participationAmount", key: "participationAmount", sorter: true, render: (_, record) => (record?.participationAmount+ "/" + record?.limitSlot)},
        {title: "Số bài kiểm tra", dataIndex: "examineAmount", key: "examineAmount", sorter: true},
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{textAlign: "center", display: "flex", justifyContent: "center", gap: "10px"}}>
                        <Button
                        type="primary"
                        icon={<FaEye size={18}/>}
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
            {/* TIÊU ĐỀ VÀ NÚT TRỞ VỀ */}
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
                {/* TIÊU ĐỀ */}
                <Title level={2} style={{margin: 0, color: "#1890ff"}}>
                    QUẢN LÝ LỚP HỌC
                </Title>

                {/* NÚT TRỞ VỀ */}
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined/>}
                    style={{
                        background: "#ff4d4f",
                        borderColor: "#ff4d4f",
                        fontWeight: "bold",
                        borderRadius: "6px",
                    }}
                    onClick={() => navigate("/admin")}
                >
                    Trở về
                </Button>
            </motion.div>

            {/* THANH TÌM KIẾM VÀ FILTER */}
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
                columns={classColumn}
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

            {/* POPUP CHI TIẾT NGƯỜI DÙNG */}
            <ClassDetailModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                classData={selectedClass}
            />
        </Spin>
    )
}

export default AdminClasses