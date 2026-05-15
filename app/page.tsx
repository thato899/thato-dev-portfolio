'use client';
import ThreeBackground from './components/ThreeBackground';

export default function Home() {
  const projects = [
    {
      title: "EduQuest Learning Management System",
      description: "Enterprise-grade LMS with automated invoicing, parent portal, and Google Meet integration",
      tech: ["PHP 8", "MySQL", "JavaScript", "Google Meet API", "HTML5/CSS3", "Bootstrap 5"],
      liveUrl: "https://eduquesttutors.co.za/login.php",
    },
    {
      title: "Recruitment Tracking System",
      description: "Full-featured ATS with multi-role oversight and RESTful API architecture",
      tech: ["PHP 8", "MySQL", "REST API", "JavaScript", "HTML5/CSS3", "PHPMailer"],
      liveUrl: "https://recruitment.eduquesttutors.co.za/admin/login.php",
    }
  ];

  const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PHP', 'Python', 'MySQL', 'Tailwind CSS'];
  const stats = [
    { value: 4, label: 'Production Systems' },
    { value: 100, label: 'Active Users' },
    { value: 3, label: 'Years Experience' },
    { value: 10, label: 'Projects' },
  ];

  // Evidence items - add your photos here
  const evidenceItems = [
    {
      title: "Tech Community Workshop",
      description: "Led a coding workshop for aspiring developers",
      category: "Community Outreach"
    },
    {
      title: "Hackathon Participant",
      description: "Collaborated on innovative solutions at local hackathon",
      category: "Networking"
    },
    {
      title: "Mentorship Program",
      description: "Mentored junior developers in web technologies",
      category: "Social Impact"
    }
  ];

  return (
    <>
      <ThreeBackground />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-block px-4 py-1 mb-6 bg-purple-500/20 rounded-full border border-purple-500/30">
              <span className="text-purple-300 text-sm">Software Engineer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Thato Junior Maluleka
            </h1>
            <p className="text-xl text-gray-300 mb-6">Building exceptional digital experiences</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Full-stack developer specializing in scalable web applications and system architecture.
            </p>
            
            <div className="mt-10 space-x-4">
              <a href="#projects" className="inline-block px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                Explore Projects
              </a>
              <a href="https://github.com/thato899" target="_blank" className="inline-block px-8 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
                GitHub Profile
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {stat.value}{stat.value === 100 ? '+' : stat.value === 4 ? '+' : stat.value === 10 ? '+' : ''}
                </div>
                <div className="text-gray-400 text-sm uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Technical Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill} className="p-3 bg-white/10 rounded-lg text-center hover:bg-white/20 transition">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence / Social Impact Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">Community & Social Impact</h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              Active involvement in tech communities, mentorship, and social initiatives
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {evidenceItems.map((item, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition group">
                  <div className="w-full h-40 bg-purple-600/20 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-purple-500/50 group-hover:border-purple-500 transition">
                    <span className="text-purple-300 text-sm">📸 Photo Placeholder</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <span className="inline-block px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                More evidence and photos available upon request
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition">
                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={project.liveUrl} target="_blank" className="inline-block px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                    Launch Application →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Professional Inquiries</h3>
            <p className="text-gray-400 mb-6">Available for software engineering roles and technical consulting</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="https://github.com/thato899" target="_blank" className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">GitHub</a>
              <a href="https://www.linkedin.com/in/thato-maluleka-55719b255" target="_blank" className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">LinkedIn</a>
              <a href="mailto:thatom505@gmail.com" className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Email</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
