import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { projects } from './content';

// Live figures are loaded only on the project page that has one.
const figures = { glove: lazy(() => import('./glove/GloveFigure.jsx')) };

const Arrow = () => <span aria-hidden="true">↗</span>;
const domain = url => url?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// One case-study layout for every project. Optional content (stats, flow, features, video, learnings,
// gallery, moment) only renders when a project has it; the flow falls back to `architecture`.
// A project with a `story` instead tells How it works as one continuous section, images in between.
function Section({ title, children }) {
  return <section className="cs-section">
    <h2>{title}</h2>
    <div className="cs-section-body">{children}</div>
  </section>;
}

function Media({ project }) {
  if (project.gallery && !project.image) return <div className="cs-gallery">
    {project.gallery.slice(0, 2).map(photo => <figure key={photo.src} className={photo.height > photo.width ? 'is-tall' : undefined}>
      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} style={{ objectPosition: photo.position }} />
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>)}
  </div>;
  if (!project.image) return null;
  return <figure className="cs-shot">
    <div className="browser">
      <div className="browser-bar" aria-hidden="true"><i /><i /><i /><span>{domain(project.live) || project.name}</span></div>
      <img src={project.image} alt={project.imageAlt || `${project.name} interface`} width={project.imageWidth} height={project.imageHeight} />
    </div>
    {project.imageCaption && <figcaption>{project.imageCaption}</figcaption>}
  </figure>;
}

function Figure({ figure, video }) {
  if (figure.video) return <figure className="cs-video">
    <video src={video.src} poster={video.poster} width={video.width} height={video.height} controls playsInline preload="metadata" aria-label={video.label} />
    {video.caption && <figcaption>{video.caption}</figcaption>}
  </figure>;
  return <figure className={figure.height > figure.width ? 'is-tall' : undefined}>
    <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" />
    {figure.caption && <figcaption>{figure.caption}</figcaption>}
  </figure>;
}

function Story({ project }) {
  return <Section title="How it works">
    <div className="cs-story">{project.story.map(block => <div key={block.title} className="cs-story-block">
      <h3>{block.title}</h3>
      {block.text?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      {block.list && <ul className="cs-list">{block.list.map(item => <li key={item}>{item}</li>)}</ul>}
      {block.figures?.map(figure => <Figure key={figure.src || 'video'} figure={figure} video={project.video} />)}
    </div>)}</div>
  </Section>;
}

function LiveFigure({ name }) {
  const Figure = figures[name];
  return <Section title="See it live">
    <Suspense fallback={<div className="cs-figure-loading" />}><Figure /></Suspense>
  </Section>;
}

export default function CaseStudy({ project }) {
  const index = projects.indexOf(project), next = projects[(index + 1) % projects.length];
  const story = Boolean(project.story);
  const flow = story ? [] : project.flow || project.architecture.map(step => ({ title: step }));
  const screens = !story && project.image && project.gallery;
  return <article className="shell cs">
    <Link className="cs-back" to="/projects"><span aria-hidden="true">←</span> All projects</Link>

    <header className="cs-header">
      <h1>{project.name}</h1>
      <p className="cs-type">{project.type} · {project.category}</p>
      <p className="cs-lede">{project.shortDescription}</p>
      {(project.live || project.github) && <div className="cs-actions">
        {project.live && <a className="button-dark" href={project.live}>Visit site <Arrow /></a>}
        {project.github && <a className={project.live ? 'button-line' : 'button-dark'} href={project.github}>Source on GitHub <Arrow /></a>}
      </div>}
    </header>

    <Media project={project} />

    {project.stats && <dl className="cs-stats">{project.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>}

    <Section title="Overview">
      <p className="cs-big">{project.problem}</p>
      <p>{project.overview}</p>
      {project.origin && <p>{project.origin}</p>}
      <dl className="cs-facts">
        <div><dt>Role</dt><dd>{project.role}</dd></div>
        <div><dt>Stack</dt><dd><ul className="tag-list">{project.stack.map(tag => <li key={tag}>{tag}</li>)}</ul></dd></div>
      </dl>
      {project.features && <ul className="cs-checks">{project.features.map(item => <li key={item}>{item}</li>)}</ul>}
    </Section>

    {project.figure && <LiveFigure name={project.figure} />}

    {story && <Story project={project} />}

    {!story && project.video && <Section title="Product demo">
      <figure className="cs-video">
        <video src={project.video.src} poster={project.video.poster} width={project.video.width} height={project.video.height} controls playsInline preload="metadata" aria-label={project.video.label} />
        {project.video.caption && <figcaption>{project.video.caption}</figcaption>}
      </figure>
    </Section>}

    {!story && <Section title="How it works">
      <ol className={`cs-flow${flow.some(step => step.text) ? '' : ' is-compact'}`}>
        {flow.map((step, i) => <li key={step.title}>
          <span className="cs-step">{String(i + 1).padStart(2, '0')}</span>
          <strong>{step.title}</strong>
          {step.tech && <span className="cs-tech">{step.tech}</span>}
          {step.text && <p>{step.text}</p>}
        </li>)}
      </ol>
    </Section>}

    {!story && project.engineering && <Section title="Engineering decisions">
      <div className="cs-notes">{project.engineering.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
    </Section>}

    {!story && <Section title="My contribution">
      <ul className="cs-list">{project.contributions.map(item => <li key={item}>{item}</li>)}</ul>
    </Section>}

    {screens && <Section title="Screens">
      <div className="cs-screens">{project.gallery.map(photo => <figure key={photo.src}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div>
    </Section>}

    {project.learnings && <Section title="What I learned">
      <ul className="cs-list">{project.learnings.map(item => <li key={item}>{item}</li>)}</ul>
    </Section>}

    <Section title="Outcome">
      <p className="cs-big">{project.result}</p>
      {project.outcomeImage && <div className="cs-story"><Figure figure={project.outcomeImage} /></div>}
      {project.moment && <figure className="cs-moment">
        <img src={project.moment.src} alt={project.moment.alt} width={project.moment.width} height={project.moment.height} loading="lazy" />
        <figcaption>{project.moment.caption}</figcaption>
      </figure>}
    </Section>

    <Link className="cs-next" to={`/projects/${next.slug}`}>
      <span className="cs-next-label">Next project</span>
      <strong>{next.name}</strong>
      <span className="cs-next-lede">{next.shortDescription}</span>
      <span className="cs-next-arrow" aria-hidden="true">→</span>
    </Link>
  </article>;
}
