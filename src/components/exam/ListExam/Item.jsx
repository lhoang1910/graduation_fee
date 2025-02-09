import React from "react";
import { Card, Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

const Item = ({ item, likes, dislikes, handleLike, handleDislike }) => {
    return (
        <Card
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
                        <p>Câu hỏi: {item.stats.questions}</p>
                    </div>
                }
            />
            <Button
                type="primary"
                style={{ marginTop: "10px", width: "100%", backgroundColor: "#9254de" }}
            >
                Vào ôn thi
            </Button>
        </Card>
    );
};

export default Item;
