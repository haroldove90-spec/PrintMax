import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from '../data/mockData';

interface HeroSliderProps {
  onSelectAction?: (action: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = () => {
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

  return (
    <section 
      id="inicio"
      className="relative bg-slate-950 overflow-hidden text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images & Overlays */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Dark Professional Vignette */}
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
            </div>
          );
        })}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-3xl">
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-600/25 border border-blue-400/40 text-blue-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{HERO_SLIDES[currentSlide].tag}</span>
              <span className="text-white/30">•</span>
              <span className="text-white font-normal">{HERO_SLIDES[currentSlide].badgeText}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
              {HERO_SLIDES[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light mb-8 max-w-2xl">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {HERO_SLIDES[currentSlide].features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={HERO_SLIDES[currentSlide].ctaPrimaryAction}
                className="inline-flex items-center space-x-2.5 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>{HERO_SLIDES[currentSlide].ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={HERO_SLIDES[currentSlide].ctaSecondaryAction}
                className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 px-6 py-3.5 rounded-xl font-semibold text-sm transition hover:border-slate-500 backdrop-blur-sm"
              >
                <span>{HERO_SLIDES[currentSlide].ctaSecondaryText}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 p-3 rounded-full bg-slate-900/70 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 transition shadow-lg hidden md:flex items-center justify-center group"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 p-3 rounded-full bg-slate-900/70 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 transition shadow-lg hidden md:flex items-center justify-center group"
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center space-x-3">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`group flex items-center space-x-2 py-2 px-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-blue-600/90 text-white font-semibold' 
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-slate-500'}`} />
              <span className="text-xs hidden sm:inline">0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
