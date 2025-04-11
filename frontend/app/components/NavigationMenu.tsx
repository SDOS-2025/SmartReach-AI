"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

function NavigationMenu({ isLoggedIn: propIsLoggedIn, userName }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(userName || 'User');
  const dropdownRef = useRef(null);

  const fetchUsername = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/get-username', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.name) setUser(data.name);
    } catch (error) {
      console.log('Username fetch failed:', error);
    }
  };

  useEffect(() => {
    if (typeof propIsLoggedIn === 'boolean') {
      setIsLoggedIn(propIsLoggedIn);
      return;
    }

    fetch('http://localhost:8000/api/check-auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        setIsLoggedIn(true);
        if (data.name) {
          setUser(data.name);
        }
        console.log('got cookie');
      })
      .catch((error) => {
        console.log('Authentication check failed:', error);
        setIsLoggedIn(false);
      });
  }, [propIsLoggedIn, userName]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setIsLoggedIn(false);
        router.push('/login');
      });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="flex bg-[#0F142E] items-center justify-between px-4 md:px-6 py-4 h-full w-full">
      <div className="flex md:ml-10 items-center space-x-8">
        <Link href="/" className="text-xl text-white font-bold">
          SmartReachAI
        </Link>
      </div>

      <div className="flex items-center">
        <Link href="/about" className="text-white mr-8 font-bold hover:text-blue-200 transition">
          About Us
        </Link>
        {!isLoggedIn && (pathname === '/' || pathname === '/about') ? (
          <Link href="/login">
            <button className="p-2 md:px-4 py-2 text-white rounded-md bg-green-600 hover:bg-green-700 transition font-bold">
              Login
            </button>
          </Link>
        ) : isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 mr-8 text-white transition-all duration-200 group"
            >
              <div className="flex items-center justify-center bg-blue-700 rounded-full w-8 h-8 border-2 border-blue-800">
                <span className="text-sm font-medium">{user.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-medium">Hey, {user}</span>
              <svg 
                className={`w-4 h-4 text-blue-100 transition-transform duration-200 ease-in-out ${dropdownOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden transform origin-top-right transition-all duration-200">
                <div className="pt-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/admin">
                      <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <svg className="w-4 h-4 mr-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin
                      </div>
                    </Link>
                    
                    <Link href="/home">
                      <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <svg className="w-4 h-4 mr-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </div>
                    </Link>
                    
                    <Link href="/write-email">
                      <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <svg className="w-4 h-4 mr-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Write Email
                      </div>
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t border-gray-100">
                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default NavigationMenu;