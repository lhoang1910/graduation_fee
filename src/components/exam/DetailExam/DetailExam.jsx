import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Tabs, Space, Tooltip, List, Input ,Avatar, Empty, Spin} from "antd";
import { DownloadOutlined, PlayCircleOutlined, BookOutlined, LikeOutlined, DislikeOutlined,SendOutlined } from "@ant-design/icons";
import { callDetailExam } from "../../../services/api";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const ExamDetail = () => {
    const { id } = useParams(); // Lấy id từ URL

    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState(null);

    const [comments, setComments] = useState([
        {
            id: 1,
            username: "Á đậu maz",
            avatar: "https://i.pravatar.cc/150?img=1",
            content: "quả nhiên siêu phẩm thì mãi là siêu phẩm",
            time: "4 ngày trước",
        },
        {
            id: 2,
            username: "lesyeuxdelamour",
            avatar: "https://i.pravatar.cc/150?img=2",
            content: "kinh điển",
            time: "6 ngày trước",
        },
        {
            id: 3,
            username: "nostalgia",
            avatar: "https://i.pravatar.cc/150?img=3",
            content: "đạo diễn christopher nolan cơ mà ad ơi?",
            time: "3 tháng trước",
        },
    ]);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newId = comments.length + 1;
            const newCommentObj = {
                id: newId,
                username: "Người dùng mới",
                avatar: "https://i.pravatar.cc/150?img=" + ((newId % 10) + 1), // Random avatar
                content: newComment.trim(),
                time: "Vừa xong",
            };
            setComments([newCommentObj, ...comments]);
            setNewComment(""); // Reset ô nhập
        }
    };

    // const exam = {
    //     examCode: "EX12345",
    //     examName: "Toán 13",
    //     description: "Đề thi học kỳ môn Toán dành cho khối lớp 13.",
    //     time: 90, // Thời gian làm bài (phút)
    //     effectiveDate: "07/02/2025 08:00",
    //     expirationDate: null, // Null sẽ hiển thị biểu tượng vô cực
    //     randomAmount: 5,
    //     totalQuestion: 20,
    //     limitation: 3, // Số lượt làm bài tối đa
    //     scoreType: "Chấm điểm từng câu",
    //     executionAmount: 120, // Tổng số thí sinh đã làm bài
    //     likes: 54,
    //     unlikes: 10,
    // };

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);

            const response = await callDetailExam(id);
            setExam(response.data);
            console.log(exam);

          } catch (error) {
            // setError(error.message);
            console.log(error)
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [id]); 
    return (
        <Spin spinning={loading} >
        <div style={{ padding: "20px" }}>
                    {exam && <div>            <Card>
                <Row gutter={[16, 16]}>
                    {/* Left section: Exam details */}
                    <Col xs={24} sm={16}>
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <img
                                    alt="exam"
                                    src="https://s3.eduquiz.io.vn/default/exam/exam-04.png"
                                    style={{ width: "100%", borderRadius: "8px" }}
                                />
                            </Col>
                            <Col span={18}>
                                <h2>{exam.examName}</h2>
                                <p><b>Mã đề thi:</b> {exam.examCode}</p>
                                <p><b>Mô tả:</b> {exam.description}</p>
                                <p><b>Thời gian làm bài:</b> {exam.time} phút</p>
                                <p><b>Thời gian bắt đầu:</b> { new Date(exam.effectiveDate).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Hiển thị 24h
  })}</p>
                                <p>
                                    <b>Thời gian hết hạn:</b>{" "}
                                    {exam.expirationDate ? (
                                        exam.expirationDate
                                    ) : (
                                        <Tooltip title="Không có hạn">
                                            {/* <InfinityOutlined /> */}∞
                                        </Tooltip>
                                    )}
                                </p>
                                <p><b>Số lượng mã đề:</b> {exam.randomAmount}</p>
                                <p><b>Tổng số câu hỏi:</b> {exam.totalQuestion}</p>
                                <p><b>Số lượt làm bài tối đa:</b> {exam.limitation || "Không giới hạn"}</p>
                                <p><b>Cách tính điểm:</b> {exam.scoreType}</p>
                                <p><b>Số thí sinh:</b> {exam.executionAmount}</p>
                                <Space size="large">
                                    <Tooltip title="Like">
                                        <Button icon={<LikeOutlined />} type="text">{exam.likes}</Button>
                                    </Tooltip>
                                    <Tooltip title="Dislike">
                                        <Button icon={<DislikeOutlined />} type="text">{exam.unlikes}</Button>
                                    </Tooltip>
                                </Space>
                                <Space style={{ marginTop: "10px" }}>
                                    <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined />}
                                        style={{ backgroundColor: "#9254de" }}
                                    >
                                        Bắt đầu ôn thi
                                    </Button>

                                </Space>
                            </Col>
                        </Row>
                    </Col>

                    {/* Right section: Sharing options */}
                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                        {/* <h4>Chia sẻ đề thi</h4>
                        <Space size="large">
                            <Button shape="circle" icon={<DownloadOutlined />} />
                        </Space>
                        <p>hoặc</p>
                        <Space>
                            <Button>Sao chép link</Button>
                            <Button>Quét mã QRCode</Button>
                        </Space> */}
                    </Col>
                </Row>
            </Card>

            {/* Tabs for additional information */}
            <Tabs defaultActiveKey="2" style={{ marginTop: "20px" }}>
     
                <TabPane tab="Kết quả" key="2">
                    Kết quả
                </TabPane>

                <TabPane tab="Bình luận" key="4">
                    {/* Danh sách bình luận */}
                    <List
                    itemLayout="vertical"
                        dataSource={comments}
                        renderItem={(item) => (
                            <List.Item
                            key={item.id}
                                actions={[
                                    <span>
                                        <LikeOutlined /> 0
                                    </span>,
                                    <span>
                                        <DislikeOutlined /> 0
                                    </span>,
                                ]}
                            >
                                <List.Item.Meta
                                    style={{alignItems:"center"}}
                                    avatar={      <Avatar size="large" style={{ backgroundColor: '#f56a00' }}>{item.username[0].toUpperCase()}</Avatar>
                                }
                                    title={<span>{item.username}</span>}
                                    description={<span>{item.time}</span>}
                                />
                                {item.content}
                            </List.Item>
                        )}
                    />
                    

                    {/* Ô nhập bình luận */}
                    <div style={{ marginTop: "20px" }}>
                        <Input.TextArea
                            rows={2}
                            placeholder="Nhập bình luận của bạn..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{ marginBottom: "10px" }}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleAddComment}
                        >
                            Gửi
                        </Button>
                    </div>
                </TabPane>

            </Tabs></div>}
            {!exam && !loading && <Empty description={"Không thấy đề thi"}></Empty>}


        </div>
        </Spin>
    );
};

export default ExamDetail;
