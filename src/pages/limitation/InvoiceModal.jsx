import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Card, notification } from "antd";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { callGetInvoiceDetail } from "../../services/api.js";

const InvoiceModal = ({ isOpen, setIsOpen, paymentId }) => {
    const [invoiceData, setInvoiceData] = useState();
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchInvoiceData = async () => {
            const res = await callGetInvoiceDetail(paymentId);
            if (res?.data) {
                setInvoiceData(res.data);
            } else {
                notification.error(res?.data?.message);
            }
        };
        if (paymentId) {
            fetchInvoiceData();
        }
    }, [paymentId]);

    const handleDownloadPDF = async () => {
        if (invoiceRef.current) {
            const canvas = await html2canvas(invoiceRef.current);
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
            pdf.save("invoice.pdf");
        }
    };

    if (!invoiceData) return <>Khong tim thay hoa don</>;

    return (
        <Modal
            title="Hóa Đơn"
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={[
                <Button key="close" onClick={() => setIsOpen(false)}>
                    Đóng
                </Button>,
                <Button key="print" type="primary" onClick={handleDownloadPDF}>
                    In
                </Button>,
            ]}
        >
            <Card ref={invoiceRef} className="border border-gray-200 rounded-lg shadow-sm p-4 space-y-3">
                <p><strong>Mã người dùng:</strong> {invoiceData.userCode}</p>
                <p><strong>Tên người dùng:</strong> {invoiceData.userFullName}</p>
                <p><strong>Số tiền thanh toán:</strong> {invoiceData.price.toLocaleString()} VND</p>
                <p><strong>Thời gian tạo hóa đơn:</strong> {new Date(invoiceData.createdDate).toLocaleString()}</p>
                <p><strong>Thời gian thanh toán:</strong> {new Date(invoiceData.paymentDate).toLocaleString()}</p>
                <p><strong>Cổng thanh toán:</strong> {invoiceData.paymentType}</p>
                <p><strong>Nội dung giao dịch:</strong> {invoiceData.content}</p>
                <p><strong>Trạng thái thanh toán:</strong>
                    <span style={{ color: invoiceData.status === "Thành công" ? "green" : "red" }}>
            {invoiceData.status}
          </span>
                </p>
            </Card>
        </Modal>
    );
};

export default InvoiceModal;