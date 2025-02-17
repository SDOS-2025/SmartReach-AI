'use client'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const TEST_SLIDES = [
  {
    id: 1,
    title: "AI-Powered Campaigns",
    description: "Automate your email marketing with smart suggestions",
    image: "/images/campaign-ai.jpg"
  },
  {
    id: 2,
    title: "Real-Time Analytics",
    description: "Track campaign performance with live metrics",
    image: "/images/analytics-dash.jpg"
  }
]

export function CarouselShadcn() {
  return (
    <Carousel
      plugins={[Autoplay({ delay: 3000 })]}
      className="w-full h-full flex"
      opts={{ align: 'start', loop: true }}
    >
        <CarouselContent className="flex h-full">
            {TEST_SLIDES.map((slide) => (
            <CarouselItem 
                key={slide.id} 
                className="basis-full h-full flex flex-col md:flex-row divide-y md:divide-x"
            >
                {/* Text Half - Mobile first */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full p-4 md:p-8 md:p-16 flex items-center justify-center bg-muted">
                    <div className="space-y-2 md:space-y-4">
                        <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
                        <p className="text-sm md:text-md text-muted-foreground">
                        {slide.description}
                        </p>
                    </div>
                </div>

                {/* Image Half */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
                    <img
                        src={slide.image}
                        className="w-full h-full object-cover md:object-center"
                        alt={slide.title}
                        style={{ 
                        aspectRatio: '1/1'
                        }}
                    />
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 md:left-4 top-[30%] md:top-1/2 -translate-y-1/2 scale-75 md:scale-100" />
        <CarouselNext className="right-2 md:right-4 top-[30%] md:top-1/2 -translate-y-1/2 scale-75 md:scale-100" />
    </Carousel>
  )
}