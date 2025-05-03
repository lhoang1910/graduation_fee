import React, { useEffect, useState } from "react";
import {Layout, Button, Form, Input, Radio, Space, Typography, Row, Col, Checkbox, Divider, notification, Spin,} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {callGetExamQuestion, callUpdateExamQuestion} from "../../../services/api.js";

const { Content, Sider } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const EditQuestions = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const {id} = useParams();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                console.log(">>>>chay vao day r")
                setLoading(true)
                const res = await callGetExamQuestion(id);
                if (res?.data) {
                    setQuestions(res.data);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchQuestions();
    }, [id]);

    const updateQuestionContent = (e) => {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion] = {
            ...updatedQuestions[selectedQuestion],
            question: e.target.value,
        };
        setQuestions(updatedQuestions);
        form.setFieldsValue({ questionContent: e.target.value });
    };

    useEffect(() => {
        form.setFieldsValue({
            questionContent: questions[selectedQuestion]?.question || "",
        });
    }, [selectedQuestion, form]);

    const addQuestion = () => {
        const newQuestion = {
            id: null,
            code: null,
            attachmentPath: null,
            questionLevel: "Dễ",
            question: "",
            type: 0,
            answers: [
                {
                    id: null,
                    index: null,
                    questionCode: null,
                    answer: "",
                    attachmentPath: null,
                    correct: false,
                },
                {
                    id: null,
                    index: null,
                    questionCode: null,
                    answer: "",
                    attachmentPath: null,
                    correct: false,
                },
            ],
            explain: null,
            explainFilePath: null,
        };

        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setSelectedQuestion(questions.length);
    };

    const addAnswer = () => {
        const updatedQuestions = [...questions];
        const updatedAnswers = [
            ...updatedQuestions[selectedQuestion].answers,
            {
                id: null,
                index: null,
                questionCode: null,
                answer: "",
                attachmentPath: null,
                correct: false,
            },
        ];
        updatedQuestions[selectedQuestion] = {
            ...updatedQuestions[selectedQuestion],
            answers: updatedAnswers,
        };
        setQuestions(updatedQuestions);
    };

    const removeAnswer = (answerIndex) => {
        const updatedQuestions = [...questions];
        const selectedQ = { ...updatedQuestions[selectedQuestion] };

        const updatedAnswers = selectedQ.answers.filter(
            (_, index) => index !== answerIndex
        );
        updatedQuestions[selectedQuestion] = {
            ...selectedQ,
            answers: updatedAnswers,
        };
        setQuestions(updatedQuestions);
    };

    const updateAnswerText = (index, newText) => {
        const updatedQuestions = [...questions];
        const selectedQ = { ...updatedQuestions[selectedQuestion] };
        const updatedAnswers = [...selectedQ.answers];

        updatedAnswers[index] = {
            ...updatedAnswers[index],
            answer: newText,
        };

        updatedQuestions[selectedQuestion] = {
            ...selectedQ,
            answers: updatedAnswers,
        };

        setQuestions(updatedQuestions);
    };

    const updateExplainText = (newText) => {
        const updatedQuestions = [...questions];
        const selectedQ = { ...updatedQuestions[selectedQuestion] };

        if (!selectedQ) return; // Nếu không có câu hỏi, không làm gì cả

        updatedQuestions[selectedQuestion] = {
            ...selectedQ,
            explain: newText,
        };

        setQuestions(updatedQuestions);
    };

    const updateLevelQuestion = (newText) => {
        const updatedQuestions = [...questions];
        const selectedQ = { ...updatedQuestions[selectedQuestion] };

        if (!selectedQ) return; // Nếu không có câu hỏi, không làm gì cả

        updatedQuestions[selectedQuestion] = {
            ...selectedQ,
            questionLevel: newText,
        };

        setQuestions(updatedQuestions);
    };

    const handleUpdateQuestions = async () => {
        try {
            const invalidQuestions = questions.filter((question, index) => {
                if (
                    !question.question ||
                    !question.answers ||
                    question.answers.length === 0
                ) {
                    notification.error({
                        message: `Câu hỏi ${
                            index + 1
                        } không được để trống câu hỏi hoặc đáp án`,
                    });
                    return true;
                }

                const invalidAnswers = question.answers.filter(
                    (answer) => !answer.answer || answer.correct === undefined
                );
                if (invalidAnswers.length > 0) {
                    notification.error({
                        message: `Câu hỏi ${index + 1} có câu trả lời không hợp lệ`,
                    });
                    return true;
                }
                const hasCorrectAnswer = question.answers.some(
                    (answer) => answer.correct === true
                );
                if (!hasCorrectAnswer) {
                    notification.error({
                        message: `Thêm đáp án vào câu hỏi ${index + 1}`,
                    });
                    return true;
                }

                return false;
            });

            if (invalidQuestions.length > 0) {
                return;
            }
            setLoading(true);
            const response = await callUpdateExamQuestion(id, questions);
            notification.info({ message: response.message });
            if (response.success) {
                notification.info({ message: response.message });
            } else {
                notification.error({ message: response.message });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <Layout style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f4f6f9" }}>
                <Sider width={250} style={styles.sidebar}>
                    <h3>Danh mục câu hỏi</h3>
                    <Button
                        type="primary"
                        block
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            if (questions.length > 1) {
                                const updatedQuestions = [...questions];
                                updatedQuestions.splice(selectedQuestion, 1);
                                setQuestions(updatedQuestions);
                                setSelectedQuestion((prev) => (prev > 0 ? prev - 1 : 0));
                            }
                        }}
                    >
                        Xóa câu hỏi
                    </Button>

                    <Divider />

                    <Row gutter={[16, 16]} gap={5}>
                        {questions.map((q, i) => (
                            <Col span={6} key={i}>
                                <Button
                                    type={selectedQuestion === i ? "primary" : "default"}
                                    style={selectedQuestion === i ? styles.activeButton : styles.defaultButton}
                                    onClick={() => setSelectedQuestion(i)}
                                >
                                    {i + 1}
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    <Divider />

                    <div style={styles.createExamButton}>
                        <Button type="primary" size="large" block onClick={handleUpdateQuestions}>
                            Lưu
                        </Button>
                    </div>
                </Sider>

                <Layout style={{ padding: "0 20px 20px 20px" }}>
                    <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                        <h2>Chỉnh sửa câu hỏi</h2>
                        <Form form={form} layout="vertical">
                            <Form.Item label="Soạn câu hỏi" name="questionContent">
                                <TextArea
                                    rows={3}
                                    placeholder="Nhập nội dung câu hỏi"
                                    onChange={updateQuestionContent}
                                    value={questions[selectedQuestion]?.question || ""}
                                />
                            </Form.Item>

                            <Form.Item label="Độ khó">
                                <Radio.Group
                                    defaultValue={"Dễ"}
                                    value={questions[selectedQuestion]?.questionLevel}
                                    onChange={(e) => updateLevelQuestion(e.target.value)}
                                >
                                    <Radio value="Dễ"> Dễ </Radio>
                                    <Radio value="Vừa"> Vừa </Radio>
                                    <Radio value="Khó"> Khó </Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="Câu trả lời">
                                {questions[selectedQuestion]?.answers.map((answer, index) => (
                                    <div key={index} style={styles.answerWrapper}>
                                        <div style={styles.answerHeader}>
                                            <Checkbox
                                                checked={answer.correct}
                                                onChange={() => {
                                                    const updatedQuestions = [...questions];
                                                    const updatedAnswers = updatedQuestions[selectedQuestion].answers.map(
                                                        (a, i) =>
                                                            i === index
                                                                ? { ...a, correct: !a.correct }
                                                                : a
                                                    );
                                                    updatedQuestions[selectedQuestion] = {
                                                        ...updatedQuestions[selectedQuestion],
                                                        answers: updatedAnswers,
                                                    };
                                                    setQuestions(updatedQuestions);
                                                }}
                                            >
                                                <Text strong>Đáp án {index + 1}</Text>
                                            </Checkbox>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeAnswer(index)}
                                            >
                                                Xóa đáp án
                                            </Button>
                                        </div>
                                        <TextArea
                                            placeholder="Nhập nội dung đáp án"
                                            value={answer.answer}
                                            onChange={(e) => updateAnswerText(index, e.target.value)}
                                            rows={3}
                                            style={styles.answerInput}
                                        />
                                    </div>
                                ))}
                            </Form.Item>

                            <Button type="dashed" block onClick={addAnswer} icon={<PlusOutlined />}>
                                Thêm đáp án
                            </Button>

                            <TextArea
                                placeholder="Nhập nội dung giải thích đáp án"
                                rows={3}
                                value={questions[selectedQuestion]?.explain || ""}
                                onChange={(e) => updateExplainText(e.target.value)}
                                style={{
                                    ...styles.answerInput,
                                    marginTop: "20px",
                                    fontStyle: "italic",
                                }}
                            />

                            <Form.Item style={{ marginTop: "20px", textAlign: "right" }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={addQuestion}
                                        style={{
                                            background: "linear-gradient(to right, #1890ff, #722ed1)",
                                        }}
                                    >
                                        Thêm câu hỏi
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
            </Layout>
        </Spin>
    );
};

const styles = {
    sidebar: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
    },
    questionList: {
        display: "flex",
        gap: "8px",
        marginTop: "10px",
    },
    activeButton: {
        backgroundColor: "#3D5AFE",
        color: "white",
        border: "none",
        width: "40px",
        height: "40px",
        fontSize: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
    },
    defaultButton: {
        backgroundColor: "white",
        color: "#3D5AFE",
        border: "1px solid #3D5AFE",
        width: "40px",
        height: "40px",
        fontSize: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
    },
    answerWrapper: {
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "12px",
    },
    answerHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    answerInput: {
        width: "100%",
    },
    radio: {
        width: "100%",
    },
    createExamButton: {
        marginTop: "auto", // Đẩy nút xuống dưới
        paddingTop: "20px",
    },
};

export default EditQuestions;
