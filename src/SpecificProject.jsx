import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from './config/api';
import { setDocumentTitle } from './utils/titleUtils';

function SpecificProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/${id}`);
        
        if (!response.ok) {
          throw new Error('Project not found');
        }
        
        const data = await response.json();
        setProject(data.project);
        
        // Set the page title with the project title
        if (data.project && data.project.title) {
          setDocumentTitle(`Project - ${data.project.title}`);
        } else {
          setDocumentTitle('Project Details');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. It may have been removed or is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <LoadingContainer>Loading project details...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!project) {
    return <ErrorContainer>Project not found</ErrorContainer>;
  }

  return (
    <ProjectContainer>
      <BackLink to="/projects">← Back to Projects</BackLink>
      
      <ProjectHeader>
        <ProjectTitle>{project.title}</ProjectTitle>
        <TechStack>
          {project.technologies.map((tech, index) => (
            <TechTag key={index}>{tech}</TechTag>
          ))}
        </TechStack>
        
        <ProjectLinks>
          {project.githubUrl && (
            <ExternalLink href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-code-branch"></i> GitHub
            </ExternalLink>
          )}
          {project.liveUrl && (
            <ExternalLink href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-external-link-alt"></i> Live Demo
            </ExternalLink>
          )}
        </ProjectLinks>
      </ProjectHeader>
      
      <ProjectDescription dangerouslySetInnerHTML={{ __html: project.description }} />
      
      {project.videoUrl && (
        <VideoContainer>
          <h3>Project Demo</h3>
          <ProjectVideo 
            src={project.videoUrl} 
            controls 
            preload="metadata"
          />
        </VideoContainer>
      )}
    </ProjectContainer>
  );
}

// Styled Components
const ProjectContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
  font-family: 'Sen', sans-serif;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  color: #5eeae3;
  text-decoration: none;
  font-size: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(-5px);
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProjectTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #5eeae3;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TechTag = styled.span`
  background-color: #042b2f;
  color: #5eeae3;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ProjectDescription = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  h2, h3 {
    color: #5eeae3;
    margin: 1.5rem 0 1rem;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #5eeae3;
    text-decoration: underline;
  }
`;

const VideoContainer = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: #5eeae3;
    margin-bottom: 1rem;
  }
`;

const ProjectVideo = styled.video`
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
  background-color: #104042;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background-color: transparent;
  color: #5eeae3;
  border: 1px solid #5eeae3;
  border-radius: 4px;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
  
  i {
    margin-right: 0.4rem;
    font-size: 0.8rem;
  }
  
  &:hover {
    background-color: rgba(94, 234, 227, 0.1);
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #5eeae3;
  padding: 2rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #ff6b6b;
  text-align: left;
  padding: 2rem;
`;

export default SpecificProject;
