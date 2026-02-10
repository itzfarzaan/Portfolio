import React from 'react';
import { useScrollAnimation } from './utils/animationUtils';
import './landingpage.css';

export function Experiences() {
  const [ref, isVisible] = useScrollAnimation();
  
  const experiences = [
    {
      role: "Full-Stack Developer Intern",
      company: "Tech Innovators Inc.",
      duration: "June 2024 - Present",
      description: "Developed full-stack applications using React, Node.js, and MongoDB. Collaborated in agile environment to deliver client projects on time."
    },
    {
      role: "AI/ML Student Developer",
      company: "University AI Lab",
      duration: "Jan 2024 - May 2024",
      description: "Built machine learning models for predictive analytics. Worked with TensorFlow and PyTorch on real-world datasets."
    },
    {
      role: "Freelance Web Developer",
      company: "Various Clients",
      duration: "2023 - Present",
      description: "Created custom websites and web apps for small businesses and individuals using modern web technologies."
    }
  ];

  return (
    <section className="experiences-section">
      <div ref={ref} className={`experiences-content fade-in-section ${isVisible ? 'is-visible' : ''}`}>
        <div className="experiences-header">
          <h2 className="section-title">// My Experiences</h2>
        </div>
        <div className={`experiences-grid stagger-children ${isVisible ? 'is-visible' : ''}`}>
          {experiences.map((exp, index) => (
            <div className="experience-card" key={index}>
              <h3 className="experience-role">{exp.role}</h3>
              <p className="experience-company">{exp.company}</p>
              <p className="experience-duration">{exp.duration}</p>
              <p className="experience-description">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}