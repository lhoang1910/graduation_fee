import React, { useState } from "react";
import { displayFile, uploadFile } from "../../utils/FileUtils.jsx";
import { FaTrash } from "react-icons/fa";

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
    );
};

export default Quiz;
