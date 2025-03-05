import React from 'react'
import Link from 'next/link'
// import axios from 'axios'
// import { useState } from "react";



function NavigationMenu() {


  return (
    <nav className="flex bg-[#0F142E] items-center justify-between px-6 py-4 h-full w-full">

      <div className="flex ml-10 md:ml-20 items-center gap-8">
        <Link href="/" className="text-xl text-white font-bold">
          SmartReachAI
        </Link>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Link href="/write-email" className="text-xl font-bold">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
            Write Email
          </button>
        </Link>
        

        <Link href="/login" className="text-xl font-bold">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md  text-sm  hover:bg-blue-700 transition-colors">
            Login
          </button>
        </Link>
        
      </div>
  </nav>
  )
}

export default NavigationMenu