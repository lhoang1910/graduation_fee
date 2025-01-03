import { Button, Divider, Flex } from "antd";
import TimerCountdown from "../Timer";
import style from "../index.module.css"
import { useSelector } from "react-redux";
function ExamInformation() {
  const exam = useSelector(state=>state.exam.exam)
  const submitHandler = ()=>{
    console.log(exam);

  }
  return (
    <Flex vertical={true} style={styles.container}>
      <h3  className={style.title}>Trắc nghiệm đề bài</h3>
      <Flex gap={1} vertical={true}>
      <span   style={styles.text}>Thời gian còn lại</span>
      <TimerCountdown duration ={12} onSubmit={()=>{submitHandler()}}></TimerCountdown>
      </Flex>

      <Divider></Divider>
      <Flex gap={8} justify="space-between">      <Button danger type="primary" >Trở về</Button>       <Button onClick={()=>{submitHandler();}} type="primary" style={{flex:1}}>Nộp bài thi</Button>

      </Flex>
    </Flex>
  );
}
const styles = {
  container:{
    position:"sticky",
    top:"0px",
    borderRadius:"5px",
    padding:"16px",
    backgroundColor:"white",
    
  },
  text:{
    fontSize:"14px",
    color:"#000000DE",
    fontWeigh:"400"
  }
}

export default ExamInformation;
