import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { profile, projects } from './portfolio/content';
import './App.css';
import { Hero, Spark, SystemArtwork } from './portfolio/Showcase';
import { About, Experience, ProjectTile, Projects } from './portfolio/Sections';
import SiteFooter from './portfolio/SiteFooter';
import './portfolio/sections.css';
import './portfolio/accents.css';
const Login = lazy(() => import('./Login'));
const Admin = lazy(() => import('./Admin'));
const EditBlog = lazy(() => import('./EditBlog'));
const EditProject = lazy(() => import('./EditProject'));
const LegacyProject = lazy(() => import('./SpecificProject'));
const Arrow = () => <span aria-hidden="true">↗</span>;
function RouteEffects() {
  const {
    pathname,
    hash
  } = useLocation();
  useEffect(() => {
    const project = projects.find(p => pathname === `/projects/${p.slug}`);
    document.title = `${project?.name || (pathname === '/' ? 'AI & Software Engineer' : pathname === '/projects' ? 'Projects' : 'Portfolio')} | Farzaan Ali`;
    const timer = setTimeout(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();else window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      if (!hash && pathname !== '/') document.getElementById('main')?.focus({ preventScroll: true });
    }, 20);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('entered');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname, hash]);
  return null;
}
function Header() {
  return <header className="site-header shell">
    <Link className="wordmark" to="/" aria-label="Farzaan Ali, home">fa<span>.</span></Link>
    <nav aria-label="Main navigation">
      <NavLink to="/projects">Projects</NavLink>
      <Link to="/#experience">Experience</Link>
      <a href={profile.blog}>Blog <Arrow /></a>
      <a href={profile.resume} target="_blank" rel="noreferrer">Resume <Arrow /></a>
    </nav>
  </header>;
}
const homeSections = [['about', 'About'], ['experience', 'Experience'], ['work', 'Projects'], ['journey', 'Journey'], ['writing', 'Writing']];
function SectionNavigation() {
  const [active, setActive] = useState('about');
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sections = homeSections.map(([id]) => document.getElementById(id));
        const reached = sections.filter(section => section && section.getBoundingClientRect().top <= 180);
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
        setActive(atBottom ? 'writing' : reached.at(-1)?.id || 'about');
      });
    };
    window.addEventListener('scroll', update, {
      passive: true
    });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <nav className="section-navigation" aria-label="On this page">
    {homeSections.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
  </nav>;
}
function Home() {
  return <div className="shell home">
    <Hero />
    <SectionNavigation />
    <About />
    <Experience />
    <Projects />

    <section className="journey-section" id="journey" aria-labelledby="journey-title">
      <div className="section-heading"><h2 id="journey-title">My <em>journey.</em></h2><span>How it came together</span></div>
      <div className="journey-composition"><div className="education-note reveal"><Spark /><span>Engineering foundations</span><strong>9.0</strong><span>CGPA · B.E. Computer Science</span><p>Artificial Intelligence & Machine Learning</p><p>Muffakham Jah College of Engineering and Technology<br />Osmania University · June 2026</p><div className="award-note">Academic excellence<br /><b>2023 / 2024 / 2025</b></div></div>
      <ol className="journey-path"><li className="reveal"><time>2022</time><div><h3>School in Hyderabad</h3><p>Completed school at AMS P. Obul Reddy Public School, studying Mathematics, Biology, Physics, and Chemistry.</p></div></li><li className="reveal"><time>2023–24</time><div><h3>Building with a community</h3><p>Web Developer / Webmaster at IEEE PES and Engineering Lead at IEEE CIS, MJCET. Built the chapter website and helped organise technical workshops.</p></div></li><li className="reveal"><time>2024</time><div><h3>Exploring AI research</h3><p>R&D team member at IEEE SMC, MJCET, from April to August. Contributed to work in language models and natural language processing.</p></div></li><li className="reveal"><time>2026</time><div><h3>Bringing the pieces together</h3><p>Completed my AI & ML engineering degree. Today, I build AI at Linkiat while continuing software engineering at Creative Analytica.</p></div></li></ol></div>
    </section>

    <section className="writing-section" id="writing" aria-labelledby="writing-title"><div className="writing-heading"><h2 id="writing-title">Blog & writing</h2><p>Notes from<br /><em>the rabbit hole.</em></p><a className="plain-link" href={profile.blog}>Visit Farzaan’s Notes ↗</a></div><a className="article-feature reveal" href="https://blog.farzaanali.com/posts/building-a-linear-regression-model-from-scratch-coding-cs229"><div className="article-cover" aria-hidden="true"><span>Learning, one model at a time.</span><b>ŷ = wx + b</b><svg viewBox="0 0 400 160"><path d="M30 10V140H380M50 125L350 25" fill="none" stroke="currentColor" strokeWidth="2" /><g fill="currentColor"><circle cx="65" cy="108" r="5" /><circle cx="105" cy="115" r="5" /><circle cx="150" cy="83" r="5" /><circle cx="200" cy="78" r="5" /><circle cx="265" cy="40" r="5" /><circle cx="300" cy="55" r="5" /><circle cx="343" cy="20" r="5" /></g></svg></div><div className="article-copy"><div><time dateTime="2025-05-25">25 May 2025</time><span>3 min read</span></div><h3>Building a Linear Regression model from Scratch | Coding CS229 <span aria-hidden="true">↗</span></h3></div></a></section>
  </div>;
}
function Work() {
  return <div className="shell projects-page">
    <div className="page-heading"><h1>Projects</h1><span>{projects.length} projects</span></div>
    <div className="collage collage-all">{projects.map(project => <ProjectTile key={project.slug} project={project} />)}</div>
  </div>;
}
function ProjectDetail() {
  const {
    id
  } = useParams();
  const index = projects.findIndex(project => project.slug === id);
  const project = projects[index];
  if (!project) return /^[a-f\d]{24}$/i.test(id) ? <LegacyProject /> : <NotFound />;
  const next = projects[(index + 1) % projects.length];
  return <article className="shell case-study">
    <Link className="back-link" to="/projects">← Projects</Link>
    <header className="case-header"><h1>{project.name}</h1><p>{project.shortDescription}</p>
      <dl className="case-facts"><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Stack</dt><dd>{project.stack.join(' / ')}</dd></div></dl>
      {(project.live || project.github) && <div className="project-links">{project.live && <a href={project.live}>Visit website <Arrow /></a>}{project.github && <a href={project.github}>Source on GitHub <Arrow /></a>}</div>}
    </header>
    <div className={`detail-art detail-${project.slug}`}>{project.image ? <figure className="project-screenshot"><img src={project.image} alt={project.imageAlt || `${project.name} application interface`} loading="lazy" />{project.imageCaption && <figcaption>{project.imageCaption}</figcaption>}</figure> : <SystemArtwork project={project} />}</div>
    <section><h2>Overview</h2><p>{project.problem}</p><p>{project.overview}</p></section>
    <section><h2>My contribution</h2><ul>{project.contributions.map(contribution => <li key={contribution}>{contribution}</li>)}</ul></section>
    <section><h2>System structure</h2><ol className="system-flow">{project.architecture.map(part => <li key={part}>{part}</li>)}</ol></section>
    {project.engineering && <section className="engineering-details"><h2>Engineering decisions</h2>{project.engineering.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</section>}
    <section><h2>Outcome</h2><p>{project.result}</p></section>
    <div className="next-project"><span>Next project</span><Link to={`/projects/${next.slug}`}>{next.name} <span aria-hidden="true">→</span></Link></div>
  </article>;
}
function BlogRedirect() {
  useEffect(() => {
    window.location.replace(profile.blog);
  }, []);
  return <p className="shell">Opening <a href={profile.blog}>the blog</a>.</p>;
}
function NotFound() {
  return <section className="shell not-found"><h1>Page not found</h1><Link to="/">Back to home</Link></section>;
}
export default function App() {
  return <BrowserRouter><RouteEffects /><a href="#main" className="skip-link">Skip to content</a><Header />
    <main id="main" tabIndex={-1}><Suspense fallback={<p className="shell loading" role="status">Loading…</p>}><Routes>
      <Route path="/" element={<Home />} /><Route path="/projects" element={<Work />} /><Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/experience" element={<Navigate to="/#experience" replace />} /><Route path="/about" element={<Navigate to="/#about" replace />} />
      <Route path="/blog/*" element={<BlogRedirect />} /><Route path="/login" element={<Login />} /><Route path="/admin" element={<Admin />} />
      <Route path="/admin/edit/:blogId" element={<EditBlog />} /><Route path="/admin/edit-project/:projectId" element={<EditProject />} /><Route path="*" element={<NotFound />} />
    </Routes></Suspense></main>
    <SiteFooter />
  </BrowserRouter>;
}
