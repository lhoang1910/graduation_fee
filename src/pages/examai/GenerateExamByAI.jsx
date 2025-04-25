import React, {useState} from "react";
import {Form, Input, InputNumber, Radio, Upload, Button, Card, message, notification, Spin, Row, Col} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {callGenerateExamByAI} from "../../services/api.js";
import {updateQuestions} from "../../redux/examCreating/examCreating.Slice.js";

const GenerateExamByAI = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [contentType, setContentType] = useState("text");
    const [file, setFile] = useState(null);

    const uploadProps = {
        accept: ".pdf,.docx",
        name: "file",
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const acceptedTypes = [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword",
            ];

            if (!acceptedTypes.includes(file.type)) {
                message.error(`${file.name} không phải là định dạng được hỗ trợ.`);
                return Upload.LIST_IGNORE;
            }

            setFile(file);
            return false;
        },
    };

    const submitForm = async () => {
        setLoading(true);

        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("file", file);
            const requestData = {
                filetype: (values.contentType === "file" && file != null) ? file.type : null,
                questionType: values.questionType || "",
                numberQuestion: Number(values.numberQuestion) || 0,
                numberAnswer: Number(values.numberAnswer) || 0,
                topic: typeof values.topic === "string" ? values.topic : "",
                content: typeof values.content === "string" ? values.content : "",
                questionRate: {
                    hardRate: Number(values.hardRate) || 0,
                    mediumRate: Number(values.mediumRate) || 0,
                    easyRate: Number(values.easyRate) || 0,
                }
            };

            console.log("Request Data:", requestData);

            formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

            const response = await callGenerateExamByAI(formData, file);

            if (response.success) {
                if (!response.data || response.data.length === 0) {
                    notification.error({
                        message: "Thất bại",
                        description: "Không đọc được đề thi từ file"
                    });
                    return;
                }

                console.log("file to json", response);
                dispatch(updateQuestions(response.data));
                navigate("/workspace/exams/news");
            } else {
                console.error("File upload failed");
                notification.error({ message: response.message });
            }
        } catch (error) {
            console.error("Error:", error);
            notification.error({ message: "Có lỗi xảy ra khi tạo đề thi bằng AI" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title="TẠO ĐỀ THI BẰNG AI"
            bordered={false}
            style={{
                maxWidth: 700,
                margin: "40px auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: 12,
                padding: 24,
                backgroundColor: "#fff",
            }}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Chủ đề"
                        name="topic"
                        rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
                    >
                        <Input placeholder="Nhập chủ đề" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                label="Loại câu hỏi"
                                name="questionType"
                                initialValue="Một đáp án đúng"
                            >
                                <Radio.Group>
                                    <Radio value="Một đáp án đúng">1 đáp án</Radio>
                                    <Radio value="Nhiều đáp án đúng">Nhiều đáp án</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                span={10}
                                label="Tỉ lệ câu hỏi (%)"
                                required
                                style={{ marginBottom: 12 }}
                            >
                                <Row gutter={12}>
                                    <Col span={8}>
                                        <Form.Item
                                            name={"hardRate"}
                                            rules={[
                                                { required: true, message: "Nhập % câu khó" },
                                                {
                                                    type: "number",
                                                    min: 0,
                                                    max: 100,
                                                    message: "Giá trị từ 0 đến 100",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <InputNumber
                                                placeholder="Khó"
                                                min={0}
                                                max={100}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name={"mediumRate"}
                                            rules={[
                                                { required: true, message: "Nhập % câu vừa" },
                                                {
                                                    type: "number",
                                                    min: 0,
                                                    max: 100,
                                                    message: "Giá trị từ 0 đến 100",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <InputNumber
                                                placeholder="Vừa"
                                                min={0}
                                                max={100}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name={"easyRate"}
                                            rules={[
                                                { required: true, message: "Nhập % câu dễ" },
                                                {
                                                    type: "number",
                                                    min: 0,
                                                    max: 100,
                                                    message: "Giá trị từ 0 đến 100",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <InputNumber
                                                placeholder="Dễ"
                                                min={0}
                                                max={100}
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Số lượng câu hỏi"
                                name="numberQuestion"
                                rules={[{ required: true, message: "Chọn số lượng câu hỏi!" }]}
                            >
                                <InputNumber min={2} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Số lượng đáp án"
                                name="numberAnswer"
                                rules={[{ required: true, message: "Chọn số lượng đáp án!" }]}
                            >
                                <InputNumber min={2} style={{ width: "100%" }}  />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Nội dung"
                        name="contentType"
                        initialValue="text"
                    >
                        <Radio.Group onChange={(e) => setContentType(e.target.value)}>
                            <Radio value="file">Upload file</Radio>
                            <Radio value="text">Nhập văn bản</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {contentType === "file" && (
                        <Form.Item label="Upload file" name="file">
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Chọn file</Button>
                            </Upload>
                        </Form.Item>
                    )}

                    {contentType === "text" && (
                        <Form.Item
                            label="Nhập nội dung"
                            name="content"
                            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập nội dung đề thi..." />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" block onClick={submitForm}>
                            Tạo đề thi
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default GenerateExamByAI;