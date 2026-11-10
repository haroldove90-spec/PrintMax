import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { AppSection, HeroSlide } from '../types';
import { HERO_SLIDES } from '../data/mockData';
import { FormattedText } from './FormattedText';

interface HeroSliderProps {
  onNavigate: (section: AppSection) => void;
  slides?: HeroSlide[];
  showImages?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate, slides, showImages = true }) => {
  const activeSlides = slides && slides.length > 0 ? slides : HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Route target for slide buttons
  const getSlideNavigationTarget = (action?: string, fallback: AppSection = 'tienda'): AppSection => {
    if (!action) return fallback;
    const cleanAction = action.replace('#', '').toLowerCase();
    const validSections: AppSection[] = [
      'inicio', 
      'nosotros', 
      'renta_venta', 
      'hardware', 
      'software', 
      'tienda', 
      'contacto',
      'admin'
    ];
    if (cleanAction === 'equipos' || cleanAction === 'renta' || cleanAction === 'venta') return 'renta_venta';
    return (validSections.includes(cleanAction as AppSection) ? cleanAction : fallback) as AppSection;
  };

  const current = activeSlides[currentSlide];

  return (
    <section 
      className="relative bg-[#000000] overflow-hidden text-white font-['Plus_Jakarta_Sans',sans-serif]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images & Overlays */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {activeSlides.map((slide: HeroSlide, index: number) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {showImages ? (
                <>
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#182F4F]/80 to-[#000000]/60" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#000000] via-[#182F4F] to-[#0b1626] relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#F27C36_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-[#000000]/80" />
                </div>
              )}
            </div>
          );
        })}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24 w-full">
          <div className="max-w-3xl">
            {/* Tag / Category Badge */}
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#182F4F]/90 border border-[#394B61] text-slate-200 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F27C36] shrink-0" />
              <span className="truncate">{current.tag}</span>
              <span className="text-white/30">•</span>
              <span className="text-[#F27C36] font-medium truncate">{current.badgeText}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-tight mb-4 sm:mb-6 break-words">
              <FormattedText text={current.title} />
            </h1>

            {/* Subtitle */}
            <div className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed font-normal mb-6 sm:mb-8 max-w-2xl break-words">
              <FormattedText text={current.subtitle} />
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-8 sm:mb-10">
              {current.features && current.features.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-2.5 bg-black/40 backdrop-blur-sm p-2.5 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#F27C36] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-100 font-medium leading-snug break-words">
                    <FormattedText text={feat} />
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons: Navigate directly to separate section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate(getSlideNavigationTarget(current.ctaPrimaryAction, 'renta_venta'))}
                className="inline-flex items-center justify-center space-x-2.5 bg-[#F27C36] hover:bg-[#d96624] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition shadow-xl transform active:scale-95 cursor-pointer"
              >
                <span>{current.ctaPrimaryText || 'Ver Catálogo de Equipos'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => onNavigate(getSlideNavigationTarget(current.ctaSecondaryAction, 'contacto'))}
                className="inline-flex items-center justify-center space-x-2 bg-[#182F4F]/90 hover:bg-[#182F4F] text-slate-100 hover:text-white border border-[#394B61] hover:border-[#F27C36] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                <span>{current.ctaSecondaryText || 'Calculadora de Renta'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 p-3 rounded-full bg-black/80 hover:bg-[#182F4F] text-white border border-[#394B61] hover:border-[#F27C36] transition shadow-lg hidden md:flex items-center justify-center group cursor-pointer"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-[#F27C36] group-hover:-translate-x-0.5 transition" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 p-3 rounded-full bg-black/80 hover:bg-[#182F4F] text-white border border-[#394B61] hover:border-[#F27C36] transition shadow-lg hidden md:flex items-center justify-center group cursor-pointer"
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-[#F27C36] group-hover:translate-x-0.5 transition" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center space-x-3">
          {activeSlides.map((slide: HeroSlide, index: number) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`group flex items-center space-x-2 py-2 px-3.5 rounded-full transition-all border cursor-pointer ${
                index === currentSlide 
                  ? 'bg-[#182F4F] text-white font-bold border-[#F27C36] shadow-md ring-1 ring-[#F27C36]' 
                  : 'bg-black/80 text-slate-400 hover:text-white border-[#394B61]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-[#F27C36]' : 'bg-slate-500'}`} />
              <span className="text-xs hidden sm:inline">0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
