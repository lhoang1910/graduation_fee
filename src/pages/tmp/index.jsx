import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {callCreateReport} from "../../services/api.js";

const PaymentTmpPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processPayment = async () => {
            const param = searchParams.toString();
            if (param) {
                await callCreateReport(param);
            }
            navigate("/limitation");
        };

        processPayment();
    }, [navigate, searchParams]);

    return <div>Processing Payment...</div>;
};


export default PaymentTmpPage;
