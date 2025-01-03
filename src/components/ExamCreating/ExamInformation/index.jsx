import { Flex, Input } from "antd";
import { useSelector } from "react-redux";
const { TextArea } = Input;
function ExamInformation() {
  const exam = useSelector((state) => state.exam.exam);
  const submitHandler = () => {
    console.log(exam);
  };
  return (
    <Flex vertical={true} style={styles.container} gap={16}>
      <h1 >Thông tin đề thi</h1>
      <Input
        maxLength={80}
        placeholder="Tên đề thi"
        style={{
          height: 40,
        }}
      />

      <TextArea
        maxLength={100}
        style={{
          height: 120,
        }}
        placeholder="Mô tả đề thi"
      />
    </Flex>
  );
}
const styles = {
  container: {
    top: "0px",
    borderRadius: "5px",
    padding: "16px",
    backgroundColor: "white",
  },
  text: {
    fontSize: "14px",
    color: "#000000DE",
    fontWeigh: "400",
  },
};

export default ExamInformation;
