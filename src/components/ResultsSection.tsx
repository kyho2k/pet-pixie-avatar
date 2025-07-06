import { ThreeViewer } from './ThreeViewer';
import { CharacterGallery } from './CharacterGallery';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CharacterResult {
  style: string;
  imageUrl: string;
  thumbnail: string;
}

interface ResultsSectionProps {
  meshyModel?: string;
  cartoonResults?: CharacterResult[];
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export const ResultsSection = ({
  meshyModel,
  cartoonResults = [],
  onRegenerate,
  isRegenerating = false
}: ResultsSectionProps) => {
  const hasResults = meshyModel || cartoonResults.length > 0;

  if (!hasResults) {
    return null;
  }

  return (
    <section id="results" className="py-12 space-y-12">
      <div className="text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-tech-foreground mb-4">
          🎉 변환 완료!
        </h2>
        <p className="text-tech-foreground/70 text-lg">
          AI가 생성한 3D 모델과 캐릭터를 확인해보세요
        </p>
      </div>

      {/* 3D Model Viewer */}
      {meshyModel && (
        <div className="animate-scale-in">
          <ThreeViewer 
            meshyModel={meshyModel}
            className="max-w-2xl mx-auto"
          />
        </div>
      )}

      {/* Character Gallery */}
      {cartoonResults.length > 0 && (
        <div className="animate-fade-in">
          <CharacterGallery 
            characters={cartoonResults}
            className="max-w-6xl mx-auto"
          />
        </div>
      )}
    </section>
  );
};