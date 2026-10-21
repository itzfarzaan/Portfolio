import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { profile, projects } from './portfolio/content';
import './App.css';
import { Hero } from './portfolio/Showcase';
import CaseStudy from './portfolio/CaseStudy';
import './portfolio/case-study.css';
import { About, Experience, ProjectTile, Projects } from './portfolio/Sections';
import Journey from './portfolio/Journey';
import './portfolio/journey.css';
import SiteFooter from './portfolio/SiteFooter';
import ThemeToggle from './portfolio/ThemeToggle';
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
      <ThemeToggle />
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

    <Journey />

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
  const project = projects.find(item => item.slug === id);
  if (!project) return /^[a-f\d]{24}$/i.test(id) ? <LegacyProject /> : <NotFound />;
  return <CaseStudy project={project} />;
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
