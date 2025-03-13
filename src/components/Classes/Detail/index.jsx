import React, {useCallback, useEffect, useState} from "react";
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
    notification
} from "antd";
import {PlusOutlined, ArrowLeftOutlined, EyeOutlined} from "@ant-design/icons";
import "./detail.css";
import {useNavigate, useParams} from "react-router-dom";
import {
    callAddUserToClass,
    callALlUsers,
    callCheckUserExistByEmail, callDeleteClassMember,
    callDetailClass,
    callListExam
} from "../../../services/api.js";
import ExamCards from "../../exam/ExamCards/Index.jsx";
import {RiDeleteBinLine} from "react-icons/ri";

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
    const [email, setEmail] = useState();
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
                        <Button type="primary" icon={<PlusOutlined />} className="add-btn" onClick={() => setIsOpenEmailModal(true)}>
                            Thêm thành viên
                        </Button>
                    )}
                </div>
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