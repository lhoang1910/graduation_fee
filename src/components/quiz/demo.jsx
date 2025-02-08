import React, { useEffect, useState } from "react";
import { Layout, Button, Form, Input, Radio, Space, Typography, Row, Col, Checkbox, Divider, notification } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { callCreateExam } from "../../services/api";
import { useSelector } from "react-redux";

const { Content, Sider } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const QuestionForm = () => {
    const [form] = Form.useForm();

    const [questions, setQuestions] = useState([1]); // Danh sách số thứ tự câu hỏi
    const [selectedQuestion, setSelectedQuestion] = useState(0); // Câu hỏi được chọn
const examRequest = useSelector(state=>state.examCreating);
    const [correctAnswer, setCorrectAnswer] = useState(1); // ID của đáp án đúng
    const [exam,setExam] = useState({
        "examName": "test tạo bài thi",
        "description": "Chỉ là test thôi",
        "examPermissionType": "Công khai",
        "time": 60,
        "effectiveDate": "2025-01-20T10:00:00.000+00:00",
        "expirationDate": null,
        "randomAmount": 5,
        "limitation": null,
        "scoreType": "Chấm điểm theo câu hỏi",
        "totalQuestion": 20,
        "questions": [
            {
                "id": null,
                "code": null,
                "attachmentPath": null,
                "question": "Chọn câu sai về khí quản?",
                "type": 0,
                "answers": [
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Chạy tiếp theo thanh quản từ bờ dưới sụn nhẫn",
                        "attachmentPath": null,
                        "correct": true
                    },
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Từ ngang mức đốt sống cổ V đến đĩa gian đốt sống N IV-V",
                        "attachmentPath": null,
                        "correct": false
                    },
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Tạo bởi các vòng sụn xếp chồng lên nhau",
                        "attachmentPath": null,
                        "correct": false
                    },
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Tận hết tại cựa khí quản",
                        "attachmentPath": null,
                        "correct": false
                    }
                ],
                "explain": "Do m ngu",
                "explainFilePath": null
            },
            {
                "id": null,
                "code": null,
                "attachmentPath": null,
                "question": "Chọn câu đúng về phế quản chính?",
                "type": 0,
                "answers": [
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Bên phải rộng hơn, ngắn hơn, thẳng đứng hơn bên trái",
                        "attachmentPath": null,
                        "correct": false
                    },
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Dị vật đường thở thường rơi vào phế quản chính trái",
                        "attachmentPath": null,
                        "correct": false
                    },
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Sau khi vào rốn phổi, phế quản chính phải tách ra 3 nhánh",
                        "attachmentPath": null,
                        "correct": false
                    },
                    {
                        "id": null,
                        "index": null,
                        "questionCode": null,
                        "answer": "Sau khi vào rốn phổi, phế quản chính trái tách ra 3 nhánh",
                        "attachmentPath": null,
                        "correct": false
                    }
                ],
                "explain": null,
                "explainFilePath": null
            },
        ]
    })
    console.log(exam);
    // Thêm câu hỏi mới
    const updateQuestionContent = (e) => {
        const updatedQuestions = [...exam.questions];
        updatedQuestions[selectedQuestion].question = e.target.value;
        setExam( (exam)=>({ ...exam, questions: updatedQuestions }))
        form.setFieldsValue({ questionContent: newQuestionText });
    };
    useEffect(() => {
        form.setFieldsValue({
            questionContent: exam.questions[selectedQuestion]?.question || "",
        });
    }, [selectedQuestion, exam, form]);
    const addQuestion = () => {
        const questions = exam.questions;
            setExam((preExam)=>{
                const questions = preExam.questions;
                const updatedQuestions = [...questions,               
                    {
                        "id": null,
                        "code": null,
                        "attachmentPath": null,
                        "question": "",
                        "type": 0,
                        "answers": [
                            {
                                "id": null,
                                "index": null,
                                "questionCode": null,
                                "answer": "",
                                "attachmentPath": null,
                                "correct": false
                            },
                            {
                                "id": null,
                                "index": null,
                                "questionCode": null,
                                "answer": "",
                                "attachmentPath": null,
                                "correct": false
                            },

                        ],
                        "explain": null,
                        "explainFilePath": null
                    }
                ] 
                
                return {...preExam,questions:updatedQuestions};
            }
        )
        setSelectedQuestion(questions.length);
        
    };

    // Thêm đáp án mới
    const addAnswer = () => {
        setExam((prevExam)=>{
            const updatedQuestions = [...prevExam.questions];

           const  updatedAnswers= [...updatedQuestions[selectedQuestion].answers,   {
                "id": null,
                "index": null,
                "questionCode": null,
                "answer": "",
                "attachmentPath": null,
                "correct": false
            }];
            updatedQuestions[selectedQuestion] = {...updatedQuestions[selectedQuestion],answers:updatedAnswers}
            return {...prevExam,questions:updatedQuestions}
        })
    };

    // Xóa đáp án
    const removeAnswer = (answerIndex) => {
        setExam((prevExam) => {
            const updatedQuestions = [...prevExam.questions]; // Sao chép mảng questions để tránh thay đổi trực tiếp state
            const selectedQ = updatedQuestions[selectedQuestion]; // Lấy câu hỏi hiện tại
    

    
            // Lọc bỏ đáp án có index tương ứng
            selectedQ.answers = selectedQ.answers.filter((_, index) => index !== answerIndex);
    
            return {
                ...prevExam,
                questions: updatedQuestions,
            };
        });
    };

    const updateAnswerText = (index, newText) => {
        setExam((prevExam) => {
            const updatedQuestions = [...prevExam.questions]; // Sao chép mảng questions để tránh thay đổi trực tiếp state
            const selectedQ = updatedQuestions[selectedQuestion]; // Lấy câu hỏi hiện tại
            const updatedAnswers = [...selectedQ.answers];

            
            updatedAnswers[index] = {
                ...updatedAnswers[index],
                answer: newText,
            };
            selectedQ.answers=updatedAnswers;
            return {
                ...prevExam,
                questions: updatedQuestions,
            };
        });
    };
    
    

    // Chọn đáp án đúng
    const selectCorrectAnswer = (id) => {
        setCorrectAnswer(id);
    };
    const handleCreateExam = async()=>{
        try {
            
           const response = await callCreateExam({...examRequest,questions:exam.questions});
            // console.log({...examRequest,questions:exam.questions})
            notification.info({message:response.message})
            console.log("repsonse exam",response.message)
            
        } catch (error) {
            console.log(error)

        }
    }
    const updateExplainText = (newText) => {
        setExam((prevExam) => {
            const updatedQuestions = [...prevExam.questions]; // Sao chép mảng questions để tránh thay đổi trực tiếp state
            const selectedQ = updatedQuestions[selectedQuestion]; // Lấy câu hỏi hiện tại
    
            if (!selectedQ) return prevExam; // Nếu không tìm thấy câu hỏi, giữ nguyên state
    
            // Cập nhật nội dung giải thích
            selectedQ.explain = newText;
    
            return {
                ...prevExam,
                questions: updatedQuestions,
            };
        });
    };
    
    return (
        <Layout style={{ minHeight: "100vh", padding: "20px", backgroundColor: "#f4f6f9" }}>
            {/* Sidebar bên trái */}
            <Sider width={250} style={styles.sidebar}>
                <h3>Danh mục câu hỏi</h3>
                <Button 
    type="primary" 
    block 
    danger 
    icon={<DeleteOutlined />} 
    onClick={() => {
        if (exam.questions.length > 1) {
            setExam((prevExam) => {
                const updatedQuestions = [...prevExam.questions];
                updatedQuestions.splice(selectedQuestion, 1); // Xóa câu hỏi hiện tại
                
                const newSelected = selectedQuestion === updatedQuestions.length ? selectedQuestion - 1 : selectedQuestion;

                return { 
                    ...prevExam, 
                    questions: updatedQuestions 
                };
            });

            // Cập nhật index câu hỏi được chọn
            setSelectedQuestion((prev) => (prev > 0 ? prev - 1 : 0));
        }
    }}
>
    Xóa câu hỏi
</Button>
<Divider></Divider>

                {/* <Space style={styles.questionList}> */}

                                {/* <Space style={styles.questionList}> */}

                <Row gutter={[16, 16]} gap={5}>
    {exam.questions.map((q, i) => (
        <Col span={6} key={i}> 
            <Button
                type={selectedQuestion === i ? "primary" : "default"}
                // shape="square"
                // size="large"
                style={selectedQuestion === i ? styles.activeButton : styles.defaultButton}
                onClick={() => setSelectedQuestion(i)}
            >
                {i + 1}
            </Button>
        </Col>
    ))}
</Row>
                {/* </Space> */}

    <Divider></Divider>
                <div style={styles.createExamButton}>
        <Button type="primary" size="large" block onClick={handleCreateExam}>
            Tạo đề thi
        </Button>
    </div>
            </Sider>

            {/* Nội dung chính bên phải */}
            <Layout style={{ padding: " 0 20px 20px 20px" }}>
                <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
                    <h2>Chỉnh sửa câu hỏi</h2>
                    <Form form={form} layout="vertical">
                        {/* Nhập nội dung câu hỏi */}
                        <Form.Item label="Soạn câu hỏi" name="questionContent">
                            <TextArea rows={3} placeholder="Nhập nội dung câu hỏi" onChange={updateQuestionContent}  />
                        </Form.Item>

                        {/* Danh sách đáp án
                        <Form.Item label="Câu trả lời">
                            <Radio.Group value={correctAnswer} onChange={(e) => selectCorrectAnswer(e.target.value)} style={styles.radio} >
                                {answers.map((answer, index) => (
                                    <div key={answer.id} style={styles.answerWrapper}>
                                        <div style={styles.answerHeader}>
                                            <Radio value={answer.id}>
                                                <Text strong>Đáp án {index + 1}</Text>
                                            </Radio>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeAnswer(answer.id)}
                                            >
                                                Xóa đáp án
                                            </Button>
                                        </div>
                                        <TextArea
                                            placeholder="Nhập nội dung đáp án"
                                            value={answer.text}
                                            onChange={(e) => updateAnswerText(answer.id, e.target.value)}
                                            rows={3}
                                            style={styles.answerInput}
                                        />
                                    </div>
                                ))}
                            </Radio.Group>
                        </Form.Item> */}
                        <Form.Item label="Câu trả lời">
    {exam.questions[selectedQuestion].answers.map((answer, index) => (
        <div key={index} style={styles.answerWrapper}>
            <div style={styles.answerHeader}>
                <Checkbox
                    checked={answer.correct}
                    
                    onChange={() => {
                        setExam((prevExam) => {
                            const updatedQuestions = [...prevExam.questions];
                            const updatedAnswers = updatedQuestions[selectedQuestion].answers.map((a,i) =>
                            i === index ? { ...a, correct: !a.correct } : a
                            );
                            updatedQuestions[selectedQuestion].answers = updatedAnswers;
                
                            return { ...prevExam, questions: updatedQuestions };
                        });
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



                        {/* Nút thêm đáp án */}
                        <Button type="dashed"  block onClick={addAnswer} icon={<PlusOutlined />}>
                            Thêm đáp án
                        </Button>
                        <TextArea
                                            placeholder="Nhập nội dung giải thích đáp án"
                                            rows={3}
                                            value={exam.questions[selectedQuestion]?.explain || ""} // Hiển thị giá trị hiện tại hoặc rỗng
    onChange={(e) => updateExplainText(e.target.value)} // Gọi hàm cập nhật khi người dùng nhập
                                            style={{...styles.answerInput,marginTop:"20px", fontStyle: "italic" }}
                                        />
                        <Form.Item style={{ marginTop: "20px", textAlign: "right" }}>
                            <Space>
                                {/* <Button type="primary">Lưu câu hỏi</Button> */}
                                <Button type="primary" onClick={addQuestion} style={{ background: "linear-gradient(to right, #1890ff, #722ed1)" }}>
                                    Thêm câu hỏi
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </Layout>
    );
};

// 🌟 Style tùy chỉnh để giống giao diện gốc
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
    radio:{
        width: "100%",


    },
    createExamButton: {
        marginTop: "auto", // Đẩy nút xuống dưới
        paddingTop: "20px",
    }
};

export default QuestionForm;



















