import React from 'react'
import Link from 'next/link'

function NavigationMenu() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 h-full w-full">
    {/* Left Section */}
    <div className="flex items-center gap-8">
      <Link href="/home" className="text-xl font-bold">
        SmartReachAI
      </Link>
    </div>

    {/* Right Section */}
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
      
      {/* User Profile */}
      {/* <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm">JD</span>
        </div>
      </div> */}
    </div>
  </nav>
  )
}

export default NavigationMenu