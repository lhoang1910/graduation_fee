import { Modal, Button, Descriptions, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
    FileTextOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    OrderedListOutlined,
    AppstoreAddOutlined,
    FieldTimeOutlined,
    CheckSquareOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const ExamDetailModal = ({ visible, onClose, examData }) => {
    const navigate = useNavigate();

    return (
        <Modal
            title="📘 Thông Tin Chi Tiết Đề Thi"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="goDetail"
                    type="primary"
                    onClick={() => navigate(`/exam/${examData?.id}`)}
                >
                    Tới đề thi
                </Button>,
            ]}
            centered
        >
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã Đề Thi" labelStyle={{ fontWeight: "bold" }}>
                    <FileTextOutlined /> {examData?.examCode}
                </Descriptions.Item>
                <Descriptions.Item label="Tên Đề Thi" labelStyle={{ fontWeight: "bold" }}>
                    <FileTextOutlined /> {examData?.examName}
                </Descriptions.Item>
                {examData?.classCode && (
                    <Descriptions.Item label="Mã Lớp Học" labelStyle={{ fontWeight: "bold" }}>
                        <FileTextOutlined /> {examData?.classCode}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Thời Gian Làm Bài" labelStyle={{ fontWeight: "bold" }}>
                    <ClockCircleOutlined /> {`${(examData?.time)} phút`}
                </Descriptions.Item>
                <Descriptions.Item label="Thời Gian Hiệu Lực" labelStyle={{ fontWeight: "bold" }}>
                    <CalendarOutlined /> {dayjs(examData?.effectiveDate).format("HH:mm DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Thời Gian Đóng" labelStyle={{ fontWeight: "bold" }}>
                    <CalendarOutlined /> {examData?.expirationDate? dayjs(examData?.expirationDate).format("HH:mm DD/MM/YYYY") : "Không giới hạn"}
                </Descriptions.Item>
                <Descriptions.Item label="Số Mã Đề" labelStyle={{ fontWeight: "bold" }}>
                    <OrderedListOutlined /> {examData?.randomAmount}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng Số Câu Hỏi" labelStyle={{ fontWeight: "bold" }}>
                    <AppstoreAddOutlined /> {examData?.totalQuestion}
                </Descriptions.Item>
                <Descriptions.Item label="Số Lượt Làm Bài Tối Đa" labelStyle={{ fontWeight: "bold" }}>
                    <FieldTimeOutlined /> {examData?.limitation ? examData?.limitation : "Không giới hạn"}
                </Descriptions.Item>
                <Descriptions.Item label="Loại Chấm Điểm" labelStyle={{ fontWeight: "bold" }}>
                    <CheckSquareOutlined /> {examData?.scoreType}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ExamDetailModal;
