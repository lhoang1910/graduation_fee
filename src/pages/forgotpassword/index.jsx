import React, { useState,useEffect,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {callForgotPassword, callLogin, callRegister} from "../../services/api.js";
import {message, notification} from "antd";
import { useDispatch } from 'react-redux';
import {
    useQuery,
    useMutation,
    useQueryClient,

  } from '@tanstack/react-query'
function ForgotPasswordPage() {


    const queryClient = useQueryClient();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const isLoginEnabled = username.trim() !== '';

    const hasNotAcc = () => {
        navigate("/register")
    }


    const handleForgotPassword = async () => {
    
            if (!emailRegex.test(username)) {
                emailRef?.current?.focus();
                notification.error({
                    message: 'Email không hợp lệ',
                    description: 'Vui lòng nhập đúng định dạng email.',
                });
                return;
            }
        if (isLoginEnabled) {
            const res = await callForgotPassword(username);
            console.log("from forgot password",res);

            if (res?.success) {
                // localStorage.setItem('access_token', res.data.token);
                message.success(res?.message);

                navigate(`/change-password?userId=${res.data}`);
            } else {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: res?.message || 'Đã có lỗi xảy ra',
                });
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftSection}>
                <img src="https://studio.eduquiz.vn/assets/images/auth/login.png" alt="Background Illustration" style={styles.backgroundImage} />
            </div>
            <div style={styles.rightSection}>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Quên mật khẩu</h2>

 
                    <input
                        type="text"
                        placeholder="Nhập email của bạn để lấy lại mật khẩu"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        ref={emailRef}
                    />

                    <a href="#" style={styles.forgotPassword} onClick={()=>{navigate("/login")}}>Đăng nhập</a>
                    <div style={styles.registerContainer}>
                        <span>Bạn chưa có tài khoản? </span>
                        <a onClick={hasNotAcc} style={styles.registerLink}>Đăng Kí ngay</a>
                    </div>
                    <button
                        onClick={handleForgotPassword}
                        style={{
                            ...styles.loginButton,
                            backgroundColor: isLoginEnabled ? '#5F4CCE' : '#ccc',
                            cursor: isLoginEnabled ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!isLoginEnabled}
                    >
                        Lấy lại mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    hover : {
        cursor: 'pointer'
    },
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f0f4ff',
        fontFamily: 'Arial, sans-serif',
    },
    leftSection: {
        width: '60%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    rightSection: {
        width: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    formContainer: {
        width: '85%',
        maxWidth: '400px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#4A4A4A',
        marginBottom: '1.5rem',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        color: '#4285F4',
        padding: '0.75rem 1.2rem',
        fontSize: '15px',
        fontWeight: 'bold',
        borderRadius: '8px',
        border: '1px solid #ddd',
        cursor: 'pointer',
        marginBottom: '1.2rem',
        width: '100%',
        justifyContent: 'center',
        transition: 'background-color 0.3s',
    },
    googleIcon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '1rem 0',
        justifyContent: 'center', // Căn giữa phần divider
    },
    orText: {
        fontSize: '14px',
        color: '#888',
        margin: '0 0.5rem',
        whiteSpace: 'nowrap',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: '#ddd',
    },
    input: {
        width: '100%',
        padding: '0.8rem',
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginBottom: '1rem',
        backgroundColor: '#F9FAFB',
        color: '#333',
        transition: 'border-color 0.3s',
    },
    forgotPassword: {
        fontSize: '14px',
        color: '#4285F4',
        textDecoration: 'none',
        alignSelf: 'flex-end',
        marginBottom: '1rem',
    },
    registerContainer: {
        fontSize: '14px',
        color: '#333',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    registerLink: {
        color: '#5F4CCE',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginLeft: '4px',
        cursor: 'pointer'
    },
    loginButton: {
        width: '100%',
        padding: '0.75rem',
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s',
    },
};

export default ForgotPasswordPage;
