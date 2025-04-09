'use client';
import { useEffect, useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1,
    title: "Transform Your Email Campaigns with AI",
    description: "SmartReach AI revolutionizes email marketing with data-driven templates tailored to your business and audience. Boost engagement and conversions with personalized outreach.",
    image: "/images/carousel1.png",
    imageDescription: "AI-Powered Email Marketing",
    ctaLink: "/write-email",
    ctaText: "Create Campaign"
  },
  {
    id: 2,
    title: "Make Data-Driven Decisions",
    description: "Leverage advanced analytics to optimize send times, refine messaging, and track performance metrics in real-time. Our platform turns insights into action.",
    image: "/images/carousel2.png",
    imageDescription: "Comprehensive Campaign Analytics",
    ctaLink: "/home",
    ctaText: "View Analytics"
  },
  {
    id: 3,
    title: "Personalize at Scale",
    description: "Our AI engine creates content that resonates with your audience segments. Send the right message to the right people at the right time.",
    image: "/images/carousel3.png",
    imageDescription: "Personalized Content Creation",
    ctaLink: "/login",
    ctaText: "Get Started"
  }
];

export function CarouselShadcn() {
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    return () => {
      // Cleanup autoplay on unmount
      // if (autoplayRef.current && autoplayRef.current.destroy) {
      //   autoplayRef.current.destroy();
      // }
    };
  }, []);

  return (
    <Carousel
      plugins={[autoplayRef.current]}
      className="w-full h-full"
      opts={{ align: 'start', loop: true }}
    >
      <CarouselContent className="h-full">
        {SLIDES.map((slide, index) => (
          <CarouselItem
            key={slide.id}
            className="basis-full h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Text Column - Always on left for desktop, on top for mobile */}
              <div className="flex flex-col justify-center p-6 md:p-12 lg:p-16 bg-gradient-to-br from-white to-gray-100">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#0F142E] to-[#2A3561]">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 mb-8">
                    {slide.description}
                  </p>
                  <Link 
                    href={slide.ctaLink} 
                    className="inline-flex items-center px-6 py-3 bg-[#0F142E] text-white rounded-lg font-medium hover:bg-[#1A2754] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {slide.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              {/* Image Column */}
              <div className="bg-gradient-to-br from-[#0F142E] to-[#1A2246] flex flex-col justify-center items-center p-6 md:p-12">
                <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src={slide.image}
                    alt={slide.imageDescription}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                <p className="text-white text-center mt-6 font-medium text-base md:text-lg">
                  {slide.imageDescription}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Customized navigation buttons */}
      <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-[#0F142E] border-none shadow-lg" />
      <CarouselNext className="right-4 bg-white/80 hover:bg-white text-[#0F142E] border-none shadow-lg" />
      
      {/* Custom pagination indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, index) => (
          <div 
            key={index} 
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              index === 0 ? 'bg-[#0F142E]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
}