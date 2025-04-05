import React from 'react';
import { Link } from 'react-router-dom';
import './landingpage.css';

export function HomeProject() {
    const projects = [
        {
            id: 1,
            title: "InterviewAIde",
            description: "An AI-driven platform that generates interview questions, analyzes CVs, and provides feedback, enhancing your interview process",
            image: "/media/projects/interviewaide.png",
            tags: ["Python", "Flask", "Groq"],
            link: "/projects/ai-chatbot"
        },
        {
            id: 2,
            title: "Academic Management Portal",
            description: "A web-based system that simplifies academic data management with dashboards for students, lecturers, and administrators, offering features like attendance tracking, marks management, and analytics.",
            image: "/media/projects/AMP.png",
            tags: ["Node.js", "Express.js", "MongoDB"],
            link: "/projects/ecommerce"
        },
        {
            id: 3,
            title: "BuddyWay",
            description: "A real-time location sharing app that lets users create sessions, share live locations, and navigate to each other's positions. It features interactive maps, session management, and automatic reconnection.",
            image: "/media/projects/buddyway.png",
            tags: ["Node.js", "Leaflet.js", "Socket.io"],
            link: "/projects/portfolio"
        }
    ];

    return (
        <section className="home-projects-section">
            <div className="section-header">
                <h2 className="section-title">Featured Projects</h2>
                <Link to="/projects" className="view-all-link">
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                    </svg>
                </Link>
            </div>
            <div className="projects-grid">
                {projects.map(project => (
                    <div className="project-card" key={project.id}>
                        <div className="project-image">
                            <img src={project.image} alt={project.title} />
                        </div>
                        <div className="project-content">
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <div className="project-tags">
                                {project.tags.map((tag, index) => (
                                    <span className="project-tag" key={index}>{tag}</span>
                                ))}
                            </div>
                            <Link to={project.link} className="project-link">
                                View Project
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}