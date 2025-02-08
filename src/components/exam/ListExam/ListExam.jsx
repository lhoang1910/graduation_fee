
import React, { useState } from "react";
import { Card, Col, Row, Pagination, Input, Space, Button } from "antd";
import { SearchOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import Item from "./Item";

const mockData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Đề thi ${i + 1}`,
    date: `07/02/202${5 - (i % 2)}`, // Ngày thay đổi theo mẫu
    stats: {
        questions: Math.floor(Math.random() * 10),
        attempts: Math.floor(Math.random() * 5),
        passes: Math.floor(Math.random() * 3),
    },
}));

const ListExam = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Số lượng card mỗi trang
    const [likes, setLikes] = useState({}); // Trạng thái lượt thích
    const [dislikes, setDislikes] = useState({}); // Trạng thái lượt không thích

    // Xử lý sự kiện Like
    const handleLike = (id) => {
        setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    // Xử lý sự kiện Dislike
    const handleDislike = (id) => {
        setDislikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    // Lọc dữ liệu theo trang
    const paginatedData = mockData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ padding: "20px" }}>
            {/* Header */}
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space style={{ justifyContent: "space-between", width: "100%" }}>
                    <h2>Danh sách đề thi</h2>
                    <Input
                        placeholder="Nhập từ khóa tìm kiếm..."
                        prefix={<SearchOutlined />}
                        style={{ width: "300px" }}
                    />
                </Space>
            </Space>

            {/* Grid */}
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                {paginatedData.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        {/* <Card
                            hoverable
                            cover={
                                <img
                                    alt="example"
                                    src="https://s3.eduquiz.io.vn/default/exam/exam-04.png"
                                    style={{ height: "150px", objectFit: "cover" }}
                                />
                            }
                            actions={[
                                <span onClick={() => handleLike(item.id)} style={{ cursor: "pointer" }}>
                                    <LikeOutlined />
                                    <span style={{ marginLeft: 8 }}>{likes[item.id] || 0}</span>
                                </span>,
                                <span onClick={() => handleDislike(item.id)} style={{ cursor: "pointer" }}>
                                    <DislikeOutlined />
                                    <span style={{ marginLeft: 8 }}>{dislikes[item.id] || 0}</span>
                                </span>,
                            ]}
                        >
                            <Card.Meta
                                title={item.title}
                                description={
                                    <div>
                                        <p>Ngày thi: {item.date}</p>
                                        <p>Câu hỏi: {item.stats.questions} 
                                            </p>
                                    </div>
                                }
                            />
                            <Button
                                type="primary"
                                style={{ marginTop: "10px", width: "100%", backgroundColor: "#9254de" }}
                            >
                                Vào ôn thi
                            </Button>
                        </Card> */}
                        <Item                             item={item}
                            likes={likes}
                            dislikes={dislikes}
                            handleLike={handleLike}
                            handleDislike={handleDislike}></Item>
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <Pagination
                style={{ textAlign: "center", marginTop: "20px" }}
                current={currentPage}
                pageSize={pageSize}
                total={mockData.length}
                onChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default ListExam;
