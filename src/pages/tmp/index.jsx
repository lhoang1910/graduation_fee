import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { callIPNHanlde } from "../../services/api.js";
import { notification } from "antd";

const PaymentTmpPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processPayment = async () => {
            try {
                const param = searchParams.toString();
                console.log(">>>>>>>>>>>>>param: ", param)
                if (param) {
                    const res = await callIPNHanlde(param);
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
                navigate("/limitation-wallet");
            }
        };

        processPayment();
    }, [navigate, searchParams]);

    return <div>Processing Payment...</div>;
};

export default PaymentTmpPage;
