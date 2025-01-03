import { Flex } from "antd";
import Answer from "../Answer";
import QuestionCreating from "../QuestionCreating";
function ExamEditor() {
  return     <Flex vertical style={styles.container}>
    
    <QuestionCreating></QuestionCreating>
  </Flex >;
}

export default ExamEditor;






const styles = {
  container:{
    border:"1px solid #eee",
    borderRadius:"5px",
    backgroundColor:"white",
    padding:"16px 16px 24px 16px"
  },
}