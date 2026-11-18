import { useEffect, useRef, useState } from 'react';
import './App.css';

const PROJECTS = [
  {
    // title: 'Inventory & Order Platform',
    // text: 'Django + React inventory management platform.',
    // tags: 'Django · PostgreSQL · React',
    image: '/images/abc.png',
  },
  {
    // title: 'Realtime Analytics API',
    // text: 'FastAPI analytics with live WebSocket updates.',
    // tags: 'FastAPI · Redis · Docker',
    image: '/images/im1.jpeg',
  },
  {
    // title: 'Job Board SaaS',
    // text: 'A modern multi-tenant job board platform.',
    // tags: 'Python · Django · React',
    image: '/images/img2.png',
  },
];

// Put your image in public/images/ and change the file name here
const BG_IMAGE = '/images/projects-bg.jpg';

// >>> Change ONLY these two numbers to resize the cards. Everything else follows. <<<
const CARD_W = 480;
const CARD_H = 580;
const CARD_GAP = CARD_W * 0.72;   // distance between neighbouring cards

export default function App() {
  const canvasRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalProjects = PROJECTS.length;

  const nextProject = () => setActiveIndex((i) => (i + 1) % totalProjects);
  const prevProject = () => setActiveIndex((i) => (i - 1 + totalProjects) % totalProjects);

  // Auto-advance every 3s; restarts whenever the slide changes or hover pauses it
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActiveIndex((i) => (i + 1) % totalProjects), 3000);
    return () => clearTimeout(id);
  }, [activeIndex, paused, totalProjects]);

  const getCardStyle = (index) => {
    let offset = index - activeIndex;
    if (offset > totalProjects / 2) offset -= totalProjects;
    if (offset < -totalProjects / 2) offset += totalProjects;

    const isActive = offset === 0;
    const x = offset * CARD_GAP;
    const z = isActive ? 0 : -150;      // translateZ on the front card upscales it through the perspective -> blurry
    const rotate = offset * -28;
    const scale = isActive ? 1 : 0.85;

    return {
      transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`,
      opacity: Math.abs(offset) > 1 ? 0 : 1,
      filter: isActive ? 'none' : 'brightness(.6)',
      zIndex: 10 - Math.abs(offset),
    };
  };
  const [errors, setErrors] = useState({ name: '', email: '', mobile: '', message: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    nodes.forEach((node) => observer.observe(node));

    const canvas = canvasRef.current;
    if (!canvas) return () => observer.disconnect();
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, frameId;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dots = [];
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let x = 0; x < width; x += 30) {
        for (let y = height * .55; y < height + 30; y += 30) {
          if (Math.random() > .55) dots.push({ x, y, phase: Math.random() * Math.PI * 2 });
        }
      }
    };
    resize();
    window.addEventListener('resize', resize);
    let time = 0;
    const draw = () => {
      time += reduced ? 0 : .016;
      ctx.clearRect(0, 0, width, height);
      dots.forEach((dot) => {
        const glow = .5 + .5 * Math.sin(time * 1.4 + dot.phase);
        ctx.fillStyle = `rgba(57,231,95,${.06 + .22 * glow})`;
        ctx.beginPath(); ctx.arc(dot.x, dot.y, 1.3, 0, Math.PI * 2); ctx.fill();
      });
      if (!reduced) frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const mobile = String(data.get('mobile') || '').trim();
    const message = String(data.get('message') || '').trim();
    const next = {
      name: /^[A-Za-z ]{3,30}$/.test(name) ? '' : 'Name must contain only letters and spaces (3-30 characters).',
      email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ? '' : 'Enter a valid email address.',
      mobile: /^[6-9][0-9]{9}$/.test(mobile) ? '' : 'Mobile must contain 10 digits and start with 6, 7, 8 or 9.',
      message: message.length >= 10 ? '' : 'Message must contain at least 10 characters.'
    };
    setErrors(next);
    if (Object.values(next).every((value) => !value)) {
      setSuccess('Thank you! Your details have been validated. Please connect this form to your email or backend to receive enquiries.');
      form.reset();
    } else setSuccess('');
  };

  return (
    <>

<header>
<nav className="wrap">
<div className="logo">
<div className="mark">
  <img src="images/logo.png" alt="Web Zelora Logo" />
</div>
<div className="word">WEB <b>ZELORA</b><span className="tag">BUILD · MARKET · GROW</span></div>
</div>
<div className="navlinks">
<a href="#" className="active">Home</a>
<a href="#services">Services</a>
<a href="#work">Portfolio</a>
<a href="#about">About</a>
<a href="#contact">Contact</a>
</div>
<a href="#contact" className="btn btn-outline btn-sm">Get Started
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
</a>
</nav>
</header>
<section className="hero-section">
<video
  className="hero-video"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
>
  <source src="/video/webzeloralogo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<div className="hero-overlay"></div>
<div className="hero-content">
<h1 style={{ fontSize: "55px" }}>WEB ZELORA</h1>
<p>We don't just build Websites, We build businesses.</p>
<a href="#contact" className="hero-btn">Get Started</a>
</div>
</section>
<section className="hero">
<canvas id="hero-canvas" ref={canvasRef}></canvas>
<div className="wrap">
<div>
<div className="badge"><span className="dot"></span>Digital Marketing & Website Development Agency</div>
<h1>
<span className="line">We Build Better</span>
<span className="line">Websites &</span>
<span className="line">Stronger Brands</span>
</h1>
<p className="lead">At Web Zelora, we create modern websites and result-driven digital marketing strategies that help your business grow online and stand out from the crowd.</p>
<div className="hero-ctas">
<a href="#contact" className="btn btn-primary">Get Started
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
</a>
<a href="#services" className="btn btn-outline">Our Services
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
</a>
</div>
<div className="hero-feats">
<div className="feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="10" height="14" rx="1.5"></rect><path d="M17 8h3v9h-3z"></path></svg>Responsive Design</div>
<div className="feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"></circle><path d="M20 20l-4.3-4.3"></path></svg>SEO Optimized</div>
<div className="feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V9M11 19V5M18 19v-7"></path></svg>Result Driven</div>
</div>
</div>
<div className="hero-visual">
<svg className="swoosh" viewBox="0 0 460 400" fill="none">
<path d="M40 260 C 140 340, 300 340, 380 220 C 430 150, 360 60, 260 80 C 180 96, 170 180, 250 210 C 320 236, 400 190, 400 130" stroke="#1E7A3E" strokeWidth="1.5" strokeDasharray="10 8" opacity="0.55"></path>
<path d="M40 260 C 140 340, 300 340, 380 220 C 430 150, 360 60, 260 80" stroke="#39E75F" strokeWidth="1.5" strokeDasharray="6 900" opacity="0.9"></path>
</svg>
<div className="float-badge fb-1">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V9M11 19V5M18 19v-7"></path></svg>
<div><b>More Traffic</b><span className="sub">More Customers</span></div>
</div>
<div className="float-badge fb-2"><b>SEO</b> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></div>
<div className="float-badge fb-3">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6l-4 6 4 6M16 6l4 6-4 6"></path></svg>
</div>
<div className="laptop">
<div className="screen">
<div className="brand">WEB <b>ZELORA</b></div>
<h4>Your Success Starts with a Great Website</h4>
<div className="mini-btn">Get Started →</div>
</div>
<div className="base"></div>
</div>
<div className="phone">
<div className="ps">
<svg viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
<path d="M4 40 L28 24 L46 32 L96 6"></path>
<path d="M78 6 L96 6 L96 22"></path>
</svg>
</div>
</div>
</div>
</div>
</section>
<section className="section" id="services">
<div className="wrap">
<div className="section-head reveal">
<div>
<div className="eyebrow">Our Services</div>
<h2>Everything You Need<br />to <b>Grow Online</b></h2>
</div>
<p>From stunning websites to powerful marketing strategies, we offer complete digital solutions to help your business reach, engage and convert.</p>
</div>
<div className="svc-grid reveal-stagger">
<div className="svc-card">
<div className="icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6L2 12l6 6M16 6l6 6-6 6"></path></svg></div>
<h3>Website Development</h3>
<p>Modern, fast and responsive websites built with the latest technologies.</p>
<a href="#">Learn More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</div>
<div className="svc-card">
<div className="icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1z"></path><path d="M16 8a4 4 0 010 8M19 5a8 8 0 010 14"></path></svg></div>
<h3>Digital Marketing</h3>
<p>Get found, get leads, get sales with our data-driven marketing strategies.</p>
<a href="#">Learn More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</div>
<div className="svc-card">
<div className="icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg></div>
<h3>SEO Services</h3>
<p>Rank higher, attract more traffic and grow your brand.</p>
<a href="#">Learn More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</div>
<div className="svc-card">
<div className="icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="10" r="1"></circle><circle cx="14" cy="8" r="1"></circle><circle cx="15" cy="14" r="1"></circle><path d="M12 21a2 2 0 01-2-2c0-1 .8-1.2.8-2.2S9.8 15 8.5 15"></path></svg></div>
<h3>UI/UX Design</h3>
<p>User-friendly designs that look great and drive results.</p>
<a href="#">Learn More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</div>
<div className="svc-card">
<div className="icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="14" height="10" rx="2"></rect><path d="M21 8l-4 3 4 3z"></path></svg></div>
<h3>Social Media Management</h3>
<p>Build your presence, engage your audience and grow your community.</p>
<a href="#">Learn More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</div>
<div className="svc-card">
<div className="icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle></svg></div>
<h3>Branding & Design</h3>
<p>Memorable brand identity that sets you apart.</p>
<a href="#">Learn More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</div>
</div>
</div>
</section>
<section className="section" id="impact">
<div className="wrap">
<div className="impact-row reveal">
<div>
<div className="eyebrow">Our Impact</div>
<h2>Numbers That Tell <b>Our Story</b></h2>
</div>
<div className="stat"><b data-target="50" data-suffix="+">40+</b><span>Happy Clients</span></div>
<div className="stat"><b data-target="100" data-suffix="+">40+</b><span>Projects Completed</span></div>
<div className="stat"><b data-target="5" data-suffix="+">2+</b><span>Years Experience</span></div>
<div className="stat"><b data-target="98" data-suffix="%">100%</b><span>Client Satisfaction</span></div>
</div>
</div>
</section>
<section className="section" id="process">
<div className="wrap">
<div className="process-top">
<div className="process-copy reveal">
<div className="eyebrow">Our Process</div>
<h2 style={{ fontFamily: 'var(--disp)', fontWeight: 700, fontSize: 'clamp(26px,3vw,34px)', margin: '0 0 14px', lineHeight: 1.2 }}>From Idea to<br />Impact — <b style={{ color: 'var(--green)' }}>Simple!</b></h2>
<p>We keep the process transparent, collaborative and hassle-free. Your goals + Our expertise = Real results.</p>
<a href="#contact" className="btn btn-primary">Start Your Project
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
</a>
</div>
<div className="process-track" id="process-track">
<div className="step" data-step="1">
<div className="idx">01</div>
<div className="num-icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.5 8.5 0 01-12.4 7.4L4 20l1.1-4.6A8.5 8.5 0 1121 11.5z"></path></svg></div>
<h4>Discover</h4>
<p>We understand your business, goals and requirements.</p>
</div>
<div className="arrow-between"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></div>
<div className="step" data-step="2">
<div className="idx">02</div>
<div className="num-icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"></path></svg></div>
<h4>Plan</h4>
<p>We create a strategy and design plan tailored to your needs.</p>
</div>
<div className="arrow-between"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></div>
<div className="step" data-step="3">
<div className="idx">03</div>
<div className="num-icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6L2 12l6 6M16 6l6 6-6 6"></path></svg></div>
<h4>Build</h4>
<p>We develop, design and optimize for performance.</p>
</div>
<div className="arrow-between"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></div>
<div className="step" data-step="4">
<div className="idx">04</div>
<div className="num-icn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V9M11 19V5M18 19v-7"></path></svg></div>
<h4>Grow</h4>
<p>You get results, more traffic and higher conversions.</p>
</div>
</div>
</div>
</div>
</section>
<section className="section" id="work">
<div className="wrap">
<div className="work-head-row reveal">
<div className="l">
<div className="eyebrow">Our Work</div>
<h2>Recent <b>Projects</b></h2>
<p>Take a look at some of our recent work. We design and develop websites that make an impact.</p>
</div>
<a href="https://github.com/Aswanthponnoran/" className="btn btn-outline btn-sm">View All Projects
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
</a>
</div>
<div className="work-grid reveal-stagger">
<div className="work-card">
<div className="work-thumb wt-1"><div className="glow"></div><h4>Modern Solutions for a Better Tomorrow</h4></div>
<div className="work-meta"><div><h5>Business Website</h5><span className="work-tag">Website Development</span></div></div>
</div>
<div className="work-card">
<div className="work-thumb wt-2"><div className="glow"></div><h4>Fresh Food Healthy Life</h4></div>
<div className="work-meta"><div><h5>E-Commerce Website</h5><span className="work-tag">Website Development</span></div></div>
</div>
<div className="work-card">
<div className="work-thumb wt-3"><div className="glow"></div><h4>Grow Your Brand With Our Marketing</h4></div>
<div className="work-meta"><div><h5>Digital Marketing Campaign</h5><span className="work-tag">Digital Marketing</span></div></div>
</div>
</div>
</div>
</section>
<section
  id="projects"
  className="projects-section"
  style={{
    // dark overlay on top of the image keeps the cards and text readable
    backgroundImage: `linear-gradient(rgba(69, 221, 132, 0.8), rgba(216, 224, 219, 0.88)), url(${BG_IMAGE})`,
    position: 'relative',
    overflowX: 'clip',
    overflowY: 'visible',
    zIndex: 1,
    padding: '60px 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
 
<div className="carousel-3d" style={{ position: 'relative', width: '100%', height: `${CARD_H + 120}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<button style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 20 }} className="carousel-btn prev" onClick={prevProject} aria-label="Previous project">‹</button>

<div
  className="carousel-stage"
  style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '100%', perspective: '1600px', overflow: 'visible' }}
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
>
{PROJECTS.map((project, index) => (
<div
  className="project-card-3d"
  key={project.image}
  // style={{
  //   ...getCardStyle(index),
  //   // dark overlay on top of the image keeps the text readable
  //   backgroundImage: ` url(${project.image})`,
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  // }}

  style={{
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: `${CARD_W}px`,
  height: `${CARD_H}px`,
  maxWidth: '80vw',
  padding: 0,
  borderRadius: '18px',
  overflow: 'hidden',
  backfaceVisibility: 'hidden',
  willChange: 'transform',
  transition: 'transform .8s cubic-bezier(.22,1,.36,1), opacity .8s ease, filter .8s ease',
  ...getCardStyle(index),
}}
>
<img
  src={project.image}
  alt={project.title || `Project ${index + 1}`}
  draggable="false"
  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', imageRendering: 'auto' }}
/>
{/* <span>{String(index + 1).padStart(2, '0')} / PROJECT</span> */}
<h3>{project.title}</h3>
<p>{project.text}</p>
{/* <div className="project-tags">{project.tags}</div> */}
</div>
))}
</div>

<button style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 20 }} className="carousel-btn next" onClick={nextProject} aria-label="Next project">›</button>
</div>

