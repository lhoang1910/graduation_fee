import {
    Modal, Button, Descriptions, List, Tag, Input, Select, Checkbox, Space, Popconfirm, message, Spin
} from "antd";
import { CalendarOutlined, UserOutlined, DeleteOutlined, SaveOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import { callUpdateQuestion, callDeleteQuestion } from "../../services/api.js";

const { TextArea } = Input;
const { Option } = Select;

const DIFFICULTY_OPTIONS = ["Dễ", "Vừa", "Khó"];

const QuestionPopupDetail = ({ visible, onClose, questionData }) => {
    const [question, setQuestion] = useState(questionData?.question || "");
    const [explain, setExplain] = useState(questionData?.explain || "");
    const [difficulty, setDifficulty] = useState(questionData?.questionLevel || "Vừa");
    const [answers, setAnswers] = useState(questionData?.answers || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setQuestion(questionData?.question);
        setExplain(questionData?.explain || "");
        setDifficulty(questionData?.questionLevel)
        setAnswers(questionData?.answers || []);
        setLoading(false);
    }, [questionData])

    const handleAddAnswer = () => {
        setAnswers([...answers, { answer: "", correct: false }]);
    };

    const handleAnswerChange = (index, value) => {
        const updated = [...answers];
        updated[index].answer = value;
        setAnswers(updated);
    };

    const handleCorrectChange = (index, checked) => {
        const updated = [...answers];
        updated[index].correct = checked;
        setAnswers(updated);
    };

    const handleRemoveAnswer = (index) => {
        const updated = answers.filter((_, i) => i !== index);
        setAnswers(updated);
    };

    const handleSave = async () => {
        if (!question.trim()) {
            message.error("Câu hỏi không được để trống!");
            return;
        }

        if (answers.length === 0) {
            message.error("Phải có ít nhất một đáp án.");
            return;
        }

        setLoading(true);
        try {
            const payload = {question, explain, questionLevel: difficulty, answers,
            };
            const res = await callUpdateQuestion(questionData.id, payload);
            if (res?.success){
                message.success("Cập nhật thành công!");
            }
        } catch (error) {
            message.error("Có lỗi khi cập nhật!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await callDeleteQuestion(questionData.id);
            message.success("Xóa thành công!");
            onClose();
        } catch (error) {
            message.error("Xóa thất bại!");
        }
    };

    return (
        <Modal
            title={`📝 ${questionData?.code || ""} - Thông Tin Chi Tiết Câu Hỏi`}
            open={visible}
            onCancel={onClose}
            width={800}
            footer={null}
            centered
        >
        <Spin spinning={loading}>
                <div style={{ marginBottom: 10, fontStyle: "italic", color: "#888" }}>
                    🕒 Lần chỉnh sửa gần nhất: {dayjs(questionData?.updatedAt).format("DD/MM/YYYY HH:mm")}
                </div>

                <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Danh mục" labelStyle={{ fontWeight: "bold" }}>
                        <Space>
                            {questionData?.programCategory && (
                                <Tag color="blue">{questionData.programCategory}</Tag>
                            )}
                            {questionData?.gradeCategory && (
                                <Tag color="green">{questionData.gradeCategory}</Tag>
                            )}
                            {questionData?.subjectCategory && (
                                <Tag color="purple">{questionData.subjectCategory}</Tag>
                            )}
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Câu Hỏi" labelStyle={{ fontWeight: "bold" }}>
                        <TextArea
                            rows={3}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Danh Sách Đáp Án" labelStyle={{ fontWeight: "bold" }}>
                        <List
                            dataSource={answers}
                            bordered
                            locale={{ emptyText: "Chưa có đáp án nào" }}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Space style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                        <Checkbox
                                            checked={item.correct}
                                            onChange={(e) => handleCorrectChange(index, e.target.checked)}
                                        />
                                        <Input
                                            value={item.answer}
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            placeholder={`Đáp án ${index + 1}`}
                                            style={{ flex: 1 }}
                                        />
                                        <DeleteOutlined
                                            onClick={() => handleRemoveAnswer(index)}
                                            style={{ color: "red", cursor: "pointer" }}
                                        />
                                    </Space>
                                </List.Item>
                            )}
                        />
                        <Button type="dashed" style={{ marginTop: 10 }} onClick={handleAddAnswer}>
                            + Thêm đáp án
                        </Button>
                    </Descriptions.Item>

                    <Descriptions.Item label="Giải Thích" labelStyle={{ fontWeight: "bold" }}>
                        <TextArea
                            rows={3}
                            value={explain}
                            onChange={(e) => setExplain(e.target.value)}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Độ Khó" labelStyle={{ fontWeight: "bold" }}>
                        <Select value={difficulty} onChange={setDifficulty} style={{ width: 120 }}>
                            {DIFFICULTY_OPTIONS.map((opt) => (
                                <Option key={opt} value={opt}>
                                    {opt}
                                </Option>
                            ))}
                        </Select>
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời Gian Tạo" labelStyle={{ fontWeight: "bold" }}>
                        <CalendarOutlined /> {dayjs(questionData?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Descriptions.Item>

                    <Descriptions.Item label="Tác Giả" labelStyle={{ fontWeight: "bold" }}>
                        <UserOutlined /> {questionData?.createdBy}
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16, textAlign: "right" }}>
                    <Space>
                        <Popconfirm
                            title="Bạn chắc chắn muốn xóa câu hỏi này?"
                            onConfirm={handleDelete}
                            okText="Xóa"
                            cancelText="Hủy"
                            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                            Lưu
                        </Button>
                        <Button onClick={onClose}>Đóng</Button>
                    </Space>
                </div>
            </Spin>
        </Modal>
    );
};

export default QuestionPopupDetail;
