import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {callIPNHanlde} from "../../services/api.js";

const PaymentTmpPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processPayment = async () => {
            const param = searchParams.toString();
            if (param) {
                await callIPNHanlde(param);
            }
            navigate("/limitation");
        };

        processPayment();
    }, [navigate, searchParams]);

    return <div>Processing Payment...</div>;
};


export default PaymentTmpPage;
