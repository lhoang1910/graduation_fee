import { Badge, Flex, Tag } from "antd";
import RadioButtonUncheckedSharpIcon from "@mui/icons-material/RadioButtonUncheckedSharp";
import RadioButtonCheckedSharpIcon from "@mui/icons-material/RadioButtonCheckedSharp";
import style from "../index.module.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { chosenAnswer } from "../../../redux/exam/examSlice";
import { useEffect } from "react";
const MyLevel = ({ level }) => {
  let color;

  if (level === "Dễ") color = "success";
  else if (level === "Vừa") color = "warning";
  else if (level === "Khó") color = "error";

  return <Tag color={color}>{level} </Tag>;
};
function Question({ question, index, type = "" }) {
  const dispatch = useDispatch();
  const handleChange = (event, i) => {
    dispatch(
      chosenAnswer({
        indexQuestion: index,
        answer: i,
        value: event.target.checked,
      })
    );
  };

  return (
    <div style={styles.question}>
      <Flex justify="space-between">
        <Flex style={{ width: "100%" }} justify="space-between">
          <span className={style.title}>{`Câu ${index + 1}`}</span>
          <MyLevel level={question.questionLevel} />
        </Flex>
        {type === "result" && (
          <span className={style.title} style={styles.modeTitle}>
            Chọn một hoặc nhiều đáp án
          </span>
        )}
      </Flex>
      <div>
        <span style={styles.questionTitle} className={style.title}>
          {question.question}
        </span>

        <ul style={{ listStyleType: "none", padding: "0" }}>
          <FormControl
            sx={{ m: 1 }}
            component="fieldset"
            variant="standard"
            style={{ width: "100%" }}
          >
            <FormGroup style={{ width: "100%" }}>
              {type !== "result" &&
                question.answers.map((e, i) => (
                  <FormControlLabel
                    onChange={(event) => {
                      handleChange(event, i);
                    }}
                    key={e.id}
                    control={
                      <Checkbox checked={e.chosen} name={i.toString()} />
                    }
                    label={e.answer}
                  />
                ))}
              {type === "result" &&
                question.answers.map((e, i) => (
                  <FormControlLabel
                    sx={{
                      width: "100%",
                      "& .MuiFormControlLabel-label": {
                        width: "100%", // Đảm bảo label trải dài
                        whiteSpace: "normal", // Cho phép xuống dòng nếu cần
                        wordBreak: "break-word", // Ngắt từ khi quá dài
                        fontSize: "16px", // Điều chỉnh kích thước chữ
                        color: "#333", // Thay đổi màu chữ nếu cần
                      },
                    }}
                    onChange={(event) => {
                      console.log(e);
                    }}
                    style={{ width: "100%" }}
                    key={e.id}
                    control={
                      <Checkbox
                        checked={e.chosen}
                        disabled={true}
                        name={i.toString()}
                      />
                    }
                    label={
                      <div
                        style={{
                          backgroundColor: `${e.chosen && "#f5222d"}`,
                          backgroundColor: `${
                            e.correct ? "#52c41a" : e.chosen && "#f5222d"
                          }`,
                          padding: "5px",
                        }}
                      >
                        {e.answer}
                      </div>
                    }
                  />
                ))}
            </FormGroup>
          </FormControl>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  question: {
    border: "1px solid #eee",
    borderRadius: "5px",
    backgroundColor: "white",
    padding: "16px 16px 24px 16px",
  },
  modeTitle: {
    fontWeigh: "300",
    fontSize: "14px",
    color: "#00000099",
  },
  answerContent: {
    fontWeight: "300",
    lineHeight: "1.25rem",
  },
  questionTitle: {
    fontSize: "14px",
    lineHeight: "1.25rem",
  },
  answer: {
    padding: "8px 16px ",
  },
};
export default Question;
// const answer ={answer
//   :
//   "he"
//   attachmentPath
//   :
//   null
//   chosen
//   :
//   false
//   correct
//   :
//   false}

// Màu xanh lá (Đáp án đúng ✅): Thường là #52c41a hoặc #28a745 trong thiết kế giao diện.
// Màu đỏ (Đáp án sai ❌): Thường là #f5222d hoặc #dc3545.
