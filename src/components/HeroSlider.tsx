import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from '../data/mockData';
import { AppSection } from '../types';

interface HeroSliderProps {
  onNavigate: (section: AppSection) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Route target for slide buttons
  const getSlideNavigationTarget = (slideIndex: number, isPrimary: boolean): AppSection => {
    if (slideIndex === 0) return isPrimary ? 'tienda' : 'hardware';
    if (slideIndex === 1) return isPrimary ? 'hardware' : 'renta';
    return isPrimary ? 'soporte' : 'contacto';
  };

  return (
    <section 
      className="relative bg-black overflow-hidden text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images & Overlays */}
      <div className="relative min-h-[560px] lg:min-h-[620px] flex items-center">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
            </div>
          );
        })}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-3xl">
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{HERO_SLIDES[currentSlide].tag}</span>
              <span className="text-white/30">•</span>
              <span className="text-blue-400 font-normal">{HERO_SLIDES[currentSlide].badgeText}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
              {HERO_SLIDES[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed font-light mb-8 max-w-2xl">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {HERO_SLIDES[currentSlide].features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-200 font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons: Navigate directly to separate section */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(getSlideNavigationTarget(currentSlide, true))}
                className="inline-flex items-center space-x-2.5 bg-black hover:bg-neutral-900 text-white px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide border border-neutral-700 hover:border-blue-500 transition shadow-xl transform hover:-translate-y-0.5"
              >
                <span>{HERO_SLIDES[currentSlide].ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                onClick={() => onNavigate(getSlideNavigationTarget(currentSlide, false))}
                className="inline-flex items-center space-x-2 bg-neutral-900/90 hover:bg-black text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 px-6 py-3.5 rounded-xl font-semibold text-sm transition"
              >
                <span>{HERO_SLIDES[currentSlide].ctaSecondaryText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-neutral-800 hover:border-blue-500 transition shadow-lg hidden md:flex items-center justify-center group"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-300 group-hover:text-blue-400 group-hover:-translate-x-0.5 transition" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-neutral-800 hover:border-blue-500 transition shadow-lg hidden md:flex items-center justify-center group"
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="w-6 h-6 text-neutral-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center space-x-3">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`group flex items-center space-x-2 py-2 px-3 rounded-full transition-all border ${
                index === currentSlide 
                  ? 'bg-black text-white font-bold border-blue-500/80 shadow-md' 
                  : 'bg-black/70 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-neutral-600'}`} />
              <span className="text-xs hidden sm:inline">0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
