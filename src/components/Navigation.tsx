import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-card/95 backdrop-blur-sm shadow-card' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🐾</span>
          </div>
          <span className="font-bold text-xl">AI Pet Avatar</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('demo')}
            className="text-foreground hover:text-primary transition-colors"
          >
            체험하기
          </button>
          <button 
            onClick={() => scrollToSection('features')}
            className="text-foreground hover:text-primary transition-colors"
          >
            기능소개
          </button>
          <button 
            onClick={() => scrollToSection('funding')}
            className="text-foreground hover:text-primary transition-colors"
          >
            후원하기
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse-glow">
            펀딩 진행중 80%
          </div>
          <Button 
            onClick={() => scrollToSection('funding')}
            className="bg-gradient-primary hover:scale-105 transition-transform"
          >
            후원하기
          </Button>
        </div>
      </div>
    </nav>
  );
};