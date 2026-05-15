'use client';
import { useEffect, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/backend/api/projects.php')
      .then(res => res.json())
      .then(setProjects)
      .catch(console.error);
    
    fetch('/backend/api/events.php')
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PHP', 'Python', 'MySQL', 'Tailwind CSS'];
  const stats = [
    { value: 4, label: 'Production Systems' },
    { value: 100, label: 'Active Users' },
    { value: 3, label: 'Years Experience' },
    { value: 10, label: 'Projects' },
  ];

  return (
    <>
      <ThreeBackground />
      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-block px-4 py-1 mb-6 bg-purple-500/20 rounded-full border border-purple-500/30">
              <span className="text-purple-300 text-sm">Software Engineer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Thato Junior Maluleka
            </h1>
            <p className="text-xl text-gray-300 mb-6">Building exceptional digital experiences</p>
            <div className="mt-10 space-x-4">
              <a href="#projects" className="inline-block px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                Explore Projects
              </a>
              <a href="https://github.com/thato899" target="_blank" className="inline-block px-8 py-3 bg-black/50 rounded-lg hover:bg-black/70 transition">
                GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-black/60 rounded-2xl border border-purple-500/30">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {stat.value}{stat.value === 100 ? '+' : stat.value === 4 ? '+' : ''}
                </div>
                <div className="text-gray-300 text-sm uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Technical Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill} className="p-3 bg-black/60 rounded-lg text-center border border-purple-500/30">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Community & Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-black/60 rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition">
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                    {event.story && (
                      <details className="mt-3">
                        <summary className="text-purple-400 cursor-pointer text-sm">Read full story</summary>
                        <p className="text-gray-400 text-sm mt-2">{event.story}</p>
                      </details>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-block px-2 py-1 bg-purple-600/30 text-purple-200 rounded-full text-xs">
                        {event.category || 'Event'}
                      </span>
                      {event.location && (
                        <span className="inline-block px-2 py-1 bg-gray-600/30 text-gray-300 rounded-full text-xs">
                          📍 {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-black/60 rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    {project.long_description && (
                      <details className="mb-4">
                        <summary className="text-purple-400 cursor-pointer">View details</summary>
                        <p className="text-gray-400 mt-2">{project.long_description}</p>
                      </details>
                    )}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech_stack?.split(',').map(tech => (
                        <span key={tech} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-lg text-sm">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" className="inline-block px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto bg-black/60 rounded-2xl p-10 text-center border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Contact</h3>
            <div className="flex justify-center gap-4">
              <a href="https://github.com/thato899" className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">GitHub</a>
              <a href="https://linkedin.com/in/thato-maluleka-55719b255" className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">LinkedIn</a>
              <a href="mailto:thatom505@gmail.com" className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">Email</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
