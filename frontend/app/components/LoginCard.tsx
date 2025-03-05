'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface LoginCardProps {
  view: string;
  setView: (view: string) => void;
}


const LoginCard = ({ view , setView }: LoginCardProps) => {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/social-auth/login/google-oauth2/';
  };

  // Login Form
  const renderLoginForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to SmartReachAI</h1>
      <h2 className="text-3xl mb-3 flex justify-center">Login</h2>
      <Label className="block">
        <Input className="h-14" type="text" placeholder="Username" />
      </Label>
      <Label className="block mt-4">
        <Input className="h-14" type="password" placeholder="Password" />
      </Label>
      <a href="#" className="text-sm text-blue-500 hover:underline mb-3">Forgot Password?</a>
      <Button className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-1 rounded-full hover:bg-blue-600">
        Login
      </Button>
      <div className="flex items-center my-4">
        <Separator className="flex-auto" />
        <span className="mx-2 text-xl flex-none text-gray-500">or</span>
        <Separator className="flex-auto" />
      </div>
      <Button
        className="w-full bg-red-500 h-14 text-xl text-white py-2 rounded-full hover:bg-red-600"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button>
    </>
  );

  // Signup Form for Individuals
  const renderSignupIndividualForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Signup for Individuals</h1>
      <Label className="block">
        <span className="text-lg">Name</span>
        <Input className="h-14 mt-2" type="text" placeholder="Enter your name" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Phone Number</span>
        <Input className="h-14 mt-2" type="tel" placeholder="Enter your phone number" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Date of Birth</span>
        <Input className="h-14 mt-2" type="date" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email</span>
        <Input className="h-14 mt-2" type="email" placeholder="Enter your email" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Password</span>
        <Input className="h-14 mt-2" type="password" placeholder="Create a password" />
      </Label>
      <Button className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full hover:bg-blue-600">
        Sign Up
      </Button>
      <Button
        variant="link"
        className="mt-4 text-blue-500 text-lg"
        onClick={() => setView('login')}
      >
        Back to Login
      </Button>
    </>
  );

  // Signup Form for Business
  const renderSignupBusinessForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Signup for Business</h1>
      <Label className="block">
        <span className="text-lg">Business Name</span>
        <Input className="h-14 mt-2" type="text" placeholder="Enter your business name" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Phone Number</span>
        <Input className="h-14 mt-2" type="tel" placeholder="Enter your phone number" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Business Email</span>
        <Input className="h-14 mt-2" type="email" placeholder="Enter your business email" />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Password</span>
        <Input className="h-14 mt-2" type="password" placeholder="Create a password" />
      </Label>
      <Button className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full hover:bg-blue-600">
        Sign Up
      </Button>
      <Button
        variant="link"
        className="mt-4 text-blue-500 text-lg"
        onClick={() => setView('login')}
      >
        Back to Login
      </Button>
    </>
  );

  return (
    <div className="p-4 md:p-6 my-auto w-3/5 flex flex-col space-y-6">
      {view === 'login' && renderLoginForm()}
      {view === 'signup-individual' && renderSignupIndividualForm()}
      {view === 'signup-business' && renderSignupBusinessForm()}
    </div>
  );
};

export default LoginCard;