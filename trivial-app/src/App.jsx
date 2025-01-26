import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { renderToStaticMarkup } from "react-dom/server";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Menu from './components/Menu/Menu';
import Quiz from './components/Quiz/Quiz';
import StarburstBackground from "./components/Menu/StarburstBackground";
import CatMascot from "./assets/cat_mascot.png"; 
import './App.css';


const App = () =>  {
  
  const svgString = encodeURIComponent(
    renderToStaticMarkup(<StarburstBackground />)
  );

  return (
    <div 
      className="background-container"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svgString}")`, 
      }}
    >
      <div className="vignette">
        <Navbar className="navbar" expand={false}>
          <div className="container-fluid">
            <Navbar.Brand className="title">Trivial</Navbar.Brand>
              <Nav.Link className="nav-link home-tab" href="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Nav.Link>
              <Nav.Link className="nav-link leaderboard-tab" href="/leaderboard">
                <FontAwesomeIcon icon={faTrophy} /> Leaderboard
              </Nav.Link>
            </div>
        </Navbar>

        <Router>
          <Routes>
            <Route path="/" element={<Menu />}/>
            <Route path="/quiz/:category/:difficulty/:amount/:timerDuration" element={<Quiz />}/>
            <Route path="/leaderboard" element={<Leaderboard />}/>
          </Routes>
          <img src={CatMascot} alt="mascot" className="mascot-photo" />
        </Router>
      </div>
  </div>
  )
}

export default App;
