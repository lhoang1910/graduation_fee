import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Input,
    notification,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Typography
} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    callGetGradeCategories,
    callGetProgramCategories,
    callGetSubjectCategories, getMyQuestions
} from "../../services/api.js";
import {FaEye, FaPlus} from "react-icons/fa";
import {motion} from "framer-motion";
import {ArrowLeftOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import QuestionPopupDetail from "./QuestionPopupDetail.jsx";
import CreateQuestionModal from "./CreateFromBankModal.jsx";
import {updateQuestions} from "../../redux/examCreating/examCreating.Slice.js";
import {useDispatch} from "react-redux";


const {Title} = Typography;
const {RangePicker} = DatePicker;

const QuestionBankPage = () => {

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [onlyCreatedQuestions, setOnlyCreatedQuestions] = useState(false);
    const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [chosenProgramId, setChosenProgramId] = useState(undefined);
    const [chosenGradeId, setChosenGradeId] = useState(undefined);
    const [chosenSubjectId, setChosenSubjectId] = useState(undefined);
    const [chosenDifficulty, setChosenDifficulty] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);

    const [programCategory, setProgramCategory] = useState([]);
    const [gradeCategory, setGradeCategory] = useState([]);
    const [subjectCategory, setSubjectCategory] = useState([]);

    const [chosenQuestionList, setChosenQuestionList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const navigate = useNavigate();

    const handleCheck = (record, checked) => {
        const exists = chosenQuestionList.find(q => q.id === record.id);
        let newList;
        let newKeys;

        if (checked && !exists) {
            newList = [...chosenQuestionList, record];
            newKeys = [...selectedRowKeys, record.id];
        } else if (!checked && exists) {
            newList = chosenQuestionList.filter(q => q.id !== record.id);
            newKeys = selectedRowKeys.filter(id => id !== record.id);
        } else {
            return;
        }

        setChosenQuestionList(newList);
        setSelectedRowKeys(newKeys);
    };

    const isChecked = (record) => selectedRowKeys.includes(record.id);

    useEffect(() => {
        const getProgramCategory = async () => {
            const res = await callGetProgramCategories();
            if (res) {
                setProgramCategory(res.data);
            }
        };
        getProgramCategory();
    }, []);

    useEffect(() => {
        if (!chosenProgramId) {
            setGradeCategory([]);
            setChosenGradeId(undefined);
            return;
        }

        const getGradeCategory = async () => {
            const res = await callGetGradeCategories(chosenProgramId);
            if (res) {
                setGradeCategory(res.data);
            }
        };
        getGradeCategory();
    }, [chosenProgramId]);

    useEffect(() => {
        if (!chosenProgramId || !chosenGradeId) {
            setSubjectCategory([]);
            setChosenSubjectId(undefined);
            return;
        }

        const getSubjectCategory = async () => {
            const res = await callGetSubjectCategories({
                programCategoryId: chosenProgramId,
                gradeCategoryId: chosenGradeId,
            });
            if (res) {
                setSubjectCategory(res.data);
            }
        };
        getSubjectCategory();
    }, [chosenProgramId, chosenGradeId]);

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const requestParams = {
                pageNumber: currentPage - 1,
                pageSize: pageSize,
                searchingKeys: searchingKeys,
                createAtFrom: dateRange ? dateRange[0].startOf("day").valueOf() : null,
                createAtTo: dateRange ? dateRange[1].endOf("day").valueOf() : null,
                sortCriteria: [{key: "createdAt", asc: false}],
                authorView: onlyCreatedQuestions,
                programCategory: programCategory.find((item) => item.id === chosenProgramId)?.program || null,
                gradeCategory: gradeCategory.find((item) => item.id === chosenGradeId)?.grade || null,
                subjectCategory: subjectCategory.find((item) => item.id === chosenSubjectId)?.subject || null,
                questionLevel: chosenDifficulty || null,
            };

            const response = await getMyQuestions(requestParams);

            setTableData(response?.data?.content || []);
            setTotalItems(response?.data?.totalElements || 0);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTableData();
    }, [currentPage, pageSize, searchingKeys, dateRange, onlyCreatedQuestions, chosenProgramId, chosenGradeId, chosenSubjectId]);


    const handleView = (record) => {
        setSelectedQuestion(record);
        console.log(record);
        setIsModalVisible(true);
    }

    const handleClearFilters = () => {
        setPageSize(10);
        setCurrentPage(1);
        setSearchingKeys(null);
        setDateRange(null);
        setOnlyCreatedQuestions(false)
        setChosenProgramId(null)
        setChosenGradeId(null)
        setChosenSubjectId(null)
        setChosenDifficulty(null)
        fetchTableData();
    }

    const handleCreateExam = () => {
        if (chosenQuestionList == null || chosenQuestionList.length === 0) {
            notification.error("Vui lòng chọn câu hỏi trước khi tạo đề thi");
            return;
        }
        const cleanedQuestionList = chosenQuestionList.map(q => ({
            id: q.id,
            code: q.code,
            attachmentPath: q.attachmentPath ?? null,
            question: q.question,
            type: q.type,
            answers: q.answers,
            explain: q.explain
        }));
        createExam(cleanedQuestionList);
    }

    const createExam = (questionList) => {
        if (questionList == null || questionList.length === 0) {
            notification.error("Vui lòng chọn câu hỏi trước khi tạo đề thi");
            return;
        }
        dispatch(updateQuestions(questionList));
        navigate("/workspace/exams/news");
    }

    const handleToggleCheckboxColumn = () => {
        setShowCheckboxColumn(!showCheckboxColumn);
    };

    const questionColumn = [
        {
            key: "select",
            align: "center",
            render: (_, record) => (
                <div style={{textAlign: "center", display: "flex", justifyContent: "center", gap: "10px"}}>
                    <Checkbox
                        checked={isChecked(record)}
                        onChange={(e) => handleCheck(record, e.target.checked)}
                        style={{
                            transform: "scale(1.3)",
                            accentColor: "#1890ff",
                            borderRadius: "4px",
                        }}
                    >
                    </Checkbox>

                </div>
            ),
        },
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1
        },
        {
            title: "Cấp độ/Chương trình",
            dataIndex: "programCategory",
            key: "programCategory"
        },
        {
            title: "Khối/Lớp",
            dataIndex: "gradeCategory",
            key: "gradeCategory"
        },
        {
            title: "Môn học",
            dataIndex: "subjectCategory",
            key: "subjectCategory"
        },
        {
            title: "Độ khó",
            dataIndex: "questionLevel",
            key: "questionLevel"
        },
        {
            title: "Câu hỏi",
            dataIndex: "question",
            key: "question"
        },
        {
            title: "Số lượng đáp án",
            dataIndex: "answers",
            key: "answers",
            render: (_, record) => record?.answers?.length || 0,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => text ? new Date(text).toLocaleDateString("vi-VN") : "-"
        },
        {
            title: "Tác giả",
            dataIndex: "createdBy",
            key: "createdBy"
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{textAlign: "center", display: "flex", justifyContent: "center", gap: "10px"}}>
                    <Button
                        type="primary"
                        icon={<FaEye size={18}/>}
                        onClick={() => handleView(record)}
                        style={{
                            background: "#1890ff",
                            borderColor: "#1890ff",
                            color: "#fff",
                            minWidth: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            boxShadow: "0px 4px 10px rgba(24, 144, 255, 0.3)",
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            {/* TIÊU ĐỀ VÀ NÚT TRỞ VỀ */}
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    background: "#f5f5f5",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* TIÊU ĐỀ */}
                <Title level={2} style={{margin: 0, color: "#1890ff"}}>
                    NGÂN HÀNG CÂU HỎI
                </Title>

                {/* NÚT TRỞ VỀ */}
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined/>}
                    style={{
                        background: "#ff4d4f",
                        borderColor: "#ff4d4f",
                        fontWeight: "bold",
                        borderRadius: "6px",
                    }}
                    onClick={() => navigate("/admin")}
                >
                    Trở về
                </Button>
            </motion.div>

            {/* THANH TÌM KIẾM VÀ FILTER */}
            <div
                style={{
                    background: "#ffffff",
                    padding: 16,
                    borderRadius: 10,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    marginBottom: 16,
                }}
            >
                <Row gutter={[12, 12]} align="middle">
                    {/* Ô tìm kiếm kéo dài ra sao cho chiều dài hàng 1 bằng hàng 2 */}
                    <Col flex="1">
                        <Input
                            placeholder="Tìm kiếm từ khóa..."
                            prefix={<SearchOutlined/>}
                            allowClear
                            value={searchingKeys}
                            onChange={(e) => setSearchingKeys(e.target.value)}
                            style={{height: 40}}
                        />
                    </Col>

                    {/* RangePicker nằm giữa */}
                    <Col flex="0 0 240px">
                        <RangePicker
                            format="DD/MM/YYYY"
                            style={{width: "100%", height: 40}}
                            onChange={(dates) => setDateRange(dates)}
                        />
                    </Col>

                    {/* Checkbox */}
                    <Col>
                        <Checkbox
                            checked={onlyCreatedQuestions}
                            onChange={(e) => setOnlyCreatedQuestions(e.target.checked)}
                        >
                            Chỉ câu hỏi của tôi
                        </Checkbox>
                    </Col>

                    {/* Nút Reset với chữ mô tả */}
                    <Col>
                        <Button
                            icon={<ReloadOutlined/>}
                            onClick={handleClearFilters}
                            type="primary"
                            style={{
                                height: 40,
                                paddingLeft: 12,
                                paddingRight: 12,
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span style={{marginRight: 8}}>Reset bộ lọc</span>
                        </Button>
                    </Col>
                </Row>

                {/* Hàng 2: Danh mục */}
                <Row gutter={[12, 12]} style={{marginTop: 12}}>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn chương trình"
                            allowClear
                            style={{width: "100%", height: 40}}
                            value={chosenProgramId}
                            onChange={(value) => {
                                setChosenProgramId(value);
                                setChosenGradeId(undefined);
                                setChosenSubjectId(undefined);
                            }}
                            options={programCategory?.map(item => ({
                                value: item.id,
                                label: item.program
                            }))}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn khối/lớp"
                            allowClear
                            disabled={!chosenProgramId}
                            style={{width: "100%", height: 40}}
                            value={chosenGradeId}
                            onChange={(value) => {
                                setChosenGradeId(value);
                                setChosenSubjectId(undefined);
                            }}
                            options={gradeCategory?.map(item => ({
                                value: item.id,
                                label: item.grade
                            }))}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn môn học"
                            allowClear
                            disabled={!chosenGradeId}
                            style={{width: "100%", height: 40}}
                            value={chosenSubjectId}
                            onChange={setChosenSubjectId}
                            options={subjectCategory?.map(item => ({
                                value: item.id,
                                label: item.subject
                            }))}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Chọn độ khó"
                            allowClear
                            style={{width: "100%", height: 40}}
                            value={chosenDifficulty}
                            onChange={setChosenDifficulty}
                            options={[
                                {value: "DỄ", label: "Dễ"},
                                {value: "VỪA", label: "Vừa"},
                                {value: "KHÓ", label: "Khó"},
                            ]}
                        />
                    </Col>
                </Row>
            </div>

            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                    }}>
                        <Button
                            onClick={handleToggleCheckboxColumn}
                            style={{
                                height: 40,
                                paddingLeft: 20,
                                paddingRight: 20,
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "8px",
                                background: "#ff4d4f",
                                borderColor: "#ff4d4f",
                                boxShadow: "0px 4px 12px rgba(255, 77, 79, 0.3)",
                                color: "#ffffff",
                                transition: "all 0.3s ease",
                            }}
                        >
                            Chọn
                        </Button>
                        {chosenQuestionList.length > 0 && (
                            <div
                                style={{
                                    fontWeight: "bold",
                                    background: "#e6f7ff",
                                    border: "1px solid #91d5ff",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    color: "#096dd9",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                Đã chọn {chosenQuestionList.length} câu hỏi

                                <Button
                                    type="primary"
                                    onClick={handleCreateExam}
                                    style={{
                                        background: "#1890ff",
                                        borderColor: "#1890ff",
                                        borderRadius: "6px",
                                        boxShadow: "0px 4px 10px rgba(24, 144, 255, 0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Tạo đề thi
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button
                        type="primary"
                        onClick={() => setOpenModal(true)}
                        icon={<FaPlus size={14} style={{marginRight: 8}}/>}
                        style={{
                            height: 40,
                            paddingLeft: 20,
                            paddingRight: 20,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "8px",
                            background: "linear-gradient(90deg, #13c2c2 0%, #36cfc9 100%)",
                            borderColor: "#13c2c2",
                            boxShadow: "0px 4px 12px rgba(19, 194, 194, 0.3)",
                            color: "#ffffff",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "linear-gradient(90deg, #36cfc9 0%, #5cdbd3 100%)";
                            e.currentTarget.style.boxShadow = "0px 6px 14px rgba(19, 194, 194, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "linear-gradient(90deg, #13c2c2 0%, #36cfc9 100%)";
                            e.currentTarget.style.boxShadow = "0px 4px 12px rgba(19, 194, 194, 0.3)";
                        }}
                    >
                        Tạo đề thi từ ngân hàng câu hỏi
                    </Button>
                </div>

                <Table
                    columns={showCheckboxColumn ? questionColumn : questionColumn.filter(col => col.key !== "select")}
                    dataSource={tableData}
                    rowKey="id"
                    pagination={{
                        total: totalItems,
                        pageSize: pageSize,
                        current: currentPage,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    locale={{emptyText: "Không tìm thấy dữ liệu nào!"}}
                />
            </div>

            <QuestionPopupDetail
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                questionData={selectedQuestion}
            />
            <CreateQuestionModal
                open={openModal}
                onClose={() => setOpenModal(false)}/>
        </Spin>
    )
}

export default QuestionBankPage;
