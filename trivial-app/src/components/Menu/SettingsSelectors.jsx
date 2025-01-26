import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { difficulties, getCategories } from '../../utils/requests';
import { useNavigate } from 'react-router-dom';
import Quiz from '../Quiz/Quiz';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './SettingsSelector.scss';

export default function SettingsSelectors() {
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState(0);
  const [difficulty, setDifficulty] = useState('');
  const [timerAmount, setTimerAmount] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [quizSettings, setQuizSettings] = useState(null); 
  const [allOptionsSelected, setAllOptionsSelected] = useState(false); 

  const animatedComponents = makeAnimated();

  // fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('[ error fetching categories ]\n', error);
      }
    };
    fetchCategories();
  }, []); 


  // categories and difficulty lists transformed to react selector format 
  const transformedCategories = categories.map(category => ({
    value: category.value,
    label: category.label
  }));

  const transformedDifficulties = difficulties.map(difficulty => ({
    value: difficulty,
    label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) // capitalize first letter
  }));

  // setters for updating settings values 
  const setAmountOfGames = (event) => {
    //console.log(event.target.value); // DEBUG
    setAmount(event.target.value);
  };

  const setQuestionTimerAmount = (event) => {
    setTimerAmount(event.target.value);
  };

  const updateSelectedCategory = (selectedOptions) => {
    //console.log(selectedOptions); // DEBUG
    setSelectedCategories(selectedOptions || []); 
  };

  const setSelectedDifficulty = (selectedOption) => {
    //console.log(selectedOption); // DEBUG
    setDifficulty(selectedOption);
  };

  // start quiz
  let navigate = useNavigate();
  const handleStartQuiz = () => {
    setQuizSettings({
      category: selectedCategories.map(category => category.value),
      difficulty: difficulty.value,
      amount: amount,
      timerAmount: timerAmount
    });
    const category = selectedCategories.map(category => category.value);
    navigate(`/quiz/${category}/${difficulty.value}/${amount}/${timerAmount}`); // change after so its in the func args
  };

  // custom styling for react-select component
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      boxShadow: state.isFocused ? "0 0 0 1.5px rgb(36,36,51,1)" : "none", 
      "&:focus-within": {
        //borderColor: "hsl(0, 0%, 80%)",
        boxShadow: "0 0 0 0.25rem rgba(13,110,253,.25)",
        outline: "none",
        borderColor: "hsl(0, 0%, 70%)"
      }
    }),
  };

  useEffect(() => {
    // check if all options are selected and amount is in correct bounds
    if ((timerAmount >= 1 && timerAmount <= 120)  && (amount >= 1 && amount <= 20)  && selectedCategories.length > 0 && difficulty !== '') {
      setAllOptionsSelected(true);
    } else {
      setAllOptionsSelected(false);
    }
  }, [amount, selectedCategories, difficulty, timerAmount]);


  return (
    <div className='settings-container'>
      <div className='inputs-container'>

        {/* timer */}
        <Form.Group controlId="formTimerAmount" className="amount-form">
          <Form.Control 
            type="number"
            placeholder="Enter question duration (1s-120s)"
            value={timerAmount || ''}
            min={1}
            max={120}
            onChange={setQuestionTimerAmount}
            className="mb-3 amount-form"
            isInvalid={timerAmount != '' && !(timerAmount >= 1 && timerAmount <= 120)}
            />

        </Form.Group>

        {/* amount of questions */}
        <Form.Group controlId="formAmount" className="amount-form">
          <Form.Control 
            type="number"
            placeholder="Enter amount of questions (1-20)"
            value={amount || ''}
            onChange={setAmountOfGames}
            min={1}
            max={20}
            className="mb-3 amount-form"
            isInvalid={amount != '' && !(amount >= 1 && amount <= 20)}
            />
        </Form.Group>

        {/* categories */}
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          defaultValue={[]}
          isMulti
          options={transformedCategories}
          placeholder="Choose categories..." 
          onChange={updateSelectedCategory} 
          className="mb-3 select-form"
          styles={customStyles}
        />

        {/* difficulty */}
        <Select
          defaultValue={[]}
          options={transformedDifficulties}
          onChange={setSelectedDifficulty}
          placeholder="Choose difficulty..." 
          className="mb-3 select-form"
          styles={customStyles}
        />
      </div>

      <div className="ready-button-container">
        <Button 
          className="ready-button" 
          onClick={handleStartQuiz}
          disabled={!allOptionsSelected} // disable button if not all options are selected
        >
          start
        </Button> 
      </div>
      
      {/* render Quiz component if quizSettings is set */}
      {quizSettings && (
        <Quiz />
      )}

    </div>
  );
}