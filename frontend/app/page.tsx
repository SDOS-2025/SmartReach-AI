import React from 'react';
import NavigationMenu from './components/NavigationMenu';
import { CarouselShadcn } from './components/CarouselShad';
import Image from 'next/image';
import { ArrowRight, BarChart2, Globe, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';
import Footer from './components/Footer';

function HomePage() {
  // Feature card component for the features section
  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-[#1A1F4A] to-[#232A5C] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/30">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0F142E] to-[#161D3F] text-white">
      {/* Navigation */}
      <div className="h-20 flex-none border-b border-gray-800">
        <NavigationMenu />
      </div>

      {/* Hero Section with Carousel */}
      <div className="w-full h-[70vh]">
        <CarouselShadcn />
      </div>

      {/* Value Proposition Section */}
      <div className="w-full py-16 px-6 md:px-10 bg-[#0F142E]/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Data-Driven Campaign Management
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Make <span className="text-blue-400 font-semibold">efficient</span> decisions with our comprehensive analytics platform designed for marketing professionals.
            </p>
            <Link href="/dashboard" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-all">
              Explore Campaigns <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-80">
              <Image
                src="/images/graphs.png"
                alt="Analytics Dashboard"
                fill
                className="object-contain rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Powerful Features
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Our platform provides everything you need to create, manage, and analyze effective marketing campaigns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<BarChart2 size={36} />} 
              title="Advanced Analytics" 
              description="Comprehensive metrics and KPIs to measure campaign performance in real-time."
            />
            <FeatureCard 
              icon={<Users size={36} />} 
              title="Audience Targeting" 
              description="Segment your audience for more personalized and effective campaigns."
            />
            <FeatureCard 
              icon={<Globe size={36} />} 
              title="Global Reach" 
              description="Deploy campaigns across multiple channels and regions from a single dashboard."
            />
            <FeatureCard 
              icon={<MessageSquare size={36} />} 
              title="Engagement Tracking" 
              description="Monitor user interactions and optimize your messaging for better results."
            />
          </div>
        </div>
      </div>

      {/* Stats Showcase */}
      <div className="w-full py-16 px-6 md:px-10 bg-[#0F142E]/80">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Proven Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gradient-to-br from-[#1A1F4A]/50 to-[#232A5C]/50 p-8 rounded-lg">
              <p className="text-4xl font-bold text-blue-400 mb-2">40%</p>
              <p className="text-gray-300">Average increase in engagement</p>
            </div>
            <div className="bg-gradient-to-br from-[#1A1F4A]/50 to-[#232A5C]/50 p-8 rounded-lg">
              <p className="text-4xl font-bold text-purple-400 mb-2">2.5x</p>
              <p className="text-gray-300">Return on marketing investment</p>
            </div>
            <div className="bg-gradient-to-br from-[#1A1F4A]/50 to-[#232A5C]/50 p-8 rounded-lg">
              <p className="text-4xl font-bold text-blue-400 mb-2">98%</p>
              <p className="text-gray-300">Customer satisfaction rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full py-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of marketing professionals who are already using our platform to create more effective campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-all">
              Get Started
            </Link>
            <Link href="/demo" className="px-8 py-3 bg-transparent border border-gray-600 rounded-lg font-medium hover:border-blue-400 transition-all">
              Request Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;