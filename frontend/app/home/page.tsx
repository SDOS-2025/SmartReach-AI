import React from 'react';
import NavigationMenu from '../components/NavigationMenu';


function HomePage() {
  return (
    <div className="flex flex-col justify-start w-screen h-screen">
    <div className="h-20 flex-none">
      <NavigationMenu />
    </div>
    <div className="flex flex-auto flex-col lg:flex-row">
      <div className="w-screen lg:w-[6rem] bg-[#0F142E] flex lg:flex-col justify-center items-center py-5 space-x-6 lg:space-y-12 lg:space-x-0">
        <h1 className='text-white'>sidebar</h1>
      </div>
      <div className="h-[calc(100vh-5rem)] w-screen p-4 lg:p-10 flex flex-row">
        <h1> Dashboard </h1>
      </div>
    </div>
  </div>
  );
}

export default HomePage;