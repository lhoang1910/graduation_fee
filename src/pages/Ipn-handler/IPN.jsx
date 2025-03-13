import {useNavigate} from "react-router-dom";
import {notification} from "antd";
import {useEffect} from "react";
import {callIpnHandle} from "../../services/api.js";

const IPNHandle = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const processPayment = async () => {
            try {
                const paymentId = localStorage.getItem("paymentId")
                if (paymentId) {
                    const res = await callIpnHandle(paymentId);
                    notification.success({
                        message: "Thanh toán thành công",
                        description: res?.data?.message || "Giao dịch hoàn tất!"
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi thanh toán",
                    description: error?.response?.data?.message || "Có lỗi xảy ra!"
                });
            } finally {
                localStorage.removeItem("paymentId");
                navigate("/limitation-wallet");
            }
        };

        processPayment();
    }, []);

    return <>
            Đang xử lý giao dịch thanh toán...........
        </>
}

export default IPNHandle;