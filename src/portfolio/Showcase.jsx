import { Link } from 'react-router-dom';
import { profile } from './content';
export function Spark({
  className = ''
}) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 0 58 31 85 15 69 42 100 50 69 58 85 85 58 69 50 100 42 69 15 85 31 58 0 50 31 42 15 15 42 31Z" fill="currentColor" /></svg>;
}
export function Hero() {
  return <section className="creative-hero" aria-labelledby="intro-title">
    <div className="hero-topline"><span>Mohammed Farzaan Ali</span></div>
    <div className="hero-composition">
      <div className="hero-type"><p className="hello-note">Hello, I’m</p><h1 id="intro-title">Farzaan<span>Ali<span className="name-dot">.</span></span></h1>
        <p className="hero-introduction">AI & software engineer</p>
      </div>
      <div className="portrait-composition"><div className="portrait-orbit" /><div className="portrait-mat"><img src="/media/farzaan-portrait.webp" alt="Mohammed Farzaan Ali" width="1321" height="1600" fetchPriority="high" /></div><span className="portrait-caption">Hyderabad, India</span></div>
    </div>
    <div className="hero-bottom"><p>I build AI applications and full-stack software.<br />Currently at <strong>Linkiat</strong> & <strong>Creative Analytica.</strong></p><a href="#work" className="round-link">Explore my work <span aria-hidden="true">↓</span></a><div className="hero-socials"><a href={profile.github}>GitHub ↗</a><a href={profile.linkedin}>LinkedIn ↗</a></div></div>
  </section>;
}
export function SystemArtwork({
  project
}) {
  return <div className={`system-artwork system-${project.slug}`} role="img" aria-label={`Conceptual system map: ${project.architecture.join(', ')}`}>
    <span className="map-label">System map</span>
    {project.slug === 'aqaarpro' ? <><div className="portal-labels"><span>Manager</span><span>Owner</span><span>Tenant</span><span>Vendor</span></div><svg viewBox="0 0 600 200" aria-hidden="true"><path d="M70 0V65Q70 100 105 100H265Q300 100 300 135V200M225 0V100M375 0V100M530 0V65Q530 100 495 100H300" stroke="currentColor" strokeWidth="3" fill="none" /><circle cx="300" cy="140" r="38" fill="var(--coral)" /><path d="M285 149V135L300 123 315 135V149M295 149V140H305V149" stroke="var(--ink)" strokeWidth="2" fill="none" /></svg><strong>AqaarPro</strong><p>Four roles. One connected system.</p></> : project.slug === 'knowmydocs' ? <><div className="document-art"><span>DOCUMENT</span><i /><i /><i /><i /><i /></div><span className="map-connector" aria-hidden="true">↘</span><div className="retrieval-art"><span>CONTEXT</span><b>Find.<br />Connect.<br /><em>Understand.</em></b></div><p>{project.architecture.join(' → ')}</p></> : <div className="generic-system">{project.architecture.map((part, index) => <div key={part}><strong>{part}</strong>{index < 2 && <b aria-hidden="true">↓</b>}</div>)}</div>}
  </div>;
}
export function ProjectStage({
  project,
  heading = 'h3'
}) {
  const Heading = heading;
  return <article className={`project-stage stage-${project.slug}`}>
    <div className="project-stage-copy"><span className="project-kind">{project.category}</span><Heading>{project.name}</Heading><p>{project.shortDescription}</p><div className="stage-stack">{project.stack.slice(0, 4).join(' · ')}</div><Link className="case-link" to={`/projects/${project.slug}`}>Explore the project <span aria-hidden="true">↗</span></Link></div>
    <div className="project-stage-art">{project.image ? <Link className="screen-composition" to={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true"><div className="screen-top"><i /><i /><i /><span>{project.name}</span></div><img src={project.image} alt="" loading="lazy" width={project.imageWidth || (project.slug === 'interviewaide' ? 1896 : 1903)} height={project.imageHeight || (project.slug === 'interviewaide' ? 953 : 958)} /></Link> : <SystemArtwork project={project} />}</div>
  </article>;
}