{/* <div className="carousel-indicators">
{PROJECTS.map((project, index) => (
<span
  key={project.title}
  className={index === activeIndex ? 'active' : ''}
  onClick={() => setActiveIndex(index)}
></span>
))}
</div> */}
</section>
<section className="section" id="testimonials">
<div className="wrap">
<div className="test-head-row reveal">
<h2>What Our <b>Clients Say</b></h2>
<div className="test-nav">
<button aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6"></path></svg></button>
<button aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6"></path></svg></button>
</div>
</div>
<div className="test-grid reveal-stagger">
<div className="test-card">
<p>"Web Zelora transformed our online presence. Our website looks amazing and we've seen a huge increase in traffic!"</p>
<div className="test-who"><div className="avatar"></div><div><b>Ajal Dev.</b><span>Business Owner</span></div></div>
</div>
<div className="test-card">
<p>"Their digital marketing strategy brought us quality leads and real growth. Highly recommended!"</p>
<div className="test-who"><div className="avatar"></div><div><b>Rohit S.</b><span>Startup Founder</span></div></div>
</div>
<div className="test-card">
<p>"Professional, creative and super easy to work with. They truly understand what we needed."</p>
<div className="test-who"><div className="avatar"></div><div><b>Sneha K.</b><span>Marketing Manager</span></div></div>
</div>
</div>
</div>
</section>
<section className="section cta-band" id="contact" style={{ padding: '72px 0' }}>
<div className="cta-inner reveal">
<div>
<div className="eyebrow">Let's Work Together</div>
<h2>Ready to Build Your Online Success?</h2>
<p>Get a free consultation and let's turn your ideas into reality.</p>
</div>
<a href="mailto:hello@webzelora.com" className="btn btn-primary">Get Started
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
</a>
</div>
</section>

