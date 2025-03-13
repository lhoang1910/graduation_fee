import React, {useEffect, useState} from "react";
import {notification, Table, Checkbox, Input, Card, Space, Button} from "antd";
import {callUserDoExamResult} from "../../../services/api";
import {EyeOutlined} from "@ant-design/icons";

const {Search} = Input;

const columns = [
    {
        title: "STT",
        dataIndex: "index",
        key: "index",
        render: (text, record, index) => index + 1,
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


const ResultLists = ({examId, createdBy}) => {

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
                fetchData({key: sorter.columnKey, asc});

            } else {
                fetchData();
            }
        }

    };

    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchingKeys, setSearchingKeys] = useState('');

    const [loading, setLoading] = useState(false);
    const [isHighestOnly, setIsHighestOnly] = useState(false);

    const fetchData = async (sorter = null) => {
        console.log("data", data)
        setLoading(true);
        try {
            let request = {
                highest: isHighestOnly,
                examId: examId,
                searchingKeys: searchingKeys,
                pageSize: 10,
                pageNumber: currentPage - 1
            }
            if (sorter) {
                request = {
                    highestOnly: isHighestOnly,
                    examId: examId,
                    searchingKeys: searchingKeys,
                    pageSize: 10,
                    pageNumber: currentPage - 1,
                    "sortCriteria": [
                        {
                            "key": sorter.key, // tên field cần sort theo
                            "asc": sorter.asc // true: tăng dần - false: giảm dần
                        }
                    ]
                }
            }
            const response = await callUserDoExamResult(request)
            if (response.success) {
                setData(response.data);

            } else {
                notification.error({message: response.message})
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [isHighestOnly, examId, searchingKeys, currentPage, pageSize]);
    return (
        <Card style={{padding: 20, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)"}}>
            <Space direction="vertical" style={{width: "100%"}}>
                <Space style={{display: "flex", justifyContent: "space-between"}}>
                    <Checkbox checked={isHighestOnly} onChange={(e) => setIsHighestOnly(e.target.checked)}>
                        Hiển thị theo kết quả tốt nhất
                    </Checkbox>
                    <Search
                        placeholder="Nhập từ khóa tìm kiếm"
                        onSearch={setSearchingKeys}
                        enterButton
                        style={{width: 300}}
                    />
                </Space>
                <Table
                    loading={loading}
                    columns={createdBy === localStorage.getItem("currentEmail")
                        ? columns
                        : columns.filter((col) => col.key !== "action")}
                    dataSource={data?.content}
                    onChange={handleTableChange}
                    pagination={{
                        total: data?.totalElements,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                />
            </Space>
        </Card>
    )
};

export default ResultLists;
