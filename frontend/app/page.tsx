import React from 'react'
import NavigationMenu from './components/NavigationMenu'
import { CarouselShadcn } from './components/CarouselShad'
import Image from 'next/image'


function HomePage() {
  return (
    <div className='flex flex-col justify-start'>
      <div className='h-20 w-full flex-none'>
        <NavigationMenu></NavigationMenu>
      </div>
      <div className='h-[calc(100vh-5rem)] w-full'> 
        <CarouselShadcn></CarouselShadcn>
      </div>

      <div className='h-screen w-full flex flex-col'> 
        <div className="bg-[#0F142E] flex-[1] flex items-center justify-center text-4xl text-white px-20 xl:px-80">
          <span className='text-start'>
            Data-driven decision making proves for{' '}
            <span className="text-blue-500 font-semibold">efficient</span>{' '}
            decision making.
          </span>
        </div>
        <div className="flex-[3] flex items-center justify-center text-3xl">
          <div className="w-1/2 h-full flex flex-col md:flex-row justify-center items-center p-12 relative">
            <Image
              src="/images/slide1.png"
              alt="slide image"
              width={600}
              height={500}
              className="object-cover"
            />
          </div>
          <div className="w-1/2 h-full flex justify-center items-center p-12 relative">
            <Image
              src="/images/slide2.png"
              alt="Carousel slide image"
              width={600}
              height={500}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className='h-screen w-full flex items-center justify-center text-3xl'> 
          Our website provides the following features:
      </div>
    </div>
  )
}


export default HomePage