<div className="form-container">
<div className="form-col">
<form id="contactForm" onSubmit={handleSubmit}>

<label htmlFor="name">Name</label>
<input type="text" name="name" id="name" placeholder="Enter your name" />
<div id="nameError" className="error">{errors.name}</div>

<label htmlFor="email">Email</label>
<input type="text" name="email" id="email" placeholder="Enter your email" />
<div id="emailError" className="error">{errors.email}</div>

<label htmlFor="mobile">Mobile</label>
<input type="text" name="mobile" id="mobile" placeholder="Enter 10 digit mobile number" />
<div id="mobileError" className="error">{errors.mobile}</div>

<label htmlFor="message">Message</label>
<textarea name="message" id="message" placeholder="Enter your message"></textarea>
<div id="messageError" className="error">{errors.message}</div>
<button type="submit">Submit</button>
<div id="success">{success}</div>
</form>
</div>
<div className="art-col">
<svg className="art-icon" viewBox="0 0 120 120" fill="none">
<g className="ring">
<circle cx="60" cy="60" r="52" stroke="#1D6E38" strokeWidth="1.5" strokeDasharray="4 7"></circle>
</g>
<circle className="pulse-dot" cx="60" cy="8" r="3" fill="#39E75F"></circle>
<circle cx="60" cy="60" r="34" fill="#0D1610" stroke="#1B241D" strokeWidth="1.5"></circle>
<path d="M42 66l14 10 22-30" stroke="#39E75F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>

