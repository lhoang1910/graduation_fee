import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, Button, Space, Tag, Modal, Form, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import {callListClass, callUserDetail} from "../../services/api.js";
import CreateClassModel from "./Create/index.jsx";

const { RangePicker } = DatePicker;

const ClassList = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        searchingKeys: '',
        createAtFrom: null,
        createAtTo: null,
        updateAtFrom: null,
        updateAtTo: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const userResponse = await callUserDetail();
            const userId = userResponse.data.id;

            const request = {
                ...filters,
                userId: userId,
                pageSize: pagination.pageSize,
                pageNumber: pagination.current - 1,
            };
            const response = await callListClass(filters.searchingKeys, request.pageNumber, request.pageSize, "CLASS_MEMBER_VIEW");
            if (response && response.data) {
                console.log('Class List Data:', response.data);
                setData(response.data || []);
                setPagination({
                    ...pagination,
                    total: response.data.length,
                });
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters, pagination.current, pagination.pageSize]);

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleTableChange = (paginationConfig) => {
        setPagination({
            ...pagination,
            current: paginationConfig.current,
            pageSize: paginationConfig.pageSize,
        });
    };

    const handleCreateClass = () => {
        setIsModalOpen(true);
    }

    const columns = [
        {
            title: 'Mã lớp',
            dataIndex: 'classCode',
            key: 'classCode',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
        },
        {
            title: 'Số lượng',
            dataIndex: 'limitSlot',
            key: 'limitSlot',
            render: (value) => (
                <Space>
                    <Tag color="green">Thành viên tối đa: {value}</Tag>
                </Space>
            ),
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdByName',
            key: 'createdByName',
            render: (text, record) => (
                <div>
                    <strong>{text}</strong>
                    <p style={{ margin: 0 }}>{record.createdByEmail}</p>
                </div>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (date) => moment(date).format('DD-MM-YYYY'),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} type="link" />
                    <Button icon={<DeleteOutlined />} type="link" danger />
                    <Button icon={<LinkOutlined />} type="primary">
                        Vào lớp học
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Thanh Filter */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleFilterChange('searchingKeys', e.target.value)}
                />
                <RangePicker
                    placeholder={['Ngày tạo từ', 'Ngày tạo đến']}
                    onChange={(dates) =>
                        handleFilterChange('createAtFrom', dates ? dates[0].toISOString() : null) ||
                        handleFilterChange('createAtTo', dates ? dates[1].toISOString() : null)
                    }
                />
                <RangePicker
                    placeholder={['Ngày cập nhật từ', 'Ngày cập nhật đến']}
                    onChange={(dates) =>
                        handleFilterChange('updateAtFrom', dates ? dates[0].toISOString() : null) ||
                        handleFilterChange('updateAtTo', dates ? dates[1].toISOString() : null)
                    }
                />
                <Button type="primary" onClick={fetchData}>
                    Lọc
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClass}>
                    Tạo mới lớp học
                </Button>
                <CreateClassModel isOpen={isModalOpen} setIsOpen={setIsModalOpen}/>
            </Space>

            {/* Bảng dữ liệu */}
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30'],
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default ClassList;
