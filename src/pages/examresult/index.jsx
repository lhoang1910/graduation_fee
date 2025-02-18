import React, { useEffect } from "react";
import { Card, Progress, Badge, Table, Tag, Space,Tooltip, Row, Col, Flex, Divider, Button } from "antd";
import Question from "../../components/exam/Question";
import { useLocation } from "react-router-dom";


const examResponse = {
  "status": "OK",
  "message": "Nộp bài thành công",
  "data": {
      "historyId": "089467ab-753e-412c-9f1e-3347684b3a55",
      "sequenceExecute": 4,
      "timeTracking": 0.13948333333333332,
      "score": 6.0,
      "startAt": 1739879051841,
      "submitAt": 1739879060210,
      "correctAnswer": 3,
      "correctQuestion": 3,
      "wrongAnswer": 2,
      "wrongQuestion": 2,
      "notAnswer": 0,
      "rank": null,
      "questionResults": [
          {
              "id": "b0d380fc-c4d6-4649-872d-af51fe9f23ed",
              "code": "Q2505631",
              "question": "ha",
              "answers": [
                  {
                      "id": "2a54a497-72dc-4b22-91d3-0a494187b4f1",
                      "questionCode": "Q2505631",
                      "answer": "ds",
                      "attachmentPath": null,
                      "chosen": true,
                      "correct": false
                  },
                  {
                      "id": "70e80a7f-81c8-4813-95da-81918e1867a0",
                      "questionCode": "Q2505631",
                      "answer": "sdsd",
                      "attachmentPath": null,
                      "chosen": false,
                      "correct": true
                  }
              ],
              "explain": null
          },
          {
              "id": "be56ceac-73a5-4e33-8ca5-7dee7689143a",
              "code": "Q2505611",
              "question": "ha",
              "answers": [
                  {
                      "id": "26440832-97ea-4b48-8b92-877a5132a23b",
                      "questionCode": "Q2505611",
                      "answer": "he",
                      "attachmentPath": null,
                      "chosen": false,
                      "correct": false
                  },
                  {
                      "id": "68aa7c40-d571-4d32-8dc2-ebc0848c82a7",
                      "questionCode": "Q2505611",
                      "answer": "hi",
                      "attachmentPath": null,
                      "chosen": true,
                      "correct": true
                  }
              ],
              "explain": null
          },
          {
              "id": "2ca64bf5-5608-4d5b-bbda-23c2b6f0b44b",
              "code": "Q2505641",
              "question": "ja",
              "answers": [
                  {
                      "id": "250381e8-df99-4cfc-89b8-a9f68c61892a",
                      "questionCode": "Q2505641",
                      "answer": "d",
                      "attachmentPath": null,
                      "chosen": false,
                      "correct": false
                  },
                  {
                      "id": "ea757076-dc63-4c02-b3d3-cd81388494bf",
                      "questionCode": "Q2505641",
                      "answer": "h",
                      "attachmentPath": null,
                      "chosen": true,
                      "correct": true
                  }
              ],
              "explain": null
          },
          {
              "id": "a09c9c8d-b25d-417f-94fe-ef6ee7292f9c",
              "code": "Q2505621",
              "question": "hehe",
              "answers": [
                  {
                      "id": "4353dd38-60fc-48cd-b7a3-92a35a0649fa",
                      "questionCode": "Q2505621",
                      "answer": "ds",
                      "attachmentPath": null,
                      "chosen": false,
                      "correct": true
                  },
                  {
                      "id": "43e846cf-91c5-47b3-806b-eff0c513a7f1",
                      "questionCode": "Q2505621",
                      "answer": "sd",
                      "attachmentPath": null,
                      "chosen": true,
                      "correct": false
                  }
              ],
              "explain": null
          },
          {
              "id": "dd9b299c-349d-41d6-8da4-d9f1b24f5725",
              "code": "Q2505601",
              "question": "gu",
              "answers": [
                  {
                      "id": "eb2c550f-9c71-4c1e-a588-0c48b30fb55b",
                      "questionCode": "Q2505601",
                      "answer": "hi",
                      "attachmentPath": null,
                      "chosen": true,
                      "correct": true
                  },
                  {
                      "id": "d7990eea-5ba6-4835-9ed0-d04467e5d5e4",
                      "questionCode": "Q2505601",
                      "answer": "ha",
                      "attachmentPath": null,
                      "chosen": false,
                      "correct": false
                  }
              ],
              "explain": null
          }
      ],
      "submitted": true
  },
  "success": true
}
const ExamResults = () => {
    const location = useLocation();
  const examResponse = location.state?.result; // Lấy dữ liệu từ state

  if (!examResponse) {
    return <p>Không có dữ liệu kết quả.</p>; // Xử lý khi không có dữ liệu
  }

  useEffect (() => {
    // Đẩy trạng thái mới vào history để chặn nút Back
    window.history.pushState(null, null, location.pathname);

    const handlePopState = () => {
      window.history.pushState(null, null, location.pathname);
    };

    // Lắng nghe sự kiện quay lại
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);
  
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card title="Kết quả thi" bordered={false}>
        <Flex justify="space-between">

        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          {/* <p><strong>Họ và tên:</strong> {examData.name}</p>
          <p><strong>Email:</strong> {examData.email}</p> */}
          <p><strong>Thời gian bắt đầu:</strong> { new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false, // Đảm bảo dùng 24 giờ
  }).format(new Date(examResponse.data.startAt))}</p>
          <p><strong>Thời gian kết thúc:</strong> { new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false, // Đảm bảo dùng 24 giờ
  }).format(new Date(examResponse.data.submitAt))}  </p>       
          {/* //   <Divider></Divider> */}

          <p><strong>Hoàn thành:</strong> {`${((1 - examResponse.data.notAnswer / examResponse.data.questionResults.length) * 100).toFixed(2)}%`}</p>


          {/* <p><strong>Số câu đúng:</strong> {examData.correct}</p>
          <p><strong>Số câu sai:</strong> {examData.incorrect}</p>
          <p><strong>Số câu bỏ trống:</strong> {examData.unanswered}</p> */}
            <Divider></Divider>


        </Space>
        <Flex style={{width:"50%"}} gap={10} flex={1} vertical align="center"> <span><strong>Điểm số</strong></span>  <Progress type="circle" percent={examResponse.data.score*10} format={(percent) => `${examResponse.data.score}`} />
        </Flex>
            </Flex>
            <Tooltip >
      <Progress percent={((1 - examResponse.data.notAnswer / examResponse.data.questionResults.length) * 100)} status="exception" success={{ percent: ((1 - (examResponse.data.wrongQuestion )/ examResponse.data.questionResults.length) * 100) }} />
    </Tooltip>        
          <Space style={containerStyle} >
          <CompletionStatus title={"Số câu đúng"} desc={examResponse?.data?.correctQuestion}></CompletionStatus>
          <CompletionStatus title={"Số câu sai"} desc={-examResponse?.data?.notAnswer+   examResponse?.data?.wrongQuestion}></CompletionStatus>
          <CompletionStatus title={"Số câu bỏ trống"} desc={examResponse?.data?.notAnswer}></CompletionStatus>
          </Space>
        {/* <Table columns={columns} dataSource={examData.results} rowKey="id" pagination={false} /> */}
        <Flex  vertical gap={"small"}>
          {examResponse?.data.questionResults?.map((e,i)=>(<Question question={e} index={i} key={i} type={"result"}></Question>))}
          </Flex>
      </Card>
    </Space>
  );
};

export default ExamResults; const boxStyle = {
  color: "white",
  // textAlign: "center",
  flex: 1,
};const containerStyle = {
  display: "flex",
  justifyContent: "space-between",

};
const CompletionStatus = ({title,desc}) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };
  
  return (
    // <Row style={containerStyle} align="middle">
    //   <Col style={textStyle}>{title}</Col>
    //   <Col style={percentageStyle}>{desc}</Col>
    // </Row>
        <Row style={containerStyle} align="middle">
      <Col ><p><strong>{title} </strong> </p></Col>
      <Col ><p><strong>{desc} </strong> </p></Col>
    </Row>
    
  );
};


const textStyle = {
  fontSize: "16px",
  fontWeight: "bold",
};

const percentageStyle = {
  fontSize: "16px",
  fontWeight: "bold",
};





