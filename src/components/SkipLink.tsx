import { Button } from '@/components/ui/button';

export const SkipLink = () => {
  const handleSkipToMain = () => {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={handleSkipToMain}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground"
      tabIndex={0}
    >
      메인 콘텐츠로 바로가기
    </Button>
  );
};