import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const AddToLeaderboard = ({ data }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const postData = async () => {

        const newEntry = {
            name: data.name,
            score: data.score,
            difficulty: data.difficulty,
            num_questions: data.num_questions,
            timer_seconds: data.timer_seconds,
            categories: data.categories
        };

        console.log(JSON.stringify(newEntry));
        
        try {
            const response = await fetch(`${apiUrl}/api/leaderboard/add`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) {
                navigate("/");
            }

            const data = await response.json();
            console.log(data);

            // if success, navigate to "/leaderboard"
            navigate("/leaderboard");

        } catch (error) {
            console.error(error.message);
        }
    };

    // call postData when component mounts
    useEffect(() => {
        postData();
    }, []);
}

export default AddToLeaderboard;
