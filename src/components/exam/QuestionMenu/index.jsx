import { Col, Row } from "antd";
import Question from "../Question";
import { FontDownloadOutlined } from "@mui/icons-material";
import style from "../index.module.css";
import hoverStyle from "./index.module.css";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
function QuestionMenu({ examRef }) {
  const exam = useSelector((state) => state.exam.exam?.questionResults);
  const onClickTileHandle = (index) => {
    // console.log(examRef?.current.children[index]);
    examRef?.current.children[index].scrollIntoView({
      behavior: "smooth",
      // block: 'nearest',
      inline: "center",
    });
  };
  console.log(exam);
  return (
    <div style={styles.container}>
      <h3 style={styles.title} className={style.title}>
        Mục lục câu hỏi
      </h3>
      
      <div style={{ textAlign: "center" }}>
        <div style={{ padding: "16px" }}>
          <Row gutter={[8,8]}>
            {/* {arr.map((val,i)=>(      <Col className={hoverStyle.hover} onClick={()=>{onClickTileHandle(i)}} style={styles.questionTile} key={i} span={4}><span>{`${val}`}</span></Col>
))} */}
            {
              exam?.map((val, i) => {
                  const isChosen =      isChosenQuestion(val?.answers);           
                return (

                <Col
                  onClick={() => {
                    onClickTileHandle(i);
                  }}
                  style={styles.questionTile}
                  key={i}
                  span={4}
                >
                  <Button
                    style={{ padding: "12px", minWidth: "40px" }}
                    size="small"
                    variant={
                      isChosen
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      isChosen
                        ? "warning"
                        : "outlined"
                    }
                  >{`${i+1}`}</Button>
                </Col>
              )})}
          </Row>
        </div>
      </div>
    </div>
  );
}
const isChosenQuestion = (answers) => {
  for (let a of answers) {
    if (a.chosen) {
      return true;
    }
  }
  return false;
};
const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: "5px",
    position: "sticky",
    top: "0px",
  },
  title: {
    margin: 0,
    paddingTop: "16px",
    paddingRight: "16px",
    paddingLeft: "16px",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center"
    textAlign: "center",
  },
  // ,
  // questionTile:{
  //   border:"solid 1px rgb(211, 215, 234)",
  //   borderRadius:"5px",
  //   padding:"12px",
  //   color:"#3e65fe"
  // ,fontWeight:600,lineHeight:"1.5 rem",fontSize:"12px",

  // }
  questionTile: {
    // border:"solid 1px rgb(211, 215, 234)",
    // borderRadius:"5px",
    color: "#3e65fe",
    fontWeight: 600,
    lineHeight: "1.5 rem",
    fontSize: "12px",
  },
};
export default QuestionMenu;
