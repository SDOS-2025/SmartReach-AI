"use client"; // Mark as Client Component

import React from 'react';
import NavigationMenu from '../components/NavigationMenu';
import Footer from '../components/Footer';

function AboutUsPage() {
  const teamMembers = [
    {
      name: "Rahul Omalur",
      role: "Data Scientist",
      email: "rahul22392@iiitd.ac.in",
      quote: "Life moves pretty fast, If you don't stop and look around once in a while you will miss it.",
      image: "/images/rahul.jpeg"
    },
    {
      name: "Tharun Harish",
      role: "Frontend Engineer & DevOps",
      email: "tharun22541@iiitd.ac.in",
      quote: "Do we exist to question reality, or does reality exist to question us?",
      image: "/images/tharun.jpeg"
    },
    {
      name: "Mehul Agarwal",
      role: "ML Engineer",
      email: "mehul22294@iiitd.ac.in",
      quote: "The best code is not the one that works, but the one that teaches you something new.",
      image: "/images/mehul.jpg"
    },
    {
      name: "Noel Abraham Tiju",
      role: "Backend Engineer",
      email: "noel22338@iiitd.ac.in",
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

  return (
    <div className="flex flex-col justify-start w-screen min-h-screen bg-[#0F142E]">
      {/* Top Navigation */}
      <div className="h-20 flex-none">
        <NavigationMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-auto flex-col p-4 lg:p-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Meet the Team Behind</h1>
          <div className="relative inline-block">
            <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              SmartReachAI
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            We're a team of passionate developers, data scientists, and engineers building the future of campaign analytics.
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-8 flex items-center animate-fade-in-down">
            <span className="w-8 h-1 bg-blue-500 rounded-full mr-3"></span>
            Our Team
            <span className="w-8 h-1 bg-blue-500 rounded-full ml-3"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-[#1A1F4A] p-6 rounded-lg shadow-lg hover:shadow-blue-900/20 hover:scale-105 transition-all duration-500 ease-in-out flex flex-col items-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-40 h-40 rounded-full mb-6 overflow-hidden border-4 border-[#252B61] transform transition-all duration-500 group-hover:border-blue-500 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-white text-xl font-medium text-center group-hover:text-blue-400 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-blue-300 text-sm font-medium mt-1 text-center">{member.role}</p>
                <a href={`mailto:${member.email}`} className="text-blue-400 text-sm mt-1 hover:text-blue-300 transition-colors">
                  {member.email}
                </a>
                <div className="w-12 h-1 bg-blue-500/50 rounded-full my-4 group-hover:w-24 transition-all duration-500"></div>
                <p className="text-gray-300 text-sm italic text-center">"{member.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-8 flex items-center animate-fade-in-down">
            <span className="w-8 h-1 bg-blue-500 rounded-full mr-3"></span>
            Our Sponsors
            <span className="w-8 h-1 bg-blue-500 rounded-full ml-3"></span>
          </h2>
          <div className="space-y-6">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center bg-[#1A1F4A] p-6 rounded-lg shadow-lg hover:shadow-blue-900/30 transition-all duration-300 ease-in-out animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2 + 0.4}s` }}
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-white p-4 flex items-center justify-center mb-6 sm:mb-0 sm:mr-8">
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-white font-semibold text-xl mb-3">{sponsor.name}</h3>
                  <div className="w-12 h-1 bg-blue-500/50 rounded-full mb-4 mx-auto sm:mx-0"></div>
                  <p className="text-gray-300 text-sm">{sponsor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Custom Tailwind Animations */}
      {/* <style jsx global>{`
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
      `}</style> */}
    </div>
  );
}

export default AboutUsPage;