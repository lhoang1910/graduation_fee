import React, {useState} from "react";
import {Layout, Menu, Tabs, Upload, Typography, Card, message, notification, Spin} from "antd";
import {UploadOutlined, FileTextOutlined} from "@ant-design/icons";
import {callCreateExamWithFile} from "../../services/api";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateQuestions} from "../../redux/examCreating/examCreating.Slice";

const {Sider, Content} = Layout;
const {Text, Title} = Typography;

const CreatingwithFile = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const uploadProps = {
        accept: ".pdf,.docx",
        name: "file",
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isAcceptedFileType =
                file.type === "application/pdf" ||
                file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // DOCX
                file.type === "application/msword"; // DOC

            if (!isAcceptedFileType) {
                message.error(`${file.name} không phải là định dạng được hỗ trợ.`);
                return Upload.LIST_IGNORE; // Ngăn không cho upload file sai định dạng
            }
            return true; // Cho phép upload nếu định dạng đúng
        },
        customRequest: async ({file, onSuccess, onError}) => {
            setLoading(true)
            console.log("file", file)
            let fileType;
            if (file.type === "application/pdf") {
                fileType = 1; // PDF
            } else if (
                file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // DOCX
                file.type === "application/msword" // DOC
            ) {
                fileType = 0; // DOCX
            }
            const formData = new FormData(); // Tạo form data để gửi file
            formData.append("file", file); // Thêm file vào form data

            try {
                // Gửi request lên server
                const response = await callCreateExamWithFile(fileType, formData);
                console.log("response create exam with file ", response);
                if (response.success) {
                    if (response.data.length === 0){
                        notification.error({
                            message: "Thất bại",
                            description: "Không đọc được đề thi từ file"
                        });
                        return;
                    }
                    console.log("file to json", response);
                    dispatch(updateQuestions(response.data))
                    navigate("/workspace/exams/news")
                    onSuccess("ok");
                } else {
                    console.error("File upload failed");
                    notification.error({message: response.message})
                    onError(new Error("Upload failed"));
                }
            } catch (error) {
                console.error("Error:", error);
                onError(error); // Báo lỗi khi xảy ra vấn đề trong quá trình gửi
            } finally {
                setLoading(false)
            }
        },
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider width={200} style={{background: "#fff"}}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    style={{height: "100%", borderRight: 0}}
                >
                    <Menu.Item key="1" icon={<FileTextOutlined/>}>
                        Tài liệu đề thi
                    </Menu.Item>
                </Menu>
            </Sider>

            <Spin align="center" gap="middle" size="large" spinning={loading}>
                <Layout style={{padding: "24px"}}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Upload tài liệu đề thi" key="1">
                                <div style={{display: "flex", gap: "20px", cursor: "pointer"}}>
                                    <Card
                                        style={{
                                            width: 400,
                                            textAlign: "center",
                                            border: "1px dashed #d9d9d9",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Upload {...uploadProps} >
                                            <UploadOutlined
                                                style={{
                                                    fontSize: "32px",
                                                    color: "#1890ff",
                                                    marginBottom: "8px",
                                                }}
                                            />
                                            <Text>Upload tài liệu đề thi</Text>
                                            <p style={{marginTop: "8px"}}>
                                                Hỗ trợ định dạng tài liệu Word, PDF
                                            </p>
                                        </Upload>
                                    </Card>
                                    <div>
                                        <Title level={5}>Hướng dẫn</Title>
                                        <Card
                                            style={{
                                                borderRadius: "8px",
                                                backgroundColor: "#e6f7ff",
                                                padding: "16px",
                                            }}
                                        >
                                            <Text>
                                                Khi upload thành công,
                                                bạn sẽ được chuyển tiếp sang trang chỉnh sửa đề thi trước khi tạo đề
                                            </Text>
                                        </Card>
                                    </div>
                                </div>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Chỉnh sửa đề thi" key="2" disabled>
                                <p>Chức năng "Duyệt kết quả" đang được phát triển.</p>
                            </Tabs.TabPane>
                        </Tabs>
                    </Content>
                </Layout>
            </Spin>
        </Layout>
    );
};

export default CreatingwithFile;
