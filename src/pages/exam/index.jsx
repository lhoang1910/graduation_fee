import { Col, notification, Row, Spin } from "antd";
import QuestionMenu from "../../components/exam/QuestionMenu";
import { examData } from "../../utils/dumydata";
import Question from "../../components/exam/Question";
import { Flex } from "antd";
import ExamInformation from "../../components/exam/ExamInformation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExam, setExam } from "../../redux/exam/examSlice";
import { CircularProgress } from "@mui/material";
import { callDetailExam, callStartExam } from "../../services/api";
import { useParams } from "react-router-dom";

function ExamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [detailExam, setDetailExam] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callDetailExam(id);
        setDetailExam(response.data);
      } catch (error) {
        // setError(error.message);
        console.log(error);
      } finally {
      }
    };

    fetchData();
  }, [id]);
  const examRef = useRef(null);
  const dispatch = useDispatch();
  const exam = useSelector((state) => state.exam?.exam?.data);

  console.log("detail exam ", detailExam);
  useEffect(() => {
    // Hàm gọi API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await callStartExam(id); // URL API của bạn
        if (!response.success) {
          notification.error({ message: response.message });
        } else {
          if (exam?.id === response.data.id) {
            console.log("same", exam);
          } else {
            console.log(" not same");

            dispatch(setExam(response));
          }
        }
        // const result = await response.json();
        // setData(result); // Cập nhật dữ liệu từ API
      } catch (error) {
        // setError(error); // Cập nhật lỗi nếu có
        notification.error({ message: error.message });
      } finally {
        setIsLoading(false); // Khi gọi API xong, thay đổi trạng thái loading
      }
    };

    fetchData(); // Gọi API ngay khi component render
  }, []);
  return (
    <div style={styles.container}>
      {/* {!exam && <Loading></Loading>} */}
      <Spin spinning={isLoading}>
        {exam && (
          <Row gutter={16}>
            <Col
              style={{ ...styles.mainCol, ...styles.stickyPosition }}
              span={6}
            >
              <ExamInformation
                detailExam={detailExam}
                setIsLoading={setIsLoading}
              ></ExamInformation>
            </Col>
            <Col style={styles.mainCol} span={12}>
              <Flex ref={examRef} vertical gap={"small"}>
                {exam?.questionResults?.map((e, i) => (
                  <Question question={e} index={i} key={i}></Question>
                ))}
              </Flex>
            </Col>
            <Col
              style={{ ...styles.mainCol, ...styles.stickyPosition }}
              span={6}
            >
              <QuestionMenu examRef={examRef}></QuestionMenu>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
}

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

export default ExamPage;
