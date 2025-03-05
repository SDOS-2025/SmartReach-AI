import React from 'react'
import NavigationMenu from './components/NavigationMenu'
import { CarouselShadcn } from './components/CarouselShad'


function HomePage() {
  return (
    <div className='flex flex-col justify-start bg-blue-500 '>

      <div className='bg-white-500 h-20 w-full  flex-none'>
        <NavigationMenu></NavigationMenu>
      </div>
      <div className='bg-yellow-500 h-[calc(100vh-5rem)] w-full'> 
        <CarouselShadcn></CarouselShadcn>
      </div>

      <div className='bg-green-500 h-screen w-full flex flex-col'> 
        <div className='bg-purple-500 flex-[1]'>
            Data-driven decision making proves for  decision making.
        </div>
        <div className='bg-red-500 flex-[3]'>
            graphss
        </div>
      </div>

      <div className='bg-blue-500 h-screen w-full'> 
        This is a test
      </div>

    </div>
  )
}

export default HomePage
