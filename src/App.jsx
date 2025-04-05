import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar.jsx';
import LandingPage from './landingpage.jsx';
import Footer from './Footer.jsx';

function App() {

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage/>}></Route>
          </Routes>
          <Footer />
        </Router>
      </div>
    </div>
  )
}

export default App
