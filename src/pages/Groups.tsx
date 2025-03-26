import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, ArrowRight } from 'lucide-react';

const dummyGroups = [
  {
    id: 1,
    name: "Calculus Study Group",
    members: 24,
    rating: 4.8,
    reviews: 15,
    description: "Join us to master calculus concepts together!",
    topics: ["Derivatives", "Integrals", "Series"],
    image: "https://images.unsplash.com/photo-1596496050827-8299e0220de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Physics Lab Partners",
    members: 18,
    rating: 4.6,
    reviews: 12,
    description: "Collaborative group for physics lab preparations and discussions.",
    topics: ["Mechanics", "Electricity", "Optics"],
    image: "https://images.unsplash.com/photo-1532634993-15f421e42ec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Chemistry Study Circle",
    members: 32,
    rating: 4.9,
    reviews: 28,
    description: "Master organic and inorganic chemistry concepts together.",
    topics: ["Organic", "Inorganic", "Physical"],
    image: "https://images.unsplash.com/photo-1532634993-15f421e42ec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Groups = () => {
  const [groups, setGroups] = useState(dummyGroups);

  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Study Groups
          </h1>
          <Link
            to="/groups/create"
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Create Group
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {group.name}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      {group.members} members
                      <span className="mx-2">•</span>
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {group.rating}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">
                  {group.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {group.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-[#333333] text-white"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <button className="w-full flex items-center justify-center px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors">
                  Join Group
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Groups;