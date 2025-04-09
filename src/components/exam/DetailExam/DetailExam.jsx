import React, {useEffect, useState} from "react";
import {Card, Row, Col, Button, Tabs, Space, Tooltip, List, Input, Avatar, Empty, Spin, Tag, notification} from "antd";
import {
    PlayCircleOutlined,
    LikeOutlined,
    DislikeOutlined,
    SendOutlined,
    ArrowLeftOutlined,
    ClockCircleOutlined,
    QuestionCircleOutlined,
    UserOutlined,
    InfoCircleOutlined,
    CalendarOutlined, SettingOutlined, DownloadOutlined, FileExcelOutlined
} from "@ant-design/icons";
import {callDetailExam, callExportResult, callUpdateExam} from "../../../services/api";
import {useNavigate, useParams} from "react-router-dom";
import ExamineeTable from "./Results";
import ResultLists from "../ResultList/ResultLists.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {BsFillQuestionOctagonFill} from "react-icons/bs";
import ExamSettingModal from "../Update/ExamSettingModal.jsx";
import {fetchExam} from "../../../redux/exam/examSlice.js";

const {TabPane} = Tabs;

const ExamDetail = () => {
    const navigate = useNavigate(); // Khởi t

    const [loading, setLoading] = useState(false);
    const [exam, setExam] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false)
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
    const [settingVisible, setSettingVisible] = useState("");

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
    const {id} = useParams(); // Lấy id từ URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await callDetailExam(id);
                setExam(response.data);
                setIsAvailable(response.data && (response.data.effectiveDate == null || new Date() >= new Date(response.data.effectiveDate)) && (response.data.expirationDate == null || new Date() < new Date(response.data.expirationDate)));
            } catch (error) {
                // setError(error.message);
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const exportExecutorsToExcel = () => {
        if (!exam?.executors?.length) return;

        const data = exam.executors.map((executor, index) => ({
            "Số thứ tự": index + 1,
            "Số báo danh": executor.candidateNumber,
            "Mã user": executor.userCode,
            "Họ và tên": executor.fullName,
            "Email": executor.email,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 5 }, // Số thứ tự
            { wch: 20 }, // Số báo danh
            { wch: 20 }, // Mã user
            { wch: 30 }, // Họ và tên
            { wch: 30 }, // Email
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Thí sinh");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileName = `${exam?.examCode.replace(/\s+/g, "_")}_thi_sinh.xlsx`;
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, fileName);
    };

    const exportResultToExcel = async () => {
        const res = await callExportResult(id);

        if (res?.success && res?.data?.length > 0) {
            const data = res.data.map((item, index) => {
                const totalSeconds = Math.round(item.timeTracking * 60);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                return {
                    "Số thứ tự": index + 1,
                    "Số báo danh": item.candidateNumber,
                    "Họ và tên": item.fullName,
                    "Mã đề": item.paperCode,
                    "Điểm": item.score,
                    "Thời gian làm bài": `${minutes} phút ${seconds} giây`,
                    "Lượt làm": item.sequenceExecute,
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(data);

            // Tùy chỉnh độ rộng cột
            worksheet['!cols'] = [
                { wch: 12 }, // Số thứ tự
                { wch: 20 }, // Số báo danh
                { wch: 30 }, // Họ và tên
                { wch: 15 }, // Mã đề
                { wch: 10 }, // Điểm
                { wch: 20 }, // Thời gian làm bài
                { wch: 12 }, // Lượt làm
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Kết quả");

            const fileName = `ket_qua_thi_${exam.examCode}.xlsx`;
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, fileName);
        } else {
            notification.error({
                message: "Không tìm thấy danh sách kết quả",
            });
        }
    };

    return (
        <Spin spinning={loading}>
            <div style={{padding: "20px"}}>
                {exam && <div>
                    <div className="header">
                        <h2>ĐỀ THI: {exam.examCode} - {exam.examName}</h2>
                        <Button
                            type="primary" danger icon={<ArrowLeftOutlined/>}
                            onClick={() => navigate("/")}
                        >
                            Trở về
                        </Button>
                    </div>
                </div>}
                {exam && <div>
                    <Card
                        hoverable
                        style={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: 24 }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={8}>
                                <img
                                    alt="exam"
                                    src="https://s3.eduquiz.io.vn/default/exam/exam-04.png"
                                    style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
                                />
                            </Col>
                            <Col xs={24} md={16}>
                                <Space wrap size="middle">
                                    <Tag color="purple"><b>Mã đề:</b> {exam.examCode}</Tag>
                                    <Tag icon={<ClockCircleOutlined/>} color="blue">
                                        {exam.time} phút
                                    </Tag>
                                    <Tag icon={<QuestionCircleOutlined/>} color="volcano">
                                        {exam.totalQuestion} câu
                                    </Tag>
                                    <Tag icon={<UserOutlined/>} color="green">
                                        {exam.executorEmail?.length || 0} thí sinh
                                    </Tag>
                                </Space>

                                <p style={{marginTop: 16}}><InfoCircleOutlined/> <b>Mô tả:</b> {exam.description}</p>
                                <p><CalendarOutlined/> <b>Thời gian bắt đầu:</b>{" "}
                                    {new Date(exam.effectiveDate).toLocaleString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                    })}
                                </p>
                                <p><CalendarOutlined/> <b>Thời gian hết hạn:</b>{" "}
                                    {exam.expirationDate ? (
                                        exam.expirationDate
                                    ) : (
                                        <Tooltip title="Không có hạn">∞</Tooltip>
                                    )}
                                </p>

                                <Row gutter={[16, 8]}>
                                    <Col span={12}><b>Cấp bậc / Trình độ:</b> {exam.programCategory}</Col>
                                    {exam.gradeCategory ? (<Col span={12}><b>Khối / Lớp:</b> {exam.gradeCategory}</Col> ) : ""}
                                    <Col span={12}><b>Môn học / Chủ đề:</b> {exam.subjectCategory}</Col>
                                    <Col span={12}><b>Số lượng mã đề:</b> {exam.randomAmount}</Col>
                                    <Col span={12}><b>Số lượt làm bài tối đa:</b> {exam.limitation || "Không giới hạn"}</Col>
                                    <Col span={12}><b>Cách tính điểm:</b> {exam.scoreType}</Col>
                                    <Col span={12}><b>Hiển thị đáp án:</b> {exam.displayAnswer ? "Có" : "Không"}</Col>
                                    <Col span={12}><b>Tỉ lệ câu hỏi:</b> Khó: {exam.questionRate.hardRate || 0} - Vừa: {exam.questionRate.mediumRate || 0} - Dễ {exam.questionRate.easyRate || 0} (%)</Col>
                                </Row>

                                <div style={{marginTop: 24}}>
                                    <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined/>}
                                        size="large"
                                        style={{
                                            backgroundColor: isAvailable ? "#52c41a" : "#d9d9d9",
                                            borderColor: isAvailable ? "#52c41a" : "#d9d9d9",
                                        }}
                                        disabled={!isAvailable}
                                        onClick={() => navigate(`/quiz/${exam.id}`)}
                                    >
                                        {isAvailable ? "Vào thi" : "Đề thi chưa mở"}
                                    </Button>

                                    {exam.createdBy === localStorage.getItem("currentEmail") && (
                                        <div style={{marginTop: 16}}>
                                            <Space wrap>

                                                <Button icon={<SettingOutlined />} onClick={() => setSettingVisible(true)} type="default" shape="round">
                                                    Cài đặt
                                                </Button>
                                                <Button icon={<BsFillQuestionOctagonFill/>} type="default" shape="round">
                                                    Ngân hàng câu hỏi
                                                </Button>
                                                <Button icon={<DownloadOutlined/>} onClick={() => exportExecutorsToExcel()} type="default" shape="round">
                                                    Tải danh sách thí sinh
                                                </Button>
                                                <Button icon={<FileExcelOutlined/>} onClick={() => exportResultToExcel()} type="default" shape="round">
                                                    Xuất kết quả
                                                </Button>
                                            </Space>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <ExamSettingModal
                        visible={settingVisible}
                        onCancel={() => setSettingVisible(false)}
                        onSave={async (updatedValues) => {
                            const res = await callUpdateExam(id, updatedValues);
                            if (res) {
                                notification.success(res?.data);
                            } else {
                                notification.error(res?.message);
                            }
                            setSettingVisible(false);
                        }}
                        exam={exam}
                    />

                    {/* Tabs for additional information */}
                    <Tabs defaultActiveKey="2" style={{marginTop: "20px"}}>

                        <TabPane tab="Thí sinh" key="2">
                            <ExamineeTable executors={exam.executors} loading={loading}></ExamineeTable>
                        </TabPane>
                        <TabPane tab="Kết quả" key="6">
                            <ResultLists examId={exam.id} createdBy={exam.createdBy}/>
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
                                        <LikeOutlined/> 0
                                    </span>,
                                            <span>
                                        <DislikeOutlined/> 0
                                    </span>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            style={{alignItems: "center"}}
                                            avatar={<Avatar size="large"
                                                            style={{backgroundColor: '#f56a00'}}>{item.username[0].toUpperCase()}</Avatar>
                                            }
                                            title={<span>{item.username}</span>}
                                            description={<span>{item.time}</span>}
                                        />
                                        {item.content}
                                    </List.Item>
                                )}
                            />


                            {/* Ô nhập bình luận */}
                            <div style={{marginTop: "20px"}}>
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Nhập bình luận của bạn..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{marginBottom: "10px"}}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined/>}
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
