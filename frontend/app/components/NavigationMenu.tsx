"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function NavigationMenu({ isLoggedIn: propIsLoggedIn }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Respect propIsLoggedIn if provided
    if (typeof propIsLoggedIn === 'boolean') {
      setIsLoggedIn(propIsLoggedIn);
      return;
    }

    // Check for authToken cookie by calling check-auth endpoint
    fetch('http://localhost:8000/api/check-auth', {
      method: 'GET',
      credentials: 'include', // Include authToken cookie
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        setIsLoggedIn(true); // Cookie is valid
        console.log('got cookie');
      })
      .catch((error) => {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
        router.push('/login');
      });
  }, [propIsLoggedIn, router]);

  const handleLogout = () => {
    fetch('http://localhost:8000/api/logout/', {
      method: 'GET',
      credentials: 'include', 
    })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(false);
          router.push('/login');
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
        // Proceed with redirect even if API fails
        setIsLoggedIn(false);
        router.push('/login');
      });
  };
  

  return (
    <nav className="flex bg-[#0F142E] items-center justify-between px-4 md:px-6 py-4 h-full w-full">
      <div className="flex md:ml-10 items-center md:gap-8">
        <Link href="/" className="text-xl text-white font-bold">
          SmartReachAI
        </Link>
      </div>

      <div className="flex items-center md:gap-4 ml-auto">
        <Link href="/write-email" className="text-xl font-bold">
          <button className="p-2 md:px-4 py-2 text-white rounded-md transition hover:text-gray-300">
            Write Email
          </button>
        </Link>

        <Link href="/about" className="text-xl font-bold mx-2">
          <button className="p-2 md:px-4 py-2 text-white rounded-md transition hover:text-gray-300">
            About Us
          </button>
        </Link>

        {!isLoggedIn ? (
          <Link href="/login" className="text-xl font-bold mx-2">
            <button className="p-2 md:px-4 py-2 text-white rounded-md bg-green-600 transition hover:text-gray-300">
              Login
            </button>
          </Link>
        ) : (
          <>

            <button
              onClick={handleLogout}
              className="p-2 md:px-4 py-2 text-white font-bold mx-2 rounded-md bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavigationMenu;