import React, { useState } from "react";
import { displayFile, uploadFile } from "../../utils/FileUtils.jsx";
import { FaTrash } from "react-icons/fa";
import { Card, Form, Layout, Select, Tabs, Typography } from "antd";
import {  Input, Button, DatePicker, InputNumber, message } from "antd";
import QuestionForm from "./demo.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setExamField } from "../../redux/examCreating/examCreating.Slice.js";

const { Sider, Content } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const styles = {
    editor: {
        display: "flex",
        gap: "16px",
        padding: "20px",
        backgroundColor: "#f3f4f6",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    leftPanel: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    rightPanel: {
        flex: 2,
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    h2: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "16px",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "12px",
        margin: "8px 0 16px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "15px",
        boxSizing: "border-box",
    },
    button: {
        backgroundColor: "#4caf50",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        fontSize: "14px",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.3s",
    },
    buttonActive: {
        backgroundColor: "#2e7d32",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
        cursor: "not-allowed",
    },
    deleteButton: {
        backgroundColor: "#f44336",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px",
        borderRadius: "6px",
        marginTop: "12px",
        cursor: "pointer",
    },
    saveButton: {
        backgroundColor: "#2196f3",
        color: "#fff",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "8px",
        marginTop: "20px",
        cursor: "pointer",
    },
};

const Quiz = () => {
    const [quiz, setQuiz] = useState({
        name: "",
        description: "",
        questions: [],
    });
    const [activeTab, setActiveTab] = useState("1");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);

    const validateCurrentQuestion = () => {
        if (currentQuestionIndex === null) return true;

        const question = quiz.questions[currentQuestionIndex];
        const hasQuestionText = question.question.trim() !== "";
        const hasTwoAnswers = question.answers.length >= 2;
        const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect);

        return hasQuestionText && hasTwoAnswers && hasCorrectAnswer;
    };

    const handleAddQuestion = () => {
        if (!validateCurrentQuestion()) return;

        const newQuestion = {
            attachmentPath: "",
            question: "",
            type: 1,
            explain: "",
            explainFilePath: "",
            answers: [
                { answer: "", attachmentPath: "", isCorrect: false },
                { answer: "", attachmentPath: "", isCorrect: false },
            ],
        };

        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: [...prevQuiz.questions, newQuestion],
        }));
        setCurrentQuestionIndex(quiz.questions.length);
    };

    const handleDeleteQuestion = () => {
        if (currentQuestionIndex === null) return;

        const updatedQuestions = [...quiz.questions];
        updatedQuestions.splice(currentQuestionIndex, 1);
        setQuiz((prevQuiz) => ({ ...prevQuiz, questions: updatedQuestions }));
        setCurrentQuestionIndex(null);
    };

    const handleAddAnswer = () => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[currentQuestionIndex].answers.push({
            answer: "",
            attachmentPath: "",
            isCorrect: false,
        });
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleDeleteAnswer = (answerIndex) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[currentQuestionIndex].answers.splice(answerIndex, 1);
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleSaveQuiz = () => {
        console.log("Quiz Data:", quiz);
        alert("Lưu bài thi thành công!");
    };

    const handleQuestionSelect = (index) => {
        if (!validateCurrentQuestion()) {
            alert("Vui lòng hoàn thiện câu hỏi hiện tại trước khi chuyển sang câu khác.");
            return;
        }
        setCurrentQuestionIndex(index);
    };


    return (
        <Layout style={{ minHeight:"100vh",borderRadius:"8px 8px 0 0" }}>
        <Content
            style={{
                padding: 24,
                margin: 0,
                background: "#fff",
                borderRadius: "8px",
                // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
        >
            {/* Tabs */}
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane tab="Thông tin chung" key="1">
                    <div style={{ display: "flex", gap: "20px" }}>
                    <ExamForm setActiveTab={setActiveTab}></ExamForm>
                        </div>

                </Tabs.TabPane>

                {/* <Tabs.TabPane tab="Đề thi" key="2">
                <div style={styles.editor}>
            <div style={styles.leftPanel}>
                <h2 style={styles.h2}>Danh sách câu hỏi</h2>
                <input
                    type="text"
                    placeholder="Tên bài thi"
                    style={styles.input}
                    value={quiz.name}
                    onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
                />
                <textarea
                    placeholder="Mô tả bài thi"
                    style={styles.input}
                    value={quiz.description}
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                ></textarea>
                <div className="question-list">
                    {quiz.questions.map((_, index) => (
                        <button
                            key={index}
                            style={{
                                ...styles.button,
                                ...(index === currentQuestionIndex ? styles.buttonActive : {}),
                            }}
                            onClick={() => handleQuestionSelect(index)}
                        >
                            [{index + 1}]
                        </button>

                    ))}
                    <button
                        style={{
                            ...styles.button,
                            ...(validateCurrentQuestion() ? {} : styles.buttonDisabled),
                        }}
                        onClick={handleAddQuestion}
                        disabled={!validateCurrentQuestion()}
                    >
                        + Thêm câu hỏi
                    </button>
                </div>
                {currentQuestionIndex !== null && (
                    <button style={styles.deleteButton} onClick={handleDeleteQuestion}>
                        <FaTrash /> Xóa câu hỏi
                    </button>
                )}
            </div>

            <div style={styles.rightPanel}>
                {currentQuestionIndex !== null ? (
                    <div>
                        <h2>Câu hỏi {currentQuestionIndex + 1}</h2>
                        <label>Câu hỏi:</label>
                        <textarea
                            placeholder="Nhập câu hỏi..."
                            value={quiz.questions[currentQuestionIndex].question}
                            onChange={(e) => {
                                const updatedQuestions = [...quiz.questions];
                                updatedQuestions[currentQuestionIndex].question = e.target.value;
                                setQuiz({ ...quiz, questions: updatedQuestions });
                            }}
                        ></textarea>

                        <label>Đính kèm:</label>
                        <input
                            type="file"
                            onChange={(e) => {
                                const filePath = uploadFile(e.target.files[0]);
                                const updatedQuestions = [...quiz.questions];
                                updatedQuestions[currentQuestionIndex].attachmentPath = filePath;
                                setQuiz({ ...quiz, questions: updatedQuestions });
                            }}
                        />
                        {displayFile(quiz.questions[currentQuestionIndex].attachmentPath)}

                        <label>Đáp án:</label>
                        {quiz.questions[currentQuestionIndex].answers.map((answer, i) => (
                            <div key={i} className="answer-item">
                                <input
                                    type="checkbox"
                                    checked={answer.isCorrect}
                                    onChange={() => {
                                        const updatedQuestions = [...quiz.questions];
                                        updatedQuestions[currentQuestionIndex].answers[i].isCorrect =
                                            !answer.isCorrect;
                                        setQuiz({ ...quiz, questions: updatedQuestions });
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder={`Đáp án ${i + 1}`}
                                    value={answer.answer}
                                    onChange={(e) => {
                                        const updatedQuestions = [...quiz.questions];
                                        updatedQuestions[currentQuestionIndex].answers[i].answer =
                                            e.target.value;
                                        setQuiz({ ...quiz, questions: updatedQuestions });
                                    }}
                                />
                                <button onClick={() => handleDeleteAnswer(i)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button className="add-answer" onClick={handleAddAnswer}>
                            + Thêm đáp án
                        </button>

                        <label>Giải thích đáp án:</label>
                        <textarea
                            placeholder="Nhập giải thích..."
                            value={quiz.questions[currentQuestionIndex].explain}
                            onChange={(e) => {
                                const updatedQuestions = [...quiz.questions];
                                updatedQuestions[currentQuestionIndex].explain = e.target.value;
                                setQuiz({ ...quiz, questions: updatedQuestions });
                            }}
                        ></textarea>
                        <input
                            type="file"
                            onChange={(e) => {
                                const filePath = uploadFile(e.target.files[0]);
                                const updatedQuestions = [...quiz.questions];
                                updatedQuestions[currentQuestionIndex].explainFilePath = filePath;
                                setQuiz({ ...quiz, questions: updatedQuestions });
                            }}
                        />
                        {displayFile(quiz.questions[currentQuestionIndex].explainFilePath)}
                    </div>
                ) : (
                    <p>Chọn hoặc thêm câu hỏi để chỉnh sửa</p>
                )}
            </div>

            <button className="save-button" onClick={handleSaveQuiz}>
                Lưu bài thi
            </button>
        </div>
                </Tabs.TabPane> */}
                <Tabs.TabPane tab="Đề thi" key="3">
                    <div style={{ display: "flex", gap: "20px" }}>
                        </div>
                        <QuestionForm></QuestionForm>

                </Tabs.TabPane>

            </Tabs>
        </Content>
    </Layout>

    );
};

export default Quiz;
const ExamForm = ({setActiveTab}) => {
    const [form] = Form.useForm();
    // const [accessType, setAccessType] = useState(""); // State để kiểm tra quyền truy cập
    // const [emails, setEmails] = useState([]); // Danh sách email nhập vào

    //     // 🌟 State cho từng biến trong form
    //     const [examName, setExamName] = useState(""); // Tên đề thi
    //     const [description, setDescription] = useState(""); // Mô tả
    //     const [examPermissionType, setExamPermissionType] = useState("Công khai"); // Quyền truy cập
    //     const [classCode, setClassCode] = useState(""); // Mã lớp học (nếu chọn "Thành viên lớp học")
    //     const [executorEmails, setExecutorEmails] = useState([]); // Danh sách email được cấp quyền
    //     const [time, setTime] = useState(60); // Thời gian làm bài
    //     const [effectiveDate, setEffectiveDate] = useState(null); // Thời gian đề thi có hiệu lực
    //     const [expirationDate, setExpirationDate] = useState(null); // Ngày đóng bài thi
    //     const [randomAmount, setRandomAmount] = useState(5); // Số lượng mã đề
    //     const [limitation, setLimitation] = useState(null); // Giới hạn số lượt làm bài
    //     const [scoreType, setScoreType] = useState("Chấm điểm theo câu hỏi"); // Cách tính điểm
    const exam = useSelector((state) => state.examCreating);
    const dispatch = useDispatch();

    const handleChange = (field, value) => {
        dispatch(setExamField({ field, value })); // Gửi action cập nhật Redux state
    };

    const onFinish = (values) => {
        console.log("Form values:", {
            exam
        });

        setActiveTab("3");
    };

    return (
        <div style={stylesForm.container}>
            <Card title="Thông tin chung" bordered={false} style={stylesForm.card}>

            <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Tên đề thi */}
            <Form.Item label="Tên đề thi" required>
                <Input
                    placeholder="Nhập tên đề thi"
                    value={exam.examName}
                    onChange={(e) => handleChange("examName", e.target.value)}
                />
            </Form.Item>

            {/* Mô tả */}
            <Form.Item label="Mô tả">
                <Input.TextArea
                    placeholder="Mô tả bổ sung"
                    rows={3}
                    value={exam.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
            </Form.Item>

            {/* Thời gian làm bài */}
            <Form.Item label="Thời gian làm bài (phút)" required>
                <InputNumber
                    min={1}
                    value={exam.time}
                    onChange={(value) => handleChange("time", value)}
                    style={{ width: "100%" }}
                />
            </Form.Item>

            {/* Thời gian đề thi có hiệu lực */}
            <Form.Item label="Thời gian đề thi có hiệu lực">
                <DatePicker
                    style={{ width: "100%" }}
                    showTime
                    value={exam.effectiveDate}
                    onChange={(date) => handleChange("effectiveDate", date)}
                />
            </Form.Item>

            {/* Ngày đóng bài thi */}
            <Form.Item label="Ngày đóng bài thi">
                <DatePicker
                    style={{ width: "100%" }}
                    showTime
                    placeholder="Để trống nếu không giới hạn"
                    value={exam.expirationDate}
                    onChange={(date) => handleChange("expirationDate", date)}
                />
            </Form.Item>

            {/* Số lượng mã đề */}
            <Form.Item label="Số lượng mã đề" required>
                <InputNumber
                    min={1}
                    value={exam.randomAmount}
                    onChange={(value) => handleChange("randomAmount", value)}
                    style={{ width: "100%" }}
                />
            </Form.Item>

            {/* Cách tính điểm */}
            <Form.Item label="Cách tính điểm">
                <Select value={exam.scoreType} onChange={(value) => handleChange("scoreType", value)}>
                    <Option value="Chấm điểm theo câu hỏi">Chấm điểm theo câu hỏi</Option>
                    <Option value="Chấm điểm theo đáp án">Chấm điểm theo đáp án</Option>
                </Select>
            </Form.Item>

            {/* Quyền truy cập */}
            <Form.Item label="Quyền truy cập">
                <Select value={exam.examPermissionType} onChange={(value) => handleChange("examPermissionType", value)}>
                    <Option value="Công khai">Công khai</Option>
                    <Option value="Chỉ mình tôi">Chỉ mình tôi</Option>
                    <Option value="Người được cấp quyền">Người được cấp quyền</Option>
                    <Option value="Thành viên lớp học">Thành viên lớp học</Option>
                </Select>
            </Form.Item>

            {/* Nếu chọn "Người được cấp quyền" -> Hiển thị ô nhập email */}
            {exam.examPermissionType === "Người được cấp quyền" && (
                <Form.Item label="Nhập email được cấp quyền">
                    <Input.TextArea
                        placeholder="Nhập email, cách nhau bằng dấu phẩy (,)"
                        rows={3}
                        // value={exam.executorEmails.join(", ")}
                        value={exam.executorEmail.join(", ")}

                        onChange={(e) =>
                            handleChange(
                                "executorEmail",
                                e.target.value.split(",").map((email) => email.trim())
                            )
                        }
                    />
                </Form.Item>
            )}

            {/* Nếu chọn "Thành viên lớp học" -> Hiển thị ô nhập mã lớp học */}
            {exam.examPermissionType === "Thành viên lớp học" && (
                <Form.Item label="Nhập mã lớp học" required>
                    <Input
                        placeholder="Nhập mã lớp học"
                        value={exam.classCode}
                        onChange={(e) => handleChange("classCode", e.target.value)}
                    />
                </Form.Item>
            )}

            {/* Nút tạo đề thi */}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Tiếp tục
                </Button>
            </Form.Item>
        </Form>

                
            </Card>
        </div>
    );
};

// 🌟 Style tối ưu hơn
const stylesForm = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "20px",
    },
    card: {
        width: "600px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        padding: "20px",
    },
    fullWidth: {
        width: "100%",
    },
    inputNumber: {
        width: "100%",
    },
    emailContainer: {
        marginTop: "10px",
    },
    emailItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        backgroundColor: "#e6f7ff",
        borderRadius: "5px",
        marginBottom: "5px",
    },
    submitButton: {
        width: "100%",
        background: "linear-gradient(to right, #1890ff, #85a5ff)",
        border: "none",
    },
};




























