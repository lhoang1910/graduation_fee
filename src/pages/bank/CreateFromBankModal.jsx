import {Modal, Form, InputNumber, Row, Col, message, Select, notification} from "antd";
import React, {useEffect, useState} from "react";
import {
    callGetGradeCategories,
    callGetProgramCategories,
    callGetSubjectCategories,
    createQuestionsFromBank
} from "../../services/api.js";
import {updateQuestions} from "../../redux/examCreating/examCreating.Slice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function CreateQuestionModal({ open, onClose }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [programCategory, setProgramCategory] = useState([]);
    const [gradeCategory, setGradeCategory] = useState([]);
    const [subjectCategory, setSubjectCategory] = useState([]);
    const [chosenProgramId, setChosenProgramId] = useState();
    const [chosenGradeId, setChosenGradeId] = useState();
    const [chosenSubjectId, setChosenSubjectId] = useState();

    useEffect(() => {
        const fetchPrograms = async () => {
            const res = await callGetProgramCategories();
            if (res) setProgramCategory(res.data);
        };
        fetchPrograms();
    }, []);

    useEffect(() => {
        if (!chosenProgramId) {
            setGradeCategory([]);
            setChosenGradeId(undefined);
            return;
        }

        const fetchGrades = async () => {
            const res = await callGetGradeCategories(chosenProgramId);
            if (res) setGradeCategory(res.data);
        };
        fetchGrades();
    }, [chosenProgramId]);

    useEffect(() => {
        if (!chosenProgramId || !chosenGradeId) {
            setSubjectCategory([]);
            setChosenSubjectId(undefined);
            return;
        }

        const fetchSubjects = async () => {
            const res = await callGetSubjectCategories({
                programCategoryId: chosenProgramId,
                gradeCategoryId: chosenGradeId,
            });
            if (res) setSubjectCategory(res.data);
        };
        fetchSubjects();
    }, [chosenProgramId, chosenGradeId]);

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const { easyRate, mediumRate, hardRate } = values.questionRate;
            const total = easyRate + mediumRate + hardRate;

            if (total !== 100) {
                return message.error("Tổng tỷ lệ câu hỏi phải bằng 100%");
            }

            const payload = {
                programCategory: programCategory.find((item) => item.id === chosenProgramId)?.program || null,
                gradeCategory: gradeCategory.find((item) => item.id === chosenGradeId)?.grade || null,
                subjectCategory: subjectCategory.find((item) => item.id === chosenSubjectId)?.subject || null,
                questionRate: values.questionRate,
                totalQuestion: values.totalQuestion,
            };

            const res = await createQuestionsFromBank(payload);
            if (res?.success && res.data != null && res?.data.length > 0){
                dispatch(updateQuestions(res?.data));
                navigate("/workspace/exams/news");
                message.success("Tạo đề thành công!");
            } else {
                notification.error("Trích xuất câu hỏi từ ngân hàng không thành công");
            }
            form.resetFields();
            onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setChosenProgramId(undefined);
        setChosenGradeId(undefined);
        setChosenSubjectId(undefined);
        onClose();
    };

    return (
        <Modal
            title="📚 Tạo đề thi từ ngân hàng"
            open={open}
            onOk={handleOk}
            confirmLoading={loading}
            onCancel={handleCancel}
            okText="Tạo đề"
            cancelText="Hủy"
            centered
        >
            <Form form={form} layout="vertical">
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                        <Select
                            placeholder="Chọn chương trình"
                            allowClear
                            style={{ width: "100%" }}
                            value={chosenProgramId}
                            onChange={(value) => {
                                setChosenProgramId(value);
                                setChosenGradeId(undefined);
                                setChosenSubjectId(undefined);
                            }}
                            options={programCategory?.map((item) => ({
                                value: item.id,
                                label: item.program,
                            }))}
                        />
                    </Col>

                    <Col xs={24} sm={12}>
                        <Select
                            placeholder="Chọn khối/lớp"
                            allowClear
                            disabled={!chosenProgramId}
                            style={{ width: "100%" }}
                            value={chosenGradeId}
                            onChange={(value) => {
                                setChosenGradeId(value);
                                setChosenSubjectId(undefined);
                            }}
                            options={gradeCategory?.map((item) => ({
                                value: item.id,
                                label: item.grade,
                            }))}
                        />
                    </Col>

                    <Col xs={24} sm={12}>
                        <Select
                            placeholder="Chọn môn học"
                            allowClear
                            disabled={!chosenGradeId}
                            style={{ width: "100%" }}
                            value={chosenSubjectId}
                            onChange={setChosenSubjectId}
                            options={subjectCategory?.map((item) => ({
                                value: item.id,
                                label: item.subject,
                            }))}
                        />
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="totalQuestion"
                            rules={[{ required: true, message: "Nhập số lượng câu hỏi" }]}
                        >
                            <InputNumber
                                placeholder="Số câu hỏi"
                                className="w-full"
                                min={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Tỷ lệ câu hỏi (%)"
                    required
                    style={{ marginTop: 16, marginBottom: 0 }}
                >
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item
                                name={["questionRate", "easyRate"]}
                                rules={[{ required: true, message: "Nhập tỷ lệ dễ" }]}
                            >
                                <InputNumber placeholder="Dễ" min={0} max={100} className="w-full" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={["questionRate", "mediumRate"]}
                                rules={[{ required: true, message: "Nhập tỷ lệ vừa" }]}
                            >
                                <InputNumber placeholder="Vừa" min={0} max={100} className="w-full" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name={["questionRate", "hardRate"]}
                                rules={[{ required: true, message: "Nhập tỷ lệ khó" }]}
                            >
                                <InputNumber placeholder="Khó" min={0} max={100} className="w-full" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
}