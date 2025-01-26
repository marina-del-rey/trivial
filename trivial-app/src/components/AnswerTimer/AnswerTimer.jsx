import { useEffect, useState, useRef } from "react";
import "./AnswerTimer.scss"

function AnswerTimer({ duration, onTimeUp }) {
    const[counter, setCounter] = useState(0);
    const[timeProgress, setTimeProgress] = useState(0);
    const intervalRef = useRef();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCounter((curr) => curr + 1);
        }, 1000); 

        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        setTimeProgress(100 * (counter / duration));
        //console.log(counter); // DEBUG
        if (counter > duration) {
            clearInterval(intervalRef.current);
            onTimeUp();
        }

    }, [counter]);

    return (
        <div className="answer-timer-container">
            <div 
                style={{
                    width: `${timeProgress}%`,
                    backgroundColor: `${
                        timeProgress < 55
                            ? '#77DD77'
                            : timeProgress < 90
                            ? '#FF964F'
                            : '#B90E0A'
                    }`
                }}
                className="progress"
            >
            </div>
        </div>
    );

}

export default AnswerTimer;