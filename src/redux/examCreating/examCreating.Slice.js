// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     examName: "",
//     description: "",
//     examPermissionType: "Công khai",
//     classCode: "",
//     executorEmails: [],
//     time: 60,
//     effectiveDate: null,
//     expirationDate: null,
//     randomAmount: 5,
//     limitation: null,
//     scoreType: "Chấm điểm theo câu hỏi",
//     questions:[                {
//         "id": null,
//         "index": null,
//         "questionCode": null,
//         "answer": "",
//         "attachmentPath": null,
//         "correct": false
//     },]
// };

// const examSlice = createSlice({
//     name: "exam",
//     initialState,
//     reducers: {
//         setExamField: (state, action) => {
//             console.log("action payload",action.payload)
//             const { field, value } = action.payload;
//             state[field] = value;
//         },
//         resetExam: () => initialState,
         
//     },
// });

// export const { setExamField, resetExam } = examSlice.actions;
// export default examSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    examName: "",
    description: "",
    examPermissionType: "Công khai",
    // classCode: "",
    // executorEmails: [],
    time: 60,
    effectiveDate: null,
    expirationDate: null,
    randomAmount: 5,
    limitation: null,
    scoreType: "Chấm điểm theo câu hỏi",
    "totalQuestion": 20           ,       // số lượng câu hỏi sẽ xuất hiện trong bài thi - bắt buộc

    questions: [
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
        },]
};

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
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
                type: 0,
                answers: [], // Danh sách câu trả lời rỗng
                explain: null,
                explainFilePath: null,
            });
        },

        // Xóa câu hỏi theo index
        removeQuestion: (state, action) => {
            const questionIndex = action.payload;
            state.questions = state.questions.filter((_, index) => index !== questionIndex);
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
                state.questions[questionIndex].answers = state.questions[questionIndex].answers.filter(
                    (_, index) => index !== answerIndex
                );
            }
        },
    },
});

export const { setExamField, resetExam, addQuestion, removeQuestion, addAnswer, removeAnswer } = examSlice.actions;
export default examSlice.reducer;
