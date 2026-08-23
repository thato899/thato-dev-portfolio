import { prisma } from '@/lib/db';
import Nav from './components/Nav';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import EventsSection from './components/EventsSection';
import Footer from './components/Footer';

const GITHUB_URL = 'https://github.com/thato899';
const LINKEDIN_URL = 'https://linkedin.com/in/thato-maluleka-55719b255';
const EMAIL = 'thatom505@gmail.com';

export default async function Home() {
  const [projects, events] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: 'asc' } }),
    prisma.event.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const projectData = projects.map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    content: p.content,
    techStack: p.techStack,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    imageUrl: p.imageUrl,
  }));

  const eventData = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    story: e.story,
    category: e.category,
    date: e.date
      ? e.date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
      : null,
    location: e.location,
    imageUrl: e.imageUrl,
  }));

  return (
    <>
      <Nav />
      <main>
        <Hero github={GITHUB_URL} />
        <StatsSection />
        <ProjectsSection projects={projectData} />
        <AboutSection />
        <EventsSection events={eventData} />
        <Footer email={EMAIL} github={GITHUB_URL} linkedin={LINKEDIN_URL} />
      </main>
    </>
  );
}
