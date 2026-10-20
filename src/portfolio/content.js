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
  slug: 'yorahealth',
  featured: true,
  highlights: [
    'Voice agent tools that book, reschedule, and cancel appointments',
    'Clinic and admin dashboards with transcripts, recordings, and outcomes',
    'Scheduling integrations with retry-safe, deduplicated events'
  ],
  name: 'YoraHealth',
  shortDescription: 'An AI receptionist for dental practices, connecting patient calls with appointment scheduling and a clinic dashboard.',
  category: 'Voice AI & full-stack engineering',
  label: 'Dental AI receptionist',
  summary: 'From a patient call to a confirmed appointment, with the clinic team kept in the loop.',
  stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Webhooks', 'Background workers'],
  role: 'End-to-end technical implementation',
  type: 'Live project',
  problem: 'Dental front desks need to handle patient calls while supporting people in the practice. Missed calls, scheduling changes, and follow-up work can leave both patients and staff without a clear next step.',
  overview: 'I implemented the technical platform behind YoraHealth: the public website, clinic and administrator dashboards, backend APIs, data model, and integrations with third-party voice AI, practice-management, and messaging services. The receptionist uses each practice’s information to answer questions and help callers book, reschedule, or cancel appointments.',
  contributions: [
    'Built the React website and operational dashboards for clinic teams and administrators, including call history, transcripts, recordings, appointment actions, and outcome analytics.',
    'Developed the Node.js and Express backend, PostgreSQL data model, authenticated sessions, clinic-scoped access, and integration endpoints.',
    'Implemented voice-agent tools for patient lookup, availability checks, appointment booking, rescheduling, cancellation, and practice information.',
    'Connected third-party scheduling systems through backend APIs and webhooks, using returned availability references and explicit confirmation before appointment changes.',
    'Added durable event and tool-call deduplication, appointment audit records, and background reconciliation for delayed call analysis and configuration updates.',
    'Implemented appointment messaging workflows that wait for evidence that a booking has reached the practice-management system before sending a confirmation.'
  ],
  architecture: ['Patient call → voice AI integration', 'Express tools → scheduling integration', 'PostgreSQL records → clinic dashboard'],
  engineering: [
    { title: 'Connecting conversation to real actions', text: 'The voice layer calls backend tools rather than directly changing practice records. The backend resolves the clinic, validates inputs and confirmations, checks scheduling availability, and records appointment actions. Third-party integrations sit behind application-owned interfaces.' },
    { title: 'Handling retries and delayed events', text: 'Voice and scheduling events can arrive more than once or out of order. Persistent event keys and cached tool results protect against repeating appointment mutations. Call-state handling preserves terminal outcomes, while background workers reconcile missing analysis and retry configuration updates.' },
    { title: 'Confirming the appointment before the message', text: 'An accepted API request does not necessarily mean an appointment is visible in the practice’s system. The notification pipeline tracks that distinction, waits for synchronization evidence, and processes messages independently so a messaging failure does not fail the appointment action.' },
    { title: 'Giving the clinic a clear operational view', text: 'The dashboard connects call summaries and available recordings with appointment outcomes and follow-up needs. Clinic-specific settings hold practice hours, services, providers, and knowledge, while administrator tools support setup and integration management.' }
  ],
  result: 'A live dental AI receptionist platform with an operational dashboard and connected scheduling workflows. My contribution covers the complete technical implementation. Integration availability and operational configuration are confirmed per practice; the website’s public dashboard preview uses fictional patient data.',
  live: 'https://www.yorahealth.com/',
  image: '/media/projects/yorahealth.webp',
  imageWidth: 1440,
  imageHeight: 1000,
  imageAlt: 'YoraHealth public website showing its dental AI receptionist and a clearly labelled fictional dashboard preview',
  imageCaption: 'YoraHealth public website. The dashboard preview contains fictional patient and appointment data.'
}, {
  slug: 'comicthread',
  featured: true,
  highlights: [
    'Publishing model from publisher down to issues, story arcs, and collections',
    'Dashboard with reading progress, a queue, and the next issue in every series',
    'Public demo playground that needs no account'
  ],
  name: 'ComicThread',
  shortDescription: 'A comic library and reading tracker that connects every series, reading order, and next issue.',
  category: 'Full-stack engineering',
  label: 'Comic library',
  summary: 'Every series, every reading order, and the next issue, connected in one library.',
  stack: ['React', 'React Query', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
  role: 'Design and full-stack development',
  type: 'Personal project',
  problem: 'Comic collections span publishers, series, volumes, story arcs, and collected editions. Knowing what to read next, and in what order, is easy to lose track of.',
  overview: 'ComicThread is a single-user comic library that models the real publishing structure, from publisher and series down to individual issues, story arcs, and collections. It tracks reading progress, ownership, and reading activity, and its dashboard lines up the next issue in every series.',
  contributions: [
    'Designed and built the product end to end, from the data model to the interface.',
    'Modelled publishing hierarchies (publisher, franchise, series, volume, issue, story arc, collection) in PostgreSQL.',
    'Built the React frontend with React Query for the dashboard, series browser, collections, and reading activity views.',
    'Implemented an Express API with JWT authentication, plus a public demo playground where visitors can explore without an account.'
  ],
  architecture: ['React + React Query interface', 'Express API with JWT auth', 'PostgreSQL publishing model'],
  result: 'A live comic library and reading tracker with a public demo that needs no account. Interface captures use an illustrative library.',
  live: 'https://comics.farzaanali.com',
  image: '/media/projects/comicthread.webp',
  imageWidth: 1440,
  imageHeight: 900,
  imageAlt: 'ComicThread landing page with the headline Every universe. In order.',
  imageCaption: 'ComicThread landing page. Cover art belongs to Marvel, DC, and Image Comics; ComicThread is a non-commercial portfolio project.'
}, {
  slug: 'aqaarpro',
  featured: true,
  highlights: [
    'Dedicated portals for managers, owners, tenants, and vendors',
    'System architecture and database design on Supabase and PostgreSQL',
    'Workflow automation built with security and scale in mind'
  ],
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
  live: 'https://aqaarpro.com',
  image: '/media/projects/aqaarpro.webp',
  imageWidth: 1440,
  imageHeight: 900,
  imageAlt: 'AqaarPro public website with its property management sign-in',
  imageCaption: 'AqaarPro public website.'
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
  github: 'https://github.com/itzfarzaan/Gesture-Glove',
  gallery: [
    { src: '/media/projects/gesture-glove-1.webp', width: 960, height: 1280, alt: 'Farzaan testing the gesture glove at a project exhibition', position: '45% 62%' },
    { src: '/media/projects/gesture-glove-2.webp', width: 1280, height: 960, alt: 'Close-up of the glove with flex sensors on each finger and an MPU6050 motion sensor', position: '42% 50%' }
  ]
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
  result: 'A document chat and summarization tool that brings upload, retrieval, questions, and summaries into one workflow. Context-preserving chunking is a central part of the retrieval approach.',
  image: '/media/projects/knowmydocs.webp',
  imageWidth: 1800,
  imageHeight: 713,
  imageAlt: 'KnowMyDocs landing page with the headline Chat with your Documents. Get Answers Instantly!'
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
  image: '/media/projects/academic-portal.webp',
  imageWidth: 1600,
  imageHeight: 810,
  imageAlt: 'Lecturer teaching profile with attendance and marks overviews for each class',
  gallery: [
    { src: '/media/projects/academic-portal-admin.webp', width: 1600, height: 800, alt: 'Admin dashboard for adding a class and building its timetable' },
    { src: '/media/projects/academic-portal-student.webp', width: 1600, height: 678, alt: 'Student view with subject-wise attendance insights' }
  ]
}, {
  slug: 'buddyway',
  name: 'BuddyWay',
  shortDescription: 'Real-time location sharing: create a session, see everyone on a live map, and navigate to each other.',
  category: 'Full-stack engineering',
  label: 'Real-time location',
  summary: 'A shared live map for meeting up, with sessions, directions, and a common destination.',
  stack: ['Node.js', 'Express', 'Socket.IO', 'Leaflet.js', 'EJS'],
  role: 'Developer',
  type: 'Technical project',
  problem: 'Meeting up with a group usually means repeatedly asking where everyone is. A shared live map makes the next step obvious for everyone in the group.',
  overview: 'BuddyWay lets people create or join a session with a six-digit code, share their live location, and get directions to each other. Hosts can set a common destination for the whole group.',
  contributions: [
    'Built session creation and joining with unique six-digit codes.',
    'Implemented live location updates over Socket.IO with automatic reconnection.',
    'Built the interactive map and navigation panel with Leaflet.js.',
    'Added host controls for setting a common destination for all members.'
  ],
  architecture: ['Create or join a session', 'Socket.IO live updates', 'Leaflet map + directions'],
  result: 'A mobile-friendly, real-time location sharing app built on WebSockets and an interactive map.',
  github: 'https://github.com/itzfarzaan/BuddyWay',
  image: '/media/projects/buddyway.png',
  imageWidth: 1273,
  imageHeight: 871
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
  date: 'Jul 2026 – Present',
  company: 'Linkiat',
  logo: '/media/logos/linkiat.webp',
  monogram: 'LK',
  role: 'Artificial Intelligence Engineer',
  location: 'Riyadh, Saudi Arabia · Remote',
  current: true,
  details: [
    'Build production AI features end to end, from architecture and implementation to testing and integration planning.',
    'Develop agents, retrieval-augmented applications, workflow automation, and backend API integrations.',
    'Combine language models with deterministic application logic, human approval controls, and verifiable execution.',
    'Work with frontend, backend, and product teams on API contracts, authentication, safety controls, and phased delivery.'
  ],
  stack: ['LLM agents', 'RAG', 'Workflow automation', 'Backend APIs']
}, {
  date: 'May 2025 – Present',
  company: 'Creative Analytica',
  logo: '/media/logos/creative-analytica.webp',
  monogram: 'CA',
  role: 'Software Engineer',
  location: 'United Arab Emirates · Remote · Part-time',
  current: true,
  details: [
    'Lead the development of AqaarPro, a property management platform, covering system architecture, database design, and full-stack implementation.',
    'Built dedicated portals and workflows for property managers, owners, tenants, and vendors.',
    'Improve day-to-day operations through workflow automation, with attention to security and scalability.'
  ],
  stack: ['React', 'Node.js', 'Express', 'Supabase', 'PostgreSQL']
}, {
  date: 'Oct 2024 – Feb 2025',
  company: 'Artmac Soft',
  logo: '/media/logos/artmac-soft.webp',
  monogram: 'AS',
  role: 'Machine Learning Engineer Intern',
  location: 'Hyderabad, India',
  details: [
    'Worked on plant disease detection, from dataset preparation to model optimisation.',
    'Built an OpenCV and Pillow augmentation pipeline for roughly 20,000 images.',
    'Optimised MobileNetV2 in PyTorch to 88.35% accuracy through augmentation and architectural adjustments.',
    'Tuned hyperparameters and learning rate schedules.'
  ],
  stack: ['PyTorch', 'MobileNetV2', 'OpenCV', 'Pillow']
}];
