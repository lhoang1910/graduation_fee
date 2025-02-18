import { Button, Divider, Flex, notification, Spin } from "antd";
import TimerCountdown from "../Timer";
import style from "../index.module.css"
import { useSelector } from "react-redux";
import { callSubmitExam } from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
function ExamInformation({detailExam,setIsLoading}) {
  const { id } = useParams();
  const navigate= useNavigate()
  const exam = useSelector(state=>state.exam?.exam)
  const submitHandler =async ()=>{
    try {
      setIsLoading(true)
      const response = await callSubmitExam(id,exam.data?.historyId,{questionResults:exam.data?.questionResults});
      console.log(response)
      if(response.success){
        navigate("/quiz/exam/result",{replace:true, state: { result: response }})
      }else{
        notification.error({message:response.message});
      }
    } catch (error) {
      console.log(error)

      
    }finally{
      setIsLoading(false)

    }

  }
  console.log("exam mmmm",exam)

  return (
    <Flex vertical={true} style={styles.container}>
      <h3  className={style.title}>Trắc nghiệm đề bài</h3>
      <Flex gap={1} vertical={true}>
      <span   style={styles.text}>Thời gian còn lại</span>
     { detailExam && <TimerCountdown deadline ={detailExam.time*60*1000+exam?.data?.startAt} onSubmit={()=>{submitHandler()}}></TimerCountdown> }
      </Flex>

      <Divider></Divider>
      <Flex gap={8} justify="space-between">      <Button danger type="primary" >Trở về</Button>     <Button onClick={()=>{submitHandler();}} type="primary" style={{flex:1}}>Nộp bài thi</Button>

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
