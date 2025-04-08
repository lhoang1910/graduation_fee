import React, {useEffect, useState} from "react";
import {
    Table,
    Input,
    Button,
    Spin,
    Tabs,
    Row,
    Empty,
    Select,
    Pagination,
    message,
    Modal,
    Form,
    notification, Upload
} from "antd";
import {PlusOutlined, ArrowLeftOutlined, UploadOutlined, DownloadOutlined} from "@ant-design/icons";
import "./detail.css";
import {useNavigate, useParams} from "react-router-dom";
import {
    callAddUserToClass,
    callALlUsers,
    callCheckUserExistByEmail, callDeleteClassMember,
    callDetailClass, callImportUsers,
    callListExam
} from "../../../services/api.js";
import ExamCards from "../../exam/ExamCards/Index.jsx";
import {RiDeleteBinLine} from "react-icons/ri";
import {CiImport} from "react-icons/ci";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const {Search} = Input;

const ClassDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [isMemberTab, setIsMemberTab] = useState(true);
    const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);
    const [isOpenImportModal, setIsOpenImportModal] = useState(false);
    const [email, setEmail] = useState();
    const [file, setFile] = useState();
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [importing, setImporting] = useState(false);
    const navigate = useNavigate();

    const userColumn = [
        { title: "STT", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
        { title: "Mã user", dataIndex: "code", key: "code", sorter: true },
        { title: "Họ và tên", dataIndex: "fullName", key: "fullName", sorter: true },
        { title: "Email", dataIndex: "email", key: "email", sorter: true },
        { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber", sorter: true },
        { title: "Giới tính", dataIndex: "gender", key: "gender", sorter: true },
        { title: "Ngày sinh", dataIndex: "birthDay", key: "birthDay", sorter: true },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{textAlign: "center"}}>
                    <Button
                        type="primary"
                        danger
                        icon={<RiDeleteBinLine />}
                        onClick={() => handleDeleteMember(record)}
                    >
                        Xóa
                    </Button>

                </div>
            ),
        },
    ];

    const { id } = useParams();


    const handleDeleteMember = async (user) => {
        try {
            setLoading(true);
            const res = await callDeleteClassMember(id, user?.email);
            if (res?.success) {
                notification.success(res?.success);
                fetchTableData();
            } else {
                notification.error(res?.error);
            }
        } catch (error){
            notification.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCheckEmail = async () => {
        if (!email.trim()) {
            message.warning("Vui lòng nhập email.");
            return;
        }

        setLoading(true);
        try {
            const res = await callCheckUserExistByEmail(email.trim());

            if (!res?.data) {
                message.error("Người dùng không tồn tại.");
            } else {
                setSelectedUser(res.data);
                setVisible(true);
            }
        } catch (error) {
            message.error("Lỗi khi kiểm tra email.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await callDetailClass(id);
                setData(response?.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu lớp học:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchTableData = async () => {
        if (!data && !isMemberTab) return;
        setTableLoading(true);
        try {
            const requestParams = {
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                ...(isMemberTab
                    ? { classId: id,
                        // sortCriteria: sorter
                    }
                    : { typeView: "CLASS_EXAM_VIEW", classCode: data?.classCode })
            };

            let response = null;
            if (isMemberTab) {
                response = await callALlUsers(requestParams);
            } else {
                response = await callListExam(requestParams);
            }

            setTableData(response?.data?.content || []);
            setTotalItems(response?.data?.totalElements || 0);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách:", error);
        } finally {
            setTableLoading(false);
        }
    }

    const changeTabs = (key) => {
        setIsMemberTab(key === "2");
        setPageSize(key === "2" ? 10 : 8);
        setCurrentPage(1)
        setTableData([]);
    }

    const handleCancel = () => {
        setVisible(false);
        setEmail("");
    };

    const handleConfirmAddUser = async () => {
        if (selectedUser) {
            const res = await callAddUserToClass(email, id)
            if (res?.success) {
                notification.success({message: res?.message})
                fetchTableData();
            } else {
                notification.error({message: res?.message})
            }
        }
        setVisible(false);
    };

    const handleImport = async () => {
        if (!file) {
            return message.warning("Vui lòng chọn file Excel trước khi gửi.");
        }

        setImporting(true);
        try {
            const res = await callImportUsers(id, file);
            if (res?.success) {
                notification.success({ message: res?.message });
                setIsOpenImportModal(false);
                setFile(null);
                fetchTableData();
            } else {
                const errorData = res?.data?.filter(item => item?.success === false);
                if (errorData && errorData.length > 0) {
                    notification.warning({
                        message: `Có ${errorData.length} dòng lỗi trong file import. Vui lòng tải file chi tiết để xem.`,
                    });

                    const exportData = errorData.map(item => ({
                        Email: item?.email || '',
                        'Họ và tên': item?.fullName || '',
                        'Ngày sinh': item?.dateOfBirth || '',
                        'Giới tính': item?.gender || '',
                        'Lỗi': item?.errorDesc || '',
                    }));

                    const worksheet = XLSX.utils.json_to_sheet(exportData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lỗi Import');

                    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                    saveAs(blob, 'Import_Errors.xlsx');
                } else {
                    notification.error({ message: res?.message || 'Import thất bại.' });
                }
            }
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra trong quá trình import. Vui lòng thử lại.' });
        } finally {
            setImporting(false);
        }
    };

    useEffect(() => {
        console.log(">>>", isMemberTab)
        if (data || isMemberTab) {
            fetchTableData();
        }
    }, [currentPage, pageSize, searchingKeys, data, isMemberTab]);

    if (!data) {
        return null;
    }
    return (
        <Spin spinning={loading}>
            <h1>LỚP HỌC</h1>
            <div style={{ padding: "20px" }}>
                <div className="header">
                    <h2>{data?.classCode} - {data?.className}</h2>
                    <Button type="primary" danger icon={<ArrowLeftOutlined />} onClick={() => navigate("/exam/explore")}>
                        Trở về
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs
                    defaultActiveKey="2"
                    style={{ marginTop: "20px" }}
                    onChange={(key) => changeTabs(key)}
                >
                    <Tabs.TabPane tab="Thành viên" key="2" />
                    <Tabs.TabPane tab="Đề thi ôn tập" key="4" />
                </Tabs>


                <div className="actions">
                    <Search
                        placeholder="Nhập từ khóa tìm kiếm..."
                        style={{ width: 300 }}
                        onSearch={(value) => setSearchingKeys(value)}
                    />
                    {isMemberTab && (
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                className="add-btn"
                                onClick={() => setIsOpenEmailModal(true)}
                            >
                                Thêm
                            </Button>
                            <Button
                                type="primary"
                                icon={<CiImport/>}
                                className="add-btn"
                                onClick={() => setIsOpenImportModal(true)}
                            >
                                Import
                            </Button>
                        </div>
                    )}
                </div>
                <Modal
                    title="📥 Nhập danh sách thành viên"
                    open={isOpenImportModal}
                    onCancel={() => setIsOpenImportModal(false)}
                    onOk={handleImport}
                    okText="Gửi"
                    cancelText="Hủy"
                    centered
                    width={500}
                    confirmLoading={importing}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                type="link"
                                icon={<DownloadOutlined />}
                                href="/assets/BieuMau.xlsx"
                                download
                                style={{ fontWeight: '500' }}
                            >
                                Tải về biểu mẫu Excel
                            </Button>
                        </div>

                        <div>
                            <Upload
                                beforeUpload={(file) => {
                                    const isExcel =
                                        file.type ===
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                                        file.name.endsWith('.xlsx');
                                    if (!isExcel) {
                                        message.error('Vui lòng chọn file Excel (.xlsx)');
                                        return Upload.LIST_IGNORE;
                                    }
                                    setFile(file);
                                    return false;
                                }}
                                showUploadList={false}
                            >
                                <Button block icon={<UploadOutlined />}>
                                    Chọn file Excel
                                </Button>
                            </Upload>

                            {file && (
                                <div style={{ marginTop: 8, fontStyle: 'italic', color: '#666' }}>
                                    📄 {file.name}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>

                <Modal
                    title="Thêm thành viên"
                    open={isOpenEmailModal}
                    onCancel={() => setIsOpenEmailModal(false)}
                    onOk={handleCheckEmail}
                    okText="Gửi"
                    cancelText="Hủy"
                >
                    <Input
                        placeholder="Nhập email người dùng..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: 10 }}
                    />
                </Modal>
                <Modal
                    title={`Bạn có muốn thêm người dùng ${selectedUser?.code} - ${selectedUser?.fullName} vào lớp học?`}
                    open={visible}
                    onCancel={handleCancel}
                    onOk={handleConfirmAddUser}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Form layout="vertical">
                        <Form.Item label="Mã người dùng">
                            <Input value={selectedUser?.code} disabled />
                        </Form.Item>
                        <Form.Item label="Họ và tên">
                            <Input value={selectedUser?.fullName} disabled />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={selectedUser?.email} disabled />
                        </Form.Item>
                        <Form.Item label="Giới tính">
                            <Input value={selectedUser?.gender} disabled />
                        </Form.Item>
                        <Form.Item label="Ngày sinh">
                            <Input value={selectedUser?.birthDay} disabled />
                        </Form.Item>
                    </Form>
                </Modal>

                <Spin spinning={tableLoading}>
                    {isMemberTab ? (
                        <Table
                            columns={data.createdbyEmail === localStorage.getItem("currentEmail")
                                ? userColumn
                                : userColumn.filter((col) => col.key !== "action")}
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
                            locale={{ emptyText: "Không tìm thấy dữ liệu nào!" }}
                        />
                    ) : (
                        <>
                            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                                <ExamCards exams={tableData} canUpdate={data.createdbyEmail === localStorage.getItem("currentEmail")} />
                            </Row>
                            {(tableData.length === 0 && !tableLoading) && <Empty description="Không có đề thi" />}
                            <Pagination
                                style={{ textAlign: "center", marginTop: "20px" }}
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalItems}
                                onChange={(page) => setCurrentPage(page)}
                            />
                            <Select defaultValue={8} className="filter-select" onChange={(value) => setPageSize(value)}>
                                <Select.Option value={8}>8 / trang</Select.Option>
                                <Select.Option value={16}>16 / trang</Select.Option>
                                <Select.Option value={32}>32 / trang</Select.Option>
                            </Select>
                        </>
                    )}
                </Spin>
            </div>
        </Spin>
    );
};

export default ClassDetail;