import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        title: 'Portfolio of Evidence',
        slug: 'portfolio-of-evidence',
        tagline: 'The site you are looking at right now',
        description:
          'A full-stack portfolio and content dashboard — Next.js, Prisma, and a hand-built admin so new work ships in minutes, not deploys.',
        content:
          'Replace this placeholder from the dashboard: /dashboard -> Projects -> Edit. Add your real projects, tech stack, links, and a cover image.',
        techStack: 'Next.js, TypeScript, Prisma, Tailwind CSS, Framer Motion',
        githubUrl: 'https://github.com/thato899/thato-dev-portfolio',
        featured: true,
        order: 0,
      },
    });
    console.log('Seeded placeholder project.');
  }

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.create({
      data: {
        title: 'Add your first event',
        description: 'A conference, hackathon, or community day worth remembering.',
        story:
          'Open the dashboard (/dashboard -> Events) to edit or delete this placeholder and add real entries with photos.',
        category: 'Community Outreach',
        order: 0,
      },
    });
    console.log('Seeded placeholder event.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
