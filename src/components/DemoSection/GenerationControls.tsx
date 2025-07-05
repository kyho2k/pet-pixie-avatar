import { RegenerateButton } from '@/components/RegenerateButton';

interface GenerationControlsProps {
  onRegenerate: () => Promise<void>;
  remainingCredits: number;
  disabled: boolean;
}

export const GenerationControls = ({
  onRegenerate,
  remainingCredits,
  disabled
}: GenerationControlsProps) => {
  return (
    <div className="text-center mt-8 space-y-4">
      <div className="inline-flex items-center space-x-4">
        <RegenerateButton
          onRegenerate={onRegenerate}
          remainingCredits={remainingCredits}
          disabled={disabled}
        />
        <div className="text-tech-foreground/60 text-sm">
          남은 체험 횟수: <span className="font-bold text-tech-accent">{remainingCredits}회</span>
        </div>
      </div>
    </div>
  );
};