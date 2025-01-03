import { Col, Row } from "antd";
import QuestionMenu from "../../components/exam/QuestionMenu";
import { examData } from "../../utils/dumydata";
import Question from "../../components/exam/Question";
import {Flex} from "antd";
import ExamInformation from "../../components/exam/ExamInformation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExam } from "../../redux/exam/examSlice";
import { CircularProgress } from "@mui/material";
function ExamPage() {
  const examRef = useRef(null);
  const dispatch = useDispatch();
  const exam = useSelector(state=>state.exam.exam);
  console.log("examm nè",exam);
  useEffect(()=>{

    dispatch(fetchExam());
  },[])

  return (

    <div style={styles.container}>
                  {/* {!exam && <Loading></Loading>} */}
      {exam &&       <Row  gutter={16}>
        <Col style={{...styles.mainCol,...styles.stickyPosition}} span={6}>
          <ExamInformation></ExamInformation>
        </Col>
        <Col style={styles.mainCol} span={12}>
          <Flex ref={examRef} vertical gap={"small"}>
          {exam?.questionResults.map((e,i)=>(<Question question={e} index={i} key={i}></Question>))}
          </Flex>

        </Col>
        <Col style={ { ...styles.mainCol, ...styles.stickyPosition }} span={6}>
          <QuestionMenu examRef = {examRef}></QuestionMenu>
        </Col>
      </Row>}

    </div>
  );
}
const styles = {
  container: {
    padding: "20px",
    backgroundColor:"#1618230f",
  },
  mainCol: {
    // border: "1px solid",
  },
  stickyPosition: {
    position: "sticky",
    top: 0,
  },
  grid:{
  }

};

export default ExamPage;
