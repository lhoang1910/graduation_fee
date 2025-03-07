import React, { useEffect, useState } from 'react';
import { callListClass } from '../../services/api.js';
import { FaPlus } from 'react-icons/fa';
import './ClassList.css';
import CreateClassModel from "./Create/Index.jsx";
import { Empty, Input, Pagination, Row, Space, Spin } from "antd";
import ClassCards from "./ClassItem/Index.jsx";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const ClassList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [pageSize, setPageSize] = useState(10);
    const [sortCriteria, setSortCriteria] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [data, setData] = useState({ content: [], totalElements: 0 });
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(() => {
        const page = parseInt(searchParams.get("page"));
        return isNaN(page) ? 1 : page;
    });

    const [typeView, setTypeView] = useState(() => {
        const param = location.pathname;
        if (param.includes("/member-view")) return 'CLASS_MEMBER_VIEW';
        if (param.includes("/author-view")) return 'AUTHOR_VIEW';
        return 'RECENT_VIEW';
    });

    useEffect(() => {
        const param = location.pathname;
        if (param.includes("/member-view")) {
            setTypeView('CLASS_MEMBER_VIEW');
        } else if (param.includes("/author-view")) {
            setTypeView('AUTHOR_VIEW');
        } else {
            setTypeView('RECENT_VIEW');
        }
    }, [location.pathname]);

    useEffect(() => {
        fetchData();
    }, [typeView, currentPage, pageSize, sortCriteria, searchingKeys]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await callListClass(searchingKeys, currentPage - 1, pageSize, typeView, sortCriteria);
            if (res?.data) {
                setData(res.data);
            } else {
                setData({ content: [], totalElements: 0 });
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        switch (typeView) {
            case 'CLASS_MEMBER_VIEW':
                return 'Danh sách lớp học của tôi';
            case 'AUTHOR_VIEW':
                return 'Danh sách lớp học đã tạo';
            case 'RECENT_VIEW':
                return 'Lớp học gần đây';
            default:
                return 'Danh sách lớp học';
        }
    };

    const handleCreateClassSuccess = () => {
        setCurrentPage(1);
        setSearchParams({ page: 1 });
        fetchData();
    };

    return (
        <div style={{ padding: "20px" }}>
            <Spin align="center" gap="middle" size="large" spinning={loading}>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                        <h2>{getTitle()}</h2>
                        <Input
                            placeholder="Nhập từ khóa tìm kiếm..."
                            prefix={<SearchOutlined />}
                            style={{ width: "300px" }}
                            value={searchingKeys}
                            onChange={(e) => setSearchingKeys(e.target.value)}
                        />
                        <button className="create-class" onClick={() => setIsOpenCreateModal(true)}>
                            <FaPlus /> Tạo lớp
                        </button>
                        <CreateClassModel
                            isOpen={isOpenCreateModal}
                            setIsOpen={setIsOpenCreateModal}
                            onSuccess={handleCreateClassSuccess}
                        />
                    </Space>
                </Space>
                <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                    <ClassCards classes={data?.content} fetchData={fetchData} />
                </Row>
                {(data?.content?.length === 0 && !loading) && <Empty description="Không thấy lớp học" />}
                <Pagination
                    style={{ textAlign: "center", marginTop: "20px" }}
                    current={currentPage}
                    pageSize={8}
                    total={data?.totalElements}
                    onChange={(page) => {
                        setCurrentPage(page);
                        setSearchParams({ page: page });
                    }}
                />
            </Spin>
        </div>
    );
};

export default ClassList;