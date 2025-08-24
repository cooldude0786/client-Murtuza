import React, { useState, useEffect, useRef } from 'react';

const dummySlides = [
  {
    bgColor: 'bg-indigo-100',
    title: 'Summer Collection is Here',
    subtitle: 'Discover the latest trends for the season.',
    buttonText: 'Shop Now',
  },
  {
    bgColor: 'bg-green-100',
    title: 'Mega Sale on Electronics',
    subtitle: 'Get up to 40% off on your favorite gadgets.',
    buttonText: 'View Deals',
  },
  {
    bgColor: 'bg-amber-100',
    title: 'New Home Decor Arrivals',
    subtitle: 'Beautify your space with our exclusive new items.',
    buttonText: 'Explore',
  },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at the first "real" slide
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const autoScrollInterval = useRef(null);

  // 1. Create clones for infinite loop effect
  const slidesWithClones = [dummySlides[dummySlides.length - 1], ...dummySlides, dummySlides[0]];

  // 2. Function to handle advancing to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  // 3. Function to handle going to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // 4. Set up the automated scrolling
  const startAutoScroll = () => {
    stopAutoScroll(); // Clear any existing interval
    autoScrollInterval.current = setInterval(() => {
      nextSlide();
    }, 1000); // Set to 1 second
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };

  // Start scrolling when the component mounts
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll(); // Cleanup on unmount
  }, []);
  
  // 5. Effect to handle the "jump" for the infinite loop
  useEffect(() => {
    if (currentSlide === slidesWithClones.length - 1) { // If on the first slide's clone
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(1);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }
    if (currentSlide === 0) { // If on the last slide's clone
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(slidesWithClones.length - 2);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [currentSlide, slidesWithClones.length]);

  // Re-enable transition after the jump
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => setTransitionEnabled(true), 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);


  return (
    <div className="container mx-auto mt-4">
      {/* 6. Add mouse enter/leave events to pause/resume scrolling */}
      <div 
        className="relative min-h-[calc(100vh-200px)]  w-full overflow-hidden rounded-lg"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        <div 
          className="w-full h-full flex"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {slidesWithClones.map((slide, index) => (
            <div 
              key={index} 
              className={`w-full min-h-[calc(100vh-200px)] flex-shrink-0 p-6 md:p-16 text-center flex flex-col justify-center items-center  ${slide.bgColor}`}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-base-content">
                {slide.title}
              </h2>
              <p className="mt-4 text-lg text-base-content max-w-2xl">
                {slide.subtitle}
              </p>
              <button className="mt-8 text-neutral-content bg-neutral hover:bg-neutral/80  font-bold py-3 px-8 rounded-lg">
                {slide.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full shadow-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full shadow-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;

