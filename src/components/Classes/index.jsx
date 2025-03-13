import React, {useEffect, useState} from 'react';
import {callListClass, callUserDetail} from '../../services/api.js';
import {FaPlus} from 'react-icons/fa';
import './ClassList.css';
import {Button, Empty, Input, Pagination, Row, Select, Spin} from "antd";
import ClassCards from "./ClassItem/Index.jsx";
import {ArrowLeftOutlined, SearchOutlined} from "@ant-design/icons";
import {useSearchParams, useLocation} from "react-router-dom";
import CreateClassModel from "./Create/Index.jsx";

const ClassList = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [pageSize, setPageSize] = useState(8);
    const [sortCriteria, setSortCriteria] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [data, setData] = useState({content: [], totalElements: 0});
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await callUserDetail();
            if (response?.data) {
                setUser(response.data);
            }
        };
        fetchUser();
    }, []);

    const [currentPage, setCurrentPage] = useState(() => {
        const page = parseInt(searchParams.get("page"));
        return isNaN(page) ? 1 : page;
    });

    const [typeView, setTypeView] = useState(() => {
        const param = location.pathname;
        if (param.includes("/member-view")) return 'CLASS_MEMBER_VIEW';
        if (param.includes("/author-view")) {
            return 'AUTHOR_VIEW';
        }
    });

    useEffect(() => {
        const param = location.pathname;
        if (param.includes("/my-class")) {
            setTypeView('CLASS_MEMBER_VIEW');
        } else if (param.includes("/created-class")) {
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
                setData({content: [], totalElements: 0});
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
                return 'LỚP HỌC CỦA TÔI';
            case 'AUTHOR_VIEW':
                return 'QUẢN LÝ LỚP HỌC';
            case 'RECENT_VIEW':
                return 'Lớp học gần đây';
            default:
                return 'DANH SÁCH LỚP HỌC';
        }
    };

    const handleCreateClassSuccess = () => {
        setCurrentPage(1);
        setSearchParams({page: 1});
        fetchData();
    };

    return (
        <div style={{padding: "20px"}}>
            <Spin align="center" gap="middle" size="large" spinning={loading}>
                <div>
                    <div className="header" style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <h2>{getTitle()}</h2>
                            <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                                <Input
                                    placeholder="Nhập từ khóa tìm kiếm..."
                                    prefix={<SearchOutlined/>}
                                    style={{width: "300px"}}
                                    value={searchingKeys}
                                    onChange={(e) => setSearchingKeys(e.target.value)}
                                />
                                <Select defaultValue={8} className="filter-select" onChange={(value) => {
                                    setPageSize(value);
                                }}>
                                    <Select.Option value={8}>8 / trang</Select.Option>
                                    <Select.Option value={16}>16 / trang</Select.Option>
                                    <Select.Option value={32}>32 / trang</Select.Option>
                                </Select>
                                {typeView === "AUTHOR_VIEW" && (
                                    <button className="create-class" onClick={() => setIsOpenCreateModal(true)}>
                                        <FaPlus/> Tạo lớp
                                    </button>
                                )}
                                <CreateClassModel isOpen={isOpenCreateModal} setIsOpen={setIsOpenCreateModal} onSuccess={() => fetchData()}/>
                                <Button
                                    type="primary" danger icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate("/")}
                                >
                                    Trở về
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Row gutter={[16, 16]} style={{marginTop: "20px"}}>
                    <ClassCards classes={data?.content} fetchData={fetchData}
                                canUpdate={typeView === "AUTHOR_VIEW"}/>
                </Row>
                {(data?.content?.length === 0 && !loading) && <Empty description="Không thấy lớp học"/>}
                <Pagination
                    style={{textAlign: "center", marginTop: "20px"}}
                    current={currentPage}
                    pageSize={pageSize}
                    total={data?.totalElements}
                    onChange={(page) => {
                        setCurrentPage(page);
                        setSearchParams({page: page});
                    }}
                />
            </Spin>
        </div>
    );
};

export default ClassList;