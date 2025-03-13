import {Modal, Descriptions, Button, Tag} from "antd";
import {
    IdcardOutlined,
    BookOutlined,
    TeamOutlined,
    UserOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";


const ClassDetailModal = ({visible, onClose, classData}) => {
    const navigate = useNavigate();
    return (
        <Modal
            title="📚 Thông Tin Chi Tiết Lớp Học"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>,
                <Button key="goDetail" type="primary" onClick={() => navigate(`/class/${classData?.id}`)}>
                    Tới lớp học
                </Button>
            ]}
            centered
        >
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã Lớp Học" labelStyle={{fontWeight: "bold"}}>
                    <IdcardOutlined/> {classData?.classCode || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Tên Lớp Học" labelStyle={{fontWeight: "bold"}}>
                    <BookOutlined/> {classData?.className || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Số Thành Viên Tối Đa" labelStyle={{fontWeight: "bold"}}>
                    <TeamOutlined/> {classData?.limitSlot || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Số Đề Thi" labelStyle={{fontWeight: "bold"}}>
                    <FileTextOutlined/> {classData?.examineAmount || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Số Thành Viên" labelStyle={{fontWeight: "bold"}}>
                    <UserOutlined/> {classData?.participationAmount || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Quản Lý" labelStyle={{fontWeight: "bold"}}>
                    <UserOutlined/> {classData?.createdByName || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái" labelStyle={{fontWeight: "bold"}}>
                    {classData?.limitSlot > classData?.participationAmount ? (
                        <Tag icon={<CheckCircleOutlined/>} color="green">
                            Còn chỗ
                        </Tag>
                    ) : (
                        <Tag color="red">Đã đầy</Tag>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ClassDetailModal;
