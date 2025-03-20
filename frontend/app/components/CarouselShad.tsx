'use client';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

const TEST_SLIDES = [
  {
    id: 1,
    title: "Do more with data",
    description: "SmartReach AI revolutionizes email campaigns with AI-driven templates customized to your business needs and audience insights. Automate outreach, personalize every message, and drive higher engagement effortlessly—saving time while maximizing impact.",
    image: "/images/campaign-ai.jpg",
    image_discription: "Effortless Email Outreach – AI-Powered, Data-Driven, and Impactful."
  },
  {
    id: 2,
    title: "Optimize Outreach with AI",
    description: "SmartReach AI leverages advanced language models to craft high-quality, personalized email templates that align with your business needs and audience insights. Generate engaging, well-structured content that enhances deliverability, bypasses spam filters, and maximizes response rates—effortlessly automating outreach while saving time.",
    image: "/images/analytics-dash.jpg",
    image_discription: "Effortless Email Outreach – AI-Powered, Data-Driven, and Impactful."
    
  },
];

export function CarouselShadcn() {
  return (
    <Carousel
      plugins={[Autoplay({ delay: 3000 })]}
      className="w-full h-full flex"
      opts={{ align: 'start', loop: true }}
    >
      <CarouselContent className="flex h-full">
        {TEST_SLIDES.map((slide, index) => (
          <CarouselItem
            key={slide.id}
            className={`basis-full h-full flex flex-col ${
              index  % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } divide-y md:divide-x md:divide-y-0`}
          >
            {/* Text Half */}
            <div className="w-full text-black md:w-7/12 h-1/2 md:h-full p-4 md:p-16 flex items-center justify-center">
              <div className="space-y-2 md:space-y-12">
                <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
                <p className="text-sm md:text-3xl">{slide.description}</p>
              </div>
            </div>

            {/* Image Half */}
            <div className="w-full bg-[#0F142E] flex flex-col justify-center p-14 items-center md:w-5/12 h-1/2 md:h-full text-white relative">
              <div className="relative w-full h-[45vh]">
                  <Image
                    src={slide.image}
                    alt={slide.image_discription || "Carousel slide image"}
                    fill
                    className="object-cover"
                  />
                </div>
              <div className='text-center text-3xl mt-6 font-bold'>
                {slide.image_discription}
              </div>
            </div>

          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-2 md:left-4 top-[30%] md:top-1/2 -translate-y-1/2 scale-75 md:scale-100" />
      <CarouselNext className="right-2 md:right-4 top-[30%] md:top-1/2 -translate-y-1/2 scale-75 md:scale-100" />
    </Carousel>
  );
}