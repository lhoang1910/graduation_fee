import {Button, Spin, Table, Typography, DatePicker, Input, Space, Select} from "antd";
import React, {useEffect, useState} from "react";
import {callAdminExamList} from "../../../services/api.js";
import {ArrowLeftOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import { motion } from "framer-motion";
import {FaEye} from "react-icons/fa";
import ExamDetailModal from "./Detail/index.jsx";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;
const {RangePicker} = DatePicker;
const {Option} = Select;

const AdminExams = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [dateRange, setDateRange] = useState(null);
    const [subTypeView, setSubTypeView] = useState(null);
    const navigate = useNavigate();

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const requestParams = {
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                createdAtFrom: dateRange ? dateRange[0].startOf("day").valueOf() : null,
                createdAtTo: dateRange ? dateRange[1].endOf("day").valueOf() : null,
                subTypeView: subTypeView
            };

            const response = await callAdminExamList(requestParams);

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
    }, [currentPage, pageSize, searchingKeys, dateRange, subTypeView]);


    const handleView = (record) => {
        setSelectedExam(record);
        setIsModalVisible(true);
    }

    const handleClearFilters = () => {
        setPageSize(10);
        setCurrentPage(1);
        setSearchText(null);
        setDateRange(null);
        setSubTypeView(null);
        fetchTableData()
    }

    const examColumn = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Mã Đề Thi",
            dataIndex: "examCode",
            key: "examCode",
            align: "center",
        },
        {
            title: "Tên Đề Thi",
            dataIndex: "examName",
            key: "examName",
        },
        {
            title: "Thời Gian (phút)",
            dataIndex: "time",
            key: "time",
            align: "center",
            render: (time) => `${time} phút`,
        },
        {
            title: "Số Lượng Mã Đề",
            dataIndex: "randomAmount",
            key: "randomAmount",
            align: "center",
        },
        {
            title: "Tổng Số Câu Hỏi",
            dataIndex: "totalQuestion",
            key: "totalQuestion",
            align: "center",
        },
        {
            title: "Số Thí Sinh",
            dataIndex: "executionAmount",
            key: "executionAmount",
            align: "center",
        },
        {
            title: "Quản Lý",
            dataIndex: "createdByName",
            key: "createdByName",
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
                    QUẢN LÝ ĐỀ THI
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
                    <RangePicker
                        format="DD/MM/YYYY"
                        onChange={(dates) => setDateRange(dates)}
                    />
                    <Select
                        placeholder="Chọn quyền riêng tư"
                        allowClear
                        style={{width: 150}}
                        value={subTypeView}
                        onChange={(value) => setSubTypeView(value)}
                    >
                        <Option value={"Công khai"}>Công khai</Option>
                        <Option value={"Chỉ mình tôi"}>Chỉ mình tôi</Option>
                        <Option value={"Người được cấp quyền"}>Người được cấp quyền</Option>
                        <Option value={"Thành viên lớp học"}>Thành viên lớp học</Option>

                    </Select>
                    <Button icon={<ReloadOutlined/>} onClick={handleClearFilters}>
                        Xóa bộ lọc
                    </Button>
                </Space>
            </Space>

            <Table
                columns={examColumn}
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
            <ExamDetailModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                examData={selectedExam}
            />
        </Spin>
    )
}

export default AdminExams