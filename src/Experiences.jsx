import { useScrollAnimation } from './utils/animationUtils';
import './landingpage.css';

export function Experiences() {
  const [ref, isVisible] = useScrollAnimation();
  
  const experiences = [
    {
      role: "Software Engineer",
      company: "Maisam Properties",
      location: "Remote, United Arab Emirates",
      duration: "May 2025 - Present",
      highlights: [
        "Leading end-to-end development of a custom property management system, from architecture and database design through full-stack implementation.",
        "Designing four role-based user modules for managers, owners, tenants, and vendors with React, Node.js, Express, Supabase, and PostgreSQL."
      ]
    },
    {
      role: "Machine Learning Engineer Intern",
      company: "Artmac Soft",
      location: "Hyderabad, India",
      duration: "Oct 2024 - Feb 2025",
      highlights: [
        "Built a data augmentation pipeline with OpenCV and Pillow for roughly 20,000 images, then optimized MobileNetV2 in PyTorch to reach 88.35% accuracy.",
        "Fine-tuned hyperparameters with learning rate schedulers to improve model performance and training efficiency."
      ]
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
              <p className="experience-location">{exp.location}</p>
              <p className="experience-duration">{exp.duration}</p>
              <ul className="experience-highlights">
                {exp.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
