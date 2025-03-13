import { Modal, Button, Descriptions, Tag } from "antd";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const paymentTypes = [
    { name: "VN_PAY", img: "https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg" },
    { name: "MOMO", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj4DcLo3V_-SgkelON0Qsr-D5G2zvYcOtBIg&s" },
    { name: "ZALO_PAY", img: "https://img.utdstc.com/icon/653/fdd/653fdd44e6ee33b689f8dfe18ec741c75d8e25230adab2588d7e107847efcc68:200" },
];

const AdminPaymentDetail = ({ visible, onClose, paymentData }) => {
    const selectedPayment = paymentTypes.find(pt => pt.name === paymentData?.paymentType);

    const handlePrintInvoice = () => {
        const doc = new jsPDF();

        doc.setFont("times", "normal");
        doc.setFontSize(16);
        doc.text("HÓA ĐƠN THANH TOÁN", 70, 20);

        doc.setFontSize(12);
        doc.text("Công ty: Hoang-Graduation", 20, 30);
        doc.text(`Ngày: ${dayjs(paymentData?.createdDate).format("DD/MM/YYYY HH:mm")}`, 20, 40);

        autoTable(doc, {
            startY: 50,
            head: [["Mục", "Thông Tin"]],
            body: [
                ["Mã Người Dùng", paymentData?.userCode || "N/A"],
                ["Tên Người Dùng", paymentData?.userFullName || "N/A"],
                ["Mã Gói - Tên Gói", `${paymentData?.cachingCode} - ${paymentData?.cachingName}`],
                ["Số Lượng Mua", paymentData?.cachingAmount || 0],
                ["Tổng Thành Tiền", `${paymentData?.price?.toLocaleString("vi-VN")} VNĐ`],
                ["Trạng Thái", paymentData?.status || "N/A"],
                ["Phương Thức Thanh Toán", paymentData?.paymentType || "N/A"],
            ],
        });

        doc.save(`HoaDon_${paymentData?.userCode}.pdf`);
    };

    return (
        <Modal
            title="Thông tin hóa đơn"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Đóng
                </Button>,
                <Button key="print" type="primary" onClick={() =>handlePrintInvoice()}>
                    In hóa đơn
                </Button>,
            ]}
            centered
        >
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Mã Người Dùng">
                    {paymentData?.userCode || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Tên Người Dùng">
                    {paymentData?.userFullName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã Gói - Tên Gói">
                    {paymentData?.cachingCode} - {paymentData?.cachingName}
                </Descriptions.Item>
                <Descriptions.Item label="Số Lượng Mua">
                    {paymentData?.cachingAmount || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng Thành Tiền">
                    {paymentData?.price?.toLocaleString("vi-VN")} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Thời Gian Tạo Hóa Đơn">
                    {paymentData?.createdDate ? dayjs(paymentData.createdDate).format("DD/MM/YYYY HH:mm") : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Thời Hạn Thanh Toán">
                    {paymentData?.paymentDate ? dayjs(paymentData.paymentDate).format("DD/MM/YYYY HH:mm") : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng Thái Thanh Toán">
                    <Tag color={paymentData?.status === "Đã thanh toán" ? "green" : "red"}>
                        {paymentData?.status || "Chưa rõ"}
                    </Tag>
                </Descriptions.Item>

                {/* Hiển thị phương thức thanh toán */}
                <Descriptions.Item label="Phương Thức Thanh Toán">
                    {selectedPayment ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                                src={selectedPayment.img}
                                alt={selectedPayment.name}
                                style={{ width: "40px", height: "40px", objectFit: "contain" }}
                            />
                            <span>{selectedPayment.name}</span>
                        </div>
                    ) : (
                        "Không xác định"
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Nội Dung Hóa Đơn">
                    {paymentData?.content || "Không có nội dung"}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default AdminPaymentDetail;
