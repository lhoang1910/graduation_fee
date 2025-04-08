import React, {useEffect, useState} from "react";
import {Card, Progress, Space, Tooltip, Row, Col, Flex, Divider, Button, notification, Spin} from "antd";
import Question from "../../components/exam/Question";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {callResultDetail} from "../../services/api.js";

const ExamResultDetail = () => {
    const {id} = useParams();
    const [examResponse, setExamResponse] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const getResultById = async () => {
            try {
                const res = await callResultDetail(id);
                setExamResponse(res);
            } catch (error) {
                notification.error({message: error});
            } finally {
                setLoading(false);
            }
        }
        getResultById();
    }, [id])

    if (!examResponse) {
        return <p>Không có dữ liệu kết quả.</p>;
    }

    return (
        <Spin align="center" gap="middle" size="large" spinning={loading}>
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
                            <p><strong>Số báo danh: {examResponse.data.candidateNumber}</strong></p>
                            <p><strong>Họ và tên: {examResponse.data.fullName}</strong></p>
                            <p><strong>Thời gian bắt đầu:</strong> {new Intl.DateTimeFormat("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour12: false, // Đảm bảo dùng 24 giờ
                            }).format(new Date(examResponse.data.startAt))}</p>
                            <p><strong>Thời gian kết thúc:</strong> {new Intl.DateTimeFormat("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour12: false, // Đảm bảo dùng 24 giờ
                            }).format(new Date(examResponse.data.submitAt))}  </p>

                            <p><strong>Hoàn
                                thành:</strong> {`${((1 - examResponse.data.notAnswer / examResponse.data.questionResults.length) * 100).toFixed(2)}%`}
                            </p>

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
                        <CompletionStatus title={"Số câu bỏ trống"}
                                          desc={examResponse?.data?.notAnswer}></CompletionStatus>
                    </Space>
                    <Flex vertical gap={"small"}>
                        {examResponse && examResponse?.data.questionResults?.map((e, i) => (
                            <Question question={e} index={i} key={i} type={"result"}></Question>))}
                    </Flex>
                </Card>
            </Space>
        </Spin>
    );
};

export default ExamResultDetail;
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





