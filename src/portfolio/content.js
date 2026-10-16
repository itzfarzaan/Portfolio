// Public portfolio content. Keep claims grounded in the resume and supplied experience.
export const profile = {
  name: 'Mohammed Farzaan Ali',
  email: 'officialfarzaanali@gmail.com',
  github: 'https://github.com/itzfarzaan',
  linkedin: 'https://www.linkedin.com/in/farzaanali/',
  blog: 'https://blog.farzaanali.com',
  resume: '/documents/Mohammed-Farzaan-Ali-Resume.pdf'
};
export const projects = [{
  slug: 'aqaarpro',
  shortDescription: 'Property management software with dedicated portals for managers, owners, tenants, and vendors.',
  name: 'AqaarPro',
  category: 'Full-stack engineering',
  label: 'Property management',
  summary: 'One system. Four perspectives. A property platform built around the people who use it.',
  stack: ['React', 'Node.js', 'Express', 'Supabase', 'PostgreSQL'],
  role: 'Software Engineer · Creative Analytica',
  type: 'Professional work',
  problem: 'Property managers, owners, tenants, and vendors need different information and different ways to act. A single generic dashboard cannot serve all four equally well.',
  overview: 'At Creative Analytica, I lead the end-to-end development of AqaarPro, a custom property management system. My work spans system architecture, database design, and full-stack implementation.',
  contributions: ['Designed and developed dedicated modules for managers, owners, tenants, and vendors.', 'Built distinct workflows for each role rather than treating every user as the same kind of account.', 'Connected a React frontend with Node.js and Express services, backed by Supabase and PostgreSQL.', 'Worked on workflow automation, security, and scalability across the system.'],
  architecture: ['Four role-based portals', 'Node.js + Express', 'Supabase + PostgreSQL'],
  result: 'A role-based property management platform with four dedicated user experiences. This is ongoing professional work; internal implementation details are kept private.',
  live: 'https://aqaarpro.com'
}, {
  slug: 'knowmydocs',
  shortDescription: 'A document chat application with context-preserving retrieval and summarisation.',
  name: 'KnowMyDocs',
  category: 'Applied AI',
  label: 'Document intelligence',
  summary: 'A conversation with your documents, built on context that stays connected.',
  stack: ['React', 'Node.js', 'Supabase', 'RAG'],
  role: 'Developer',
  type: 'Technical project',
  problem: 'Students, researchers, and professionals often need a specific answer from a long document, without reading it from beginning to end each time.',
  overview: 'KnowMyDocs lets people upload documents, ask questions, and generate summaries. The core engineering work focuses on retrieval-augmented generation: finding relevant document context before producing an answer.',
  contributions: ['Built document upload and conversational interactions using React and Node.js.', 'Implemented context-preserving document chunking for retrieval workflows.', 'Used Supabase within the application stack.', 'Focused on improving the relevance of retrieved content through the way documents are split for embeddings.'],
  architecture: ['Upload a document', 'Context-preserving chunks', 'Retrieve context → answer'],
  result: 'A document chat and summarization tool that brings upload, retrieval, questions, and summaries into one workflow. Context-preserving chunking is a central part of the retrieval approach.'
}, {
  slug: 'interviewaide',
  shortDescription: 'Adaptive interview practice with AI-generated questions and spoken responses.',
  name: 'InterviewAIde',
  category: 'Applied AI',
  label: 'Interview practice',
  summary: 'Interview preparation that responds to you, with room to think out loud.',
  stack: ['Python', 'Flask', 'JavaScript', 'Llama 3', 'Web Speech API'],
  role: 'Developer',
  type: 'Technical project',
  problem: 'Reading a list of interview questions is different from responding in a live conversation. Practice needs to include both adaptive questions and spoken responses.',
  overview: 'An AI interview preparation portal with adaptive simulations powered by the llama3-70b model. A Flask backend and JavaScript frontend support a conversational practice experience.',
  contributions: ['Built adaptive interview simulations with dynamic questions and answers.', 'Integrated the llama3-70b model into the interview workflow.', 'Connected a Flask backend to a JavaScript frontend.', 'Integrated the Web Speech API for verbal interview simulation.'],
  architecture: ['Written or spoken response', 'Flask + Llama 3', 'Adaptive interview question'],
  result: 'An interview practice portal that combines language model interactions with browser speech capabilities.',
  github: 'https://github.com/itzfarzaan/InterviewAIde',
  image: '/media/projects/interviewaide.png'
}, {
  slug: 'academic-management-portal',
  shortDescription: 'Role-based dashboards for attendance, grading, and academic performance.',
  name: 'Academic Management Portal',
  category: 'Full-stack engineering',
  label: 'Education systems',
  summary: 'Attendance, grades, and academic progress, organised around three distinct roles.',
  stack: ['Node.js', 'Express', 'EJS', 'MongoDB'],
  role: 'Developer',
  type: 'Technical project',
  problem: 'Students, lecturers, and administrators interact with the same academic records for different reasons. Their interfaces need to reflect those responsibilities.',
  overview: 'A role-based academic management application with separate dashboards for students, lecturers, and administrators, built with server-rendered EJS views and a Node.js backend.',
  contributions: ['Developed dashboards tailored to three academic roles.', 'Implemented attendance tracking and grading features.', 'Added performance analytics to help make academic records easier to interpret.', 'Built the application with Node.js, Express, EJS, and MongoDB.'],
  architecture: ['Student · Lecturer · Admin', 'Express + EJS', 'MongoDB academic records'],
  result: 'A central academic management application for attendance, grading, and performance tracking.',
  github: 'https://github.com/itzfarzaan/Academic-Management-Portal',
  image: '/media/projects/AMP.png'
}, {
  slug: 'gesture-glove',
  shortDescription: 'A sensor-based glove that translates gestures into speech and text.',
  name: 'The Gesture Glove',
  category: 'Hardware & accessibility',
  label: 'Assistive technology',
  summary: 'Turning physical gestures into text and speech through sensors and software.',
  stack: ['Arduino', 'MPU6050', 'Flex sensors', 'Serial communication'],
  role: 'Co-developer · Serial communication',
  type: 'Technical project',
  problem: 'Gesture-based communication can be difficult for people unfamiliar with sign language to understand. This project explores a sensor-based bridge to speech and text.',
  overview: 'A collaboratively developed hardware glove that converts sign language gestures into speech and text. My main contribution was serial communication and integrating sensor readings with Arduino.',
  contributions: ['Co-developed the hardware glove for gesture-based communication.', 'Led serial communication between the hardware and software.', 'Integrated MPU6050 and flex sensors with Arduino.', 'Worked on real-time gesture recognition to support text and speech output.'],
  architecture: ['Motion + flex sensors', 'Arduino → serial data', 'Gesture → text + speech'],
  result: 'An assistive hardware project exploring gesture-to-text and gesture-to-speech communication, connecting sensor integration with real-time recognition.',
  github: 'https://github.com/itzfarzaan/Gesture-Glove'
}, {
  slug: 'legal-document-summarizer',
  shortDescription: 'Legal document summaries and multilingual translation in a Flask application.',
  name: 'Legal Document Summarizer',
  category: 'Applied AI',
  label: 'Language & comprehension',
  summary: 'Making long legal documents easier to navigate, with summaries and translation.',
  stack: ['Python', 'Flask', 'Legal-Pegasus', 'Hugging Face'],
  role: 'Developer',
  type: 'Technical project',
  problem: 'Lengthy legal documents can make it difficult to find a manageable starting point, particularly when language is another barrier.',
  overview: 'A Flask web application that combines legal document summarization with multilingual translation support. The summarization component uses the Legal-Pegasus model from Hugging Face.',
  contributions: ['Developed a Flask interface for legal document summarization.', 'Integrated Legal-Pegasus for the summarization workflow.', 'Added multilingual translation support.', 'Brought model interactions into a web application workflow.'],
  architecture: ['Legal document input', 'Legal-Pegasus summarization', 'Summary + translation'],
  result: 'A web-based tool for reading assistance through summaries and translation; its output is not a substitute for reviewing the original document.',
  github: 'https://github.com/itzfarzaan/Legal-Document-Summarizer'
}];
export const experience = [{
  date: 'Jul 2026 — Present',
  company: 'Linkiat',
  role: 'Artificial Intelligence Engineer',
  location: 'Riyadh, Saudi Arabia · Remote',
  current: true,
  text: 'Building production-focused AI capabilities, from architecture and implementation to testing and integration planning.',
  details: ['Developing agents, retrieval-augmented applications, workflow automation, and backend API integrations.', 'Combining language models with deterministic application logic, human approval controls, and verifiable execution.', 'Working across frontend, backend, and product teams on API contracts, authentication, safety controls, and phased delivery.']
}, {
  date: 'May 2025 — Present',
  company: 'Creative Analytica',
  role: 'Software Engineer',
  location: 'United Arab Emirates · Remote · Part-time',
  current: true,
  text: 'Leading the development of AqaarPro, from system architecture and database design to the interfaces people use every day.',
  details: ['Leading AqaarPro development, with dedicated workflows for property managers, owners, tenants, and vendors.', 'Building with React, Node.js, Express, Supabase, and PostgreSQL.', 'Improving workflows through automation, with attention to security and scalability.']
}, {
  date: 'Oct 2024 — Feb 2025',
  company: 'Artmac Soft',
  role: 'Machine Learning Engineer Intern',
  location: 'Hyderabad, India',
  text: 'Worked on plant disease detection, connecting dataset preparation with model optimisation.',
  details: ['Built an OpenCV and Pillow augmentation pipeline for approximately 20,000 images.', 'Optimised MobileNetV2 in PyTorch, reaching 88.35% accuracy through augmentation and architectural adjustments.', 'Fine-tuned hyperparameters and learning rate schedulers.']
}, {
  date: 'Apr 2024 — Aug 2024',
  company: 'IEEE SMC · MJCET',
  role: 'R&D Team Member',
  location: 'Hyderabad, India',
  text: 'Contributed to research and development in large language models and natural language processing.',
  details: ['Participated in AI-focused research and development alongside the student R&D team.']
}, {
  date: 'Dec 2023 — Jul 2024',
  company: 'IEEE CIS · MJCET',
  role: 'Engineering Lead',
  location: 'Hyderabad, India',
  text: 'Contributed to the technical team, with experience in React and Node.js.',
  details: ['Worked with the technical team using React and Node.js.']
}, {
  date: 'Aug 2023 — Jul 2024',
  company: 'IEEE PES · MJCET',
  role: 'Web Developer / Webmaster',
  location: 'Hyderabad, India',
  text: 'Developed the official chapter website and helped organise hands-on technical workshops.',
  details: ['Oversaw a team of more than 20 members in workshop organisation.']
}];
