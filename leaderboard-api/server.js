const cors = require('cors');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;
const db = new sqlite3.Database('./leaderboard.db');

app.use(cors()); // cors middleware
app.use(express.json()); // middleware to parse JSON requests

// api routes
// test route
app.get("/", (req, res) => {
    res.json({ message: "leaderboard api is up and running!" });
});

// add new entry to leaderboard
app.post('/api/leaderboard/add', (req, res) => {
    const newEntry = req.body;
    // insert into table
    db.run(`INSERT INTO leaderboard (name, score, difficulty, num_questions, timer_seconds) VALUES (?, ?, ?, ?, ?)`,
        [newEntry.name, newEntry.score, newEntry.difficulty, newEntry.num_questions, newEntry.timer_seconds],
        function (error) {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'failed to add entry to leaderboard!' });
            }

            const leaderboardId = this.lastID;
            console.log(leaderboardId);
            newEntry.categories.split(',').forEach(categoryId => {
                db.run(`INSERT INTO leaderboard_categories (leaderboard_id, category_id) VALUES (?, ?)`,
                    [leaderboardId, categoryId],
                    function (err) {
                        if (err) {
                            console.error(err.message);
                            return res.status(500).json({ error: 'failed to associate categories with entry in table! ' });
                        }
                    }
                );
            });
            // success message
            res.status(200).json({ message: 'leaderboard entry added successfully!' });
        }
    );
});


// fetch leaderboard data
app.get('/api/leaderboard', (req, res) => {
    db.all(`SELECT l.*, GROUP_CONCAT(c.category_name) AS categories
            FROM leaderboard l
            JOIN leaderboard_categories lc ON l.id = lc.leaderboard_id
            JOIN categories c ON lc.category_id = c.id
            GROUP BY l.id`, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'error fetching leaderboard data' });
        }
        // success message with data
        res.status(200).json(rows);
    });
});


// set port/listen for requests
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
});