import React, {useState, useEffect} from 'react';
import './index.css';
import {Form, Input, Select, DatePicker, Button, message, notification, Avatar} from "antd";
import {callChangePassword, callUpdateUserProfile, callUserDetail} from "../../services/api.js";
import dayjs from 'dayjs';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const {Option} = Select;

const Profile = () => {
    const [activeTab, setActiveTab] = useState('accountInfo');
    const [userInfo, setUserInfo] = useState({
        email: '',
        phone: '',
        fullName: '',
        gender: 'male',
        birthDate: '',
        avatar: '',
    });
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            const response = await callUserDetail();
            setUserInfo({
                id: response.data.id,
                email: response.data.email || '',
                phone: response.data.phoneNumber || '',
                fullName: response.data.fullName || '',
                gender: response.data.gender || 'male',
                birthDate: response.data.birthDay || '',
                avatar: response.data.avatar || '',
            });
        } catch (error) {
            console.error('Failed to fetch user details', error);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div style={{padding: "20px", fontFamily: "Arial, sans-serif", margin: "auto"}}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                padding: "16px",
                background: "#f5f5f5",
                borderRadius: "8px"
            }}>
                <h2 style={{margin: 0, color: "#333"}}>THÔNG TIN TÀI KHOẢN</h2>
                <Button
                    type="primary" danger icon={<ArrowLeftOutlined/>}
                    onClick={() => navigate("/")}
                    style={{borderRadius: "6px", padding: "8px 16px"}}
                >
                    Trở về
                </Button>
            </div>

            {/* Container */}
            <div style={{
                display: "flex",
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                overflow: "hidden"
            }}>
                {/* Sidebar */}
                <div style={{
                    width: "250px",
                    borderRight: "2px solid #f0f0f0",
                    padding: "20px",
                    background: "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    <button
                        onClick={() => handleTabChange('accountInfo')}
                        style={{
                            padding: "12px",
                            border: "none",
                            borderRadius: "6px",
                            background: activeTab === 'accountInfo' ? "#1890ff" : "#fff",
                            color: activeTab === 'accountInfo' ? "#fff" : "#333",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "0.3s",
                            textAlign: "left"
                        }}
                    >
                        Thông tin tài khoản
                    </button>

                    <button
                        onClick={() => handleTabChange('changePassword')}
                        style={{
                            padding: "12px",
                            border: "none",
                            borderRadius: "6px",
                            background: activeTab === 'changePassword' ? "#1890ff" : "#fff",
                            color: activeTab === 'changePassword' ? "#fff" : "#333",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "0.3s",
                            textAlign: "left"
                        }}
                    >
                        Đổi mật khẩu
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    padding: "20px",
                    minHeight: "300px"
                }}>
                    {activeTab === 'accountInfo' &&
                        <AccountInfo userInfo={userInfo} setUserInfo={setUserInfo}
                                     fetchUserDetails={fetchUserDetails}/>}
                    {activeTab === 'changePassword' && <ChangePassword userId={userInfo.id}/>}
                </div>
            </div>
        </div>
    );
};

const AccountInfo = ({userInfo, setUserInfo, fetchUserDetails}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            email: userInfo.email,
            phone: userInfo.phone,
            fullName: userInfo.fullName,
            gender: userInfo.gender,
            birthDate: userInfo.birthDate ? dayjs(userInfo.birthDate, "DD-MM-YYYY") : null,
        });
    }, [userInfo, form]);


    const handleSubmit = async (values) => {
        try {
            const response = await callUpdateUserProfile(userInfo.id, {
                fullName: values.fullName,
                phoneNumber: values.phone,
                gender: values.gender,
                birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : null,
            });

            if (response.success) {
                message.success(response.message);
                fetchUserDetails();
            } else {
                notification.error({
                    message: "Lỗi cập nhật",
                    description: response.message || "Đã xảy ra lỗi trong quá trình cập nhật.",
                });
            }
        } catch (error) {
            console.error("Cập nhật thông tin thất bại:", error);
            notification.error({
                message: "Lỗi hệ thống",
                description: "Không thể kết nối với máy chủ. Vui lòng thử lại sau.",
            });
        }
    };

    return (
        <div>
            <div className="pf-account-info">
                {/* <div className="pf-pic">
                {
                    userInfo?.avatar  ?         <>      <img src={userInfo.avatar} alt="Avatar" />
                    <button className="delete-pic">Xoá ảnh</button> </>   :       <Avatar style={{ backgroundColor: 'GrayText', verticalAlign: 'middle' }} size="large" gap={6}>
        {userInfo?.fullName}
      </Avatar>
                }

            </div> */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{type: "email", message: "Email không hợp lệ."}, {
                            required: true,
                            message: "Vui lòng nhập email."
                        }]}
                    >
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Điện thoại di động"
                        name="phone"
                        rules={[{
                            pattern: /^[0-9]{9,12}$/,
                            message: "Số điện thoại phải từ 9 đến 12 chữ số."
                        }, {required: true, message: "Vui lòng nhập số điện thoại."}]}
                    >
                        <Input
                            type="tel"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Họ tên"
                        name="fullName"
                        rules={[{required: true, message: "Họ và tên không được để trống."}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{required: true, message: "Vui lòng chọn giới tính."}]}
                    >
                        <Select>
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="birthDate"
                        rules={[{required: true, message: "Ngày sinh không được để trống."}]}
                    >
                        <DatePicker
                            format="DD-MM-YYYY"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    );
};

const ChangePassword = ({userId}) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const request = {
                oldPassword: values.currentPassword,
                password: values.newPassword,
                retypePassword: values.confirmPassword,
            };

            const response = await callChangePassword(userId, request);

            if (response.success) {
                message.success(response.message || 'Đổi mật khẩu thành công!');
                form.resetFields();
            } else {
                notification.error({
                    message: "Lỗi",
                    description: response.message || "Đã xảy ra lỗi khi thay đổi mật khẩu.",
                });
            }
        } catch (error) {
            console.error("Lỗi khi thay đổi mật khẩu:", error);
            notification.error({
                message: "Lỗi hệ thống",
                description: "Không thể kết nối với máy chủ. Vui lòng thử lại sau.",
            });
        }
    };

    return (
        <div className="pf-change-password">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[{required: true, message: "Vui lòng nhập mật khẩu hiện tại."}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{required: true, message: "Vui lòng nhập mật khẩu mới."}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        {required: true, message: "Vui lòng nhập lại mật khẩu mới."},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu xác nhận không khớp."));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Profile;
const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${day}-${month}-${year}`;
};