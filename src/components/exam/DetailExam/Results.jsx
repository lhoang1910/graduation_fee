import React from "react";
import {Table} from "antd";

const ExamineeTable = ({executors, loading}) => {
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Mã user",
            dataIndex: "userCode",
            key: "userCode",
            sorter: false,
        },
        {
            title: "Số báo danh",
            dataIndex: "candidateNumber",
            key: "candidateNumber",
            sorter: false,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            sorter: false,
        },
        {
            title: "Số lượt đã làm",
            dataIndex: "executionAmount",
            key: "executionAmount",
            sorter: false,
        },
        {
            title: "Số điểm trung bình",
            dataIndex: "averageScore",
            key: "averageScore",
            sorter: false,
        },
        {
            title: "Tổng thời gian đã làm",
            dataIndex: "totalTrackingTime",
            key: "totalTrackingTime",
            render: (time) => {
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${minutes} phút ${seconds} giây`;
            },
            sorter: false,
        },
        {
            title: "Liên hệ",
            dataIndex: "email",
            key: "email",
            sorter: false,
        }
    ];

    return <Table loading={loading} columns={columns} dataSource={executors} />;
};

export default ExamineeTable;
