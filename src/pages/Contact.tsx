import React from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-16 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6 flex flex-col items-center text-center">
              <Mail className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400">support@edunotes.com</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6 flex flex-col items-center text-center">
              <MessageSquare className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400">Available 24/7</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6 flex flex-col items-center text-center">
              <Phone className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;