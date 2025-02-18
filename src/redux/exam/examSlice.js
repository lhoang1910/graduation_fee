import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { examFetchData } from "../../utils/dumydata";
import { callStartExam } from "../../services/api";

const initialState = {};

export const fetchExam = createAsyncThunk(
  "exam/fetchExam",
  async (id, thunkApi) => {
return await callStartExam(id)
  }
);      
export const examSlice = createSlice({
  name: "exam",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    chosenAnswer: (state, action) => {
      const { answer, indexQuestion, value } = action.payload;
      console.log(state.exam);
      state.exam.data.questionResults[indexQuestion].answers[answer].chosen = value;
      console.log("done");
    },
    setExam: (state, action) => {
      state.exam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExam.fulfilled, (state, action) => {
      state.exam = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { increment,setExam ,decrement, incrementByAmount, chosenAnswer } =
  examSlice.actions;

export default examSlice.reducer;




