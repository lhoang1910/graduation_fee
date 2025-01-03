import { Flex } from "antd";
import RadioButtonUncheckedSharpIcon from '@mui/icons-material/RadioButtonUncheckedSharp';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import style from "../index.module.css"
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useDispatch } from "react-redux";
import { chosenAnswer } from "../../../redux/exam/examSlice";
import { useEffect } from "react";

function Question({ question, index }) {

  const dispatch = useDispatch();
  const handleChange = (event,i) => {
 
    dispatch(chosenAnswer({indexQuestion:index,answer:i,value:event.target.checked}));
  };

  return (
    <div style={styles.question}>
      <Flex justify="space-between">
        <span className={style.title}>{`Câu ${index + 1}`}</span>
        <span  className={style.title} style={styles.modeTitle}>Một đáp án</span>
      </Flex>
      <div>
        <span  style={styles.questionTitle} className={style.title}>{question.question}</span>

        <ul style={{listStyleType:"none",padding:"0"}}>


         {/* <FormControl>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    name="radio-buttons-group"
  >
     {question.answers.map((e,i)=>(
          <FormControlLabel value={i} control={<Radio />} label={e.answer} />

          // <li key={i}><Flex align="center" style={styles.answer} gap={16} vertical={false} justify="flex-start">
          //      <RadioButtonCheckedSharpIcon   htmlColor="blue" fontSize="medium"/> 
          //     <Radio checkedIcon={<RadioButtonCheckedSharpIcon />} />

          //      <span  style={styles.answerContent} className={style.title}>{e.answer}</span> 
          // </Flex></li>
      ))}
    
  </RadioGroup>
</FormControl>  */}

   <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
        <FormGroup>
          {
          question.answers.map((e,i)=>(          <FormControlLabel
            onChange={(event)=>{handleChange(event,i)}} 
          key={e.id}
            control={
              <Checkbox   name={i.toString()} />
            }
            label={e.answer}
          />))}



        </FormGroup>
        </FormControl>

        </ul>
      </div>
    </div>
  );
}
const styles = {
  question:{
    border:"1px solid #eee",
    borderRadius:"5px",
    backgroundColor:"white",
    padding:"16px 16px 24px 16px"
  },
  modeTitle:{
    fontWeigh:"300",
    fontSize:"14px",
    color:"#00000099"
  },
  answerContent:{
    fontWeight:"300",
    lineHeight:"1.25rem",

  },
  questionTitle:{
    fontSize:"14px",
    lineHeight:"1.25rem"
  },
  answer:{
    padding:"8px 16px "

  }

  
}
export default Question;
