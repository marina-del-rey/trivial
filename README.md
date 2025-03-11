# Trivial
Trivial is a customizable quiz app built with React and Node.js. It allows users to test their knowledge across various topics, track their performance, and add their results to a leaderboard.

## Features
- Customizable quizzes: Choose categories, difficulty, questions, and timer.
- Timed gameplay with visual progress indicators.
- Performance tracking with a detailed score breakdown.
- Leaderboard to compete with others.
- Responsive design for all devices.

## Installation & Setup

### Prerequisites  
Make sure you have the following installed:  
- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (package manager)
- [SQLite3](https://www.sqlite.org/download.html) (for database management)  

### 1. Clone the repository  
```bash
git clone https://github.com/marina-del-rey/trivial.git
cd trivial
```

### 2. Install dependencies
#### Frontend
```bash
cd trivial-app
npm install
```
or, if using yarn
```bash
yarn install
```

#### Backend
```bash
cd ../leaderboard-api
npm install
```

## Frontend Environment Variables
Inside the `trivial-app/` folder, create a `.env` file:
```bash
cd trivial-app
touch .env
```
Then add:
```bash
VITE_API_URL=http://localhost:3001
```
Replace ```http://localhost:3001``` with a different backend URL if necessary.



## Database Setup (SQLite3)
Trivial uses an SQLite3 database for storing leaderboard scores. The database file is located in `leaderboard-api/data/leaderboard.db`
If you need to create a new database manually, run:
### 1. Install SQLite3
```bash
sudo apt install sqlite3  # Debian/Ubuntu  
brew install sqlite3       # macOS
```

### 2. Create the database (if missing)
If `leaderboard-api/data/leaderboard.db` doesn’t exist, create it manually:
```
mkdir -p leaderboard-api/data
sqlite3 leaderboard-api/data/leaderboard.db
```
Inside the SQLite shell, enter the following SQL commands to create the necessary tables:
#### Leaderboard table
```sql
CREATE TABLE leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    num_questions INTEGER NOT NULL,
    timestamp TEXT DEFAULT (strftime('%d-%m-%Y %H:%M', 'now', 'localtime')),
    timer_seconds INTEGER
);
```

#### Categories table
This table must be pre-filled because categories are fixed and match the public API.
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL
);
```
Insert the predefined categories:
```sql
INSERT INTO categories (category_name) VALUES
    ('General Knowledge'),
    ('Books'),
    ('Film'),
    ('Music'),
    ('Video Games'),
    ('Science & Nature'),
    ('Computers'),
    ('Mathematics'),
    ('Mythology'),
    ('Sports'),
    ('Geography'),
    ('History'),
    ('Politics'),
    ('Art'),
    ('Celebrities'),
    ('Animals'),
    ('Vehicles'),
    ('Comics'),
    ('Gadgets'),
    ('Japanese Anime & Manga'),
    ('Cartoon & Animations');
```
#### Leaderboard categories table (relationships)
```sql
CREATE TABLE leaderboard_categories (
    leaderboard_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY (leaderboard_id) REFERENCES leaderboard(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    PRIMARY KEY (leaderboard_id, category_id)
);
```

## Running the project
### 1. Start the backend
Inside the `leaderboard-api` folder, run:
```bash
npm start
```
### 2. Start the frontend
Open a new terminal, navigate to the ```trivial-app``` folder, and run:
```bash
npm run dev
```









