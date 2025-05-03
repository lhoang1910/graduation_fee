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

export const callBuyLimitation = (limitationId, servicePackageType, amount, paymentType) => {
    return baseApiCall(`/api/limitations/buy/${limitationId}`, 'post', {servicePackageType, amount, paymentType},true)
}

export const callCurrentUserDashboard = () => {
    return baseApiCall(`/api/users/dashboard`, 'get', {}, true)
}

export const callCurrentUserLimitation = () => {
    return baseApiCall(`/api/limitations/current`, 'get', {}, true);
}

export const callIPNHanlde = (param) => {
    return baseApiCall(`/api/payment/vnpay_ipn?${param}`, 'get', {}, true);
}

export const callMomoIPNHanlde = (param) => {
    return baseApiCall(`/api/payment/momo_ipn?${param}`, 'get', {}, true);
}

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

export const callCreateReport = (title, content) => {
    return baseApiCall('/api/report/create', 'post', {title, content}, true);
}

export const callCreateClass = (className) => {
    return baseApiCall('/api/classes/create', 'post', {className}, true);
}

export const callUpdateClass = (classId, className) => {
    return baseApiCall(`/api/classes/${classId}/update`, 'post', {className}, true);
}

export const callUserDetail = () => {
    return baseApiCall('/api/users/me', 'get', {}, true);
};

export const callUpdateUserProfile = (userId, userInfo) => {
    return baseApiCall(`/api/users/${userId}/update-profile`, 'post', userInfo, true);
};

export const callChangePassword = (userId, request) => {
    return baseApiCall(`/api/users/${userId}/update-password`, 'post', request, true);
};

export const callListClass = (searchingKeys, pageNumber, pageSize, typeView, sortCriteria) => {
    return baseApiCall(`/api/classes/all`, 'post', {searchingKeys: searchingKeys, pageNumber: pageNumber, pageSize: pageSize, typeView: typeView, sortCriteria: sortCriteria}, true);
};

export const callAdminListClass = (payload) => {
    return baseApiCall(`/api/admin/classes`, 'post', payload, true);
};

export const callListLimitation = (pageNumber, pageSize, searchingKeys, startPrice, endPrice, type) => {
    return baseApiCall(`/api/limitations/all`, 'post', {pageNumber, pageSize, searchingKeys, startPrice, endPrice, type}, true);
}

export const callLimitationDetail = (limitationId) => {
    return baseApiCall(`/api/limitations/${limitationId}`, 'get', {},true);
}

export const callDetailClass = (id) => {
    return baseApiCall(`/api/classes/${id}`, 'get', {}, true);
};

export const callDeleteClass = (classId) => {
    return baseApiCall(`/api/classes/${classId}/delete`, 'delete', {},true);
}

export const callCreateExamWithFile = (fileType,formData) => {
    console.log("call ",formData)
    return baseApiCall(`/api/question/detect?fileType=${fileType}`, 'post', formData, true);
};

export const callGenerateExamByAI = (formData) => {
    return baseApiCall(`/api/question/ai-generate`, "post", formData, true);
};

export const callCreateExam = (request) => {
    return baseApiCall(`/api/exam/create`, 'post', request, true);
};

export const callUpdateExam = (id, request) => {
    return baseApiCall(`/api/exam/${id}/create`, 'post', request, true);
};

export const callListExam = (request) => {
    return baseApiCall(`/api/exam/list`, 'post', request, true);
};
export const callDetailExam = (id) => {
    return baseApiCall(`/api/exam/${id}`, 'get',{}, true);
};
export const callStartExam = (id) => {
    return baseApiCall(`/api/exam/${id}/start-exam`, 'post',{}, true);
};
export const callSubmitExam = (examId,historyId,payload) => {
    return baseApiCall(`/api/exam/${examId}/submit-exam/${historyId}`, 'post',payload, true);
};
export const callExamResults = (payload) => {
    return baseApiCall(`/api/exam/results`, 'post',payload, true);
};
export const callUserDoExamResult = (payload) => {
    return baseApiCall(`/api/exam/results`, 'post', payload, true);
}

export const callALlUsers = (payload) => {
    return baseApiCall(`/api/users/all`, 'post', payload, true);
}

export const callLimitationWallet = (payload) => {
    return baseApiCall(`/api/limitations/my-wallet`, 'post', payload, true);
}

export const callFindLimitationByCode = (code) => {
    return baseApiCall(`/api/limitations/find-by-code/${code}`, 'get', {}, true);
}

export const callDeleteExam = (id) => {
    return baseApiCall(`/api/exam/${id}/delete`, 'post', {}, true)
}

export const callAllCreatedClassNameCode = () => {
    return baseApiCall(`/api/classes/find-all-created-class-name`, 'get', {}, true)
}

