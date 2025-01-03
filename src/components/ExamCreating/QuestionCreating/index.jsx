import { Flex ,Input} from "antd";

import Answer from "../Answer";
import { Button } from "@mui/material";
const {TextArea} = Input;
function QuestionCreating() {
    return ( <Flex vertical gap={16}>
        <h3>Soạn câu hỏi </h3>
        <TextArea  maxLength={100}       style={{
        height: 120,
      }}  placeholder="Nhập nội dung câu hỏi" />
        <h3>Câu trả lời </h3>
        <Answer></Answer>
        <Answer></Answer>

        <Answer></Answer>

        <Answer></Answer>
        <Flex gap={8} justify="space-between">      <Button danger  variant="contained" color="secondary"  >Thêm đáp án</Button>    

</Flex>        <h3> Giải thích </h3>

        <TextArea  maxLength={100}       style={{
        height: 120,
      }}  placeholder="Nhập nội dung giải thích đáp án" />
            <Flex gap={8} justify="space-between">      <Button danger  variant="contained"  >Thêm câu hỏi</Button>    

</Flex>  
    </Flex> );
}

export default QuestionCreating;