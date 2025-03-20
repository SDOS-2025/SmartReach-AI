'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface LoginCardProps {
  view: string;
  setView: (view: string) => void;
}

const LoginCard = ({ view, setView }: LoginCardProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [emailHostUser, setEmailHostUser] = useState('');
  const [emailHostPassword, setEmailHostPassword] = useState('');
  const [emailHost, setEmailHost] = useState('');
  const [emailPort, setEmailPort] = useState('');
  const [emailUseTLS, setEmailUseTLS] = useState(true);

  const handleGoogleLogin = () => {
    window.location.href = '/api/social-auth/login/google-oauth2/';
  };

  const handleLogin = async () => {
    // Build the request body with username and password
    const requestBody = {
      username,
      password,
    };
  
    try {
      const response = await fetch('/api/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      // Check if the response status indicates an error
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        // Optionally display an error message to the user
        return;
      }
  
      const data = await response.json();
      console.log('Login response:', data);
      if (data.message === 'Login successful') {
        window.location.href = '/write-email';
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSignupBusiness = async () => {
    // Build the request body with all the required fields
    const requestBody = {
      username,
      email,
      password,
      email_host_user: emailHostUser,
      email_host_password: emailHostPassword,
      email_host: emailHost,
      email_port: emailPort,
      email_use_tls: emailUseTLS,
    };

    try {
      const response = await fetch('/api/signup-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup error:', errorData);
        return;
      }

      const data = await response.json();
      console.log('Signup response:', data);

      if (data.message === 'User and organization created successfully') {
        // Redirect to login view after a successful signup
        setView('login');
        // Optionally, you can redirect with: window.location.href = '/login';
      } else {
        console.error('Unexpected response:', data);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

const handleSignupIndividuals = async () => {
  // Build the request body with username, email, and password
  const requestBody = { username, email, password };

  try {
    const response = await fetch('/api/signup-individuals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Signup error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Signup response:', data);

    // Check if signup was successful and route accordingly.
    // For example, route to the login view:
    if (data.message === 'User created successfully') {
      setView('login');
      // OR for a full redirect, uncomment the line below:
      // window.location.href = '/login';
    } else {
      console.error('Unexpected response:', data);
    }
  } catch (error) {
    console.error('Error during signup:', error);
  }
};

  // Login Form
  const renderLoginForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to SmartReachAI</h1>
      <h2 className="text-3xl mb-3 flex justify-center">Login</h2>
      <Label className="block">
        <Input
          className="h-14"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <Input
          className="h-14"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <a href="#" className="text-sm text-blue-500 hover:underline mb-3">
        Forgot Password?
      </a>
      <Button
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-1 rounded-full hover:bg-blue-600"
        onClick={handleLogin}
      >
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
        <Input
          className="h-14 mt-2"
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email</span>
        <Input
          className="h-14 mt-2"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Password</span>
        <Input
          className="h-14 mt-2"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <Button
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full hover:bg-blue-600"
        onClick={handleSignupIndividuals}
      >
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

  const renderSignupBusinessForm = () => (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Signup for Business</h1>
      <Label className="block">
        <span className="text-lg">Business Name</span>
        <Input
          className="h-14 mt-2"
          type="text"
          placeholder="Enter your business name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Business Email</span>
        <Input
          className="h-14 mt-2"
          type="email"
          placeholder="Enter your business email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Password</span>
        <Input
          className="h-14 mt-2"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Host User</span>
        <Input
          className="h-14 mt-2"
          type="text"
          placeholder="Enter your email host user"
          value={emailHostUser}
          onChange={(e) => setEmailHostUser(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Host Password</span>
        <Input
          className="h-14 mt-2"
          type="password"
          placeholder="Enter your email host password"
          value={emailHostPassword}
          onChange={(e) => setEmailHostPassword(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Host</span>
        <Input
          className="h-14 mt-2"
          type="text"
          placeholder="Enter your email host (e.g. smtp.gmail.com)"
          value={emailHost}
          onChange={(e) => setEmailHost(e.target.value)}
        />
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Port</span>
        <Input
          className="h-14 mt-2"
          type="number"
          placeholder="Enter your email port (e.g. 587)"
          value={emailPort}
          onChange={(e) => setEmailPort(e.target.value)}
        />
      </Label>
      <Label className="flex justify-start mt-4">
        <span className="text-lg">Email Use TLS</span>
        <Input
          className="h-5 ml-3 w-5"
          type="checkbox"
          checked={emailUseTLS}
          onChange={(e) => setEmailUseTLS(e.target.checked)}
        />
      </Label>
      <Button
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full hover:bg-blue-600"
        onClick={handleSignupBusiness}
      >
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
    <div className="px-12 py-4 max-w- md:p-4 md:p-6 my-auto flex flex-col space-y-6">
      {view === 'login' && renderLoginForm()}
      {view === 'signup-individual' && renderSignupIndividualForm()}
      {view === 'signup-business' && renderSignupBusinessForm()}
    </div>
  );
};

export default LoginCard;