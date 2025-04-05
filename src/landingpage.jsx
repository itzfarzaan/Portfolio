import './landingpage.css';
import { ReactTyped } from "react-typed";
import { Tooltip, Resume } from "./Contactme.jsx";

function LandingPage(){
    return <>
        <AboutMe />
        <Description />
        <Skills />
    </>
}

function AboutMe(){
    const titles = [
        'Mohammed Farzaan Ali',
        'Fullstack Developer',
    ];

    return(
        <section className="about-me-section">
            <div className="profile-image-container">
                <img src="/media/Picture2.png" alt="Mohammed Farzaan Ali" className="profile-image" />
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
        </section>
    );
}

function Description(){
    return(
        <section className="description-section">
            <div className="description-content">
                <div className="description-header">
                    <h2 className="section-title">About Me</h2>
                </div>
                <div className="description-paragraphs">
                    <p className="description-text">
                    I am a 20-year-old developer from Hyderabad, India, pursuing my Bachelor's in Artificial Intelligence and Machine Learning. I'm passionate about creating technology that solves real-world problems while being accessible to everyone. 
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
            <div className="skills-content">
                <div className="skills-header">
                    <h2 className="section-title">Skills</h2>
                </div>
                {/* <div className="skills-paragraphs">
                    <p className="skills-text">
                        I have expertise in a variety of programming languages and technologies, including:
                    </p>
                </div> */}
                <div className="skills-grid">
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

export default LandingPage;