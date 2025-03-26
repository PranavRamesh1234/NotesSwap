import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, CheckCircle, Trophy, Zap, Github, Twitter, Linkedin } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div 
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
        <div className="relative max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            Learn Together, Grow Faster
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Join our community of students sharing knowledge through high-quality study notes. Buy, sell, and collaborate with peers worldwide.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/marketplace"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            >
              Browse Notes
            </Link>
            <Link
              to="/groups"
              className="px-8 py-3 bg-transparent text-white border border-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Join Groups
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-[#0A0A0A] py-24 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose EduNotes?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We provide a comprehensive platform for students to share knowledge and excel together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Quality Notes", description: "Access verified study materials from top students across different subjects." },
              { icon: Users, title: "Study Groups", description: "Join or create study groups to collaborate and earn rewards together." },
              { icon: Star, title: "Earn Rewards", description: "Get rewarded for your contributions and active participation in the community." }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#1a1a1a] rounded-xl border border-[#333333] hover:scale-105 hover:border-white/20 transition-transform duration-300 scroll-animate"
              >
                <feature.icon className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#0A0A0A] py-24 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-white mb-4">
              Features That Set Us Apart
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover why thousands of students choose EduNotes for their academic success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: "Verified Content", description: "All notes are reviewed and verified by subject matter experts." },
              { icon: Trophy, title: "Reward System", description: "Earn points and rewards for your contributions to the community." },
              { icon: Zap, title: "Instant Access", description: "Download notes instantly after purchase, no waiting time." }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 scroll-animate hover:scale-105 transition-transform duration-300"
              >
                <feature.icon className="h-6 w-6 text-white flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "About", links: ["About Us", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Safety", "Terms of Service"] },
              { title: "Legal", links: ["Privacy Policy", "Cookie Policy", "Guidelines"] }
            ].map((section, index) => (
              <div key={index} className="scroll-animate">
                <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-300 hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="scroll-animate">
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <div className="flex space-x-4">
                {[Github, Twitter, Linkedin].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#333333] text-center scroll-animate">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} EduNotes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;