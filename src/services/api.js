import axios from '../utils/axios-customize';

export const baseApiCall = async (url, method, payload = {}, secure = false) => {
    const token = localStorage.getItem('access_token');
    const headers = secure && token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await axios({
        url,
        method,
        data: payload,
        headers
    });

    console.log('Response:', response.data);

    if (response.data == null) {
        return {success: false, message: 'Lỗi hệ thống (call API)', data: null}
    }

    return {success: response.data.success && response.data.status === 'OK', message: response.data.message, data: response.data.data};
};


export const callRegister = (email, password, retypePassword) => {
    return baseApiCall('/api/auth/register', 'post', {email, password, retypePassword}, false);
};

export const callLogin = (email, password) => {
    return baseApiCall('/api/auth/login', 'post', {email, password}, false);
};

export const callUserDetail = () => {
    return baseApiCall('/internal/api/profile', 'get', {}, true);
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
