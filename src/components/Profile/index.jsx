import React, { useState, useEffect } from 'react';
import './index.css';
import { Form, Input, Select, DatePicker, Button, message, notification } from "antd";
import {callChangePassword, callUpdateUserProfile, callUserDetail} from "../../services/api.js";
import dayjs from 'dayjs';

const { Option } = Select;

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
        <div className="pf-container">
            <div className="pf-sidebar">
                <button
                    onClick={() => handleTabChange('accountInfo')}
                    className={activeTab === 'accountInfo' ? 'active' : ''}
                >
                    Thông tin tài khoản
                </button>
                <button
                    onClick={() => handleTabChange('changePassword')}
                    className={activeTab === 'changePassword' ? 'active' : ''}
                >
                    Đổi mật khẩu
                </button>
            </div>

            <div className="pf-content">
                {activeTab === 'accountInfo' && <AccountInfo userInfo={userInfo} setUserInfo={setUserInfo} fetchUserDetails={fetchUserDetails} />}
                {activeTab === 'changePassword' && <ChangePassword userId={userInfo.id}/>}
            </div>
        </div>
    );
};

const AccountInfo = ({ userInfo, setUserInfo, fetchUserDetails }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            email: userInfo.email,
            phone: userInfo.phone,
            fullName: userInfo.fullName,
            gender: userInfo.gender,
            birthDate: userInfo.birthDate ? dayjs(userInfo.birthDate) : null,
        });
    }, [userInfo, form]);

    const handleSubmit = async (values) => {
        try {
            const response = await callUpdateUserProfile(userInfo.id, {
                fullName: values.fullName,
                phoneNumber: values.phone,
                gender: values.gender === "male" ? 1 : values.gender === "female" ? 2 : 3,
                birthDay: values.birthDate.format("DD-MM-YYYY"),
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
        <div className="pf-account-info">
            <h2>Thông tin tài khoản</h2>
            <div className="pf-pic">
                <img src={userInfo.avatar} alt="Avatar" />
                <button className="delete-pic">Xoá ảnh</button>
            </div>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ type: "email", message: "Email không hợp lệ." }, { required: true, message: "Vui lòng nhập email." }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Điện thoại di động"
                    name="phone"
                    rules={[{ pattern: /^[0-9]{9,12}$/, message: "Số điện thoại phải từ 9 đến 12 chữ số." }, { required: true, message: "Vui lòng nhập số điện thoại." }]}
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
                    rules={[{ required: true, message: "Họ và tên không được để trống." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính." }]}
                >
                    <Select>
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Ngày sinh"
                    name="birthDate"
                    rules={[{ required: true, message: "Ngày sinh không được để trống." }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const ChangePassword = ({ userId }) => {
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
            <h2>Đổi mật khẩu</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại." }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới." }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: "Vui lòng nhập lại mật khẩu mới." },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu xác nhận không khớp."));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
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
