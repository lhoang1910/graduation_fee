import {Modal, Button, Descriptions, Input, InputNumber, Select, Form, notification} from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {callAdminCreateLimitation, callAdminUpdateLimitation} from "../../../../services/api.js";

const { Option } = Select;

const ServicePackageDetailModal = ({ visible, onClose, limitation, action }) => {
    const isCreateMode = action === "Tạo Mới";
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(() => {
        if (isCreateMode) {
            return {
                code: "",
                name: "",
                createClass: 0,
                createExamNormally: 0,
                createExamByAI: 0,
                memberPerClass: 0,
                price: 0,
                salePercentage: 0,
                type: "",
            };
        }
        return {
            code: limitation?.code || "",
            name: limitation?.name || "",
            createClass: limitation?.createClass || 0,
            createExamNormally: limitation?.createExamNormally || 0,
            createExamByAI: limitation?.createExamByAI || 0,
            memberPerClass: limitation?.memberPerClass || 0,
            price: limitation?.price || 0,
            salePercentage: limitation?.salePercentage || 0,
            type: limitation?.type || "",
            createdAt: limitation?.createdAt || null,
            boughtAmount: limitation?.boughtAmount || 0,
        };
    });

    useEffect(() => {
        if (!isCreateMode && limitation) {
            setFormData({
                code: limitation.code || "",
                name: limitation.name || "",
                createClass: limitation.createClass || 0,
                createExamNormally: limitation.createExamNormally || 0,
                createExamByAI: limitation.createExamByAI || 0,
                memberPerClass: limitation.memberPerClass || 0,
                price: limitation.price || 0,
                salePercentage: limitation.salePercentage || 0,
                type: limitation.type || "",
                createdAt: limitation.createdAt || null,
                boughtAmount: limitation.boughtAmount || 0,
            });
            form.setFieldsValue({
                code: limitation.code || "",
                name: limitation.name || "",
                createClass: limitation.createClass || 0,
                createExamNormally: limitation.createExamNormally || 0,
                createExamByAI: limitation.createExamByAI || 0,
                memberPerClass: limitation.memberPerClass || 0,
                price: limitation.price || 0,
                salePercentage: limitation.salePercentage || 0,
                type: limitation.type || "",
            });
        } else {
            setFormData({
                code: "",
                name: "",
                createClass: 0,
                createExamNormally: 0,
                createExamByAI: 0,
                memberPerClass: 0,
                price: 0,
                salePercentage: 0,
                type: "",
            })
        }
    }, [limitation, isCreateMode]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        if (isCreateMode) {
            console.log("Tạo Mới:", formData);
            createPackageService()
        } else {
            console.log("Xem Chi Tiết:", formData);
            updatePackageService()
        }
        onClose();
    };

    const createPackageService = async () => {
        const payload = {
            code: formData.code,
            name: formData.name,
            createClass: formData.createClass,
            createExamNormally: formData.createExamNormally,
            createExamByAI: formData.createExamByAI,
            memberPerClass: formData.memberPerClass,
            price: formData.price,
            salePercentage: formData.salePercentage,
            type: formData.type,
        };

        const res = await callAdminCreateLimitation(payload);
        if (res?.success){
            notification.success(res?.message)
        } else {
            notification.error(res?.message);
        }
    }

    const updatePackageService = async () => {
        const payload = {
            name: formData.name,
            createClass: formData.createClass,
            createExamNormally: formData.createExamNormally,
            createExamByAI: formData.createExamByAI,
            memberPerClass: formData.memberPerClass,
            price: formData.price,
            salePercentage: formData.salePercentage,
        };

        const res = await callAdminUpdateLimitation(payload);
        if (res?.success){
            notification.success(res?.message)
        } else {
            notification.error(res?.message);
        }
    }

    return (
        <Modal
            title={`Thông Tin Gói Dịch Vụ - ${action}`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {isCreateMode ? "Tạo mới" : "Cập nhật"}
                </Button>,
            ]}
            centered
            width={800}
        >
            <Form layout="vertical" form={form} initialValues={formData}>
                <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Mã Gói">
                        <Input
                            value={formData.code}
                            onChange={(e) => handleChange("code", e.target.value)}
                            disabled={!isCreateMode}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Tên Gói">
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Số lượt tạo lớp">
                        <InputNumber
                            min={0}
                            value={formData.createClass}
                            onChange={(value) => handleChange("createClass", value)}
                            style={{ width: "100%" }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Số lượt tạo đề thi (Thường)">
                        <InputNumber
                            min={0}
                            value={formData.createExamNormally}
                            onChange={(value) => handleChange("createExamNormally", value)}
                            style={{ width: "100%" }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Số lượt tạo đề thi (AI)">
                        <InputNumber
                            min={0}
                            value={formData.createExamByAI}
                            onChange={(value) => handleChange("createExamByAI", value)}
                            style={{ width: "100%" }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Số thành viên tối đa / lớp">
                        <InputNumber
                            min={0}
                            value={formData.memberPerClass}
                            onChange={(value) => handleChange("memberPerClass", value)}
                            style={{ width: "100%" }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Giá tiền (VNĐ)">
                        <InputNumber
                            min={0}
                            value={formData.price}
                            onChange={(value) => handleChange("price", value)}
                            style={{ width: "100%" }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Khuyến mãi (%)">
                        <InputNumber
                            min={0}
                            max={100}
                            value={formData.salePercentage}
                            onChange={(value) => handleChange("salePercentage", value)}
                            style={{ width: "100%" }}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Loại Gói">
                        <Select
                            value={formData.type}
                            onChange={(value) => handleChange("type", value)}
                            style={{ width: "100%" }}
                            placeholder={"Chọn loại gói dịch vụ..."}
                        >
                            <Option value="Lượt tạo lớp học">Lượt tạo lớp học</Option>
                            <Option value="Tạo đề thi (Thủ công và Import file)">
                                Tạo đề thi (Thủ công và Import file)
                            </Option>
                            <Option value="Tạo đề thi bằng AI">Tạo đề thi bằng AI</Option>
                            <Option value="Số lượng thành viên lớp học">
                                Số lượng thành viên lớp học
                            </Option>
                            <Option value="Combo">Combo</Option>
                        </Select>
                    </Descriptions.Item>

                    {!isCreateMode && (
                        <>
                            <Descriptions.Item label="Thời gian tạo">
                                {dayjs(limitation?.createdAt).format("DD/MM/YYYY HH:mm")}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số lượng đã bán">
                                {limitation?.boughtAmount}
                            </Descriptions.Item>
                        </>
                    )}
                </Descriptions>
            </Form>
        </Modal>
    );
};

export default ServicePackageDetailModal;
