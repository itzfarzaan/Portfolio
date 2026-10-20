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
    'An AI receptionist that answers, books, reschedules, and cancels using each practice’s own rules',
    'Clinic and admin dashboards with transcripts, recordings, and call outcomes',
    'Every appointment change confirmed by the caller and recorded'
  ],
  name: 'YoraHealth',
  shortDescription: 'An AI receptionist for dental practices, connecting patient calls with appointment scheduling and a clinic dashboard.',
  category: 'Voice AI & full-stack engineering',
  label: 'Dental AI receptionist',
  summary: 'From a patient call to a confirmed appointment, with the clinic team kept in the loop.',
  stack: ['React', 'Vite', 'JavaScript', 'Node.js', 'PostgreSQL'],
  role: 'End-to-end technical implementation',
  type: 'Live project',
  problem: 'Dental front desks have to answer patient calls while also looking after the patients in front of them. Missed calls and scheduling changes leave both patients and staff without a clear next step.',
  overview: 'YoraHealth is an AI receptionist that answers calls, schedules appointments, and handles patient questions using each practice’s own rules. I built the software behind it, from the public website to the dashboards clinic teams use every day.',
  flow: [
    { title: 'Answer', tech: 'AI receptionist', text: 'The receptionist picks up and answers with the practice’s own hours, services, and providers.' },
    { title: 'Understand', tech: 'Practice knowledge', text: 'It works out what the caller needs: a new booking, a change, or a question about the practice.' },
    { title: 'Confirm', tech: 'Caller confirmation', text: 'Appointments are booked, moved, or cancelled only after the caller confirms the details.' },
    { title: 'Record', tech: 'Call record', text: 'Each call keeps its summary, transcript, recording, and outcome in one place.' },
    { title: 'Review', tech: 'React dashboard', text: 'The clinic team sees outcomes, follow-ups, and the calls that need attention.' }
  ],
  contributions: [
    'Built the public website and the authenticated clinic and admin dashboards in React.',
    'Designed the clinic dashboard: a practice overview with KPI cards and a call-demand chart, a call list, and call detail with transcript, recording player, and outcome.',
    'Built appointment views and review filters so staff can find the calls that still need a follow-up.',
    'Built admin tools for setting up a clinic and its practice information: hours, providers, services, and greetings.',
    'Designed the data model for clinics, calls, appointments, and audit records, scoped so each clinic only ever sees its own data.',
    'Made appointment changes safe: nothing is booked, moved, or cancelled without the caller’s confirmation, and every change leaves an audit record.'
  ],
  architecture: ['Patient call → AI receptionist', 'Confirmed appointment changes', 'Clinic dashboard'],
  result: 'A live AI receptionist for dental practices, with a dashboard that keeps the clinic team in the loop on every call. The website’s dashboard preview uses fictional patient data.',
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
    'Publishing model from publisher down to issues, story arcs, sagas, and collections',
    'Dashboard with reading progress, a queue, and the next issue in every series',
    'Public demo playground that needs no account'
  ],
  name: 'ComicThread',
  shortDescription: 'A comic library and reading tracker that connects every series, reading order, and next issue.',
  category: 'Full-stack engineering',
  label: 'Comic library',
  summary: 'Every series, every reading order, and the next issue, connected in one library.',
  stack: ['React 19', 'TanStack Query', 'Vite', 'Express 5', 'PostgreSQL', 'JWT', 'Metron API'],
  role: 'Design and full-stack development',
  type: 'Personal project',
  problem: 'A comic run spreads across series, volumes, trades, and crossover events, so knowing what to read next depends on reading order across all of them.',
  overview: 'ComicThread is a comic library and reading tracker. It models the real publishing hierarchy, tracks progress by issue, collection, story arc, and saga, and works out the next issue in every series.',
  stats: [
    { value: '140', label: 'API route handlers across 18 routers' },
    { value: '9', label: 'Core entity types in the data model' },
    { value: '16', label: 'Numbered database migrations' },
    { value: '0', label: 'Network calls made by the demo' }
  ],
  flow: [
    { title: 'Catalog', tech: 'PostgreSQL · pg', text: 'Publishers, series, issues, collections, arcs, and sagas live in relational tables with explicit reading orders.' },
    { title: 'Sync', tech: 'Metron API', text: 'Followed series refresh their metadata and release dates on a schedule, within the API’s rate limit.' },
    { title: 'Serve', tech: 'Express 5 · JWT', text: 'Eighteen routers serve the app, and everything except sign-in requires a token.' },
    { title: 'Compute', tech: 'SQL CTEs', text: 'Queries work out the next unread issue in each series, alongside streaks and the reading heatmap.' },
    { title: 'Render', tech: 'React 19 · TanStack Query', text: 'The interface caches each view and refreshes it after every change.' }
  ],
  contributions: [
    'Designed the data model across 16 migrations: nine core entities, join tables for arcs, sagas, and collections, and composite indexes for the detail-page hot paths.',
    'Wrote the next-issue query as a three-stage SQL CTE that finds the lowest unread issue past the furthest point read, holds back dropped series, and leaves arc issues to their story arc.',
    'Built the Metron sync: requests spaced every 3.2 seconds to respect its limit, hourly checks that refresh series older than seven days, and an advisory lock so two processes never sync at once.',
    'Set up TanStack Query with a five-minute stale time and debounced cache invalidation after writes, so bursts of changes refresh the interface once.',
    'Built a demo mode that runs entirely in memory from a seed library with no network fallback, with tests proving it never calls fetch or touches local storage.',
    'Secured the owner account with bcrypt and JWTs, plus a login limiter that locks an address out for 24 hours after five failed attempts.'
  ],
  learnings: [
    'Modelling a real-world hierarchy that does not fit one neat tree',
    'Putting ordering logic in SQL where the data already lives',
    'Respecting another service’s rate limits in background work',
    'Making a demo safe by design rather than by convention'
  ],
  architecture: ['React + React Query interface', 'Express API with JWT auth', 'PostgreSQL publishing model'],
  result: 'A live comic library and reading tracker, with a public demo anyone can explore without an account.',
  live: 'https://comics.farzaanali.com',
  image: '/media/projects/comicthread.webp',
  imageWidth: 1440,
  imageHeight: 900,
  imageAlt: 'ComicThread landing page with the headline Every universe. In order.',
  imageCaption: 'ComicThread landing page. Cover art belongs to Marvel, DC, and Image Comics; ComicThread is a non-commercial portfolio project.',
  gallery: [
    { src: '/media/projects/comicthread-screen-1.webp', width: 1600, height: 910, alt: 'ComicThread dashboard with the current read, queue, and reading stats', caption: 'Dashboard: the current read, the queue, and reading stats.' },
    { src: '/media/projects/comicthread-screen-2.webp', width: 1600, height: 1056, alt: 'Saga page listing its story arcs in reading order with progress rings', caption: 'A saga, with its story arcs in reading order and progress for each.' },
    { src: '/media/projects/comicthread-screen-3.webp', width: 1600, height: 1199, alt: 'Dashboard rows for issues in progress, events in progress, and new releases', caption: 'Issues and events in progress, with new and upcoming releases.' },
    { src: '/media/projects/comicthread-screen-4.webp', width: 1600, height: 927, alt: 'Reading year heatmap with most-read characters and creators', caption: 'The reading year heatmap, with most-read characters and creators.' }
  ]
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
  shortDescription: 'A sensor glove that turns American Sign Language gestures into text and speech in real time.',
  name: 'The Gesture Glove',
  category: 'Hardware & accessibility',
  label: 'Assistive technology',
  summary: 'Turning physical gestures into text and speech through sensors and software.',
  stack: ['Arduino Uno', 'MPU6050', 'Flex sensors', 'Python', 'PySerial', 'k-NN', 'pyttsx3'],
  role: 'Serial communication & sensor integration',
  type: 'Technical project',
  problem: 'People who communicate in American Sign Language are often talking with people who do not know it. The Gesture Glove reads ASL gestures from the hand itself and turns them into text and speech as they happen.',
  overview: 'Flex sensors and an MPU6050 feed an Arduino Uno, which streams readings to a Python backend that classifies each gesture, shows it as text, and speaks it aloud.',
  stats: [
    { value: '<200 ms', label: 'From gesture to output' },
    { value: '100 Hz', label: 'Sensor sampling rate' },
    { value: '20', label: 'Gestures in the training set' },
    { value: '6-axis', label: 'Motion sensing with the MPU6050' }
  ],
  flow: [
    { title: 'Sense', tech: 'Flex sensors · MPU6050', text: 'Each finger’s bend and the hand’s orientation are read 100 times a second.' },
    { title: 'Collect', tech: 'Arduino Uno', text: 'The Arduino acquires the analog and motion readings and preprocesses them.' },
    { title: 'Transmit', tech: 'Serial · PySerial', text: 'Readings stream over serial to the Python backend.' },
    { title: 'Classify', tech: 'Moving average · k-NN', text: 'A moving average removes noise, then bend angles and orientation are matched against 20 trained gestures.' },
    { title: 'Speak', tech: 'pyttsx3 · Python GUI', text: 'The recognised gesture appears as text and is spoken aloud at the same time.' }
  ],
  contributions: [
    'Streamed sensor frames from the Arduino Uno to the Python backend over serial with PySerial, keeping up with the 100 Hz sampling rate.',
    'Wired the MPU6050 over I2C and the flex sensors through the Arduino’s analog inputs, combining both into a single reading per frame.',
    'Smoothed the raw readings with a moving average filter so sensor noise did not reach the classifier.',
    'Turned each frame into features, finger bend angles and hand orientation, for the k-NN gesture classifier.',
    'Kept the path from gesture to text and speech under 200 ms so the output keeps pace with the hand.',
    'Split sensor reading, classification, and GUI output into separate modules that could be developed and tested independently.'
  ],
  learnings: [
    'Integrating several analog and digital sensors with an embedded board',
    'Real-time signal filtering and sensor fusion',
    'Keeping a machine learning classifier fast enough for live input',
    'Debugging hardware and software together, where a fault can come from either side'
  ],
  architecture: ['Motion + flex sensors', 'Arduino → serial data', 'Gesture → text + speech'],
  result: 'A working wearable prototype that recognises ASL gestures and turns them into text and speech in real time.',
  github: 'https://github.com/itzfarzaan/Gesture-Glove',
  gallery: [
    { src: '/media/projects/gesture-glove-1.webp', width: 960, height: 1280, alt: 'Farzaan testing the gesture glove', caption: 'Testing the glove.', position: '45% 62%' },
    { src: '/media/projects/gesture-glove-2.webp', width: 1280, height: 960, alt: 'Close-up of the glove with flex sensors on each finger and an MPU6050 motion sensor', caption: 'A flex sensor on each finger, with the MPU6050 on the back of the hand.', position: '42% 50%' }
  ]
}, {
  slug: 'knowmydocs',
  name: 'KnowMyDocs',
  shortDescription: 'A retrieval-augmented chat app where anyone can upload notes, PDFs, or papers and get answers drawn from their own documents.',
  category: 'Applied AI',
  label: 'Document intelligence',
  summary: 'A conversation with your documents, built on context that stays connected.',
  stack: ['React', 'Vite', 'Express', 'Supabase', 'OpenAI embeddings', 'Llama 3.3 70B', 'MUI'],
  role: 'Design and full-stack development',
  type: 'Technical project',
  problem: 'Finding one answer in long notes, PDFs, or research papers usually means reading them again or hunting with Ctrl+F.',
  overview: 'KnowMyDocs is a retrieval-augmented generation app anyone can use. Upload a document, ask a question in plain language, and get an answer drawn only from that document, along with the passages it came from.',
  stats: [
    { value: '5', label: 'File types: PDF, TXT, MD, CSV, JSON' },
    { value: '500', label: 'Tokens per chunk, with 50 of overlap' },
    { value: 'Top 5', label: 'Passages retrieved per question' },
    { value: 'AES-256', label: 'Encryption for stored chunks' }
  ],
  flow: [
    { title: 'Upload', tech: 'Multer · pdf-parse', text: 'A file is uploaded or text is pasted, and the text is extracted from every page.' },
    { title: 'Chunk', tech: 'Llama 3.3 70B', text: 'An LLM splits the text at natural boundaries and titles each section, so context stays together.' },
    { title: 'Embed', tech: 'text-embedding-3-small', text: 'Chunks are embedded in one batch and stored, encrypted, against the user’s project.' },
    { title: 'Retrieve', tech: 'Cosine similarity', text: 'The question is embedded and compared with the user’s chunks to find the five closest.' },
    { title: 'Answer', tech: 'GPT-3.5 Turbo', text: 'The model answers only from those passages, and says so when the documents do not cover the question.' }
  ],
  contributions: [
    'Built semantic chunking on Llama 3.3 70B: 500-token chunks with 50 tokens of overlap, and a two-stage split for documents over 4,000 tokens that pre-splits into overlapping base chunks first.',
    'Guarded against the chunker rewriting text by checking every chunk against the source, with rule-based and token-based fallbacks when a check fails.',
    'Implemented retrieval with text-embedding-3-small and cosine similarity over vectors filtered by user and project, returning the top five passages with their similarity scores.',
    'Grounded answers with a system prompt that restricts the model to the retrieved passages, sanitised questions against prompt injection, and stored the sources with each conversation.',
    'Secured user data with AES-256-GCM encryption for chunk content, SHA-256-hashed API keys, and row-level security on every table.',
    'Opened the pipeline to developers through a REST API with API keys, a usage dashboard, and per-minute and per-day rate limits for each plan.'
  ],
  learnings: [
    'Chunking decides retrieval quality more than any other single step',
    'Using an LLM inside a pipeline needs checks against its own output',
    'Grounding prompts that admit when the answer is not there',
    'Designing an app for people and an API for developers on the same core'
  ],
  architecture: ['Upload a document', 'Context-preserving chunks', 'Retrieve context → answer'],
  result: 'A working RAG product built for anyone to use: a chat interface for people, and a REST API for developers building their own pipelines.',
  image: '/media/projects/knowmydocs.webp',
  imageWidth: 1800,
  imageHeight: 713,
  imageAlt: 'KnowMyDocs landing page with the headline Chat with your Documents. Get Answers Instantly!',
  video: { src: '/media/projects/knowmydocs-demo.mp4', poster: '/media/projects/knowmydocs-demo-poster.webp', width: 1550, height: 640, label: 'KnowMyDocs product overview video', caption: 'Product overview: the landing page, upload, projects, and the Document Processing Center.' }
}, {
  slug: 'interviewaide',
  shortDescription: 'Interview practice that writes questions from your role or CV, listens to spoken answers, and gives personal feedback.',
  name: 'InterviewAIde',
  category: 'Applied AI',
  label: 'Interview practice',
  summary: 'Interview preparation that responds to you, with room to think out loud.',
  stack: ['Python', 'Flask', 'Llama 3 70B', 'Groq', 'PyPDF2', 'JavaScript', 'Web Speech API'],
  role: 'Design and development',
  type: 'Technical project',
  problem: 'Reading a list of interview questions is different from answering them in a live conversation, and generic questions rarely match the role or the CV in front of the interviewer.',
  overview: 'InterviewAIde is an interview practice app. It writes questions for a job role or from an uploaded CV, takes typed or spoken answers, and finishes with personal feedback on how the interview went.',
  stats: [
    { value: '3', label: 'Practice modes: chat, CV, and verbal' },
    { value: '70B', label: 'Llama 3 parameters behind every question' },
    { value: '1–10', label: 'Questions per interview, chosen by the user' },
    { value: '5', label: 'Feedback sections in CV mode' }
  ],
  flow: [
    { title: 'Validate', tech: 'Llama 3 · Groq', text: 'The model checks the job role and extracts its professional domains, or explains why it is not a real role.' },
    { title: 'Parse', tech: 'PyPDF2', text: 'An uploaded CV is read page by page and kept in the session for questions and feedback.' },
    { title: 'Generate', tech: 'Llama 3 70B', text: 'Questions are written for the role or the CV and split into a list for the interview.' },
    { title: 'Answer', tech: 'Web Speech API', text: 'Questions can be read aloud, and spoken answers are transcribed as the user talks.' },
    { title: 'Feedback', tech: 'Llama 3 70B', text: 'Every question and answer is reviewed together to produce personal, structured feedback.' }
  ],
  contributions: [
    'Built three practice modes in Flask: questions for a job role, questions drawn from an uploaded CV, and a fully spoken interview.',
    'Added a validation step before generation, at a low temperature of 0.3, that rejects invalid roles and extracts professional domains to steer the questions generated at 0.7.',
    'Parsed CVs page by page with PyPDF2 and kept the text in the session so both questions and feedback could refer back to it.',
    'Built the verbal interview with the Web Speech API: speech synthesis reads each question, and continuous recognition with interim results transcribes the answer live.',
    'Designed feedback prompts that return overall performance, strengths, areas to improve, and advice, plus how well the answers match the CV in CV mode.',
    'Connected the JavaScript chat interface to Flask endpoints for starting interviews, uploading CVs, answering, and generating feedback.'
  ],
  learnings: [
    'Using a cheap validation call to keep generation on track',
    'Tuning temperature separately for checking and for writing',
    'Building voice input that feels natural in the browser',
    'Prompting for feedback that is specific rather than generic'
  ],
  architecture: ['Written or spoken response', 'Flask + Llama 3', 'Adaptive interview question'],
  result: 'An interview practice tool that adapts to the role or CV, supports spoken answers, and ends every session with structured feedback.',
  github: 'https://github.com/itzfarzaan/InterviewAIde',
  image: '/media/projects/interviewaide.webp',
  imageWidth: 1600,
  imageHeight: 804,
  imageAlt: 'InterviewAIde chat mode with front-end interview questions, answers, and feedback',
  gallery: [
    { src: '/media/projects/interviewaide-cv.webp', width: 1600, height: 805, alt: 'CV mode with an uploaded CV and a question drawn from it', caption: 'CV mode: questions drawn from the uploaded CV.' },
    { src: '/media/projects/interviewaide-feedback.webp', width: 1056, height: 756, alt: 'Structured feedback with strengths, areas to improve, and advice', caption: 'Feedback at the end of an interview.' }
  ]
}, {
  slug: 'academic-management-portal',
  shortDescription: 'Role-based dashboards for attendance, marks, and academic insights for admins, lecturers, and students.',
  name: 'Academic Management Portal',
  category: 'Full-stack engineering',
  label: 'Education systems',
  summary: 'Attendance, grades, and academic progress, organised around three distinct roles.',
  stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'EJS'],
  role: 'Design and development',
  type: 'Technical project',
  problem: 'Admins, lecturers, and students all work with the same academic records, but each needs different information and different ways to act on it.',
  overview: 'The Academic Management Portal gives each role its own dashboard. Admins set up classes and timetables, lecturers take attendance hour by hour and enter marks, and students follow their own attendance and results.',
  stats: [
    { value: '3', label: 'Roles, each with its own dashboard' },
    { value: '6', label: 'Mongoose data models' },
    { value: '6 × 6', label: 'Timetable grid: days by hours' },
    { value: '40%', label: 'Threshold that flags at-risk students' }
  ],
  flow: [
    { title: 'Configure', tech: 'Mongoose', text: 'The admin creates a class with its subjects and a six-day, six-hour timetable.' },
    { title: 'Assign', tech: 'Express', text: 'Lecturers are assigned subjects, with checks that stop duplicates and timetable clashes.' },
    { title: 'Record', tech: 'MongoDB', text: 'Attendance is stored hour by hour, with every student’s presence for that subject.' },
    { title: 'Analyze', tech: 'JavaScript', text: 'Attendance percentages, marks, and at-risk counts are calculated from the records.' },
    { title: 'Present', tech: 'EJS', text: 'Each role sees its own dashboard, with attendance gauges for students.' }
  ],
  contributions: [
    'Modelled the academic records in MongoDB with six Mongoose models: lecturers, students, classes, attendance, subject assignments, and marks.',
    'Built admin tools to create classes with a six-day, six-hour timetable, add lecturers and students, and assign subjects.',
    'Prevented clashes when assigning subjects with a unique index on class and subject, plus a time-conflict check against existing periods.',
    'Recorded attendance hour by hour, with each hour storing the subject, the lecturer, and every student’s presence.',
    'Calculated marks as the average of two internal tests plus an assignment, out of 30, and flagged students below 40%.',
    'Built insights for lecturers and students, including subject-wise attendance and at-risk counts, rendered in role-specific EJS dashboards.'
  ],
  learnings: [
    'Designing one data model that serves three very different users',
    'Shaping attendance data around how it is actually taken',
    'Catching scheduling conflicts before they reach the database',
    'Turning raw records into numbers people can act on'
  ],
  architecture: ['Student · Lecturer · Admin', 'Express + EJS', 'MongoDB academic records'],
  result: 'A single academic system for attendance, marks, and insights, with a dashboard built for each of its three roles.',
  github: 'https://github.com/itzfarzaan/Academic-Management-Portal',
  image: '/media/projects/academic-portal.webp',
  imageWidth: 1600,
  imageHeight: 810,
  imageAlt: 'Lecturer teaching profile with attendance and marks overviews for each class',
  gallery: [
    { src: '/media/projects/academic-portal-admin.webp', width: 1600, height: 800, alt: 'Admin form for adding a class and building its timetable', caption: 'Admin: adding a class and building its timetable.' },
    { src: '/media/projects/academic-portal-attendance.webp', width: 1600, height: 801, alt: 'Lecturer marking attendance for each student', caption: 'Lecturer: marking attendance for an hour.' },
    { src: '/media/projects/academic-portal-student-overview.webp', width: 1600, height: 803, alt: 'Student attendance overview with a gauge and a dated attendance log', caption: 'Student: overall attendance and a dated log.' },
    { src: '/media/projects/academic-portal-student.webp', width: 1600, height: 678, alt: 'Student view with subject-wise attendance gauges', caption: 'Student: attendance by subject.' }
  ]
}, {
  slug: 'buddyway',
  name: 'BuddyWay',
  shortDescription: 'Real-time location sharing: create a session, see everyone on a live map, and navigate to each other.',
  category: 'Full-stack engineering',
  label: 'Real-time location',
  summary: 'A shared live map for meeting up, with sessions, directions, and a common destination.',
  stack: ['Node.js', 'Express', 'Socket.IO', 'Leaflet', 'Leaflet Routing Machine', 'OpenStreetMap', 'EJS'],
  role: 'Design and development',
  type: 'Technical project',
  problem: 'Meeting up with a group usually means asking everyone where they are, again and again. A shared live map makes the next step obvious.',
  overview: 'BuddyWay lets people create or join a session with a code, share their live location on a map, and get directions to each other. The host can also set one destination for the whole group.',
  stats: [
    { value: '10', label: 'Real-time socket events' },
    { value: '60 s', label: 'Session cleanup cycle' },
    { value: '5 min', label: 'Grace period for an empty session' },
    { value: '30 min', label: 'Grace period after the host leaves' }
  ],
  flow: [
    { title: 'Locate', tech: 'Geolocation API', text: 'Each member’s browser watches their position with high accuracy and no cached readings.' },
    { title: 'Sync', tech: 'Socket.IO', text: 'Every session is its own room, so location updates only reach the people in it.' },
    { title: 'Persist', tech: 'Node.js', text: 'Sessions, members, and routes are saved so a server restart does not end them.' },
    { title: 'Route', tech: 'Leaflet · OSM', text: 'Directions are drawn to any member or to the group’s shared destination.' },
    { title: 'Expire', tech: 'Scheduled cleanup', text: 'Empty and abandoned sessions are cleared after a grace period.' }
  ],
  contributions: [
    'Built session rooms on Socket.IO so each group’s location updates stay inside its own room, across ten real-time events.',
    'Tracked live positions with the Geolocation API’s watchPosition, using high accuracy, no cached readings, and a ten-second timeout.',
    'Wrote a session manager that keeps members, locations, and routes, and saves them to disk so sessions survive a restart.',
    'Drew live maps and directions with Leaflet and Leaflet Routing Machine on OpenStreetMap, including a common destination the host can set or clear.',
    'Kept connections reliable with WebSockets, a polling fallback, tuned ping intervals, and automatic reconnection.',
    'Cleaned up sessions every 60 seconds, keeping empty sessions for five minutes and sessions whose host disconnected for thirty.'
  ],
  learnings: [
    'Scoping real-time events so they only reach the right people',
    'Handling flaky mobile connections without losing the session',
    'Balancing location accuracy against battery and noise',
    'Cleaning up shared state that nobody explicitly ends'
  ],
  architecture: ['Create or join a session', 'Socket.IO live updates', 'Leaflet map + directions'],
  result: 'A mobile-friendly, real-time location sharing app built on WebSockets and an interactive map.',
  github: 'https://github.com/itzfarzaan/BuddyWay',
  image: '/media/projects/buddyway.webp',
  imageWidth: 1273,
  imageHeight: 871,
  imageAlt: 'BuddyWay home screen with options to create or join a session'
}, {
  slug: 'legal-document-summarizer',
  name: 'Legal Document Summarizer',
  shortDescription: 'Upload a legal PDF and get a short abstractive summary from a legal language model, with translation.',
  category: 'Applied AI',
  label: 'Language & comprehension',
  summary: 'Making long legal documents easier to navigate, with summaries and translation.',
  stack: ['Python', 'Flask', 'Hugging Face Transformers', 'Legal-Pegasus', 'LangChain', 'googletrans'],
  role: 'Design and development',
  type: 'Technical project',
  problem: 'Legal documents are long and dense, and language can be a second barrier for the people who need to understand them.',
  overview: 'The Legal Document Summarizer is a Flask app that reads an uploaded legal PDF, summarises it with Legal-Pegasus, a model fine-tuned on legal text, and can translate the summary into another language.',
  stats: [
    { value: '1024', label: 'Input tokens per summary' },
    { value: '9', label: 'Beams in the beam search' },
    { value: '150–250', label: 'Tokens in each summary' },
    { value: '2', label: 'Endpoints: summarise and translate' }
  ],
  flow: [
    { title: 'Upload', tech: 'Flask', text: 'A legal PDF is uploaded through the web interface.' },
    { title: 'Parse', tech: 'LangChain · PyPDFLoader', text: 'The document text is extracted from the PDF.' },
    { title: 'Summarize', tech: 'Legal-Pegasus', text: 'A legal language model writes an abstractive summary with beam search.' },
    { title: 'Translate', tech: 'googletrans', text: 'The summary can be translated into another language.' }
  ],
  contributions: [
    'Built the Flask app with two endpoints, one for summarising and one for translating.',
    'Extracted document text with LangChain’s PyPDFLoader.',
    'Ran Legal-Pegasus through Hugging Face Transformers, loading the model once at startup instead of on every request.',
    'Tuned generation for readable summaries: input capped at 1024 tokens, beam search with nine beams, no repeated trigrams, and a length penalty for 150 to 250 token output.',
    'Added translation of the summary with googletrans, with an option to view the extracted text alongside it.'
  ],
  learnings: [
    'Picking a domain-specific model over a general one',
    'How beam search settings shape summary quality',
    'Working within a model’s input length limit'
  ],
  architecture: ['Legal document input', 'Legal-Pegasus summarization', 'Summary + translation'],
  result: 'A compact tool that turns a legal PDF into a short summary and translates it, as a starting point rather than a substitute for reading the document.',
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
