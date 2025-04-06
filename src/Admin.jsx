import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CreateBlog from './CreateBlog';
import ViewBlog from './ViewBlog';
import CreateProject from './CreateProject';
import ViewProjects from './ViewProjects';
import { API_URL } from './config/api';

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('createBlog');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await fetch(`${API_URL}/admin/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                    // Dispatch auth change event
                    window.dispatchEvent(new Event('authChange'));
                } else {
                    // Token invalid or expired
                    localStorage.removeItem('token');
                    // Dispatch auth change event
                    window.dispatchEvent(new Event('authChange'));
                    navigate('/');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    if (loading) {
        return <LoadingContainer>Verifying authentication...</LoadingContainer>;
    }

    if (!isAuthenticated) {
        navigate('/');
        return null;
    }

    return (
        <AdminContainer>
            <AdminHeader>
                <h1>Admin Dashboard</h1>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </AdminHeader>
            
            <TabContainer>
                <TabGroup>
                    <TabGroupLabel>Blog Management</TabGroupLabel>
                    <TabButton 
                        active={activeTab === 'createBlog'} 
                        onClick={() => setActiveTab('createBlog')}
                    >
                        Create Blog
                    </TabButton>
                    <TabButton 
                        active={activeTab === 'viewBlogs'} 
                        onClick={() => setActiveTab('viewBlogs')}
                    >
                        Manage Blogs
                    </TabButton>
                </TabGroup>
                
                <TabGroup>
                    <TabGroupLabel>Project Management</TabGroupLabel>
                    <TabButton 
                        active={activeTab === 'createProject'} 
                        onClick={() => setActiveTab('createProject')}
                    >
                        Create Project
                    </TabButton>
                    <TabButton 
                        active={activeTab === 'viewProjects'} 
                        onClick={() => setActiveTab('viewProjects')}
                    >
                        Manage Projects
                    </TabButton>
                </TabGroup>
            </TabContainer>
            
            <TabContent>
                {activeTab === 'createBlog' && (
                    <TabPanel>
                        <CreateBlog />
                    </TabPanel>
                )}
                
                {activeTab === 'viewBlogs' && (
                    <TabPanel>
                        <ViewBlog />
                    </TabPanel>
                )}
                
                {activeTab === 'createProject' && (
                    <TabPanel>
                        <CreateProject />
                    </TabPanel>
                )}
                
                {activeTab === 'viewProjects' && (
                    <TabPanel>
                        <ViewProjects />
                    </TabPanel>
                )}
            </TabContent>
        </AdminContainer>
    );
}

// Styled Components
const AdminContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 80vh;
    color: #fff;
`;

const AdminHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h1 {
        color: #5eeae3;
        margin: 0;
    }
`;

const LogoutButton = styled.button`
    background-color: transparent;
    color: #ff6b6b;
    border: 1px solid #ff6b6b;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #ff6b6b;
        color: #042b2f;
    }
`;

const TabContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const TabGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const TabGroupLabel = styled.h3`
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #5eeae3;
`;

const TabButton = styled.button`
    background-color: ${props => props.active ? '#5eeae3' : 'transparent'};
    color: ${props => props.active ? '#042b2f' : '#fff'};
    border: 1px solid ${props => props.active ? '#5eeae3' : '#333'};
    padding: 0.7rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: ${props => props.active ? '600' : '400'};
    
    &:hover {
        background-color: ${props => props.active ? '#5eeae3' : '#333'};
    }
`;

const TabContent = styled.div`
    background-color: transparent;
    border-radius: 8px;
    min-height: 500px;
`;

const TabPanel = styled.div`
    padding: 1rem;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    font-size: 1.2rem;
    color: #5eeae3;
`;

export default Admin;