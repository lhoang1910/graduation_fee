import React, {useEffect, useState} from "react";
import {Table, Input, Button, Pagination, Space, Select, Spin, Tabs, Row, Col, Empty} from "antd";
import {PlusOutlined, ArrowLeftOutlined} from "@ant-design/icons";
import "./detail.css";
import {useNavigate, useParams} from "react-router-dom";
import {callALlUsers, callDetailClass, callDetailExam, callListExam} from "../../../services/api.js";
import LimitationCard from "../../Limitations/Item/LimitationCard.jsx";
import Item from "../../exam/ListExam/Item.jsx";

const {Search} = Input;

const ClassDetail = ({classId}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchingKeys, setSearchingKeys] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null)
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([])
    const [isMemberTab, setIsMemberTab] = useState(true);

    const userColumn = [
        {title: "STT", dataIndex: "index", key: "index", render: (text, record, index) => index + 1},
        {title: "Mã user", dataIndex: "code", key: "code", sorter: true},
        {title: "Họ và tên", dataIndex: "fullName", key: "fullName", sorter: true},
        {title: "Email", dataIndex: "phoneNumber", key: "phoneNumber", sorter: true},
        {title: "Số điện thoại", dataIndex: "email", key: "email", sorter: true},
        {title: "Giới tính", dataIndex: "gender", key: "gender", sorter: true},
        {title: "Ngày sinh", dataIndex: "birthDay", key: "birthDay", sorter: true},
    ];

    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await callDetailClass(id);
                setData(response?.data);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const fetchMemberData = async (sorter = null) => {
        setTableLoading(true);
        try {
            const response = await callALlUsers({
                pageNumber: currentPage-1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                classId: id,
                sortCriteria: sorter
            });
            setTableData(response?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setTableLoading(false);
        }
    }

    const fetchExamData = async () => {
        setTableLoading(true);
        try {
            const response = await callListExam({
                pageNumber: currentPage-1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                typeView: "CLASS_EXAM_VIEW",
                classCode: data?.classCode
            });
            setTableData(response?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setTableLoading(false);
        }
    }

    useEffect(() => {
        setCurrentPage(1);
        setPageSize(10)
        if (isMemberTab){
            fetchMemberData()
        } else {
            fetchExamData()
        }
    }, [id, currentPage, pageSize, searchingKeys, isMemberTab]);

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter)
        if (sorter) {
            let asc;
            if (sorter.order === "ascend") {
                asc = true;
            }
            if (sorter.order === "descend") {
                asc = false;
            }
            if (asc === false || asc === true) {
                fetchMemberData({key: sorter.columnKey, asc});
            } else {
                fetchMemberData();
            }
        }
    };

    return (
        <Spin spinning={loading}>
            <h1>LỚP HỌC</h1>
            <div style={{padding: "20px"}}>
                <div className="header">
                    <h2>{data?.classCode} - {data?.className}</h2>
                    <Button type="primary" danger icon={<ArrowLeftOutlined/>}>
                        Trở về
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs
                    defaultActiveKey="2"
                    style={{marginTop: "20px"}}
                    onChange={(key) => setIsMemberTab(key === "2")}
                >
                    <Tabs.TabPane tab="Thành viên" key="2" />
                    <Tabs.TabPane tab="Đề thi ôn tập" key="4" />
                </Tabs>

                <div className="actions">
                    <Search placeholder="Nhập từ khóa tìm kiếm..." style={{width: 300}}
                            onSearch={() => setSearchingKeys(e.target.value)}/>
                    {isMemberTab && (<Button type="primary" icon={<PlusOutlined/>} className="add-btn">
                        Thêm thành viên
                    </Button>)}
                </div>

                {/* Bảng dữ liệu */}
                {isMemberTab && (<Spin spinning={tableLoading}>
                    <Table
                        columns={userColumn}
                        dataSource={tableData?.content}
                        pagination={{
                            total: data?.totalElements, pageSize: 10, onChange: (page, pageSize) => {
                                setCurrentPage(page);
                            }
                        }}
                        locale={{emptyText: "Không tìm thấy dữ liệu nào!"}}
                        onChange={handleTableChange}
                    />
                </Spin>)}

                {!isMemberTab && (<Spin spinning={tableLoading}>
                    <Row gutter={[16, 16]} style={{marginTop: "20px"}}>
                        {tableData.content?.map((item) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                <Item item={item}></Item>
                            </Col>
                        ))}
                    </Row>
                    {tableData.content?.length === 0 && loading === false && <Empty description="Không thấy đề thi"></Empty>}
                </Spin>)}

                {/* Phân trang */}
                <div className="pagination-container">
                    <span>Số hàng hiển thị trên trang: </span>
                    <Select
                        value={pageSize}
                        onChange={(value) => setPageSize(value)}
                        options={[
                            {value: 10, label: "10"},
                            {value: 20, label: "20"},
                            {value: 50, label: "50"},
                        ]}
                    />
                    <span> của tổng số {totalItems}</span>

                    <Pagination
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                        className="pagination"
                    />

                    <span>Chuyển đến trang: </span>
                    <Input
                        type="number"
                        min={1}
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        style={{width: 50, marginLeft: 5}}
                    />
                </div>
            </div>
        </Spin>
    );
}

export default ClassDetail;