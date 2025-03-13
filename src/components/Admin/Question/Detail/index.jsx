import { Modal, Button, Descriptions, List, Tag } from "antd";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const QuestionDetailModal = ({ visible, onClose, questionData }) => {
    return (
        <Modal
            title="📝 Thông Tin Chi Tiết Câu Hỏi"
            open={visible}
            onCancel={onClose}
            width={800} // 👉 Tăng độ rộng modal
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            centered
        >
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã Câu Hỏi" labelStyle={{ fontWeight: "bold" }}>
                    <FileTextOutlined /> {questionData?.code}
                </Descriptions.Item>

                <Descriptions.Item label="Câu Hỏi" labelStyle={{ fontWeight: "bold" }}>
                    <div style={{ whiteSpace: "pre-wrap" }}>{questionData?.question}</div>
                </Descriptions.Item>

                <Descriptions.Item label="Danh Sách Đáp Án" labelStyle={{ fontWeight: "bold" }}>
                    <List
                        bordered
                        dataSource={questionData?.answers}
                        renderItem={(answer) => (
                            <List.Item style={{ display: "flex", alignItems: "center" }}>
                                {answer.correct ? (
                                    <Tag icon={<CheckCircleOutlined />} color="green">
                                        {answer.answer} (Đúng)
                                    </Tag>
                                ) : (
                                    <Tag icon={<CloseCircleOutlined />} color="red">
                                        {answer.answer}
                                    </Tag>
                                )}
                            </List.Item>
                        )}
                    />
                </Descriptions.Item>

                <Descriptions.Item label="Giải Thích" labelStyle={{ fontWeight: "bold" }}>
                    <div style={{ whiteSpace: "pre-wrap" }}>{questionData?.explain || "Không có"}</div>
                </Descriptions.Item>

                <Descriptions.Item label="Thời Gian Tạo" labelStyle={{ fontWeight: "bold" }}>
                    <CalendarOutlined /> {dayjs(questionData?.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>

                <Descriptions.Item label="Tác Giả" labelStyle={{ fontWeight: "bold" }}>
                    <UserOutlined /> {questionData?.createdBy}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default QuestionDetailModal;