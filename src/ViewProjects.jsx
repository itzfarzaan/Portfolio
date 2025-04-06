import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from './config/api';

function ViewProjects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
        };

        verifyAuth();
        fetchProjects();
    }, [navigate]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication required');
                return;
            }
            
            const response = await fetch(`${API_URL}/admin/projects`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
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

    const handleDeleteProject = async (project) => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication required');
                return;
            }
            
            console.log('Deleting project with ID:', project._id);
            
            const response = await fetch(`${API_URL}/admin/projects/${project._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Delete response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Delete error data:', errorData);
                throw new Error(`Failed to delete project: ${errorData.message || response.statusText}`);
            }
            
            // Remove the deleted project from the state
            setProjects(projects.filter(item => item._id !== project._id));
            
            // Show success message
            setMessage({
                text: 'Project deleted successfully',
                type: 'success'
            });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
            
        } catch (err) {
            console.error('Error deleting project:', err);
            setMessage({
                text: `Failed to delete project: ${err.message}`,
                type: 'error'
            });
        }
    };

    const toggleFeatured = async (project) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication required');
                return;
            }
            
            const response = await fetch(`${API_URL}/admin/projects/${project._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    featured: !project.featured
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update project');
            }
            
            // Update the project in the state
            setProjects(projects.map(p => 
                p._id === project._id ? { ...p, featured: !p.featured } : p
            ));
            
            // Show success message
            setMessage({
                text: `Project ${!project.featured ? 'featured' : 'unfeatured'} successfully`,
                type: 'success'
            });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
            
        } catch (err) {
            console.error('Error updating project:', err);
            setMessage({
                text: 'Failed to update project. Please try again.',
                type: 'error'
            });
        }
    };

    return (
        <ViewProjectsContainer>
            <Header>
                <h2>Manage Projects</h2>
                <CreateButton to="/admin/create-project">+ Add New Project</CreateButton>
            </Header>
            
            {message.text && (
                <MessageContainer type={message.type}>
                    {message.text}
                </MessageContainer>
            )}
            
            {loading ? (
                <LoadingMessage>Loading projects...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : projects.length === 0 ? (
                <NoProjectsMessage>
                    <p>No projects found. Create your first project!</p>
                    <CreateButton to="/admin/create-project">+ Add New Project</CreateButton>
                </NoProjectsMessage>
            ) : (
                <ProjectsList>
                    {projects.map(project => (
                        <ProjectCard key={project._id}>
                            <ProjectImageContainer>
                                {project.imageUrl ? (
                                    <ProjectImage src={project.imageUrl} alt={project.title} />
                                ) : (
                                    <NoImage>No Image</NoImage>
                                )}
                                {project.featured && <FeaturedBadge>Featured</FeaturedBadge>}
                            </ProjectImageContainer>
                            <ProjectContent>
                                <ProjectTitle>{project.title}</ProjectTitle>
                                <TechStack>
                                    {project.technologies.map((tech, index) => (
                                        <TechTag key={index}>{tech}</TechTag>
                                    ))}
                                </TechStack>
                            </ProjectContent>
                            <ProjectActions>
                                <EditButton to={`/admin/edit-project/${project._id}`}>
                                    Edit
                                </EditButton>
                                <DeleteButton onClick={() => handleDeleteProject(project)}>
                                    Delete
                                </DeleteButton>
                                <ViewButton to={`/projects/${project._id}`} target="_blank">
                                    View
                                </ViewButton>
                                <FeaturedButton 
                                    featured={project.featured ? 'true' : 'false'}
                                    onClick={() => toggleFeatured(project)}
                                >
                                    {project.featured ? 'Unfeature' : 'Feature'}
                                </FeaturedButton>
                            </ProjectActions>
                        </ProjectCard>
                    ))}
                </ProjectsList>
            )}
        </ViewProjectsContainer>
    );
}

// Styled Components
const ViewProjectsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    color: #fff;
    
    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h2 {
        font-size: 2rem;
        color: #5eeae3;
        margin: 0;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const CreateButton = styled(Link)`
    background-color: #5eeae3;
    color: #042b2f;
    text-decoration: none;
    padding: 0.7rem 1.2rem;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #4cd9d2;
        transform: translateY(-2px);
    }
`;

const MessageContainer = styled.div`
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    background-color: ${props => props.type === 'error' ? '#ff6b6b22' : '#5eeae322'};
    color: ${props => props.type === 'error' ? '#ff6b6b' : '#5eeae3'};
    border: 1px solid ${props => props.type === 'error' ? '#ff6b6b' : '#5eeae3'};
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
    
    p {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
    }
`;

const ProjectsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-x: auto;
`;

const ProjectCard = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr auto;
    background-color: #104042;
    border-radius: 8px;
    overflow: hidden;
    
    @media (max-width: 900px) {
        grid-template-columns: 150px 1fr;
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ProjectImageContainer = styled.div`
    position: relative;
    height: 150px;
    
    @media (max-width: 768px) {
        height: 200px;
    }
`;

const ProjectImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NoImage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #042b2f;
    color: #5eeae3;
    font-size: 0.9rem;
`;

const FeaturedBadge = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #5eeae3;
    color: #042b2f;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
`;

const ProjectContent = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ProjectTitle = styled.h3`
    font-size: 1.3rem;
    margin: 0;
    color: #5eeae3;
    word-break: break-word;
`;

const TechStack = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const TechTag = styled.span`
    background-color: #042b2f;
    color: #5eeae3;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
`;

const ProjectActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #042b2f;
    
    @media (max-width: 900px) {
        grid-column: 1 / -1;
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

const ActionButton = styled.button`
    background-color: transparent;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    text-align: center;
    display: block;
    width: 100px;
    
    @media (max-width: 900px) {
        flex: 1;
        min-width: 100px;
    }
`;

const EditButton = styled(Link)`
    background-color: transparent;
    color: #5eeae3;
    border: 1px solid #5eeae3;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    text-align: center;
    display: block;
    width: 100px;
    
    &:hover {
        background-color: #5eeae322;
    }
    
    @media (max-width: 900px) {
        flex: 1;
        min-width: 100px;
    }
`;

const DeleteButton = styled(ActionButton)`
    color: #ff6b6b;
    border: 1px solid #ff6b6b;
    
    &:hover {
        background-color: #ff6b6b22;
    }
`;

const ViewButton = styled(Link)`
    background-color: transparent;
    color: #fff;
    border: 1px solid #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    text-align: center;
    display: block;
    width: 100px;
    
    &:hover {
        background-color: #ffffff22;
    }
    
    @media (max-width: 900px) {
        flex: 1;
        min-width: 100px;
    }
`;

const FeaturedButton = styled(ActionButton)`
    color: ${props => props.featured === 'true' ? '#ffc107' : '#5eeae3'};
    border: 1px solid ${props => props.featured === 'true' ? '#ffc107' : '#5eeae3'};
    
    &:hover {
        background-color: ${props => props.featured === 'true' ? '#ffc10722' : '#5eeae322'};
    }
`;

export default ViewProjects;
