import React, {useEffect, useState} from "react";
import {Card, Form, Layout, Select, Tabs, Typography, Tag, Modal} from "antd";
import {Input, Button, DatePicker, InputNumber, message} from "antd";
import QuestionForm from "./demo.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setExamField} from "../../redux/examCreating/examCreating.Slice.js";
import moment from "moment";
import {callAllCreatedClassNameCode, callCheckUserExistByEmail} from "../../services/api.js";

const {Sider, Content} = Layout;
const {Text, Title} = Typography;
const {Option} = Select;
const {TabPane} = Tabs;

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
                {answer: "", attachmentPath: "", isCorrect: false},
                {answer: "", attachmentPath: "", isCorrect: false},
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
        setQuiz((prevQuiz) => ({...prevQuiz, questions: updatedQuestions}));
        setCurrentQuestionIndex(null);
    };

    const handleAddAnswer = () => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[currentQuestionIndex].answers.push({
            answer: "",
            attachmentPath: "",
            isCorrect: false,
        });
        setQuiz({...quiz, questions: updatedQuestions});
    };

    const handleDeleteAnswer = (answerIndex) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[currentQuestionIndex].answers.splice(answerIndex, 1);
        setQuiz({...quiz, questions: updatedQuestions});
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
        <Layout style={{minHeight: "100vh", borderRadius: "8px 8px 0 0"}}>
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
                        <div style={{display: "flex", gap: "20px"}}>
                            <ExamForm setActiveTab={setActiveTab}></ExamForm>
                        </div>

                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Đề thi" key="3">
                        <div style={{display: "flex", gap: "20px"}}>
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
    const exam = useSelector((state) => state.examCreating);
    const dispatch = useDispatch();
    const [classes, setClasses] = useState([])
    const [email, setEmail] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckEmail = async () => {
        if (!email.trim()) {
            message.warning("Vui lòng nhập email.");
            return;
        }

        setLoading(true);
        try {
            const res = await callCheckUserExistByEmail(email.trim());

            if (!res?.data) {
                message.error("Người dùng không tồn tại.");
            } else {
                setSelectedUser(res.data);
                setVisible(true);
            }
        } catch (error) {
            message.error("Lỗi khi kiểm tra email.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAddUser = () => {
        if (selectedUser) {
            handleChange("executorEmail", [...exam.executorEmail, selectedUser.email]);
            setEmail("");
        }
        setVisible(false);
        setSelectedUser(null);
    };

    const handleCancel = () => {
        setVisible(false);
        setEmail("");
    };

    const handleRemoveEmail = (removedEmail) => {
        handleChange(
            "executorEmail",
            exam.executorEmail.filter((e) => e !== removedEmail)
        );
    };

    const handleChange = (field, value) => {
        dispatch(setExamField({field, value}));
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await callAllCreatedClassNameCode();
                setClasses(response?.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lớp học:", error);
            }
        };

        fetchClasses();
    }, []);

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
                            style={{width: "100%"}}
                        />
                    </Form.Item>

                    {/* Thời gian đề thi có hiệu lực */}
                    <Form.Item label="Thời gian đề thi có hiệu lực" required>
                        <DatePicker
                            style={{width: "100%"}}
                            showTime
                            value={exam.effectiveDate ? moment(exam.effectiveDate) : moment()}
                            onChange={(date) => handleChange("effectiveDate", date)}
                        />
                    </Form.Item>

                    {/* Ngày đóng bài thi */}
                    <Form.Item label="Ngày đóng bài thi">
                        <DatePicker
                            style={{ width: "100%" }}
                            showTime
                            placeholder="Để trống nếu không giới hạn"
                            value={exam.expirationDate ? moment(exam.expirationDate) : null}
                            onChange={(date) => handleChange("expirationDate", date ? date.toISOString() : null)}
                        />
                    </Form.Item>

                    {/* Cách tính điểm */}
                    <Form.Item label="Cách tính điểm" required>
                        <Select value={exam.scoreType} onChange={(value) => handleChange("scoreType", value)}>
                            <Option value="Chấm điểm theo câu hỏi">Chấm điểm theo câu hỏi</Option>
                            <Option value="Chấm điểm theo đáp án">Chấm điểm theo đáp án</Option>
                        </Select>
                    </Form.Item>

                    {/* Quyền truy cập */}
                    <Form.Item label="Quyền truy cập" required>
                        <Select value={exam.examPermissionType}
                                onChange={(value) => handleChange("examPermissionType", value)}>
                            <Option value="Công khai">Công khai</Option>
                            <Option value="Chỉ mình tôi">Chỉ mình tôi</Option>
                            <Option value="Người được cấp quyền">Người được cấp quyền</Option>
                            <Option value="Thành viên lớp học">Thành viên lớp học</Option>
                        </Select>
                    </Form.Item>

                    {/* Nếu chọn "Người được cấp quyền" -> Hiển thị ô nhập email */}
                    {exam.examPermissionType === "Người được cấp quyền" && (
                        <Form.Item label="Nhập email được cấp quyền" required>
                            <Input
                                placeholder="Nhập email và nhấn Enter"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onPressEnter={handleCheckEmail}
                                style={{ marginBottom: "10px" }}
                            />
                            <Button type="primary" onClick={handleCheckEmail} loading={loading}>
                                Kiểm tra
                            </Button>

                            <div style={{ marginTop: "10px" }}>
                                {exam.executorEmail.map((email) => (
                                    <Tag key={email} closable onClose={() => handleRemoveEmail(email)}>
                                        {email}
                                    </Tag>
                                ))}
                            </div>
                        </Form.Item>
                    )}

                    {/* Popup xác nhận */}
                    <Modal
                        title={`Bạn có muốn thêm người dùng ${selectedUser?.code} - ${selectedUser?.fullName} vào đề thi?`}
                        open={visible}
                        onCancel={handleCancel}
                        onOk={handleConfirmAddUser}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Form layout="vertical">
                            <Form.Item label="Mã người dùng">
                                <Input value={selectedUser?.code} disabled />
                            </Form.Item>
                            <Form.Item label="Họ và tên">
                                <Input value={selectedUser?.fullName} disabled />
                            </Form.Item>
                            <Form.Item label="Email">
                                <Input value={selectedUser?.email} disabled />
                            </Form.Item>
                            <Form.Item label="Giới tính">
                                <Input value={selectedUser?.gender} disabled />
                            </Form.Item>
                            <Form.Item label="Ngày sinh">
                                <Input value={selectedUser?.birthDay} disabled />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {exam.examPermissionType === "Thành viên lớp học" && (
                        <Form.Item label="Chọn lớp học" required>
                            <Select
                                placeholder="Chọn lớp học"
                                value={exam.classCode}
                                onChange={(value) => handleChange("classCode", value)}
                                style={{ width: "100%" }}
                            >
                                {classes.map((cls) => (
                                    <Select.Option key={cls.classCode} value={cls.classCode}>
                                        {cls.classCode} - {cls.className}
                                    </Select.Option>
                                ))}
                            </Select>
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




























