import { useState, useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import './Leaderboard.scss';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const apiUrl = import.meta.env.VITE_API_URL;

    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>,
        );
    }

    useEffect(() => {
        // fetch leaderboard data from the API
        fetch(`${apiUrl}/api/leaderboard`) 
            .then(response => response.json())
            .then(data => setLeaderboardData(data))
            .catch(error => console.error('Error fetching leaderboard data:', error));
    }, []); 

    console.log(leaderboardData);

    return (
        <div className="leaderboard-container">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Difficulty</th>
                        <th>Categories</th>
                        <th>Time</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(entry => (
                        <tr key={entry.id}>
                            <td>{entry.name}</td>
                            <td>{entry.score}/{entry.num_questions * 5}</td>
                            <td>{entry.difficulty}</td>
                            <td>{entry.categories}</td>
                            <td>{entry.timer_seconds}</td>
                            <td>{entry.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="pagination-container">
                <Pagination>
                    <Pagination.Prev onClick={() => currentPage > 1 && paginate(currentPage - 1)} />
                    {paginationItems}
                    <Pagination.Next onClick={() => currentPage < totalPages && paginate(currentPage + 1)} />
                </Pagination>
            </div>
        </div>
    );
};

export default Leaderboard;
