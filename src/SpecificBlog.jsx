import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_URL } from './config/api';
import { setDocumentTitle } from './utils/titleUtils';

function SpecificBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs/${id}`);
        
        if (!response.ok) {
          throw new Error('Blog not found');
        }
        
        const data = await response.json();
        setBlog(data.blog);
        
        // Set the page title with the blog title
        if (data.blog && data.blog.title) {
          setDocumentTitle(`Blog - ${data.blog.title}`);
        } else {
          setDocumentTitle('Blog Post');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post. It may have been removed or is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <LoadingContainer>Loading blog post...</LoadingContainer>;
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>Error</h2>
        <p>{error}</p>
        <BackLink to="/blog">Back to Blogs</BackLink>
      </ErrorContainer>
    );
  }

  if (!blog) {
    return (
      <ErrorContainer>
        <h2>Blog Not Found</h2>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <BackLink to="/blog">Back to Blogs</BackLink>
      </ErrorContainer>
    );
  }

  const formattedDate = blog.date 
    ? new Date(blog.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  return (
    <PageWrapper>
      <BlogContainer>
        <BlogHeader>
          <BackLink to="/blog">← Back to Blogs</BackLink>
          <BlogTitle>{blog.title}</BlogTitle>
          <BlogMeta>
            <span>Published on {formattedDate}</span>
          </BlogMeta>
          {blog.imageUrl && (
            <FeaturedImage src={blog.imageUrl} alt={blog.title} />
          )}
        </BlogHeader>
        
        <BlogContent dangerouslySetInnerHTML={{ __html: blog.content }} />
        
        <BlogFooter>
          <BackLink to="/blog">← Back to Blogs</BackLink>
        </BlogFooter>
      </BlogContainer>
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled.div`
  background-color: transparent;
  min-height: 100vh;
  padding: 2rem 0;
  color: #fff;
`;

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
  font-family: 'Sen', sans-serif;
  background-color: #042b2f;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const BlogHeader = styled.header`
  margin-bottom: 2rem;
`;

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  color: #5eeae3;
  margin: 1rem 0;
`;

const BlogMeta = styled.div`
  font-size: 0.9rem;
  color: #aaa;
  margin-bottom: 1.5rem;
`;

const FeaturedImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const BlogContent = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  color: #fff;
  
  h1, h2, h3, h4, h5, h6 {
    color: #5eeae3;
    margin: 1.5rem 0 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: #fff;
  }
  
  a {
    color: #5eeae3;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1.5rem 0;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
    color: #fff;
  }
  
  blockquote {
    border-left: 4px solid #5eeae3;
    padding-left: 1rem;
    font-style: italic;
    margin: 1.5rem 0;
    color: #aaa;
  }
  
  code {
    background-color: #104042;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
    color: #5eeae3;
  }
  
  pre {
    background-color: #104042;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1.5rem 0;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const BlogFooter = styled.footer`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #104042;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #5eeae3;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #fff;
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
  text-align: left;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #ff6b6b;
  padding: 2rem;
  text-align: left;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

export default SpecificBlog;
