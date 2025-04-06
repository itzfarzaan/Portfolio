import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from './config/api';
import { setDocumentTitle } from './utils/titleUtils';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setDocumentTitle('Projects');
        
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/projects`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                
                const data = await response.json();
                setProjects(data.projects || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <ProjectsContainer>
            <ProjectsHeader>
                <h1>My Projects</h1>
                <p>Here are some of the technical projects I've worked on</p>
            </ProjectsHeader>

            {loading ? (
                <LoadingMessage>Loading projects...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : projects.length === 0 ? (
                <NoProjectsMessage>
                    <h2>Coming Soon</h2>
                    <p>I'm working on adding my projects. Check back later!</p>
                </NoProjectsMessage>
            ) : (
                <ProjectGrid>
                    {projects.map(project => (
                        <ProjectCard key={project._id}>
                            {project.imageUrl && (
                                <ProjectImage src={project.imageUrl} alt={project.title} />
                            )}
                            <ProjectContent>
                                <ProjectTitle>{project.title}</ProjectTitle>
                                <ProjectDescription>
                                    {project.summary 
                                        ? (project.summary.length > 150 
                                            ? `${project.summary.replace(/<[^>]*>/g, '').substring(0, 150)}...` 
                                            : project.summary.replace(/<[^>]*>/g, ''))
                                        : (project.description && project.description.length > 150 
                                            ? `${project.description.replace(/<[^>]*>/g, '').substring(0, 150)}...` 
                                            : (project.description ? project.description.replace(/<[^>]*>/g, '') : "No description available."))}
                                </ProjectDescription>
                                <TechStack>
                                    {project.technologies.map((tech, index) => (
                                        <TechTag key={index}>{tech}</TechTag>
                                    ))}
                                </TechStack>
                                <ProjectLinks>
                                    <ViewDetailsLink to={`/projects/${project._id}`}>
                                        View Details
                                    </ViewDetailsLink>
                                    {project.githubUrl && (
                                        <ExternalLink href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                            GitHub
                                        </ExternalLink>
                                    )}
                                    {project.liveUrl && (
                                        <ExternalLink href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                            Live Demo
                                        </ExternalLink>
                                    )}
                                </ProjectLinks>
                            </ProjectContent>
                        </ProjectCard>
                    ))}
                </ProjectGrid>
            )}
        </ProjectsContainer>
    );
}

// Styled Components
const ProjectsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Sen', sans-serif;
    color: #fff;
    
    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const ProjectsHeader = styled.div`
    margin-bottom: 2rem;
    text-align: center;
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        color: #5eeae3;
    }
    
    p {
        font-size: 1.1rem;
        opacity: 0.9;
    }
`;

const ProjectGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ProjectCard = styled.div`
    background-color: #104042;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const ProjectImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const ProjectContent = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const ProjectTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #5eeae3;
`;

const ProjectDescription = styled.p`
    margin-bottom: 1rem;
    line-height: 1.5;
    flex-grow: 1;
`;

const TechStack = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
    background-color: #042b2f;
    color: #5eeae3;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
`;

const ProjectLinks = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: auto;
`;

const ViewDetailsLink = styled(Link)`
    background-color: #042b2f;
    color: #5eeae3;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: inline-block;
    border: 1px solid #5eeae3;
    
    &:hover {
        background-color: #5eeae3;
        color: #042b2f;
    }
`;

const ExternalLink = styled.a`
    background-color: transparent;
    color: #5eeae3;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: inline-block;
    border: 1px solid #5eeae3;
    
    &:hover {
        background-color: #5eeae3;
        color: #042b2f;
    }
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 3rem;
    color: #ff6b6b;
    font-size: 1.2rem;
`;

const NoProjectsMessage = styled.div`
    text-align: center;
    padding: 3rem;
    
    h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #5eeae3;
    }
    
    p {
        font-size: 1.2rem;
        opacity: 0.8;
    }
`;

export default Projects;