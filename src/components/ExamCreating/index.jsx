import { Button, Col, Flex, Row } from "antd";
import QuestionMenu from "../exam/QuestionMenu";
import { fetchExam } from "../../redux/exam/examSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import ExamCreatingMenu from "./ExamCreatingMenu";
import Answer from "./Answer";
import ExamEditor from "./ExamEditor";
import ExamInformation from "./ExamInformation";

function ExamCreating() {
  const dispatch = useDispatch();
  const [exam, setExam] = useState([]);
  useEffect(() => {
    dispatch(fetchExam());
  }, []);
  return (
    <div style={styles.container}>
      <Row gutter={16}>
        <Col style={{ ...styles.mainCol, ...styles.stickyPosition }} span={8}>
          <Flex vertical gap={16} style={{ position: "static" }}>
            {" "}
            <ExamInformation></ExamInformation>
            <ExamCreatingMenu></ExamCreatingMenu>
          </Flex>
        </Col>
        <Col style={styles.mainCol} span={16}>
          <ExamEditor></ExamEditor>
        </Col>
      </Row>
    </div>
  );
}

export default ExamCreating;

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#1618230f",
  },
  mainCol: {
    // border: "1px solid",
  },
  stickyPosition: {
    position: "sticky",
    top: 0,
  },
  grid: {},
};
