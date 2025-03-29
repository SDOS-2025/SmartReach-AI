'use client';

import React, { useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import LoginCard from '../components/LoginCard';
import { Button } from '@/components/ui/button';

function LoginPage() {
  const [view, setView] = useState('login'); // Manage view state here

  return (
    <div className="flex flex-col justify-start bg-white w-screen h-screen">
      <div className="h-20 flex-none">
        <NavigationMenu isLoggedIn={false}/>
      </div>
      <div className="flex flex-auto flex-col md:flex-row">
        <div className="max-h py-4 md:h-[calc(100vh-5rem)] w-full md:overflow-y-scroll md:w-3/5 flex-none flex justify-center">
          <LoginCard view={view} setView={setView} />
        </div>
        <div className="bg-[#0F142E] flex flex-col text-white items-center justify-center space-y-12 h-full p-4 pb-12 md:pb-0 flex-auto">
          <p className="text-3xl font-semibold">New Here?</p>
          <p className="text-2xl text-center">Sign up to explore and analyze your email campaign here!</p>
          <div className="mt-4 flex flex-col xl:flex-row gap-4 justify-center">
            <Button
              className="bg-blue-500 py-7 px-10 h-12 text-lg text-white rounded-full hover:bg-blue-600"
              onClick={() => setView('signup-individual')}
            >
              Signup for Individuals
            </Button>
            <Button
              className="bg-blue-500 py-7 px-10 h-12 text-lg text-white rounded-full hover:bg-blue-600"
              onClick={() => setView('signup-business')}
            >
              Signup for Business
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;