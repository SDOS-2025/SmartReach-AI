import React from 'react'
import NavigationMenu from '../components/NavigationMenu'
import { CarouselShadcn } from '../components/CarouselShad'


function HomePage() {
  return (
    <div className='flex flex-col justify-start bg-blue-500 w-screen h-screen'>

      <div className='bg-white-500 h-20 flex-none'>
        <NavigationMenu></NavigationMenu>
      </div>
      <div className='bg-yellow-500 flex-auto'> 
        <CarouselShadcn></CarouselShadcn>
      </div>
    </div>
  )
}

export default HomePage