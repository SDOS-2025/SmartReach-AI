'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';

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
  const [showLoginErrors, setShowLoginErrors] = useState(false);
  const [showSignupIndErrors, setShowSignupIndErrors] = useState(false);
  const [showSignupBusErrors, setShowSignupBusErrors] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleGoogleLogin = () => {
    window.location.href = '/social-auth/login/google-oauth2/';
  };

  const isLoginValid = () => username.trim() !== '' && password.trim() !== '';
  const isSignupIndividualValid = () => username.trim() !== '' && email.trim() !== '' && password.trim() !== '';
  const isSignupBusinessValid = () =>
    username.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    emailHostUser.trim() !== '' &&
    emailHostPassword.trim() !== '' &&
    emailHost.trim() !== '' &&
    emailPort.trim() !== '';

  const handleLogin = async () => {
    setShowLoginErrors(true);
    setLoginErrorMessage('');

    if (!isLoginValid()) {
      console.error('Please fill all required fields: Email, Password');
      return;
    }

    const requestBody = { username, password };
    try {
      const response = await fetch('/api/user-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Status Code:", response.status);
        console.error('Login error:', data);
        if (data?.error === "Invalid email address") {
          setLoginErrorMessage("Invalid email address.");
        } else if (data?.error === "Wrong password") {
          setLoginErrorMessage("Wrong password.");
        } else if (data?.error === "User not found") {
          setLoginErrorMessage("User not found.");
        } else {
          setLoginErrorMessage("An unexpected error occurred.");
        }
        return;
      }

      if (data.message === 'Login successful') {
        if (data.status === "Normal") {
          window.location.href = '/write_email';
        } else {
          window.location.href = '/home';
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginErrorMessage("Server error. Please try again later.");
    }
  };

  const handleSignupBusiness = async () => {
    setShowSignupBusErrors(true);
    if (!isSignupBusinessValid()) {
      console.error(
        'Please fill all required fields: Business Name, Email, Password, Email Host User, Email Host Password, Email Host, Email Port'
      );
      return;
    }

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
      const response = await fetch('/api/signup-business/', {
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
        setView('login');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleSignupIndividuals = async () => {
    setShowSignupIndErrors(true);
    if (!isSignupIndividualValid()) {
      console.error('Please fill all required fields: Name, Email, Password');
      return;
    }

    const requestBody = { username, email, password };
    try {
      const response = await fetch('/api/signup-individuals/', {
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
      if (data.message === 'User created successfully') {
        setView('login');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const renderLoginForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to SmartReachAI</h1>
      <h2 className="text-3xl mb-3 flex justify-center">Login</h2>
      
      {/* Error message display */}
      {loginErrorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{loginErrorMessage}</span>
        </div>
      )}
      
      <Label className="block">
        <Input
          className="h-14"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!username.trim()) return;
              passwordInputRef.current?.focus();
            }
          }}
          required
        />
        {showLoginErrors && !username && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <Input
          className="h-14"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordInputRef}
          required
        />
        {showLoginErrors && !password && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <div className="text-sm text-blue-500 hover:underline py-5">
        <a 
          href="#" 
          className="hover:underline" 
          onClick={(e) => {
            e.preventDefault();
            setView('forgot-password');
          }}
        >
          Forgot Password?
        </a>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-1 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-md hover:shadow-blue-500/50 animate-shrink-shadow"
      >
        Login
      </Button>
      <div className="flex items-center my-4">
        <Separator className="flex-auto" />
        <span className="mx-2 text-xl flex-none text-gray-500">or</span>
        <Separator className="flex-auto" />
      </div>
      <Button
        type="button"
        className="w-full bg-red-500 h-14 text-xl text-white py-2 rounded-full hover:bg-red-600 transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-md hover:shadow-red-500/50 animate-shrink-shadow"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button>
    </form>
  );

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
          required
        />
        {showSignupIndErrors && !username && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email</span>
        <Input
          className="h-14 mt-2"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {showSignupIndErrors && !email && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Password</span>
        <Input
          className="h-14 mt-2"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {showSignupIndErrors && !password && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Button
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-md hover:shadow-blue-500/50 animate-shrink-shadow"
        onClick={handleSignupIndividuals}
      >
        Sign Up
      </Button>
      <Button variant="link" className="mt-4 text-blue-500 text-lg" onClick={() => setView('login')}>
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
          required
        />
        {showSignupBusErrors && !username && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Business Email</span>
        <Input
          className="h-14 mt-2"
          type="email"
          placeholder="Enter your business email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {showSignupBusErrors && !email && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Password</span>
        <Input
          className="h-14 mt-2"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {showSignupBusErrors && !password && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Host User</span>
        <Input
          className="h-14 mt-2"
          type="text"
          placeholder="Enter your email host user"
          value={emailHostUser}
          onChange={(e) => setEmailHostUser(e.target.value)}
          required
        />
        {showSignupBusErrors && !emailHostUser && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Host Password</span>
        <Input
          className="h-14 mt-2"
          type="password"
          placeholder="Enter your email host password"
          value={emailHostPassword}
          onChange={(e) => setEmailHostPassword(e.target.value)}
          required
        />
        {showSignupBusErrors && !emailHostPassword && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Host</span>
        <Input
          className="h-14 mt-2"
          type="text"
          placeholder="Enter your email host (e.g. smtp.gmail.com)"
          value={emailHost}
          onChange={(e) => setEmailHost(e.target.value)}
          required
        />
        {showSignupBusErrors && !emailHost && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <span className="text-lg">Email Port</span>
        <Input
          className="h-14 mt-2"
          type="number"
          placeholder="Enter your email port (e.g. 587)"
          value={emailPort}
          onChange={(e) => setEmailPort(e.target.value)}
          required
        />
        {showSignupBusErrors && !emailPort && <p className="text-red-500 text-sm mt-1">This field is required</p>}
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
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-md hover:shadow-blue-500/50 animate-shrink-shadow"
        onClick={handleSignupBusiness}
      >
        Sign Up
      </Button>
      <Button variant="link" className="mt-4 text-blue-500 text-lg" onClick={() => setView('login')}>
        Back to Login
      </Button>
    </>
  );

  return (
    <div className="px-12 py-4 max-w-md:p-4 md:p-6 my-auto flex flex-col space-y-6">
      {view === 'login' && renderLoginForm()}
      {view === 'signup-individual' && renderSignupIndividualForm()}
      {view === 'signup-business' && renderSignupBusinessForm()}
      <style jsx>{`
        @keyframes shrink-shadow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0); }
          50% { transform: scale(0.98); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
        }
        .animate-shrink-shadow { animation: shrink-shadow 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginCard;