import { useState, useEffect } from "react";
import { resultInitialState } from "../../constants";
import { getQuestions } from "../../utils/requests";
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Modal, Form } from 'react-bootstrap';
import { shuffleArray } from "../../utils/utils";
import AddToLeaderboard from "../Leaderboard/AddToLeaderboard";
import AnswerTimer from "../AnswerTimer/AnswerTimer";
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'; 
import ScoreIndicator from "./ScoreIndicator";
import "./Quiz.scss";

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [choices, setChoices] = useState([]);
    const [answer, setAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [currentQuestionIndex, setcurrentQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [score, setScore] = useState(resultInitialState);
    const [showFinalScore, setShowFinalScore] = useState(false);
    const [showAnswerTimer, setShowAnswerTimer] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [showMain, setShowMain] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const navigate = useNavigate();
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);    
      
    const { category, difficulty, amount, timerDuration } = useParams();

    const onPlayNewGame = () => {
        navigate("/");
    };

    // fetch questions from api
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questionsData = await getQuestions({ category, difficulty, amount });
                setQuestions(questionsData);

                // set initial question
                if (questionsData.length > 0) {
                    const initialQuestion = questionsData[0];
                    const initialCorrectAnswer = initialQuestion.correct_answer;
                    const initialChoices = [...initialQuestion.incorrect_answers, initialCorrectAnswer];
                    setCurrentQuestion(initialQuestion.question);
                    setCorrectAnswer(initialCorrectAnswer);
                    setChoices(initialChoices);
                }

            } catch (error) {
                console.error('[ error fetching questions ]\n', error);
                navigate("/");
                alert(error);
            }
        };
        fetchQuestions();
    }, []);

    // render loading indicator while fetching questions
    if (questions.length === 0) {
        return <LoadingIndicator />;
    }

    
    // update selected answer index & check if answer is correct
    const onAnswerClick = (answer, index) => {
        setSelectedAnswerIndex(index);
        if (answer === correctAnswer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    };

    // update questions after next button is clicked
    const onClickNext = (finalAnswer) => {
        setSelectedAnswerIndex(null); // reset selected answer index
        setShowAnswerTimer(false); // reset answer timer progress bar
        setScore((prev) =>  // update user score
            finalAnswer
                ? {
                    ...prev,
                    points: prev.points + 5,
                    correctAnswers: prev.correctAnswers + 1.
                    }
                : {
                    ...prev,
                    wrongAnswers: prev.wrongAnswers + 1,
                }
        );

        // update current question if it's not the last one
        if (currentQuestionIndex !== questions.length - 1) { 
            setcurrentQuestionIndex((prev) => prev + 1);
        } else {
            setcurrentQuestionIndex(0); // reset if last question
            setShowFinalScore(true);
        }

        setTimeout(() => {
            setShowAnswerTimer(true);
        });

        // update question, correct answer, and choices for the next question
        const nextQuestionIndex = currentQuestionIndex !== questions.length - 1 ? currentQuestionIndex + 1 : 0;
        const nextQuestion = questions[nextQuestionIndex];
        const nextCorrectAnswer = nextQuestion.correct_answer;
        const nextChoices = [...nextQuestion.incorrect_answers, nextCorrectAnswer];

        // update state with the next question and choices
        setCurrentQuestion(nextQuestion.question);
        setCorrectAnswer(nextCorrectAnswer);
        setChoices(shuffleArray(nextChoices));
    };

    // restart game
    const onCreateNewGame = () => {
        setScore(resultInitialState);
        setShowFinalScore(false);
    };

    const handleTimeUp = () => {
        setAnswer(false);
        onClickNext(false);
    }

    // add to leaderboard
    const handleAddToLeaderboard = () => {
        setShowMain(true);
        setShowModal(false); // close the modal
        const difficultyCapitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

        const body = {
            name: username,
            score: score.points,
            difficulty: difficultyCapitalized,
            num_questions: parseInt(amount),
            timer_seconds: parseInt(timerDuration),
            categories: category,
        };

        setResponseData(body);
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <div className="quiz-container">
                {!showFinalScore ? ( 
                <>
                    {showAnswerTimer && <AnswerTimer duration={timerDuration} onTimeUp={handleTimeUp} />} 
                    <div className="quiz-card">
                        <div className="questions-length-container">
                            <span className="active-question-num">{currentQuestionIndex + 1}</span>
                            <span className="total-question-num">/{questions.length}</span>
                            <span className="score">score: {score.points}</span>
                        </div>
                        <h2 dangerouslySetInnerHTML={{__html: currentQuestion}}></h2>
                        <div className="answers-container mb-3">
                            <ul>
                                {
                                    choices.map((answer, index) => (
                                        <li
                                            onClick={() => onAnswerClick(answer, index)}
                                            key={answer}
                                            className={selectedAnswerIndex === index ? 'selected-answer' : null}
                                            >
                                                <span dangerouslySetInnerHTML={{__html: answer}}></span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="footer">
                            <Button 
                                className="next-button"
                                onClick={() => onClickNext(answer)}
                                disabled={selectedAnswerIndex === null}
                            >
                                {currentQuestionIndex === questions.length - 1 ? "finish" : "next"}  
                            </Button>
                        </div>
                    </div>
                </>) : <div className="results-container">
                        <div className="results-card">
                            <div className="row">
                            <ScoreIndicator score={score} numQuestions={questions.length}></ScoreIndicator>
                                <div className="results-buttons">
                                    <Button className="col-3 next-button new-game-button" onClick={onPlayNewGame}>
                                        new game
                                    </Button>
                                    <div className="col-3 divider"/>
                                    <Button className="next-button" onClick={onCreateNewGame}>
                                        play again
                                    </Button>
                                    <div className="w-100"></div>
                                    <Button className="col-3 next-button add-button" onClick={handleShow}>
                                        add to leaderboard
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
            <div className="modal-container">
                <Modal show={showModal} onHide={handleClose} dialogClassName="my-modal">
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control 
                                    placeholder="enter your name..."
                                    onChange={(event) => setUsername(event.target.value)}
                                    maxLength={15}
                                    isInvalid={!username}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} className="close-button">
                            close
                        </Button>
                        <Button variant="primary" onClick={handleAddToLeaderboard}>
                            add score
                        </Button>
                        {showMain && <AddToLeaderboard data={responseData}/>}
                    </Modal.Footer>
                </Modal>  
            </div>  
        </div>
        
    );
}

export default Quiz;