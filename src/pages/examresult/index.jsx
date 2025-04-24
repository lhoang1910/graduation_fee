import React, {useEffect} from "react";
import {Card, Progress, Badge, Table, Tag, Space, Tooltip, Row, Col, Flex, Divider, Button} from "antd";
import Question from "../../components/exam/Question";
import {useLocation, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";

const ExamResults = () => {
    const location = useLocation();
    const examResponse = location.state?.result; // Lấy dữ liệu từ state
    const navigate = useNavigate();

    if (!examResponse) {
        return <p>Không có dữ liệu kết quả.</p>; // Xử lý khi không có dữ liệu
    }

    useEffect(() => {
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
        <Space direction="vertical" style={{width: "100%"}}>
            <Card title="Kết quả thi" bordered={false} extra={
                <Button
                    type="primary" danger icon={<ArrowLeftOutlined/>}
                    onClick={() => navigate(`/exam/${examResponse.data.examId}`)}
                >
                    Trở về
                </Button>
            }>
                <Flex justify="space-between">

                    <Space direction="vertical" size="middle" style={{display: "flex"}}>
                        {/* <p><strong>Họ và tên:</strong> {examData.name}</p>
          <p><strong>Email:</strong> {examData.email}</p> */}
                        <p><strong>Số báo danh: {examResponse.data.candidateNumber}</strong></p>
                        <p><strong>Họ và tên: {examResponse.data.fullName}</strong></p>
                        <p><strong>Mã đề: {examResponse.data.paperCode}</strong></p>
                        <p><strong>Thời gian bắt đầu:</strong> {new Intl.DateTimeFormat("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: false, // Đảm bảo dùng 24 giờ
                        }).format(new Date(examResponse.data.startAt))}</p>
                        <p><strong>Thời gian nộp bài:</strong> {new Intl.DateTimeFormat("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour12: false, // Đảm bảo dùng 24 giờ
                        }).format(new Date(examResponse.data.submitAt))}  </p>
                        {/* //   <Divider></Divider> */}

                        <p><strong>Hoàn
                            thành:</strong> {`${((1 - examResponse.data.notAnswer / examResponse.data.questionResults.length) * 100).toFixed(2)}%`}
                        </p>


                        {/* <p><strong>Số câu đúng:</strong> {examData.correct}</p>
          <p><strong>Số câu sai:</strong> {examData.incorrect}</p>
          <p><strong>Số câu bỏ trống:</strong> {examData.unanswered}</p> */}
                        <Divider></Divider>


                    </Space>
                    <Flex style={{width: "50%"}} gap={10} flex={1} vertical align="center">
                        <span><strong>Điểm số</strong></span> <Progress type="circle"
                                                                        percent={examResponse.data.score * 10}
                                                                        format={(percent) => `${examResponse.data.score}`}/>
                    </Flex>
                </Flex>
                <Tooltip>
                    <Progress
                        percent={((1 - examResponse.data.notAnswer / examResponse.data.questionResults.length) * 100)}
                        status="exception"
                        success={{percent: ((1 - (examResponse.data.wrongQuestion) / examResponse.data.questionResults.length) * 100)}}/>
                </Tooltip>
                <Space style={containerStyle}>
                    <CompletionStatus title={"Số câu đúng"}
                                      desc={examResponse?.data?.correctQuestion}></CompletionStatus>
                    <CompletionStatus title={"Số câu sai"}
                                      desc={-examResponse?.data?.notAnswer + examResponse?.data?.wrongQuestion}></CompletionStatus>
                    <CompletionStatus title={"Số câu bỏ trống"} desc={examResponse?.data?.notAnswer}></CompletionStatus>
                </Space>
                {/* <Table columns={columns} dataSource={examData.results} rowKey="id" pagination={false} /> */}
                <Flex vertical gap={"small"}>
                    {examResponse?.data.questionResults?.map((e, i) => (
                        <Question question={e} index={i} key={i} type={"result"}></Question>))}
                </Flex>
            </Card>
        </Space>
    );
};

export default ExamResults;
const boxStyle = {
    color: "white",
    // textAlign: "center",
    flex: 1,
};
const containerStyle = {
    display: "flex",
    justifyContent: "space-between",

};
const CompletionStatus = ({title, desc}) => {
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
            <Col><p><strong>{title} </strong></p></Col>
            <Col><p><strong>{desc} </strong></p></Col>
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





