import React, { useEffect, useState } from 'react';
import {callDeleteClass, callListClass} from '../../services/api.js';
import { FaUsers, FaFileAlt, FaEdit, FaTrash, FaSignInAlt, FaSortUp, FaSortDown, FaPlus } from 'react-icons/fa';
import './ClassList.css';
import CreateClassModel from "./Create/Index.jsx";
import {notification} from "antd";
import UpdateClassModel from "./Update/Index.jsx";

const ClassList = ({ typeView }) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortCriteria, setSortCriteria] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [typeView, pageNumber, pageSize, sortCriteria, searchingKeys]);

    const fetchData = async () => {
        const res = await callListClass(searchingKeys, pageNumber, pageSize, typeView, sortCriteria);
        if (res?.data) {
            setData(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
        }
    };

    const handleSearch = (e) => {
        setSearchingKeys(e.target.value);
        setPageNumber(0);
    };

    const toggleSort = (key) => {
        setSortCriteria(prev => {
            const existing = prev.find(s => s.key === key);
            if (existing) {
                return prev.map(s => s.key === key ? { key, asc: !s.asc } : s);
            }
            return [...prev, { key, asc: true }];
        });
    };

    const getTitle = () => {
        switch (typeView) {
            case 'CLASS_MEMBER_VIEW': return 'Danh sách lớp học của tôi';
            case 'AUTHOR_VIEW': return 'Danh sách lớp học đã tạo';
            case 'RECENT_VIEW': return 'Lớp học gần đây';
            default: return 'Danh sách lớp học';
        }
    };

    const handleCreateClassSuccess = () => {
        fetchData();
    };

    const handleDeleteClass = async (classId) => {
        if (!classId) {
            notification.error("Lớp học không tồn tại")
            return;
        }
        const res = await callDeleteClass(classId);
        if (res?.success){
            notification.success(res.message)
            fetchData();
        } else {
            notification.error(res.message);
        }
    }

    return (
        <div className="container">
            <h1>{getTitle()}</h1>
            <div className="search-container">
                <select className="page-size-selector" onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <input type="text" placeholder="Tìm kiếm lớp học..." onChange={handleSearch} className="search-box" />
                <button className="create-class" onClick={() => setIsOpenCreateModal(true)}><FaPlus /> Tạo lớp</button>
                <CreateClassModel isOpen={isOpenCreateModal} setIsOpen={setIsOpenCreateModal} onSuccess={handleCreateClassSuccess}/>
                <UpdateClassModel isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal} onSuccess={handleCreateClassSuccess} classId={selectedClassId}/>
            </div>
            <div className="sort-container">
                {['classCode', 'className', 'participationAmount', 'examineAmount'].map(key => {
                    const sortObj = sortCriteria.find(s => s.key === key);
                    return (
                        <div key={key} className={`sort-item ${sortObj ? 'active' : ''}`} onClick={() => toggleSort(key)}>
                            <span className="sort-label">
                                {key === 'classCode' ? 'Mã lớp' : key === 'className' ? 'Tên lớp' : key === 'participationAmount' ? 'Số thành viên' : 'Số lượng đề thi'}
                            </span>
                            <div className="sort-icons">
                                <FaSortUp className={`sort-arrow up ${sortObj?.asc ? 'active' : ''}`} />
                                <FaSortDown className={`sort-arrow down ${sortObj && !sortObj.asc ? 'active' : ''}`} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <br/><br/>
            <div className="class-list">
                {data.map((classItem) => (
                    <div key={classItem.id} className="class-card">
                        <img src="https://img.freepik.com/free-vector/interior-classroom_1308-26552.jpg" alt="class" />
                        <h2>{classItem.className}</h2>
                        <p>Mã lớp: {classItem.classCode}</p>
                        <p><FaUsers /> {classItem.participationAmount}/{classItem.limitSlot}</p>
                        <p><FaFileAlt /> {classItem.examineAmount}</p>
                        <p>Tạo bởi: {classItem.createdByName}</p>
                        <div className="card-buttons">
                            <button className="enter-class"><FaSignInAlt /> Vào lớp</button>
                            <button className="edit-class" onClick={() => {
                                setSelectedClassId(classItem.id);
                                setIsOpenUpdateModal(true)}}><FaEdit /> Sửa</button>
                            <button className="delete-class" onClick={() => handleDeleteClass(classItem.id)}><FaTrash /> Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)}>Trước</button>
                <span>{pageNumber + 1} / {totalPages}</span>
                <button disabled={pageNumber + 1 >= totalPages} onClick={() => setPageNumber(pageNumber + 1)}>Tiếp</button>
            </div>
        </div>
    );
};

export default ClassList;