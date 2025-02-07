import axios from '../utils/axios-customize';

import { notification } from "antd";

export const baseApiCall = async (url, method, payload = {}, secure = false) => {
    try {
        const token = localStorage.getItem('access_token');
        const headers = secure && token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axios({
            url,
            method,
            data: payload,
            headers
        });

        if (response.data == null) {
            return { success: false, message: 'Lỗi hệ thống (call API)', data: null };
        }

        return {
            success: response.data.success && response.data.status === 'OK',
            message: response.data.message,
            data: response.data.data
        };

    } catch (error) {
        console.error("Lỗi API:", error);

        if (error.response) {
            const { status, data } = error.response;
            if (status === 500) {
                // notification.error({
                //     message: "Lỗi máy chủ (500)",
                //     description: "Hệ thống đang gặp sự cố, vui lòng thử lại sau.",
                // });
            } else {
                notification.error({
                    message: `Lỗi ${status}`,
                    description: data?.message || "Đã xảy ra lỗi.",
                });
            }

            return { success: false, message: data?.message || `Lỗi ${status}`, data: null };
        } 
    }
};

export const callForgotPassword = (email) => {
    return baseApiCall('/api/auth/forget-password', 'post', {email}, false);
};
export const callResetPassword = (userId,verificationCode,password,retypePassword) => {
    return baseApiCall('/api/auth/reset-password', 'post', {userId,verificationCode,password,retypePassword}, false);
};
export const callRegister = (email, password, retypePassword,fullName,phoneNumber,gender,birthDate) => {
    return baseApiCall('/api/auth/register', 'post', {email, password, retypePassword,fullName,phoneNumber,gender,birthDate}, false);
};

export const callLogin = (email, password) => {
    return baseApiCall('/api/auth/login', 'post', {email, password}, false);
};

export const callUserDetail = () => {
    return baseApiCall('/api/users/me', 'get', {}, true);
};

export const callUpdateUserProfile = (userId, userInfo) => {
    return baseApiCall(`/api/users/${userId}/update-profile`, 'post', userInfo, true);
};

export const callChangePassword = (userId, request) => {
    return baseApiCall(`/api/users/${userId}/update-password`, 'post', request, true);
};

export const callListClass = (request) => {
    return baseApiCall(`/api/classes/`, 'post', request, true);
};

export const callDetailClass = ({id}) => {
    return baseApiCall(`/api/classes/id`, 'get', {}, true);
};

export const callCreateExam = (request) => {
    return baseApiCall(`/api/exam/create`, 'post', request, true);
};
