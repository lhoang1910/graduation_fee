import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
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
  questions: [
    {
      questionLevel: "Dễ",
      id: null,
      code: null,
      attachmentPath: null,
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
  ],
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    updateQuestions: (state, action) => {
      state.questions = action.payload; // Thay thế mảng questions hiện tại bằng mảng mới
      console.log(">>>>question updated successfully");
    },
    // Cập nhật một trường dữ liệu chung
    setExamField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    // Reset toàn bộ form về mặc định
    resetExam: () => initialState,

    // Thêm một câu hỏi mới
    addQuestion: (state) => {
      state.questions.push({
        id: state.questions.length + 1, // Tạo ID tự động
        questionCode: null,
        question: "",
        questionLevel: "Dễ",
        type: 0,
        answers: [], // Danh sách câu trả lời rỗng
        explain: null,
        explainFilePath: null,
      });
    },

    // Xóa câu hỏi theo index
    removeQuestion: (state, action) => {
      const questionIndex = action.payload;
      state.questions = state.questions.filter(
        (_, index) => index !== questionIndex
      );
    },

    // Thêm một đáp án vào câu hỏi cụ thể
    addAnswer: (state, action) => {
      const { questionIndex } = action.payload;
      const newAnswer = {
        id: state.questions[questionIndex]?.answers.length + 1 || 1,
        questionCode: null,
        answer: "",
        attachmentPath: null,
        correct: false, // Mặc định đáp án chưa đúng
      };

      if (state.questions[questionIndex]) {
        state.questions[questionIndex].answers.push(newAnswer);
      }
    },

    // Xóa một đáp án khỏi câu hỏi cụ thể
    removeAnswer: (state, action) => {
      const { questionIndex, answerIndex } = action.payload;

      if (state.questions[questionIndex]) {
        state.questions[questionIndex].answers = state.questions[
          questionIndex
        ].answers.filter((_, index) => index !== answerIndex);
      }
    },
  },
});

export const {
  setExamField,
  resetExam,
  addQuestion,
  removeQuestion,
  addAnswer,
  removeAnswer,
  updateQuestions,
} = examSlice.actions;
export default examSlice.reducer;
