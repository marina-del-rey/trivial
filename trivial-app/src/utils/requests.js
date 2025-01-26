import { shuffleArray } from './utils';
import axios from 'axios'

const BASE_URL = 'https://opentdb.com/api.php'
const CATEGORY_URL = 'https://opentdb.com/api_category.php';
const MAX_RETRIES = 5; // max number of retries
const RETRY_DELAY = 5000; // delay between retries in milliseconds

let cachedCategories = null;

export const difficulties = ['easy', 'medium', 'hard']

export const getQuestions = async ({ category, difficulty, amount }) => {
    let questions = [];
    let retries = 0;
    const initialDelay = 5000;
    const delayBetweenRequests = 5000; // 5 second delay
    const categories = category.split(',').map(cat => cat.trim());

    await new Promise(resolve => setTimeout(resolve, initialDelay));

    // make request for each category
    for (const [index, cat] of categories.entries()) {
        let success = false;
        while (!success && retries < MAX_RETRIES) {
            try {
                const response = await axios.get(`${BASE_URL}?amount=${amount}&type=multiple&difficulty=${difficulty}&category=${cat}`);
                const data = await response.data;
                questions.push(...data.results);
                success = true;
                console.log(...data.results);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    retries++;
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                } else {
                    throw error;
                }
            }
        }

        // check if it's not the last category to avoid unnecessary delay after the last request
        if (index !== categories.length - 1) {
            // wait for the specified delay before making the next request
            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
    }

    if (retries === MAX_RETRIES) {
        throw new Error(`Maximum number of retries (${MAX_RETRIES}) exceeded.`);
    }

    if (questions.length === 0) {
        throw new Error("Not enough questions in category.");
    }

    questions = shuffleArray(questions);
    console.log(questions);
    console.log(questions.slice(0, amount));
    return questions.slice(0, amount);
}


// gets categories
export const getCategories = () => {
    if (cachedCategories) {
        return Promise.resolve(cachedCategories);
    } else {
        return axios.get(CATEGORY_URL)
            .then(response => {
                const triviaCategories = response.data.trivia_categories;
                const categoriesArray = triviaCategories.map(category => {
                    let categoryName = category.name;
                    // remove prefixes like "Entertainment: " or "Science: "
                    categoryName = categoryName.split(': ')[1] || categoryName;
                    return {
                        label: categoryName,
                        value: category.id
                    };
                });
                // sort categoriesArray by alphabetical order
                categoriesArray.sort((a, b) => a.label.localeCompare(b.label));
                cachedCategories = categoriesArray;
                return categoriesArray;
            })
            .catch(error => {
                console.error('[ error fetching categories ]\n', error);
                return []; // return empty array in case of error
            });
    }
}
