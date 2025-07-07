import React, { Component, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl p-8 text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h1 className="text-2xl font-bold mb-4">앱 로딩 중 오류가 발생했습니다</h1>
            <p className="text-muted-foreground mb-6">
              페이지를 새로고침해주세요. 문제가 계속되면 관리자에게 문의해주세요.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-left bg-red-50 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-red-800 mb-2">Error Details:</h3>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
            
            <Button 
              onClick={() => window.location.reload()}
              className="mr-4"
            >
              페이지 새로고침
            </Button>
            <Button 
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              다시 시도
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}