import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from './config/api';

function ViewBlog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication required');
                return;
            }
            
            const response = await fetch(`${API_URL}/admin/blogs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            
            const data = await response.json();
            setBlogs(data.blogs || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError('Failed to load blog posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blog) => {
        if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication required');
                return;
            }
            
            console.log('Deleting blog with ID:', blog._id);
            
            const response = await fetch(`${API_URL}/admin/blogs/${blog._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Delete response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Delete error data:', errorData);
                throw new Error(`Failed to delete blog: ${errorData.message || response.statusText}`);
            }
            
            // Remove the deleted blog from the state
            setBlogs(blogs.filter(item => item._id !== blog._id));
            
            // Show success message
            setMessage({
                text: 'Blog post deleted successfully',
                type: 'success'
            });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
            
        } catch (err) {
            console.error('Error deleting blog:', err);
            setMessage({
                text: `Failed to delete blog post: ${err.message}`,
                type: 'error'
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <ViewBlogContainer>
            <Header>
                <h2>Manage Blog Posts</h2>
                <RefreshButton onClick={fetchBlogs}>
                    Refresh
                </RefreshButton>
            </Header>
            
            {message.text && (
                <Message type={message.type}>
                    {message.text}
                </Message>
            )}
            
            {loading ? (
                <LoadingMessage>Loading blog posts...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : blogs.length === 0 ? (
                <EmptyState>
                    <p>No blog posts found.</p>
                    <p>Create your first blog post to get started!</p>
                </EmptyState>
            ) : (
                <BlogList>
                    {blogs.map(blog => (
                        <BlogItem key={blog._id}>
                            <BlogContent>
                                <BlogDate>{formatDate(blog.date)}</BlogDate>
                                <BlogTitle>{blog.title}</BlogTitle>
                            </BlogContent>
                            <BlogActions>
                                <EditButton to={`/admin/edit/${blog._id}`}>
                                    Edit
                                </EditButton>
                                <DeleteButton onClick={() => handleDeleteBlog(blog)}>
                                    Delete
                                </DeleteButton>
                                <ViewButton to={`/blog/${blog._id}`} target="_blank">
                                    View
                                </ViewButton>
                            </BlogActions>
                        </BlogItem>
                    ))}
                </BlogList>
            )}
        </ViewBlogContainer>
    );
}

// Styled Components
const ViewBlogContainer = styled.div`
    width: 100%;
    color: #fff;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h2 {
        color: #5eeae3;
        margin: 0;
    }
`;

const RefreshButton = styled.button`
    background-color: #104042;
    color: #5eeae3;
    border: 1px solid #5eeae3;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        background-color: #5eeae3;
        color: #042b2f;
    }
`;

const Message = styled.div`
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    background-color: ${props => props.type === 'success' ? 'rgba(94, 234, 227, 0.2)' : 'rgba(255, 99, 71, 0.2)'};
    color: ${props => props.type === 'success' ? '#5eeae3' : '#ff6347'};
    border-left: 4px solid ${props => props.type === 'success' ? '#5eeae3' : '#ff6347'};
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: #5eeae3;
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: #ff6347;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    background-color: rgba(16, 64, 66, 0.3);
    border-radius: 8px;
    
    p {
        margin: 0.5rem 0;
        &:first-child {
            font-size: 1.2rem;
            color: #5eeae3;
        }
    }
`;

const BlogList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const BlogItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background-color: #104042;
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const BlogContent = styled.div`
    flex: 1;
`;

const BlogDate = styled.div`
    color: #5eeae3;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
`;

const BlogTitle = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
`;

const BlogActions = styled.div`
    display: flex;
    gap: 0.75rem;
    
    @media (max-width: 768px) {
        width: 100%;
        justify-content: flex-start;
    }
`;

const ActionButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
`;

const EditButton = styled(Link)`
    background-color: #042b2f;
    color: #5eeae3;
    border: 1px solid #5eeae3;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
        background-color: #5eeae3;
        color: #042b2f;
    }
`;

const DeleteButton = styled.button`
    background-color: transparent;
    color: #ff6347;
    border: 1px solid #ff6347;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
        background-color: #ff6347;
        color: #fff;
    }
`;

const ViewButton = styled(Link)`
    background-color: transparent;
    color: #fff;
    border: 1px solid #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

export default ViewBlog;
