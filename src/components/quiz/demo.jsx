import React, { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Form,
  Input,
  Radio,
  Space,
  Typography,
  Row,
  Col,
  Checkbox,
  Divider,
  notification,
  Spin,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { callCreateExam } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {
  resetExam,
  updateQuestions,
} from "../../redux/examCreating/examCreating.Slice";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import moment from "moment/moment.js";

const { Content, Sider } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const QuestionForm = () => {
  const [value, setValue] = React.useState("female");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { message } = location.state || {};
  const [form] = Form.useForm();
  const questions = useSelector((state) => state.examCreating.questions);
  const navigate = useNavigate();

  const [selectedQuestion, setSelectedQuestion] = useState(0); // Câu hỏi được chọn
  const examRequest = useSelector((state) => state.examCreating);
  const [correctAnswer, setCorrectAnswer] = useState(1); // ID của đáp án đúng
  const [exam, setExam] = useState({
    examName: "",
    questionRate: { easyRate: 100, mediumRate: 0, hardRate: 0 },
    description: "",
    examPermissionType: "Công khai",
    classCode: "",
    executorEmail: [],
    time: null,
    effectiveDate: moment().add(30, 'minutes').toISOString(),
    expirationDate: null,
    randomAmount: null,
    limitation: null,
    scoreType: "Chấm điểm theo câu hỏi",
    totalQuestion: 0,
    questions: questions,
  });
  // Thêm câu hỏi mới
  const updateQuestionContent = (e) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[selectedQuestion] = {
      ...updatedQuestions[selectedQuestion], // Tạo bản sao của câu hỏi cần cập nhật
      question: e.target.value, // Cập nhật câu hỏi
    };
    setExam((exam) => ({ ...exam, questions: updatedQuestions }));
    form.setFieldsValue({ questionContent: e.target.value });
  };
  useEffect(() => {
    console.log("question", exam.questions);
    form.setFieldsValue({
      questionContent: exam.questions[selectedQuestion]?.question || "",
    });
  }, [selectedQuestion, exam, form]);
  const addQuestion = () => {
    const questions = exam.questions;
    setExam((preExam) => {
      const questions = preExam.questions;
      const updatedQuestions = [
        ...questions,
        {
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
        },
      ];

      return { ...preExam, questions: updatedQuestions };
    });
    setSelectedQuestion(questions.length);
  };

  // Thêm đáp án mới
  const addAnswer = () => {
    setExam((prevExam) => {
      const updatedQuestions = [...prevExam.questions];

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
      return { ...prevExam, questions: updatedQuestions };
    });
  };

  // Xóa đáp án
  const removeAnswer = (answerIndex) => {
    setExam((prevExam) => {
      const updatedQuestions = [...prevExam.questions]; // Sao chép mảng questions để tránh thay đổi trực tiếp state
      const selectedQ = updatedQuestions[selectedQuestion]; // Lấy câu hỏi hiện tại

      // Lọc bỏ đáp án có index tương ứng
      selectedQ.answers = selectedQ.answers.filter(
        (_, index) => index !== answerIndex
      );

      return {
        ...prevExam,
        questions: updatedQuestions,
      };
    });
  };

  const updateAnswerText = (index, newText) => {
    setExam((prevExam) => {
      const updatedQuestions = [...prevExam.questions]; // Sao chép mảng questions để tránh thay đổi trực tiếp state
      const selectedQ = { ...updatedQuestions[selectedQuestion] }; // Sao chép câu hỏi hiện tại
      const updatedAnswers = [...selectedQ.answers];

      updatedAnswers[index] = {
        ...updatedAnswers[index],
        answer: newText,
      };
      // selectedQ = {...selectedQ,answers:updatedAnswers}
      selectedQ.answers = updatedAnswers;
      updatedQuestions[selectedQuestion] = selectedQ;

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
  const handleCreateExam = async () => {
    try {
      if (examRequest.examName.trim() === "") {
        notification.error({ message: "Tên đề thi trống" });
        return;
      }
      if (examRequest.effectiveDate === null) {
        notification.error({ message: "Thêm thời gian đề thi có hiệu lực" });
        return;
      }
      if (examRequest.examPermissionType === "Người được cấp quyền") {
      }
      if (
        examRequest.examPermissionType === "Thành viên lớp học" &&
        examRequest.classCode.trim() === ""
      ) {
        notification.error({ message: "Thêm mã lớp học" });
        return;
      }
      const invalidQuestions = exam.questions.filter((question, index) => {
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

      let request;
      if (examRequest.examPermissionType === "Người được cấp quyền") {
        const { classCode, ...examRequestWithoutExecutorEmail } = examRequest;
        request = examRequestWithoutExecutorEmail;
      } else if (examRequest.examPermissionType === "Thành viên lớp học") {
        const { executorEmail, ...examRequestWithoutClassCode } = examRequest;
        request = examRequestWithoutClassCode;
      } else {
        // const { executorEmails, ...examRequestWithoutClassCode } = examRequest;
        // request = examRequestWithoutClassCode;
        request = examRequest;
      }
      setLoading(true);
      const response = await callCreateExam({
        ...request,
        questions: exam.questions,
      });
      // console.log({...examRequest,questions:exam.questions})
      notification.info({ message: response.message });
      if (response.success) {
        dispatch(resetExam());
        console.log("repsonse exam", response.message);
        navigate(`/exam/${response?.data?.id}`)
      } else {
        notification.error({ message: response.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
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
  const updateLevelQuestion = (newText) => {
    setExam((prevExam) => {
      const updatedQuestions = [...prevExam.questions]; // Sao chép mảng questions để tránh thay đổi trực tiếp state
      const selectedQ = updatedQuestions[selectedQuestion]; // Lấy câu hỏi hiện tại

      if (!selectedQ) return prevExam; // Nếu không tìm thấy câu hỏi, giữ nguyên state

      // Cập nhật nội dung giải thích
      // selectedQ.questionLevel = newText;
      const updatedQuestion = { ...selectedQ, questionLevel: newText };
      updatedQuestions[selectedQuestion] = updatedQuestion;

      return {
        ...prevExam,
        questions: updatedQuestions,
      };
    });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(updateQuestions(exam.questions));
    };
  }, [dispatch]);

  return (
    <Spin spinning={loading}>
      <Layout
        style={{
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f4f6f9",
        }}
      >
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

                  const newSelected =
                    selectedQuestion === updatedQuestions.length
                      ? selectedQuestion - 1
                      : selectedQuestion;

                  return {
                    ...prevExam,
                    questions: updatedQuestions,
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

          <Row gutter={[16, 16]} gap={5}>
            {exam.questions.map((q, i) => (
              <Col span={6} key={i}>
                <Button
                  type={selectedQuestion === i ? "primary" : "default"}
                  // shape="square"
                  // size="large"
                  style={
                    selectedQuestion === i
                      ? styles.activeButton
                      : styles.defaultButton
                  }
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
            <Button
              type="primary"
              size="large"
              block
              onClick={handleCreateExam}
            >
              Tạo đề thi
            </Button>
          </div>
        </Sider>

        {/* Nội dung chính bên phải */}
        <Layout style={{ padding: " 0 20px 20px 20px" }}>
          <Content
            style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}
          >
            <h2>Chỉnh sửa câu hỏi</h2>
            <Form form={form} layout="vertical">
              {/* Nhập nội dung câu hỏi */}

              <Form.Item label="Soạn câu hỏi" name="questionContent">
                <TextArea
                  rows={3}
                  placeholder="Nhập nội dung câu hỏi"
                  onChange={updateQuestionContent}
                />
              </Form.Item>

              <Form.Item label="Độ khó">
                <Radio.Group
                  defaultValue={"Dễ"}
                  value={exam.questions[selectedQuestion]?.questionLevel}
                  onChange={(e) => {
                    updateLevelQuestion(e.target.value);
                  }}
                >
                  <Radio value="Dễ"> Dễ </Radio>
                  <Radio value="Vừa"> Vừa </Radio>
                  <Radio value="Khó"> Khó </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Câu trả lời">
                {exam.questions[selectedQuestion].answers.map(
                  (answer, index) => (
                    <div key={index} style={styles.answerWrapper}>
                      <div style={styles.answerHeader}>
                        <Checkbox
                          checked={answer.correct}
                          onChange={() => {
                            setExam((prevExam) => {
                              const updatedQuestions = [...prevExam.questions];
                              const updatedAnswers = updatedQuestions[
                                selectedQuestion
                              ].answers.map((a, i) =>
                                i === index ? { ...a, correct: !a.correct } : a
                              );
                              const updatedQuestion = {
                                ...updatedQuestions[selectedQuestion],
                                answers: updatedAnswers, // Cập nhật lại answers
                              };
                              updatedQuestions[selectedQuestion] =
                                updatedQuestion;

                              return {
                                ...prevExam,
                                questions: updatedQuestions,
                              };
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
                        onChange={(e) =>
                          updateAnswerText(index, e.target.value)
                        }
                        rows={3}
                        style={styles.answerInput}
                      />
                    </div>
                  )
                )}
              </Form.Item>

              {/* Nút thêm đáp án */}
              <Button
                type="dashed"
                block
                onClick={addAnswer}
                icon={<PlusOutlined />}
              >
                Thêm đáp án
              </Button>
              <TextArea
                placeholder="Nhập nội dung giải thích đáp án"
                rows={3}
                value={exam.questions[selectedQuestion]?.explain || ""} // Hiển thị giá trị hiện tại hoặc rỗng
                onChange={(e) => updateExplainText(e.target.value)} // Gọi hàm cập nhật khi người dùng nhập
                style={{
                  ...styles.answerInput,
                  marginTop: "20px",
                  fontStyle: "italic",
                }}
              />
              <Form.Item style={{ marginTop: "20px", textAlign: "right" }}>
                <Space>
                  {/* <Button type="primary">Lưu câu hỏi</Button> */}
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
  radio: {
    width: "100%",
  },
  createExamButton: {
    marginTop: "auto", // Đẩy nút xuống dưới
    paddingTop: "20px",
  },
};

export default QuestionForm;
