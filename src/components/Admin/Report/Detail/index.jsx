import { Modal, Button, Input, Checkbox, message, Descriptions, Tag, Space, Spin } from "antd";
import { GiAutoRepair } from "react-icons/gi";
import React, { useState } from "react";
import { callExecuteReports } from "../../../../services/api.js";
import dayjs from "dayjs";

const ReportDetailModal = ({ visible, onClose, reportData }) => {
    const [replyContent, setReplyContent] = useState("");
    const [sendEmail, setSendEmail] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleExecuteReport = async () => {
        if (!replyContent.trim()) {
            message.warning("Vui lòng nhập nội dung phản hồi!");
            return;
        }

        try {
            setLoading(true);
            await callExecuteReports(reportData?.id, { replyContent, sendEmail });
            message.success("Báo cáo đã được xử lý thành công!");
            onClose();
        } catch (error) {
            message.error("Có lỗi xảy ra khi xử lý báo cáo!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thông Tin Báo Cáo"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" type="default" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            centered
        >
            <Descriptions bordered size="middle" column={1}>
                <Descriptions.Item label="Tiêu đề">{reportData?.title}</Descriptions.Item>
                <Descriptions.Item label="Nội dung">{reportData?.content}</Descriptions.Item>
                <Descriptions.Item label="Người báo cáo">{reportData?.reportedByName}</Descriptions.Item>
                <Descriptions.Item label="Thời gian báo cáo">{dayjs(reportData?.reportedAt).format("HH:mm DD/MM/YYYY")}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={reportData?.executor ? "green" : "red"}>
                        {reportData?.executor ? "Đã xử lý" : "Chưa xử lý"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            {!reportData?.executor && (
                <div style={{ marginTop: "20px" }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Button
                            type="primary"
                            icon={<GiAutoRepair size={18} />}
                            onClick={() => setIsProcessing(true)}
                            style={{ background: "#faad14", borderColor: "#faad14" }}
                        >
                            Đánh dấu đã xử lý
                        </Button>

                        {isProcessing && (
                            <Spin spinning={loading}>
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Nhập nội dung phản hồi..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <Checkbox
                                    checked={sendEmail}
                                    onChange={(e) => setSendEmail(e.target.checked)}
                                    style={{ marginTop: "10px" }}
                                >
                                    Gửi email thông báo cho {reportData?.reportedByName}
                                </Checkbox>
                                <Button
                                    type="primary"
                                    onClick={handleExecuteReport}
                                    loading={loading}
                                    style={{ marginTop: "10px" }}
                                >
                                    Gửi phản hồi
                                </Button>
                            </Spin>
                        )}
                    </Space>
                </div>
            )}
        </Modal>
    );
};

export default ReportDetailModal;