import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from './config/api';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_URL}/api/blogs`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                
                const data = await response.json();
                setBlogs(data.blogs || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <BlogContainer>
            <BlogHeader>
                <h1>Blog</h1>
                <p>Thoughts, stories and ideas</p>
            </BlogHeader>

            {loading ? (
                <LoadingMessage>Loading blog posts...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : blogs.length === 0 ? (
                <NoBlogsMessage>
                    <h2>Coming Soon</h2>
                    <p>I'm working on some interesting blog posts. Check back later!</p>
                </NoBlogsMessage>
            ) : (
                <BlogList>
                    {blogs.map(blog => (
                        <BlogRow key={blog._id}>
                            <DateColumn>{formatDate(blog.date)}</DateColumn>
                            <TitleColumn>{blog.title}</TitleColumn>
                            <ActionColumn>
                                <ReadMoreLink to={`/blog/${blog._id}`}>
                                    Read More →
                                </ReadMoreLink>
                            </ActionColumn>
                        </BlogRow>
                    ))}
                </BlogList>
            )}
        </BlogContainer>
    );
}

// Styled Components
const BlogContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Sen', sans-serif;
    color: #fff;
    
    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const BlogHeader = styled.div`
    text-align: center;
    margin-bottom: 3rem;
    
    h1 {
        font-size: 2.5rem;
        color: #5eeae3;
        margin-bottom: 0.5rem;
    }
    
    p {
        font-size: 1.2rem;
        color: #fff;
    }
`;

const BlogList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
`;

const BlogRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    align-items: center;
    background-color: #104042;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 1.25rem;
    }
`;

const DateColumn = styled.div`
    color: #5eeae3;
    font-size: 0.9rem;
    
    @media (max-width: 768px) {
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
    }
`;

const TitleColumn = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    color: #fff;
    word-break: break-word;
    
    @media (max-width: 768px) {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
    }
`;

const ActionColumn = styled.div`
    display: flex;
    justify-content: flex-end;
    
    @media (max-width: 768px) {
        justify-content: flex-start;
    }
`;

const ReadMoreLink = styled(Link)`
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
    
    @media (max-width: 768px) {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
    }
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: #5eeae3;
`;

const ErrorMessage = styled.div`
    text-align: center;
    padding: 3rem;
    color: #e74c3c;
    font-size: 1.2rem;
`;

const NoBlogsMessage = styled.div`
    text-align: center;
    padding: 5rem 2rem;
    background-color: #104042;
    border-radius: 8px;
    
    h2 {
        color: #5eeae3;
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    
    p {
        color: #fff;
        font-size: 1.2rem;
    }
`;

export default Blog;