import {Button, Select, Spin, Table, Typography, DatePicker, Input, Space, InputNumber, notification} from "antd";
import React, {useEffect, useState} from "react";
import {callAdminDeleteLimitation, callAdminLimitationList} from "../../../services/api.js";
import {FaEye} from "react-icons/fa";
import {ArrowLeftOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import { motion } from "framer-motion";
import {MdDeleteOutline} from "react-icons/md";
import ServicePackageDetailModal from "./Detail/index.jsx";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;
const {Option} = Select;
const {RangePicker} = DatePicker;

const AdminServicePackage = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [selectedLimitation, setSelectedLimitation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [startPrice, setStartPrice] = useState(null)
    const [endPrice, setEndPrice] = useState(null)
    const [type, setType] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [action, setAction] = useState(null)
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
                startPrice: startPrice,
                endPrice: endPrice,
                type: type
            };

            const response = await callAdminLimitationList(requestParams);

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
    }, [currentPage, pageSize, searchingKeys, startPrice, endPrice, dateRange, type]);

    const handleView = (record) => {
        setAction("Xem Chi Tiết")
        setSelectedLimitation(record);
        setIsModalVisible(true);
    }

    const handleClearFilters = () => {
        setPageSize(10);
        setCurrentPage(1);
        setStartPrice(null);
        setDateRange(null);
        setEndPrice(null);
        setType(null);
        setSearchingKeys(null)
        fetchTableData();
    }

    const handleDelete = async (record) => {
        if (!record || !record.id) return;
        const res = callAdminDeleteLimitation(record?.id);
        if (res?.success) {
            notification.success({key: "Thành công", message:res?.data});
            fetchTableData()
        } else {
            notification.error({key: "Thất bại", message: "Có lỗi xảy ra khi xóa gói dịch vụ"})
        }
    }

    const handleCreateNew = () => {
        setAction("Tạo Mới")
        setIsModalVisible(true);
    }

    const limitationColumn = [
        { title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
        { title: "Mã gói", dataIndex: "code", key: "code" },
        { title: "Tên gói", dataIndex: "name", key: "name" },
        { title: "Lượt tạo lớp", dataIndex: "createClass", key: "createClass" },
        { title: "Lượt tạo đề thi (thường)", dataIndex: "createExamNormally", key: "createExamNormally" },
        { title: "Lượt tạo đề thi (AI)", dataIndex: "createExamByAI", key: "createExamByAI" },
        { title: "Thành viên tối đa / lớp", dataIndex: "memberPerClass", key: "memberPerClass" },
        { title: "Giá (VND)", dataIndex: "price", key: "price" },
        { title: "Khuyến mãi", dataIndex: "salePercentage", key: "salePercentage" },
        { title: "Lượt mua", dataIndex: "boughtAmount", key: "boughtAmount" },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
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
                    <Button
                        type="primary"
                        icon={<MdDeleteOutline size={18} />}
                        onClick={() => handleDelete(record)}
                        style={{
                            background: "#ff4d4f",
                            borderColor: "#ff4d4f",
                            color: "#fff",
                            minWidth: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            boxShadow: "0px 4px 10px rgba(255, 77, 79, 0.3)",
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
                    QUẢN LÝ GÓI DỊCH VỤ
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
                    onClick={() => navigate("/admin")}
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
                    <Select
                        placeholder="Chọn loại gói"
                        allowClear
                        style={{ width: 200 }}
                        value={type}
                        onChange={(value) => setType(value)}
                    >
                        <Option value="Luợt tạo lớp học">Luợt tạo lớp học</Option>
                        <Option value="Tạo đề thi (Thủ công và Import file)">
                            Tạo đề thi (Thủ công và Import file)
                        </Option>
                        <Option value="Tạo đề thi bằng AI">Tạo đề thi bằng AI</Option>
                        <Option value="Số lượng thành viên lớp học">Số lượng thành viên lớp học</Option>
                        <Option value="Combo">Combo</Option>
                    </Select>

                    <RangePicker format="DD/MM/YYYY" onChange={(dates) => setDateRange(dates)} />

                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <InputNumber
                            min={0}
                            placeholder="💰 Giá tối thiểu"
                            value={startPrice}
                            onChange={(value) => setStartPrice(value)}
                            style={{ width: 120 }}
                        />
                        <span style={{ fontSize: "16px" }}>➝</span>
                        <InputNumber
                            min={0}
                            placeholder="💰 Giá tối đa"
                            value={endPrice}
                            onChange={(value) => setEndPrice(value)}
                            style={{ width: 120 }}
                        />
                    </div>

                    <Button icon={<ReloadOutlined />} onClick={handleClearFilters}>
                        Xóa bộ lọc
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                        style={{ background: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
                    >
                        Tạo mới
                    </Button>
                </Space>
            </Space>

            <Table
                columns={limitationColumn}
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

            <ServicePackageDetailModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                limitation={selectedLimitation}
                action={action}
                // onSuccess={() => fetchTableData()}
            />
        </Spin>
    )
}

export default AdminServicePackage