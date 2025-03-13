import React, {useEffect, useState} from 'react';
import './ExamPage.css';
import {Button, Empty, Input, Pagination, Row, Select, Space, Spin} from "antd";
import {ArrowLeftOutlined, SearchOutlined} from "@ant-design/icons";
import {useSearchParams, useLocation, useParams} from "react-router-dom";
import ExamCards from "../ExamCards/Index.jsx";
import {callListExam, callUserDetail} from "../../../services/api.js";

const ExamPages = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [pageSize, setPageSize] = useState(8);
    const [sortCriteria, setSortCriteria] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [data, setData] = useState({content: [], totalElements: 0});
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Khám phá");
    const [typeView, setTypeView] = useState("EXECUTOR_VIEW");
    const [subTypeView, setSubTypeView] = useState(null);

    const {classCode} = useParams();

    const [currentPage, setCurrentPage] = useState(() => {
        const page = parseInt(searchParams.get("page"));
        return isNaN(page) ? 1 : page;
    });

    useEffect(() => {
        const param = location.pathname;
        if (param.includes("/explore")) {
            setTitle("ĐỀ THI CỦA TÔI")
            setTypeView('EXECUTOR_VIEW');
            return;
        }
        if (param.includes("/classes/exam")) {
            setTitle("ĐỀ THI")
            setTypeView('CLASS_EXAM_VIEW');
            return;
        }
        if (param.includes("/created")) {
            setTitle("QUẢN LÝ ĐỀ THI")
            setTypeView('AUTHOR_VIEW');
        }
    }, [location.pathname]);

    useEffect(() => {
        fetchData();
    }, [typeView, subTypeView, currentPage, pageSize, sortCriteria, searchingKeys]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await callListExam({
                searchingKeys: searchingKeys,
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                typeView: typeView,
                sortCriteria: sortCriteria,
                classCode: classCode,
                subTypeView: subTypeView
            });
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

    return (
        <div style={{padding: "20px"}}>
            <Spin align="center" gap="middle" size="large" spinning={loading}>
                <div className="header" style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <h2>{title}</h2>
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
                            {typeView === "EXECUTOR_VIEW" && (
                                <Select
                                    defaultValue={"Tất cả"}
                                    className="filter-select"
                                    onChange={(value) => {
                                        setSubTypeView(value !== "Tất cả" ? null : value);
                                    }}
                                >
                                    <Select.Option value={"Tất cả"}>Tất cả</Select.Option>
                                    <Select.Option value={"Công khai"}>Công khai</Select.Option>
                                    <Select.Option value={"Được chia sẻ"}>Được chia sẻ</Select.Option>
                                </Select>
                            )}
                            <Button type="primary" danger icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
                                Trở về
                            </Button>
                        </div>
                    </div>
                </div>

                <Row gutter={[16, 16]} style={{marginTop: "20px"}}>
                    <ExamCards exams={data?.content} fetchData={fetchData}
                               canUpdate={typeView === "AUTHOR_VIEW"}/>
                </Row>
                {(data?.content?.length === 0 && !loading) && <Empty description="Không thấy đề thi"/>}
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

export default ExamPages;