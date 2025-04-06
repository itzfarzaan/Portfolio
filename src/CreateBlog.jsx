import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { API_URL } from './config/api';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Image, TextStyle, Color],
    content: '',
    autofocus: false,
  });

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For demo purposes, we're just setting a local URL
    // In a real app, you would upload this to a server
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !editor || editor.isEmpty) {
      setMessage({ text: 'Title and content are required', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${API_URL}/admin/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content: editor.getHTML(),
          imageUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
      
      const data = await response.json();
      setMessage({ text: 'Blog post created successfully!', type: 'success' });
      
      // Reset form
      setTitle('');
      setImageUrl('');
      editor.commands.setContent('');
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      setMessage({ text: 'Failed to create blog post. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Create New Blog Post</Title>
        
        {message.text && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="image">Featured Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
            
            {imageUrl && (
              <ImagePreview>
                <img src={imageUrl} alt="Preview" />
              </ImagePreview>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label>Content</Label>
            <EditorContainer>
              <MenuBar>
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  type="button"
                >
                  Bold
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  type="button"
                >
                  Italic
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  type="button"
                >
                  H1
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  type="button"
                >
                  H2
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  type="button"
                >
                  Bullet List
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  type="button"
                >
                  Numbered List
                </button>
                <button onClick={addImage} type="button">
                  Add Image
                </button>
                <select
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  defaultValue=""
                >
                  <option value="">Default</option>
                  <option value="#5eeae3">Teal</option>
                  <option value="#042b2f">Dark Teal</option>
                  <option value="#ff6b6b">Red</option>
                  <option value="#339af0">Blue</option>
                  <option value="#51cf66">Green</option>
                </select>
              </MenuBar>
              <EditorContent editor={editor} />
            </EditorContainer>
          </FormGroup>
          
          <ButtonGroup>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Blog Post'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Container>
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled.div`
  background-color: transparent;
  min-height: 100vh;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Sen', sans-serif;
  background-color: #042b2f;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  color: #5eeae3;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #5eeae3;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #104042;
  font-size: 1rem;
  background-color: #0e0e11;
  color: #fff;
  
  &:focus {
    outline: none;
    border-color: #5eeae3;
    box-shadow: 0 0 0 2px rgba(94, 234, 227, 0.2);
  }
`;

const EditorContainer = styled.div`
  .ProseMirror {
    padding: 1rem;
    border: 1px solid #104042;
    border-radius: 4px;
    min-height: 300px;
    background-color: #0e0e11;
    color: #fff;
    
    &:focus {
      outline: none;
      border-color: #5eeae3;
      box-shadow: 0 0 0 2px rgba(94, 234, 227, 0.2);
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #5eeae3;
    }
    
    ul, ol {
      padding-left: 1.5rem;
      color: #fff;
    }
    
    p {
      color: #fff;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
  }
`;

const MenuBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #104042;
  border-radius: 4px;
  
  button, select {
    padding: 0.5rem;
    background-color: #042b2f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    
    &:hover {
      background-color: #0e0e11;
    }
    
    &:active {
      background-color: #5eeae3;
      color: #042b2f;
    }
  }
  
  select {
    option {
      background-color: #042b2f;
      color: #fff;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #5eeae3;
  color: #042b2f;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4cd9d2;
  }
  
  &:disabled {
    background-color: #104042;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  
  ${props => props.type === 'error' && `
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    border: 1px solid #e74c3c;
  `}
  
  ${props => props.type === 'success' && `
    background-color: rgba(94, 234, 227, 0.1);
    color: #5eeae3;
    border: 1px solid #5eeae3;
  `}
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  
  img {
    max-width: 300px;
    max-height: 200px;
    border-radius: 4px;
  }
`;

export default CreateBlog;
