import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { API_URL } from './config/api';

function CreateProject() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const editor = useEditor({
        extensions: [StarterKit, Image, TextStyle, Color],
        content: '',
        onUpdate: ({ editor }) => {
            // You can add additional handling here if needed
        }
    });

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
        };

        verifyAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if editor exists and get its content
        const editorContent = editor ? editor.getHTML() : '';
        
        if (!title || !editorContent || editorContent === '<p></p>') {
            setMessage({
                text: 'Title and description are required',
                type: 'error'
            });
            return;
        }
        
        setLoading(true);
        setMessage({ text: '', type: '' });
        
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/admin/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: editorContent,
                    summary,
                    technologies: technologies.split(',').map(tech => tech.trim()),
                    imageUrl,
                    videoUrl,
                    githubUrl,
                    liveUrl,
                    featured
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage({
                    text: 'Project created successfully!',
                    type: 'success'
                });
                
                // Clear form
                setTitle('');
                setSummary('');
                setTechnologies('');
                setImageUrl('');
                setVideoUrl('');
                setGithubUrl('');
                setLiveUrl('');
                setFeatured(false);
                
                if (editor) {
                    editor.commands.setContent('');
                }
                
                // Redirect to projects after a short delay
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                setMessage({
                    text: data.message || 'Failed to create project',
                    type: 'error'
                });
                console.error('Server response:', data);
            }
        } catch (error) {
            console.error('Error creating project:', error);
            setMessage({
                text: 'An error occurred while creating the project',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CreateProjectContainer>
            <FormHeader>Create New Project</FormHeader>
            
            {message.text && (
                <MessageContainer type={message.type}>
                    {message.text}
                </MessageContainer>
            )}
            
            <ProjectForm onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="summary">Project Summary (Brief overview for project cards)</Label>
                    <TextArea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows="3"
                        placeholder="A brief summary that will appear on project cards (max 150 characters recommended)"
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="technologies">Technologies Used (comma-separated)</Label>
                    <Input
                        type="text"
                        id="technologies"
                        value={technologies}
                        onChange={(e) => setTechnologies(e.target.value)}
                        placeholder="React, Node.js, MongoDB, etc."
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="videoUrl">Video URL (optional)</Label>
                    <Input
                        type="text"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="githubUrl">GitHub Repository URL (optional)</Label>
                    <Input
                        type="text"
                        id="githubUrl"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username/repo"
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="liveUrl">Live Demo URL (optional)</Label>
                    <Input
                        type="text"
                        id="liveUrl"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://example.com"
                    />
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="description">Project Description *</Label>
                    <EditorContainer>
                        <MenuBar>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={editor?.isActive('bold') ? 'is-active' : ''}
                            >
                                Bold
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={editor?.isActive('italic') ? 'is-active' : ''}
                            >
                                Italic
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                            >
                                H2
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                            >
                                H3
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={editor?.isActive('bulletList') ? 'is-active' : ''}
                            >
                                Bullet List
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={editor?.isActive('orderedList') ? 'is-active' : ''}
                            >
                                Numbered List
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                className={editor?.isActive('codeBlock') ? 'is-active' : ''}
                            >
                                Code Block
                            </MenuButton>
                            <MenuButton
                                type="button"
                                onClick={() => {
                                    const url = window.prompt('Enter image URL');
                                    if (url) {
                                        editor.chain().focus().setImage({ src: url }).run();
                                    }
                                }}
                            >
                                Image
                            </MenuButton>
                        </MenuBar>
                        <StyledEditorContent editor={editor} />
                    </EditorContainer>
                </FormGroup>
                
                <FormGroup>
                    <CheckboxContainer>
                        <Checkbox
                            type="checkbox"
                            id="featured"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                        />
                        <CheckboxLabel htmlFor="featured">
                            Feature this project on the home page
                        </CheckboxLabel>
                    </CheckboxContainer>
                </FormGroup>
                
                <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Creating Project...' : 'Create Project'}
                </SubmitButton>
            </ProjectForm>
        </CreateProjectContainer>
    );
}

// Styled Components
const CreateProjectContainer = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    color: #fff;
    
    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const FormHeader = styled.h2`
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #5eeae3;
`;

const MessageContainer = styled.div`
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    background-color: ${props => props.type === 'error' ? '#ff6b6b22' : '#5eeae322'};
    color: ${props => props.type === 'error' ? '#ff6b6b' : '#5eeae3'};
    border: 1px solid ${props => props.type === 'error' ? '#ff6b6b' : '#5eeae3'};
`;

const ProjectForm = styled.form`
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
    font-size: 1rem;
    font-weight: 600;
`;

const Input = styled.input`
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #333;
    background-color: #042b2f;
    color: #fff;
    font-size: 1rem;
    
    &:focus {
        outline: none;
        border-color: #5eeae3;
    }
`;

const TextArea = styled.textarea`
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #333;
    background-color: #042b2f;
    color: #fff;
    font-size: 1rem;
    resize: vertical;
    min-height: 100px;
    
    &:focus {
        outline: none;
        border-color: #5eeae3;
    }
`;

const EditorContainer = styled.div`
    border: 1px solid #333;
    border-radius: 4px;
    overflow: hidden;
`;

const MenuBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
    background-color: #104042;
    border-bottom: 1px solid #333;
`;

const MenuButton = styled.button`
    background-color: transparent;
    border: 1px solid #333;
    color: #fff;
    padding: 0.5rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    
    &:hover {
        background-color: #042b2f;
    }
    
    &.is-active {
        background-color: #5eeae3;
        color: #042b2f;
    }
`;

const StyledEditorContent = styled(EditorContent)`
    .ProseMirror {
        padding: 1rem;
        min-height: 200px;
        background-color: #042b2f;
        color: #fff;
        
        &:focus {
            outline: none;
        }
        
        p {
            margin-bottom: 1rem;
        }
        
        h2, h3 {
            color: #5eeae3;
            margin: 1.5rem 0 1rem;
        }
        
        ul, ol {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
        }
        
        li {
            margin-bottom: 0.5rem;
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 1rem 0;
        }
    }
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Checkbox = styled.input`
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
`;

const CheckboxLabel = styled.label`
    font-size: 1rem;
    cursor: pointer;
`;

const SubmitButton = styled.button`
    padding: 1rem;
    background-color: #5eeae3;
    color: #042b2f;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: #4cd9d2;
    }
    
    &:disabled {
        background-color: #333;
        color: #666;
        cursor: not-allowed;
    }
`;

export default CreateProject;
