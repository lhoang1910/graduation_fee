import { useEffect, useState } from "react";

function TimerCountdown({duration,onSubmit}) {
    const [time,setTime] = useState(duration);
    useEffect(()=>{
        setTimeout(()=>{
            setTime(time-1)
            if(time<1){
                onSubmit();
                 setTime(10000000);
            }
        },1000);
    },[time])
    const getFormattedTime=(sc)=>{
        let total_minutes = parseInt(Math.floor(sc/60));
        let total_hours = parseInt(Math.floor(total_minutes/60));
        let seconds = parseInt(sc%60);
        let minutes = parseInt(total_minutes%60);
        let hours = parseInt(Math.floor(total_hours/24));
        return hours ? `${hours}:${minutes}:${seconds}` :  `${minutes}:${seconds}`

    }
    return ( <div style={{color:"rgb(62, 101, 254)",fontWeight:600,lineHeight:"1.5 rem",fontSize:"16px"}}>{getFormattedTime(time)}</div> );
}

export default TimerCountdown;