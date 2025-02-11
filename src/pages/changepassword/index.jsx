import React, {useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {callRegister, callResetPassword} from '../../services/api';
import { message, notification } from 'antd';

function ChangePassword() {

    const [code, setCode] = useState('');

const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState({});
const [searchParams] = useSearchParams();
const userId = searchParams.get("userId");


    const navigate = useNavigate();

    const handleRegister = async () => {
        if (isRegisterEnabled) {
            const res = await callResetPassword(userId,code,password,confirmPassword);
            console.log("call reset password",res);

            if (res?.success) {
                message.success(res?.data);
                navigate('/login');
            } else {
                notification.error({
                    message: 'Đặt lại mật khẩu thất bại',
                    description: res?.message || 'Đã có lỗi xảy ra',
                });
            }
        }
    };

    const validateFields = () => {

        const newErrors = {};

        if (password.trim() === '') {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (confirmPassword.trim() === '') {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        if (code.trim() === '') {
            newErrors.code = 'Mã xác nhận không được để trống';
        }


        setErrors(newErrors);
    };


        const isRegisterEnabled =
        code.trim() !== ''  &&
        password.trim() !== '' &&
        confirmPassword.trim() !== '' &&
        password === confirmPassword; 
    const handleHasAcc = () => {
        navigate("/login");
    };

    const styles = {
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
            justifyContent: 'center',
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
            // marginBottom: '1rem',
            backgroundColor: '#F9FAFB',
            color: '#333',
            transition: 'border-color 0.3s',
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
        errorText: {
            color: '#D32F2F',
            fontSize: '13px',
            display: 'block',
            textAlign: 'left',
            width:"100%",
                        marginBottom: '1rem',

        },
    };

    return (

        <div style={styles.container}>
    <div style={styles.leftSection}>
        <img src="https://studio.eduquiz.vn/assets/images/auth/login.png" alt="Background Illustration"
             style={styles.backgroundImage}/>
    </div>
    <div style={styles.rightSection}>
        <div style={styles.formContainer}>
            <h2 style={styles.title}>Lấy lại mật khẩu</h2>

            
            <input
                type="text"
                placeholder=" Nhập mã xác nhận đã gửi về email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={validateFields}
                style={styles.input}
            />
            {/* {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>} */}
             <span style={styles.errorText}>{errors.code}</span>


 


            <input
                type="password"
                placeholder="Nhập mật khẩu mới của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validateFields}
                style={styles.input}
            />
            {/* {errors.password && <span style={styles.errorText}>{errors.password}</span>} */}
            <span style={styles.errorText}>{errors.password}</span>

            <input
                type="password"
                placeholder="Xác nhận mật khẩu mới của bạn"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateFields}
                style={styles.input}
            />
            {/* {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>} */}
            <span style={styles.errorText}>{errors.confirmPassword}</span>


            <div style={styles.registerContainer}>
                <span>Bạn đã có tài khoản? </span>
                <a onClick={handleHasAcc} style={styles.registerLink}>Đăng nhập ngay</a>
            </div>
            <button
                onClick={handleRegister}
                style={{
                    ...styles.loginButton,
                    backgroundColor: isRegisterEnabled ? '#5F4CCE' : '#ccc',
                    cursor: isRegisterEnabled ? 'pointer' : 'not-allowed',
                }}
                disabled={!isRegisterEnabled}
            >
                Xác nhận
            </button>
        </div>
    </div>
</div>

    );
}

export default ChangePassword;