<h1>Form</h1>
<p>Send it over — we read every message and reply within one business day.</p>
</div>
</div>

<footer className="page-footer">
<div className="social-row">
<a href="https://www.instagram.com/web_zelora?obrf=MW9qOWc5aTVyajYxMw==" className="social-btn insta" aria-label="Instagram">
<span className="bubble">Follow us!</span>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none"></circle></svg>
</a>
<a href="#" className="social-btn fb" aria-label="Facebook">
<span className="bubble">Say hi 👋</span>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 8h2V5h-2a4 4 0 00-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9a1 1 0 011-1z"></path></svg>
</a>
<div className="social-container">

  <a
    href="https://wa.me/7511155341"
    className="social-btn whatsapp"
    aria-label="WhatsApp"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i className="fab fa-whatsapp"></i>
  </a>

 

</div>
</div>
<p className="footer-note">© 2026 Web Zelora — say hello on any platform.</p>
</footer>

<footer className="site-footer">
<div className="wrap">
<div className="foot-top">
<div className="logo">
<div className="mark">W</div>
<div className="word">WEB <b>ZELORA</b><span className="tag">BUILD · MARKET · GROW</span></div>
</div>
<div className="foot-links">
<a href="#">Home</a><a href="#services">Services</a><a href="#work">Portfolio</a><a href="#about">About</a><a href="#contact">Contact</a>
</div>
{/* <div className="foot-social">
<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 8h2V5h-2a4 4 0 00-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9a1 1 0 011-1z"></path></svg></a>
<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none"></circle></svg></a>
<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"></rect><path d="M8 10.5V17M8 7.5v.01M12 17v-4a2 2 0 014 0v4M12 13v4"></path></svg></a>
<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="6" width="19" height="12" rx="3"></rect><path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"></path></svg></a>
</div> */}
</div>
<div className="foot-bottom">
<span>© 2025 Web Zelora. All rights reserved.</span>
<span>Web Development  |  Digital Marketing  |  Brand Growth</span>
</div>
</div>
</footer>

    </>
  );
}
