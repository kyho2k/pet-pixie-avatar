import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StyleOption {
  id: string;
  name: string;
  description: string;
  example: string;
  emoji: string;
}

interface StyleSelectorProps {
  onStylesChange: (styles: string[]) => void;
  selectedStyles: string[];
  className?: string;
}

export const StyleSelector = ({ 
  onStylesChange, 
  selectedStyles, 
  className = "" 
}: StyleSelectorProps) => {
  const styleOptions: StyleOption[] = [
    {
      id: 'disney',
      name: '디즈니 스타일',
      description: '귀엽고 둥글둥글한 디즈니 캐릭터 스타일',
      example: '큰 눈, 부드러운 라인',
      emoji: '🏰'
    },
    {
      id: 'anime',
      name: '애니메이션',
      description: '일본 애니메이션 스타일의 캐릭터',
      example: '날카로운 눈, 생동감 있는 표현',
      emoji: '⚡'
    },
    {
      id: 'pixel',
      name: '픽셀 아트',
      description: '8비트 게임 스타일의 픽셀 아트',
      example: '레트로 게임 캐릭터',
      emoji: '🎮'
    },
    {
      id: 'watercolor',
      name: '수채화',
      description: '부드러운 수채화 터치의 아트',
      example: '몽환적이고 따뜻한 느낌',
      emoji: '🎨'
    },
    {
      id: 'cartoon',
      name: '카툰',
      description: '친근한 만화 스타일',
      example: '단순하고 친근한 라인',
      emoji: '😊'
    },
    {
      id: 'fantasy',
      name: '판타지',
      description: '마법적이고 환상적인 스타일',
      example: '반짝이는 효과, 마법 요소',
      emoji: '✨'
    }
  ];

  const toggleStyle = (styleId: string) => {
    const newStyles = selectedStyles.includes(styleId)
      ? selectedStyles.filter(id => id !== styleId)
      : [...selectedStyles, styleId];
    
    onStylesChange(newStyles);
  };

  return (
    <Card className={`bg-tech-bg/50 border-tech-accent/20 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-tech-foreground">
            🎭 스타일 선택
          </h3>
          <Badge variant="secondary" className="text-xs">
            {selectedStyles.length}/3 선택됨
          </Badge>
        </div>
        
        <p className="text-sm text-tech-foreground/70 mb-4">
          최대 3개까지 선택 가능합니다. 선택한 스타일별로 각각 생성됩니다.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {styleOptions.map((style) => (
            <Button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              variant={selectedStyles.includes(style.id) ? 'default' : 'outline'}
              disabled={!selectedStyles.includes(style.id) && selectedStyles.length >= 3}
              className={`h-auto p-3 justify-start ${
                selectedStyles.includes(style.id)
                  ? 'bg-tech-accent text-white border-tech-accent'
                  : 'text-tech-foreground border-tech-accent/40 hover:bg-tech-accent/10'
              }`}
            >
              <div className="text-left w-full">
                <div className="flex items-center mb-1">
                  <span className="mr-2">{style.emoji}</span>
                  <span className="font-semibold text-sm">{style.name}</span>
                </div>
                <p className="text-xs opacity-80 leading-tight">
                  {style.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
        
        {selectedStyles.length === 0 && (
          <div className="text-center mt-4 p-3 bg-tech-accent/10 rounded-lg">
            <p className="text-sm text-tech-foreground/70">
              스타일을 선택하지 않으면 자동으로 최적 스타일이 적용됩니다
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};