import React from 'react'
import NavigationMenu from './components/NavigationMenu'
import { CarouselShadcn } from './components/CarouselShad'


function HomePage() {
  return (
    <div className='flex flex-col justify-start '>

      <div className='h-20 w-full  flex-none'>
        <NavigationMenu></NavigationMenu>
      </div>
      <div className='h-[calc(100vh-5rem)] w-full'> 
        <CarouselShadcn></CarouselShadcn>
      </div>

      <div className='h-screen w-full flex flex-col'> 
        <div className="bg-[#0F142E] flex-[1] flex items-center justify-center text-4xl text-white px-80">
          <span className='text-start'>
            Data-driven decision making proves for{' '}
            <span className="text-blue-500 font-semibold">efficient</span>{' '}
            decision making.
          </span>
        </div>
        <div className='flex-[3] flex items-center justify-center text-3xl'>
            graphss
        </div>
      </div>

      <div className='h-screen w-full flex items-center justify-center text-3xl'> 
          Our website provides the following features:
      </div>

    </div>
  )
}

export default HomePage
