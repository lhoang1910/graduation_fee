import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    DatePicker,
    Switch,
    InputNumber,
    Select,
    Tag,
    Button,
    Space,
    Tooltip,
    message, Divider, Row, Col,
} from "antd";
import moment from "moment";
import {callCheckUserExistByEmail} from "../../../services/api.js";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ExamSettingModal = ({exam, visible, onCancel, onSave}) => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleChange = (field, value) => {
        form.setFieldsValue({ [field]: value });
    };

    const handleCheckEmail = async () => {
        if (!email.trim()) {
            message.warning("Vui lòng nhập email.");
            return;
        }
        setLoading(true);
        try {
            const res = await callCheckUserExistByEmail(email.trim());
            if (!res?.data) {
                message.error("Người dùng không tồn tại.");
            } else {
                setSelectedUser(res.data);
                setConfirmVisible(true);
            }
        } catch (error) {
            message.error("Lỗi khi kiểm tra email.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAddUser = () => {
        const current = form.getFieldValue("executorEmail") || [];
        if (selectedUser) {
            form.setFieldsValue({
                executorEmail: [...current, selectedUser.email],
            });
            setEmail("");
        }
        setConfirmVisible(false);
        setSelectedUser(null);
    };

    const handleRemoveEmail = (removedEmail) => {
        const current = form.getFieldValue("executorEmail") || [];
        form.setFieldsValue({
            executorEmail: current.filter((e) => e !== removedEmail),
        });
    };

    const handleFinish = (values) => {
        onSave(values);
    };

    return (
        <>
            <Modal
                title={`Cài đặt đề thi: ${exam.examCode} - ${exam.examName}`}
                open={visible}
                onCancel={onCancel}
                onOk={() => form.submit()}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                width={800}
            >
                <p style={{ marginBottom: 16, fontStyle: "italic", color: "#666" }}>
                    Lần cập nhật gần nhất: {moment(exam.updatedDate).format("DD/MM/YYYY HH:mm:ss")}
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        ...exam,
                        effectiveDate: exam.effectiveDate ? moment(exam.effectiveDate) : null,
                        expirationDate: exam.expirationDate ? moment(exam.expirationDate) : null,
                    }}
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label="Tên đề thi"
                        name="examName"
                        rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}
                        style={{ marginBottom: 12 }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description" style={{ marginBottom: 12 }}>
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian làm bài (phút)"
                                name="time"
                                rules={[{ required: true }]}
                                style={{ marginBottom: 12 }}
                            >
                                <TimeInput />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Số lượng mã đề"
                                name="randomAmount"
                                style={{ marginBottom: 12 }}
                            >
                                <InputNumber min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="Số lượt làm bài tối đa"
                                name="limitation"
                                style={{ marginBottom: 12 }}
                            >
                                <InputNumber min={0} placeholder="Không giới hạn nếu để trống" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Hiển thị đáp án"
                                name="displayAnswer"
                                valuePropName="checked"
                                style={{ marginBottom: 12 }}
                            >
                                <Switch checkedChildren="Có" unCheckedChildren="Không" />
                            </Form.Item>
                        </Col>
                    </Row>

                        {/*<Form.Item label="Cách tính điểm" name="scoreType" style={{ marginBottom: 12 }}>*/}
                        {/*    <Input />*/}
                        {/*</Form.Item>*/}

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item label="Từ ngày" name="effectiveDate" style={{ marginBottom: 12 }}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Đến ngày" name="expirationDate" style={{ marginBottom: 12 }}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Quyền truy cập"
                        name="examPermissionType"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 12 }}
                    >
                        <Select onChange={(value) => handleChange("examPermissionType", value)}>
                            <Option value="Công khai">Công khai</Option>
                            <Option value="Chỉ mình tôi">Chỉ mình tôi</Option>
                            <Option value="Người được cấp quyền">Người được cấp quyền</Option>
                            <Option value="Thành viên lớp học" disabled>Thành viên lớp học</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item shouldUpdate={(prev, curr) => prev.examPermissionType !== curr.examPermissionType}>
                        {({ getFieldValue }) =>
                            getFieldValue("examPermissionType") === "Người được cấp quyền" && (
                                <>
                                    <Form.Item label="Nhập email được cấp quyền" style={{ marginBottom: 8 }}>
                                        <Input.Group compact>
                                            <Input
                                                style={{ width: "calc(100% - 100px)" }}
                                                placeholder="Nhập email và nhấn Enter"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onPressEnter={handleCheckEmail}
                                            />
                                            <Button type="primary" onClick={handleCheckEmail} loading={loading}>
                                                Kiểm tra
                                            </Button>
                                        </Input.Group>
                                    </Form.Item>

                                    <Form.Item name="executorEmail" style={{ marginBottom: 0 }}>
                                        <div style={{ minHeight: 32 }}>
                                            {(form.getFieldValue("executorEmail") || []).map((email) => (
                                                <Tag key={email} closable onClose={() => handleRemoveEmail(email)} style={{ marginBottom: 6 }}>
                                                    {email}
                                                </Tag>
                                            ))}
                                        </div>
                                    </Form.Item>
                                </>
                            )
                        }
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xác nhận thêm user */}
            <Modal
                open={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                onOk={handleConfirmAddUser}
                okText="Xác nhận"
                cancelText="Hủy"
                title={`Bạn có muốn thêm người dùng ${selectedUser?.code} - ${selectedUser?.fullName} vào đề thi?`}
            >
                <Form layout="vertical">
                    <Form.Item label="Mã người dùng">
                        <Input value={selectedUser?.code} disabled />
                    </Form.Item>
                    <Form.Item label="Họ và tên">
                        <Input value={selectedUser?.fullName} disabled />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={selectedUser?.email} disabled />
                    </Form.Item>
                    <Form.Item label="Giới tính">
                        <Input value={selectedUser?.gender} disabled />
                    </Form.Item>
                    <Form.Item label="Ngày sinh">
                        <Input value={selectedUser?.birthDay} disabled />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

const TimeInput = ({ value = 0, onChange }) => {
    const h = Math.floor(value / 60);
    const m = Math.round(value % 60);
    return (
        <Input.Group compact>
            <InputNumber
                min={0}
                value={h}
                onChange={(val) => onChange?.((val || 0) * 60 + m)}
                style={{ width: "50%" }}
                addonAfter="giờ"
            />
            <InputNumber
                min={0}
                max={59}
                value={m}
                onChange={(val) => onChange?.(h * 60 + (val || 0))}
                style={{ width: "50%" }}
                addonAfter="phút"
            />
        </Input.Group>
    );
};


export default ExamSettingModal;
