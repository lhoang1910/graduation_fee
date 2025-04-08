import {Button, notification, Select, Spin, Table, Typography, DatePicker, Input, Space} from "antd";
import React, {useEffect, useState} from "react";
import {callAdminUpdateUserStatus, callALlUsers} from "../../../services/api.js";
import {FaEye} from "react-icons/fa";
import UserDetailModal from "./Detail/index.jsx";
import {ArrowLeftOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import { motion } from "framer-motion";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;
const {Option} = Select;
const {RangePicker} = DatePicker;

const AdminUsers = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [genderFilter, setGenderFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const navigate = useNavigate();

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const requestParams = {
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                gender: genderFilter,
                isActive: statusFilter,
                createAtFrom: dateRange ? dateRange[0].startOf("day").valueOf() : null,
                createAtTo: dateRange ? dateRange[1].endOf("day").valueOf() : null,
            };

            const response = await callALlUsers(requestParams);

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
    }, [currentPage, pageSize, searchingKeys, genderFilter, statusFilter, dateRange]);

    const handleChangeActive = async (record) => {
        if (!record) return;
        const res = await callAdminUpdateUserStatus(record?.id);
        if (res?.success) {
            notification.success(res?.data);
            fetchTableData();
        } else {
            notification.error({message: res?.message})
        }
    }

    const handleView = (record) => {
        setSelectedUser(record);
        setIsModalVisible(true);
    }

    const handleClearFilters = () => {
        setPageSize(10);
        setCurrentPage(1);
        setSearchText(null);
        setDateRange(null);
        setStatusFilter(null);
        setGenderFilter(null);
        fetchTableData();
    }

    const userColumn = [
        {title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => index + 1},
        {title: "Mã user", dataIndex: "code", key: "code", sorter: true},
        {title: "Họ và tên", dataIndex: "fullName", key: "fullName", sorter: true},
        {title: "Email", dataIndex: "email", key: "email", sorter: true},
        {title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber", sorter: true},
        {title: "Giới tính", dataIndex: "gender", key: "gender", sorter: true},
        {title: "Ngày sinh", dataIndex: "birthDay", key: "birthDay", sorter: true, render: (text) => text ? new Date(text).toLocaleDateString("vi-VN") : "-"},
        {
            title: "Trạng thái",
            key: "isActive",
            align: "center",
            render: (_, record) => (
                <div style={{textAlign: "center", display: "flex", justifyContent: "center", gap: "10px"}}>
                    <Button
                        type={record.active ? "default" : "primary"}
                        danger={!record.active}
                        onClick={() => handleChangeActive(record)}
                        style={{
                            minWidth: "120px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            boxShadow: record.active ? "none" : "0px 4px 10px rgba(255, 77, 79, 0.3)",
                        }}
                    >
                        {record.active ? "🟢 Khả dụng" : "🔴 Vô hiệu"}
                    </Button>

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
                    QUẢN LÝ NGƯỜI DÙNG
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
                    value={searchText}
                    onChange={(e) => setSearchingKeys(e.target.value)}
                />

                <Space>
                    <Select
                        placeholder="Chọn giới tính"
                        allowClear
                        style={{width: 150}}
                        value={genderFilter}
                        onChange={(value) => setGenderFilter(value)}
                    >
                        <Option value="Nam">Nam</Option>
                        <Option value="Nữ">Nữ</Option>
                        <Option value="Khác">Khác</Option>
                    </Select>

                    <Select
                        placeholder="Chọn trạng thái"
                        allowClear
                        style={{width: 150}}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                    >
                        <Option value={true}>Khả dụng</Option>
                        <Option value={false}>Vô hiệu</Option>
                    </Select>

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
                columns={userColumn}
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
            <UserDetailModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                user={selectedUser}
            />
        </Spin>
    )
}

export default AdminUsers