import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { API_URL } from './config/api';

function EditProject() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState(''); // Added summary field
    const [technologies, setTechnologies] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [originalProject, setOriginalProject] = useState(null);

    const editor = useEditor({
        extensions: [StarterKit, Image, TextStyle, Color],
        content: '',
        onUpdate: ({ editor }) => {
            // You can add additional handling here if needed
        }
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                // Use the correct API endpoint with authentication
                const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                
                const data = await response.json();
                setOriginalProject(data.project);
                
                // Set form fields with project data
                setTitle(data.project.title || '');
                setSummary(data.project.summary || ''); // Set summary field
                setTechnologies(Array.isArray(data.project.technologies) 
                    ? data.project.technologies.join(', ') 
                    : data.project.technologies || '');
                setImageUrl(data.project.imageUrl || '');
                setVideoUrl(data.project.videoUrl || '');
                setGithubUrl(data.project.githubUrl || '');
                setLiveUrl(data.project.liveUrl || '');
                setFeatured(data.project.featured || false);
                
                // Set editor content
                if (editor && data.project.description) {
                    editor.commands.setContent(data.project.description);
                }
                
            } catch (error) {
                console.error('Error fetching project:', error);
                setMessage({
                    text: 'Failed to load project. Please try again later.',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };
        
        if (editor) {
            fetchProject();
        }
    }, [projectId, navigate, editor]);

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
        
        setSubmitting(true);
        setMessage({ text: '', type: '' });
        
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/admin/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: editorContent,
                    summary, // Include summary field
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
                    text: 'Project updated successfully!',
                    type: 'success'
                });
                
                // Redirect to projects after a short delay
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                setMessage({
                    text: data.message || 'Failed to update project',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error updating project:', error);
            setMessage({
                text: 'An error occurred while updating the project',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter the URL of the image:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingMessage>Loading project...</LoadingMessage>
            </LoadingContainer>
        );
    }

    return (
        <EditProjectContainer>
            <FormHeader>Edit Project</FormHeader>
            
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
                    {imageUrl && (
                        <PreviewContainer>
                            <PreviewLabel>Image Preview:</PreviewLabel>
                            <ImagePreview src={imageUrl} alt="Project preview" />
                        </PreviewContainer>
                    )}
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
                    <HelpText>
                        For best results, use a direct link to an MP4 file or a video hosting service that allows embedding
                    </HelpText>
                    {videoUrl && (
                        <PreviewContainer>
                            <PreviewLabel>Video Preview:</PreviewLabel>
                            <VideoPreview controls>
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </VideoPreview>
                        </PreviewContainer>
                    )}
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
                            <MenuButton type="button" onClick={addImage}>
                                Add Image
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
                
                <ButtonGroup>
                    <CancelButton type="button" onClick={() => navigate('/admin/view-projects')}>
                        Cancel
                    </CancelButton>
                    <SubmitButton type="submit" disabled={submitting}>
                        {submitting ? 'Updating Project...' : 'Update Project'}
                    </SubmitButton>
                </ButtonGroup>
            </ProjectForm>
        </EditProjectContainer>
    );
}

// Styled Components
const EditProjectContainer = styled.div`
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

const HelpText = styled.p`
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 0.25rem;
`;

const PreviewContainer = styled.div`
    margin-top: 1rem;
`;

const PreviewLabel = styled.p`
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #5eeae3;
`;

const ImagePreview = styled.img`
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
    border: 1px solid #333;
`;

const VideoPreview = styled.video`
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
    border: 1px solid #333;
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

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const SubmitButton = styled.button`
    flex: 1;
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

const CancelButton = styled.button`
    flex: 1;
    padding: 1rem;
    background-color: transparent;
    color: #fff;
    border: 1px solid #333;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #333;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    font-size: 1.2rem;
    color: #5eeae3;
`;

export default EditProject;
