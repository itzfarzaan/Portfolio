import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { experience, projects } from './content';
import AsciiTitle from './AsciiTitle';

const Arrow = () => <span aria-hidden="true">↗</span>;
const domain = url => url?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function SectionHeader({ id, title, meta }) {
  return <header className="section-head">
    <AsciiTitle id={id}>{title}</AsciiTitle>
    <span className="section-leader" aria-hidden="true" />
    <span className="section-meta">{meta}</span>
  </header>;
}

export function About() {
  return <section className="home-section about" id="about" aria-labelledby="about-title">
    <SectionHeader id="about-title" title="About" meta="AI & software engineer" />
    <div className="about-intro">
      <p className="about-lead">I build technology that <em>closes gaps</em> between people.</p>
      <div className="about-body">
        <p>My first hackathon project was a glove that turned sign language into speech and text. Years later, my final-year project went further: a generative Transformer that converts speech into Indian Sign Language poses, performed live by a 3D avatar.</p>
        <p>That idea runs through most of my work. Whether it is a voice receptionist, a document you can talk to, or an avatar that signs, <span className="about-key">I like building the bridge between what people need and what technology can already do.</span></p>
      </div>
    </div>
    <dl className="about-facts">
      <div><dt>First build</dt><dd>Sign language glove, 2023</dd></div>
      <div><dt>Final project</dt><dd>Real-time ISL translation</dd></div>
      <div><dt>Graduated</dt><dd>Rank 9 of 466</dd></div>
      <div><dt>Writing</dt><dd><a href="https://blog.farzaanali.com">blog.farzaanali.com ↗</a></dd></div>
    </dl>
  </section>;
}

export function Experience() {
  const current = experience.filter(item => item.current).length;
  return <section className="home-section" id="experience" aria-labelledby="experience-title">
    <SectionHeader id="experience-title" title="Experience" meta={`${experience.length} roles · ${current} current`} />
    <ol className="xp-list">
      {experience.map(item => <li key={item.company} className="xp-row reveal">
        <div className="xp-when"><span>{item.date}</span>{item.current && <span className="xp-current">Current</span>}</div>
        <div className="xp-who">
          <span className={`xp-mark${item.logo ? ' xp-logo' : ''}`} aria-hidden="true">{item.logo ? <img src={item.logo} alt="" loading="lazy" /> : item.monogram}</span>
          <div><h3>{item.company}</h3><p className="xp-role">{item.role}</p><p className="xp-where">{item.location}</p></div>
        </div>
        <div className="xp-what">
          <ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
          <ul className="tag-list" aria-label="Tools and focus">{item.stack.map(tag => <li key={tag}>{tag}</li>)}</ul>
        </div>
      </li>)}
    </ol>
  </section>;
}

// A slanted browser window that straightens on hover.
// A project can set `cover` to show a different shot here than at the top of its case study.
function PreviewShot({ project }) {
  const shot = project.cover || { src: project.image, width: project.imageWidth, height: project.imageHeight };
  return <Link className="feature-shot" to={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
    <div className="browser">
      <div className="browser-bar"><i /><i /><i /><span>{domain(project.live) || project.name}</span></div>
      <img src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" />
    </div>
  </Link>;
}

function FeaturedProject({ project }) {
  return <article className="feature reveal" aria-labelledby={`feature-${project.slug}`}>
    <PreviewShot project={project} />
    <div className="feature-copy">
      <h3 id={`feature-${project.slug}`}>{project.name}</h3>
      <p className="feature-type">{project.type} · {project.category}</p>
      <p className="feature-lede">{project.shortDescription}</p>
      <ul className="feature-points">{project.highlights.map(point => <li key={point}>{point}</li>)}</ul>
      <ul className="tag-list" aria-label="Stack">{project.stack.slice(0, 5).map(tag => <li key={tag}>{tag}</li>)}</ul>
      <div className="feature-links">
        <Link className="button-dark" to={`/projects/${project.slug}`}>Case study <span aria-hidden="true">→</span></Link>
        {project.live && <a className="button-line" href={project.live}>Visit site <Arrow /></a>}
      </div>
    </div>
  </article>;
}

export function ProjectTile({ project }) {
  return <Link className="tile reveal" to={`/projects/${project.slug}`}>
    <span className={`tile-shot${!project.image && project.gallery ? ' tile-split' : ''}`}>
      {project.image
        ? <img src={project.image} alt="" width={project.imageWidth} height={project.imageHeight} loading="lazy" />
        : project.gallery
          // Two photos meet on a diagonal seam, so the person and the hardware both get room.
          ? project.gallery.slice(0, 2).map(photo => <img key={photo.src} src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" style={{ objectPosition: photo.position }} />)
          : <ol className="tile-flow" aria-label="How it works">{project.architecture.map(step => <li key={step}>{step}</li>)}</ol>}
    </span>
    <div className="tile-copy">
      <strong>{project.name}</strong>
      <span className="tile-lede">{project.shortDescription}</span>
      <span className="tile-stack">{project.stack.slice(0, 3).join(' · ')}</span>
    </div>
    <span className="tile-arrow" aria-hidden="true">↗</span>
  </Link>;
}

// The last tile cycles through every project on a timer, so the full collection is one click away.
function ViewAllTile() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex(current => (current + 1) % projects.length), 2600);
    return () => clearInterval(timer);
  }, [paused]);
  const project = projects[index];
  return <Link className="tile tile-all reveal" to="/projects" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <span className="tile-cycle" aria-hidden="true">
      <span className="tile-cycle-count">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
      <span key={project.slug} className="tile-cycle-item"><b>{project.name}</b><span>{project.category}</span></span>
      <span key={`bar-${index}-${paused}`} className={`tile-cycle-bar${paused ? ' is-paused' : ''}`} />
    </span>
    <strong>View all projects</strong>
    <span className="tile-all-note">{projects.length} projects, with case studies</span>
    <span className="tile-arrow" aria-hidden="true">→</span>
  </Link>;
}

const collage = ['gesture-glove', 'knowmydocs', 'aqaarpro'];

export function Projects() {
  const featured = projects.filter(project => project.featured);
  const rest = collage.map(slug => projects.find(project => project.slug === slug)).filter(Boolean);
  return <section className="home-section" id="work" aria-labelledby="work-title">
    <SectionHeader id="work-title" title="Projects" meta={<Link className="section-link" to="/projects">View all <span aria-hidden="true">→</span></Link>} />
    <div className="feature-list">{featured.map(project => <FeaturedProject key={project.slug} project={project} />)}</div>
    <h3 className="collage-title">More projects</h3>
    <div className="collage">
      {rest.map(project => <ProjectTile key={project.slug} project={project} />)}
      <ViewAllTile />
    </div>
  </section>;
}
