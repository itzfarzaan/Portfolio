import { Link } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';

function Navbar(){
    const [menuActive, setMenuActive] = useState(false);
    
    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Farzaan Ali</Link>
            </div>
            <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
                <span className="hamburger-icon">
                    <span className={`hamburger-line ${menuActive ? 'active' : ''}`}></span>
                    <span className={`hamburger-line ${menuActive ? 'active' : ''}`}></span>
                    <span className={`hamburger-line ${menuActive ? 'active' : ''}`}></span>
                </span>
            </button>
            <div className={`navbar-links ${menuActive ? 'active' : ''}`}>
                <Link to="/" className="nav-link" onClick={() => setMenuActive(false)}>Home</Link>
                <Link to="/projects" className="nav-link" onClick={() => setMenuActive(false)}>Projects</Link>
                <Link to="/blog" className="nav-link" onClick={() => setMenuActive(false)}>Blog</Link>
            </div>
        </nav>
    );
}

export default Navbar;