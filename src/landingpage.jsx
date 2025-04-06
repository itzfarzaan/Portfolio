import './landingpage.css';
import { ReactTyped } from "react-typed";
import { Tooltip, Resume } from "./Contactme.jsx";
import { Link } from "react-router-dom";
import {HomeProject} from "./homeproject.jsx";
import { useState, useEffect } from 'react';
import { setDocumentTitle } from './utils/titleUtils';
import { useScrollAnimation } from './utils/animationUtils';

function LandingPage(){
    useEffect(() => {
        setDocumentTitle('Home');
    }, []);
    
    return <>
        <AboutMe />
        <Description />
        <Skills />
        <MobileBlog />
        <HomeProject />
    </>
}

function AboutMe(){
    const titles = [
        'Mohammed Farzaan Ali',
        'Fullstack Developer',
        'AI/ML Engineer',
    ];
    
    const [imageLoaded, setImageLoaded] = useState(false);

    return(
        <section className="about-me-section">
            <div className="profile-image-container">
                {!imageLoaded && <div className="image-loader"></div>}
                <img 
                    src="/media/Picture2.png" 
                    alt="Mohammed Farzaan Ali" 
                    className={`profile-image ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <div className="about-me-content">
                <p className="greeting">Hey there! I'm-</p>
                <h1 className="name">
                    <ReactTyped
                        strings={titles}
                        typeSpeed={80}
                        backSpeed={50}
                        backDelay={1500}
                        loop
                        smartBackspace
                    />
                </h1>
                <div className="social-buttons">
                    <Tooltip />
                    <Resume />
                </div>
            </div>
            
            {/* Scroll Down Indicator */}
            <div className="scroll-indicator">
                <div className="scroll-text">Scroll Down</div>
                <div className="scroll-arrows">
                    <div className="scroll-arrow"></div>
                    <div className="scroll-arrow"></div>
                    <div className="scroll-arrow"></div>
                </div>
            </div>
        </section>
    );
}

function Description(){
    const [ref, isVisible] = useScrollAnimation();
    
    return(
        <section className="description-section">
            <div ref={ref} className={`description-content fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                <div className="description-header">
                    <h2 className="section-title">// About</h2>
                </div>
                <div className="description-paragraphs">
                    <p className="description-text">
                    I am a 20-year-old developer from Hyderabad, India, pursuing my Bachelor's in <span className="highlight-text">Artificial Intelligence</span> and <span className="highlight-text">Machine Learning</span>. I'm passionate about creating technology that solves real-world problems while being accessible to everyone. 
                    </p>
                    <p className="description-text">
                    I believe in technology that makes life better and easier for people Still figuring out exactly where I'm headed in this vast tech landscape, but I'm enjoying the journey—complete with its late-night debugging sessions and those rare perfect moments when everything just works. Always up for interesting conversations or collaborating on something new!
                    </p>
                </div>
            </div>
        </section>
    )
}

function Skills() {
    const [ref, isVisible] = useScrollAnimation();
    
    const skillsData = [
        { name: 'Python', logo: '/media/python-logo.png' },
        { name: 'JavaScript', logo: '/media/javascript-logo.png' },
        { name: 'C', logo: '/media/C-logo.png' },
        { name: 'Node.js', logo: '/media/nodejs-logo.png' },
        { name: 'HTML5', logo: '/media/html5-logo.png' },
        { name: 'React', logo: '/media/react.png' },
        { name: 'CSS3', logo: '/media/css3-logo.png' },
        { name: 'MongoDB', logo: '/media/mongodb-logo.png' },
        { name: 'Git', logo: '/media/git-logo.png' },  
    ];

    return (
        <section className="skills-section">
            <div ref={ref} className={`skills-content fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                <div className="skills-header">
                    <h2 className="section-title">// Skills</h2>
                </div>
                {/* <div className="skills-paragraphs">
                    <p className="skills-text">
                        I have expertise in a variety of programming languages and technologies, including:
                    </p>
                </div> */}
                <div className={`skills-grid stagger-children ${isVisible ? 'is-visible' : ''}`}>
                    {skillsData.map((skill, index) => (
                        <div className="skill-card" key={index}>
                            <div className="skill-logo-container">
                                <img src={skill.logo} alt={`${skill.name} logo`} className="skill-logo" />
                            </div>
                            <p className="skill-name">{skill.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MobileBlog(){
    return(
        <section className="mobile-blog-section">
            <div className="mobile-blog-card">
                <div className="card-content">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                            <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                    </div>
                    <div className="card-text">
                        <h3>Check out my Blog</h3>
                        <p>Thoughts, tutorials, and tech insights</p>
                    </div>
                </div>
                <Link to="/blog" className="card-button">
                    <span>Read Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                    </svg>
                </Link>
            </div>
        </section>
    );
}

export default LandingPage;