export const callCheckUserExistByEmail = (email) => {
    return baseApiCall(`/api/users/exists-by-email/${email}`, 'get', {}, true)
}
export const callResultDetail = (id) => {
    return baseApiCall(`/api/exam/results/${id}`, 'post',{}, true);
};

export const callResultDashBoard = (payload) => {
    return baseApiCall(`/api/exam/results/dash-board`, 'post',payload, true);
};

export const callAddUserToClass = (email, classId) => {
    return baseApiCall(`/api/classes/${classId}/add`, 'post', {email}, true);
}

export const callIpnHandle = (id) => {
    return baseApiCall(`/api/payment/ipn-handler/${id}`, 'get', {}, true);
}

export const callDeleteClassMember = (classId, email) => {
    return baseApiCall(`/api/classes/${classId}/remove`, 'post', {email}, true);
}

export const callGetInvoiceDetail = (id) => {
    return baseApiCall(`/api/payment/find-by-id/${id}`, 'get', {}, true);
}

export const callSetRetryExam = (id, payload) => {
    return baseApiCall(`/api/exams/${id}/retry`, 'post', payload, true);
}

// Admin
export const callAdminDashboard = (payload) => {
    return baseApiCall(`/api/admin/dashboard`, 'post', payload, true)
}

export const callAdminUserList = (payload) => {
    return baseApiCall(`/api/admin/users`, 'post', {}, true);
}

export const callAdminUserDetail = (id) => {
    return baseApiCall(`/api/admin/users/${id}`, 'get', {}, true);
}

export const callAdminUpdateUserStatus = (id) => {
    return baseApiCall(`/api/admin/users/${id}/status`, 'post', {}, true);
}

export const callAdminExamList = (payload) => {
    return baseApiCall(`/api/admin/exams`, 'post', payload, true)
}

export const callAdminQuestionList = (payload) => {
    return baseApiCall(`/api/admin/questions/all-question`, 'post', payload, true);
}

export const callAdminLimitationList = (payload) => {
    return baseApiCall(`/api/admin/limitations`, 'post', payload, true);
}

export const callAdminCreateLimitation = (payload) => {
    return baseApiCall(`/api/admin/limitations/create`, 'post', payload, true);
}

export const callAdminUpdateLimitation = (id, payload) => {
    return baseApiCall(`/api/admin/limitations/${id}/update`, 'post', payload, true);
}

export const callAdminDeleteLimitation = (id) => {
    return baseApiCall(`/api/admin/limitations/delete/{limitationId}`, 'post', {}, true);
}
export const callAdminGetLimitationDetail = (id) => {
    return baseApiCall(`/api/admin/limitations/${id}`, 'post', {}, true);
}

export const callAdminPaymentList = (payload) => {
    return baseApiCall(`/api/admin/payment-histories/all`, 'post', payload, true);
}

export const callAdminReports = (payload) => {
    return baseApiCall(`/api/admin/reports`, 'post', payload, true);
}

export const callExecuteReports = (reportId, payload) => {
    return baseApiCall(`/api/admin/reports/${reportId}/execute`, 'post', payload, true);
}

export const callImportUsers = async (classId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return baseApiCall(`/api/classes/${classId}/import-class-user`, 'post', formData, true);
};

export const callExportResult = (examId) => {
    return baseApiCall(`/api/exam/${examId}/export-result`, 'get', {}, true);
}

// export const callUpdateExam = (examId, payload) => {
//     console.log(">>>>", payload)
//     return baseApiCall(`/api/exam/${examId}/update-exam`, 'post', payload, true);
// }

// Categories
export const callGetProgramCategories = () => {
    return baseApiCall(`/api/categories/programs`, 'get', {}, true);
}

export const callGetGradeCategories = (programId) => {
    return baseApiCall(`/api/categories/program/${programId}/grades`, 'get', {}, true);
}

export const callGetSubjectCategories = (payload) => {
    return baseApiCall(`/api/categories/subjects`, 'post', payload, true);
}

export const callGetMyQuestions = (payload) => {
    return baseApiCall(`/api/question/get-my-questions`, 'post', payload, true);
}

export const callUpdateExamQuestion = (examId, payload) => {
    return baseApiCall(`/api/exam/${examId}/update-question`, 'post', payload, true);
}

export const callGetExamQuestion = (examId) => {
    return baseApiCall(`/api/exam/${examId}/questions`, 'get', {}, true);
}

export const getMyQuestions = (payload) => {
    return baseApiCall(`/api/question/get-all-questions`, 'post', payload, true);
}

export const callUpdateQuestion = (id, payload) => {
    return baseApiCall(`/api/question/${id}/update`, 'post', payload, true);
}

export const createQuestionsFromBank = (payload) => {
    return baseApiCall(`/api/question/create-questions-from-bank`, 'post', payload, true);
}

export const callDeleteQuestion = (id) => {
    return baseApiCall(`/api/question/${id}/delete`, 'post', {}, true);
}