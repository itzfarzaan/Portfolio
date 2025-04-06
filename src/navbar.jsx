import { Link } from 'react-router-dom';
import './navbar.css';
import { useState, useEffect, useRef } from 'react';

function Navbar(){
    const [menuActive, setMenuActive] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    
    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuActive && 
                menuRef.current && 
                !menuRef.current.contains(event.target) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target)) {
                setMenuActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuActive]);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src="/media/logo2.png" alt="Farzaan Ali Logo" className="logo-image" />
                </Link>
            </div>
            <button 
                className="mobile-menu-button" 
                onClick={toggleMenu} 
                aria-label="Toggle menu"
                ref={buttonRef}
            >
                <span className="hamburger-icon">
                    <span className={`hamburger-line ${menuActive ? 'active' : ''}`}></span>
                    <span className={`hamburger-line ${menuActive ? 'active' : ''}`}></span>
                    <span className={`hamburger-line ${menuActive ? 'active' : ''}`}></span>
                </span>
            </button>
            <div 
                className={`navbar-links ${menuActive ? 'active' : ''}`}
                ref={menuRef}
            >
                <Link to="/" className="nav-link" onClick={() => setMenuActive(false)}>Home</Link>
                <Link to="/projects" className="nav-link" onClick={() => setMenuActive(false)}>Projects</Link>
                <Link to="/blog" className="nav-link" onClick={() => setMenuActive(false)}>Blog</Link>
            </div>
        </nav>
    );
}

export default Navbar;