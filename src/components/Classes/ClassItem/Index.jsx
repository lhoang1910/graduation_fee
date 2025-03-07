import {FaEdit, FaFileAlt, FaSignInAlt, FaTrash, FaUsers} from "react-icons/fa";
import React, {useState} from "react";
import {notification} from "antd";
import {callDeleteClass} from "../../../services/api.js";
import UpdateClassModel from "../Update/Index.jsx";
import {useNavigate} from "react-router-dom";


const ClassCards = ({classes, fetchData}) => {

    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const navigate = useNavigate();

    const handleDeleteClass = async (classId) => {
        if (!classId) {
            notification.error("Lớp học không tồn tại")
            return;
        }
        const res = await callDeleteClass(classId);
        if (res?.success){
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
            <UpdateClassModel isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal} onSuccess={fetchData} classId={selectedClassId}/>
            <div className="class-list">
                {classes.map((classItem) => (
                    <div key={classItem.id} className="class-card">
                        <img src="https://img.freepik.com/free-vector/interior-classroom_1308-26552.jpg"
                             alt="class"/>
                        <h2>{classItem.className}</h2>
                        <p>Mã lớp: {classItem.classCode}</p>
                        <p><FaUsers/> {classItem.participationAmount}/{classItem.limitSlot}</p>
                        <p><FaFileAlt/> {classItem.examineAmount}</p>
                        <p>Tạo bởi: {classItem.createdByName}</p>
                        <div className="card-buttons">
                            <button className="enter-class" onClick={() => navigate(`/class/${classItem.id}`)}><FaSignInAlt/> Vào lớp</button>
                            <button className="edit-class" onClick={() => {
                                setSelectedClassId(classItem.id);
                                setIsOpenUpdateModal(true)
                            }}><FaEdit/> Sửa
                            </button>
                            <button className="delete-class" onClick={() => handleDeleteClass(classItem.id)}>
                                <FaTrash/> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ClassCards