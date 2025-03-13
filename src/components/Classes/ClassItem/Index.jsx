import {FaEdit, FaFileAlt, FaSignInAlt, FaTrash, FaUser, FaUsers} from "react-icons/fa";
import React, {useState} from "react";
import {notification} from "antd";
import {callDeleteClass} from "../../../services/api.js";
import UpdateClassModel from "../Update/Index.jsx";
import {useNavigate} from "react-router-dom";


const ClassCards = ({classes, fetchData, canUpdate}) => {

    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const navigate = useNavigate();

    const handleDeleteClass = async (classId) => {
        if (!classId) {
            notification.error("Lớp học không tồn tại")
            return;
        }
        const res = await callDeleteClass(classId);
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

    return (
        <>
            <UpdateClassModel isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal} onSuccess={fetchData}
                              classId={selectedClassId}/>
            <div className="class-list">
                {classes.map((classItem) => (
                    <div key={classItem.id} className="class-card" title={classItem.className}>
                        <div style={{position: "relative", display: "inline-block"}}>
                            <img src="https://img.freepik.com/free-vector/interior-classroom_1308-26552.jpg"
                                 alt="class" style={{width: "100%", borderRadius: "8px"}}/>
                            {classItem.classCode && (
                                <div style={{
                                    position: "absolute",
                                    top: "13%",
                                    left: "49%",
                                    transform: "translateX(-50%)",
                                    color: "#ffcc00",
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)"
                                }}>
                                    {classItem.classCode}
                                    <br/>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.8rem",
                                            color: "#ffffff",
                                            textShadow: "1px 1px 2px rgba(0, 86, 179, 0.4)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <FaUser size={18} style={{marginRight: "5px"}}/>
                                            <span>Tạo bởi:</span>
                                        </div>

                                        <div style={{marginTop: "2px", fontWeight: "bold"}}>
                                            {classItem.createdByName}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <h2>{classItem.className.length > 9 ? classItem.className.slice(0, 20) + "..." : classItem.className}</h2>
                        <p><FaUsers/> {classItem.participationAmount}/{classItem.limitSlot}</p>
                        <p><FaFileAlt/> {classItem.examineAmount}</p>
                        <div className="card-buttons">
                            <button className="enter-class" onClick={() => navigate(`/class/${classItem.id}`)}>
                                <FaSignInAlt/> Vào lớp
                            </button>
                            {canUpdate && (
                                <>
                                    <button className="edit-class" onClick={() => {
                                        setSelectedClassId(classItem.id);
                                        setIsOpenUpdateModal(true)
                                    }}><FaEdit/> Sửa
                                    </button>
                                    <button className="delete-class"
                                            onClick={() => handleDeleteClass(classItem.id)}>
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

export default ClassCards