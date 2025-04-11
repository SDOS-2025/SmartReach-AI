'use client';

import React, { useState, useEffect } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import LoginCard from '../components/LoginCard';
import { Button } from '@/components/ui/button';
import Footer from '../components/Footer';

function LoginPage() {
  const [view, setView] = useState('login'); // Manage view state here
  
  return (
    <div className="flex flex-col justify-start w-screen bg-white">
      <div className="h-[10vh] flex-none">
        <NavigationMenu isLoggedIn={false} />
      </div>
      
      <div className="h-[90vh] flex flex-auto flex-col md:flex-row ">
        {/* Login Form Section */}
        <div className="w-full md:w-3/5 flex justify-center items-start relative overflow-y-auto">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          {/* Login card container with added internal space */}
          <div className="w-full max-w-md z-10 px-4 py-8 md:py-12">
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <LoginCard view={view} setView={setView} />
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-[#0F142E] flex flex-col text-white items-center justify-center space-y-8 w-full md:w-2/5 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/20"></div>
          
          {/* Decorative circles */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-xl"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center max-w-lg">
            <div className="w-20 h-1 bg-blue-500 rounded-full mb-8"></div>
            
            <h2 className="text-3xl font-bold mb-4 text-center">New Here?</h2>
            
            <p className="text-xl text-center text-blue-100 mb-8">
              Sign up to explore and analyze your email campaigns with powerful analytics tools!
            </p>
            
            <div className="w-12 h-1 bg-blue-500/50 rounded-full mb-8"></div>
            
            <div className="flex flex-col xl:flex-row gap-4 justify-center w-full">
              <Button
                className="bg-blue-600 py-7 px-10 h-14 text-lg font-medium text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group"
                onClick={() => setView('signup-individual')}
              >
                <span className="w-2 h-2 bg-blue-300 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                Signup for Individuals
              </Button>
              
              <Button
                className="bg-blue-600 py-7 px-10 h-14 text-lg font-medium text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group"
                onClick={() => setView('signup-business')}
              >
                <span className="w-2 h-2 bg-blue-300 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                Signup for Business
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;