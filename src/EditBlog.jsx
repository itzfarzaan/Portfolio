import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { API_URL } from './config/api';

function EditBlog() {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [originalBlog, setOriginalBlog] = useState(null);

    const editor = useEditor({
        extensions: [StarterKit, Image, TextStyle, Color],
        content: '',
        onUpdate: ({ editor }) => {
            // You can add additional handling here if needed
        }
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/');
                    return;
                }
                
                const response = await fetch(`${API_URL}/admin/blogs/${blogId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch blog');
                }
                
                const data = await response.json();
                setOriginalBlog(data.blog);
                setTitle(data.blog.title);
                
                if (data.blog.image) {
                    setImagePreview(data.blog.image);
                }
                
                if (editor) {
                    editor.commands.setContent(data.blog.content);
                }
                
            } catch (err) {
                console.error('Error fetching blog:', err);
                setMessage({
                    text: 'Failed to load blog post. Please try again later.',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        if (blogId && editor) {
            fetchBlog();
        }
    }, [blogId, editor, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!editor) return;
        
        if (!title.trim()) {
            setMessage({
                text: 'Please enter a title for your blog post',
                type: 'error'
            });
            return;
        }
        
        const content = editor.getHTML();
        
        if (!content || content === '<p></p>') {
            setMessage({
                text: 'Please add some content to your blog post',
                type: 'error'
            });
            return;
        }
        
        setSubmitting(true);
        setMessage({ text: '', type: '' });
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/');
                return;
            }
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (imagePreview && imagePreview.startsWith('data:')) {
                // Convert base64 to blob and append
                const response = await fetch(imagePreview);
                const blob = await response.blob();
                formData.append('image', blob, 'image.jpg');
            }
            
            const response = await fetch(`${API_URL}/admin/blogs/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage({
                    text: 'Blog post updated successfully!',
                    type: 'success'
                });
                
                // Redirect back to admin page after 2 seconds
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to update blog post');
            }
        } catch (err) {
            console.error('Error updating blog:', err);
            setMessage({
                text: err.message || 'Failed to update blog post. Please try again.',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <PageWrapper>
                <Container>
                    <LoadingMessage>Loading blog post...</LoadingMessage>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <Title>Edit Blog Post</Title>
                
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
                        <Label htmlFor="image">Featured Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <ImagePreview>
                                <img src={imagePreview} alt="Preview" />
                            </ImagePreview>
                        )}
                    </FormGroup>
                    
                    <FormGroup>
                        <Label>Content</Label>
                        <EditorContainer>
                            <MenuBar>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={editor.isActive('bold') ? 'is-active' : ''}
                                    type="button"
                                >
                                    Bold
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={editor.isActive('italic') ? 'is-active' : ''}
                                    type="button"
                                >
                                    Italic
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                                    type="button"
                                >
                                    H2
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                                    type="button"
                                >
                                    H3
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                                    type="button"
                                >
                                    Bullet List
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                                    type="button"
                                >
                                    Ordered List
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                    className={editor.isActive('codeBlock') ? 'is-active' : ''}
                                    type="button"
                                >
                                    Code Block
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().setColor('#5eeae3').run()}
                                    type="button"
                                >
                                    Teal
                                </MenuButton>
                                <MenuButton
                                    onClick={() => editor.chain().focus().setColor('#ffffff').run()}
                                    type="button"
                                >
                                    White
                                </MenuButton>
                            </MenuBar>
                            <EditorContent editor={editor} />
                        </EditorContainer>
                    </FormGroup>
                    
                    <ButtonGroup>
                        <CancelButton type="button" onClick={() => navigate('/admin')}>
                            Cancel
                        </CancelButton>
                        <SubmitButton type="submit" disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update Blog Post'}
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
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
`;

const Title = styled.h1`
    color: #5eeae3;
    margin-bottom: 2rem;
    font-size: 2rem;
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
    color: #5eeae3;
    font-size: 1rem;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #104042;
    background-color: #042b2f;
    color: #fff;
    font-size: 1rem;
    
    &:focus {
        outline: none;
        border-color: #5eeae3;
    }
    
    &[type="file"] {
        padding: 0.5rem;
        background-color: transparent;
        border: none;
    }
`;

const ImagePreview = styled.div`
    margin-top: 1rem;
    
    img {
        max-width: 100%;
        max-height: 300px;
        border-radius: 4px;
    }
`;

const EditorContainer = styled.div`
    border: 1px solid #104042;
    border-radius: 4px;
    overflow: hidden;
    
    .ProseMirror {
        padding: 1rem;
        min-height: 300px;
        background-color: #042b2f;
        color: #fff;
        
        &:focus {
            outline: none;
        }
        
        p {
            margin: 0.5rem 0;
        }
        
        h2, h3, h4 {
            color: #5eeae3;
        }
        
        ul, ol {
            padding-left: 1.5rem;
        }
        
        code {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
        }
        
        pre {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 0.75rem;
            border-radius: 4px;
            
            code {
                background-color: transparent;
                padding: 0;
            }
        }
    }
`;

const MenuBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    background-color: #104042;
    border-bottom: 1px solid #042b2f;
    gap: 0.25rem;
`;

const MenuButton = styled.button`
    padding: 0.4rem 0.6rem;
    background-color: #042b2f;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    
    &:hover {
        background-color: #5eeae3;
        color: #042b2f;
    }
    
    &.is-active {
        background-color: #5eeae3;
        color: #042b2f;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: flex-end;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
`;

const SubmitButton = styled(Button)`
    background-color: #5eeae3;
    color: #042b2f;
    border: none;
    
    &:hover {
        background-color: #4cd9d2;
    }
    
    &:disabled {
        background-color: #2a7a76;
        cursor: not-allowed;
    }
`;

const CancelButton = styled(Button)`
    background-color: transparent;
    color: #fff;
    border: 1px solid #fff;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const Message = styled.div`
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    background-color: ${props => props.type === 'success' ? 'rgba(94, 234, 227, 0.2)' : 'rgba(255, 99, 71, 0.2)'};
    color: ${props => props.type === 'success' ? '#5eeae3' : '#ff6347'};
    border-left: 4px solid ${props => props.type === 'success' ? '#5eeae3' : '#ff6347'};
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 3rem;
    color: #5eeae3;
    font-size: 1.2rem;
`;

export default EditBlog;
