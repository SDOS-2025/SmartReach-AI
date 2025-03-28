"use client"; // Mark as Client Component

import React from 'react';
import NavigationMenu from '../components/NavigationMenu';

function AboutUsPage() {
  const teamMembers = [
    {
      name: "Rahul Omalur",
      role: "Data Scientist",
      quote: "Life moves pretty fast, If you don’t stop and look around once in a while you will miss it.",
      image: "/images/rahul.jpeg"
    },
    {
      name: "Tharun Harish",
      role: "Frontend Engineer & DevOps",
      quote: "Do we exist to question reality, or does reality exist to question us?",
      image: "/images/tharun.jpeg"
    },
    {
      name: "Mehul Agarwal",
      role: "ML Engineer",
      quote: "The best code is not the one that works, but the one that teaches you something new.",
      image: "/images/mehul.jpg"
    },
    {
      name: "Noel Abraham Tiju",
      role: "Backend Engineer",
      quote: "Love is patient, Love is kind",
      image: "/images/noel.jpeg"
    }
  ];

  const sponsors = [
    {
      name: "RouteMobile",
      description: "Route Mobile is a cloud communications platform service provider that offers solutions for messaging, voice, email, SMS filtering, analytics, and monetization, catering to enterprises, OTT players, and mobile network operators (MNOs) globally",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8PZwQqEC5N5tPqlgow4LqOMtP8Z5ds6tT4g&s"
    },
  ];

  const handleProfileClick = () => {
    console.log('Navigating to Profile');
    window.location.href = '/profile/';
  };

  const handleUpgradePlanClick = () => {
    console.log('Navigating to Upgrade Plan');
    window.location.href = '/upgrade-plan/';
  };

  return (
    <div className="flex flex-col justify-start w-screen min-h-screen">
      {/* Top Navigation */}
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-auto flex-col lg:flex-row">
        {/* About Us Content */}
        <div className="w-screen p-4 lg:p-10 flex flex-col bg-white">
          {/* Team Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 animate-fade-in-down">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-[#0F142E] py-8 px-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 ease-in-out transform hover:rotate-2 animate-fade-in-up flex flex-col items-center"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mb-4 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                  <h3 className="text-white font-medium text-center transition-colors duration-300 hover:text-gray-200">
                    {member.name}
                  </h3>
                  <p className="text-gray-400 text-sm text-center">{member.role}</p>
                  <p className="text-gray-300 text-sm mt-2 italic text-center">"{member.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 animate-fade-in-down">About Our Sponsors</h2>
            <div className="space-y-6">
              {sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center bg-[#0F142E] p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2 + 0.4}s` }}
                >
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-4 sm:mb-0 sm:mr-6"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-white font-medium text-lg">{sponsor.name}</h3>
                    <p className="text-blue-100 text-sm mt-2">{sponsor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tailwind Animations */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AboutUsPage;