import './ScoreIndicator.scss';
import 'animate.css';

const ScoreIndicator = ({ score, numQuestions }) => {
    const totalPoints = numQuestions * 5;
    const val = (score.points / totalPoints) * 100;
    const deg = (180 / 100) * val;

    return (
        <div className="score-container">
            <h3 className="animate__animated animate__jackInTheBox">Results</h3>
            <div className="indicator d-flex justify-content-center align-items-center">
                <span className="bar" style={{ transform: `rotate(${deg}deg)` }} />
                <span className="result">
                    <span>{score.points}</span>/<span>{totalPoints}</span>
                    <span>points</span>
                </span>
            </div>
            <div className="score-text-container">
                <p>
                    correct answers: <span>{score.correctAnswers}</span>
                </p>
                <p>
                    wrong answers: <span>{score.wrongAnswers}</span>
                </p>
            </div>
        </div>
    );              

};

export default ScoreIndicator;