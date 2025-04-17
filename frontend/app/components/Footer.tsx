"use client";
import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-[#0F142E] text-white py-8 px-4 md:px-6">
      <div className="container mx-auto">
        
        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SmartReachAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;