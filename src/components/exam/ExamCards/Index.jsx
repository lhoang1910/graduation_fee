import React from "react";
import {notification} from "antd";
import {callDeleteExam} from "../../../services/api.js";
import {useNavigate} from "react-router-dom";
import {FaSignInAlt, FaTrash, FaListOl, FaShareAltSquare, FaUser} from "react-icons/fa";
import {AiOutlineFileProtect} from "react-icons/ai";
import {Tooltip} from "antd";
import {MdPublic} from "react-icons/md";
import {SiGoogleclassroom} from "react-icons/si";
import {RiGitRepositoryPrivateLine} from "react-icons/ri";


const ExamCards = ({exams, fetchData, canUpdate}) => {

    const navigate = useNavigate();

    const handleDeleteExam = async (examId) => {
        if (!examId) {
            notification.error("Lớp học không tồn tại")
            return;
        }
        const res = await callDeleteExam(examId);
        if (res?.success) {
            notification.success({
                message: "Thành công",
                description: res.message
            });
            fetchData();
        } else {
            notification.error({
                message: "Thất bại",
                description: res.message || "Có lỗi xảy ra"
            });
        }
    }

    const getPermissionLabel = (permissionType, classCode) => {
        switch (permissionType) {
            case "Công khai":
                return <Tooltip title="Bất kỳ ai cũng có thể làm bài"><MdPublic style={{color: "#ff9800"}}/> Công
                    khai</Tooltip>;
            case "Thành viên lớp học":
                return <Tooltip title={`Chỉ học sinh lớp ${classCode} được truy cập`}><SiGoogleclassroom
                    style={{color: "#4caf50"}}/> Lớp học:
                    <span> {classCode}</span></Tooltip>;
            case "Người được cấp quyền":
                return <Tooltip title="Chỉ người được cấp quyền mới có thể truy cập"><FaShareAltSquare
                    style={{color: "#673ab7"}}/> Người được
                    cấp quyền</Tooltip>;
            case "Chỉ mình tôi":
                return <Tooltip title="Chỉ có bạn mới có thể truy cập"><RiGitRepositoryPrivateLine
                    style={{color: "#f44336"}}/> Chỉ mình tôi</Tooltip>;
            default:
                return permissionType;
        }
    };

    return (
        <>
            <div className="class-list">
                {exams.map((examItem) => (
                    <div key={examItem.id} className="class-card" title={examItem.examName}>
                        <div style={{position: "relative", display: "inline-block"}}>
                            <img
                                src="data:image/jpeg;base64,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"
                                alt="class" style={{width: "100%", borderRadius: "8px"}}/>
                            {examItem.examCode && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "65%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        color: "#ffcc00",
                                        fontSize: "2rem",
                                        fontWeight: "bold",
                                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    {examItem.examCode}
                                    <br/>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.8rem",
                                            marginTop: "5px",
                                            color: "#003366",
                                            textShadow: "1px 1px 2px rgba(0, 86, 179, 0.4)",
                                            background: "rgba(255, 255, 255, 0.5)",
                                            padding: "4px 10px",
                                            borderRadius: "4px",
                                            border: "1px solid #0056b3",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <FaUser size={18} style={{marginRight: "5px"}}/>
                                            <span>Tạo bởi:</span>
                                        </div>

                                        <div style={{marginTop: "2px", fontWeight: "bold"}}>
                                            {examItem.createdByName}
                                        </div>
                                    </div>

                                </div>
                            )}

                        </div>
                        <h2 style={{
                            textAlign: "center",
                            minWidth: "120px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>{examItem.examName.length > 9 ? examItem.examName.slice(0, 20) + "..." : examItem.examName}</h2>
                        <p>
                            <FaListOl style={{color: "#ff5722"}}/> {examItem.totalQuestion} câu hỏi
                            &nbsp;&nbsp;<AiOutlineFileProtect style={{color: "#3f51b5"}}/> {examItem.randomAmount} mã đề
                        </p>
                        <p>
                            {getPermissionLabel(examItem.examPermissionType, examItem.classCode)}
                        </p>
                        <div className="card-buttons">
                            <button className="enter-class" onClick={() => navigate(`/exam/${examItem.id}`)}>
                                <FaSignInAlt/> Làm bài
                            </button>
                            {canUpdate && (
                                <>
                                    <button className="delete-class" onClick={() => handleDeleteExam(examItem.id)}>
                                        <FaTrash/> Xóa
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ExamCards