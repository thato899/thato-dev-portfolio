import { prisma } from '@/lib/db';
import ProjectManagerList from './ProjectManagerList';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });

  const managed = projects.map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    content: p.content ?? '',
    techStack: p.techStack,
    liveUrl: p.liveUrl ?? '',
    githubUrl: p.githubUrl ?? '',
    imageUrl: p.imageUrl,
    featured: p.featured,
  }));

  return <ProjectManagerList projects={managed} />;
}
