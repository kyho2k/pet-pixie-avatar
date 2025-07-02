import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider = ({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "원본",
  afterLabel = "AI 변환 결과" 
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <Card className="overflow-hidden bg-white shadow-card">
      <div className="text-center py-4 bg-gradient-primary">
        <h3 className="text-lg font-semibold text-primary-foreground">
          🎭 변화 과정을 직접 확인해보세요
        </h3>
        <p className="text-sm text-primary-foreground/80">
          슬라이더를 좌우로 움직여 비교해보세요
        </p>
      </div>
      
      <div 
        className="relative aspect-video cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* Before Image */}
        <div className="absolute inset-0">
          <img 
            src={beforeImage} 
            alt={beforeLabel}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {beforeLabel}
          </div>
        </div>

        {/* After Image */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={afterImage} 
            alt={afterLabel}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {afterLabel}
          </div>
        </div>

        {/* Slider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-muted/30">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSliderPosition(25)}
            className="text-xs"
          >
            25%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSliderPosition(50)}
            className="text-xs"
          >
            50%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSliderPosition(75)}
            className="text-xs"
          >
            75%
          </Button>
        </div>
      </div>
    </Card>
  );
};