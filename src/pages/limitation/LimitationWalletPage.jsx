import React, {useEffect, useState} from "react";
import {callFindLimitationByCode, callGetInvoiceDetail, callLimitationWallet} from "../../services/api.js";
import {Card, Table, Button, DatePicker, Spin, message, Select, Empty, notification} from "antd";
import {RiAiGenerate, RiDeleteBinLine} from "react-icons/ri";
import {SiGoogleclassroom} from "react-icons/si";
import {FaChalkboardTeacher, FaClipboardList, FaEye} from "react-icons/fa";
import dayjs from "dayjs";
import './index.css'
import BuyLimitationModal from "../../components/Limitations/Buy/index.jsx";
import {ArrowLeftOutlined} from "@ant-design/icons";
import InvoiceModal from "./InvoiceModal.jsx";
import AdminPaymentDetail from "../../components/Admin/Payment/Detail/index.jsx";

const {RangePicker} = DatePicker;
const getFirstDayOfMonth = () => dayjs().startOf("month");
const getLastDayOfMonth = () => dayjs().endOf("month");

const LimitationWalletPage = () => {
    const [limitationWallet, setLimitationWallet] = useState(null);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState(getFirstDayOfMonth);
    const [endDate, setEndDate] = useState(getLastDayOfMonth);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [isAscending, setIsAscending] = useState(false);

    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedLimitation, setSelectedLimitation] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

    const handleBuyClick = async (code) => {
        try {
            const response = await callFindLimitationByCode(code);
            setSelectedLimitation(response?.data);
            setIsBuyModalOpen(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin hạn mức:", error);
        }
    };

    useEffect(() => {
        fetchLimitationWallet();
    }, [startDate, endDate, pageSize, pageNumber, isAscending]);

    const fetchLimitationWallet = async () => {
        setLoading(true);
        try {
            const res = await callLimitationWallet({
                startDate,
                endDate,
                pageSize,
                pageNumber: (pageNumber - 1),
                ascending: isAscending
            });
            setLimitationWallet(res?.data || []);
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

    const handleView = async (paymentId) => {
        if (!paymentId){
            notification.error({key: "Thất bại", message: "Không tìm thấy hóa đơn"})
            return;
        }
        const res = await callGetInvoiceDetail(paymentId);
        if (res?.success) {
            setSelectedPayment(res?.data);
            setOpenInvoiceModal(true);
        } else {
            notification.error(res?.message);
        }
    }

    return (
        <div className="wallet-container">
            {/* Tiêu đề chính */}
            <div>
                <div className="header">
                    <h2>VÍ SỬ DỤNG</h2>
                    <Button
                        type="primary" danger icon={<ArrowLeftOutlined/>}
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
                            name: "Lượt tạo lớp học",
                            amount: limitationWallet?.createClass,
                            icon: <FaChalkboardTeacher className="icon green"/>,
                            code: "CL01"
                        },
                        {
                            name: "Lượt tạo đề thi (thường)",
                            amount: limitationWallet?.createExamNormally,
                            icon: <FaClipboardList className="icon red"/>,
                            code: "EXNO02"
                        },
                        {
                            name: "Lượt tạo đề thi (bằng AI)",
                            amount: limitationWallet?.createExamByAI,
                            icon: <RiAiGenerate className="icon blue"/>,
                            code: "EXAI01"
                        },
                        {
                            name: "Số thành viên tối đa / lớp học",
                            amount: limitationWallet?.memberPerClass,
                            icon: <SiGoogleclassroom className="icon orange"/>,
                            code: "CLMEM01"
                        }
                    ].map((item, index) => (
                        <Card key={index} className="usage-card">
                            <div className="card-content">
                                {item.icon}
                                <span className="usage-title">{item.name}</span>
                                <p className="usage-amount">
                                    Theo gói vĩnh viễn: <strong>{item.amount || 0}</strong>
                                </p>
                                <Button type="primary" className="buy-btn" onClick={() => handleBuyClick(item.code)}
                                >Mua thêm</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            <br/><br/>
            {/* Bộ lọc lịch sử */}
            <h2 className="title">Lịch sử lượt sử dụng</h2>
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
                columns={[
                    {
                        title: "Thời gian",
                        dataIndex: "actionTime",
                        key: "actionTime",
                        render: (time) => dayjs(time).format("HH:mm DD/MM/YYYY")
                    },
                    {
                        title: "Lịch sử",
                        dataIndex: "action",
                        key: "action"
                    },
                    {
                        title: "Thao tác",
                        key: "action",
                        align: "center",
                        render: (_, record) => (
                            record.paymentId && (
                                <div style={{textAlign: "center"}}>
                                    <Button
                                        type="primary"
                                        icon={<FaEye/>}
                                        onClick={() => handleView(record.paymentId)}
                                    >
                                        Xem hóa đơn
                                    </Button>

                                </div>
                            )
                        ),
                    },
                ]}
                dataSource={limitationWallet?.histories?.content}
                pagination={{
                    pageSize,
                    current: pageNumber,
                    onChange: (page) => setPageNumber(page),
                }}
            />

            {/*{selectedPaymentId && <InvoiceModal isOpen={openInvoiceModal} setIsOpen={setOpenInvoiceModal} paymentId={selectedPaymentId}/>}*/}
            <AdminPaymentDetail visible={openInvoiceModal}
                                onClose={() => setOpenInvoiceModal(false)}
                                paymentData={selectedPayment}/>
            {isBuyModalOpen && (
                <BuyLimitationModal
                    limitation={selectedLimitation}
                    isOpen={isBuyModalOpen}
                    setIsOpen={setIsBuyModalOpen}
                />
            )}
        </div>
    );
}

export default LimitationWalletPage;
