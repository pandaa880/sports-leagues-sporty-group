import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-red-50 text-red-800">
            <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-4 text-sm">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <Button 
              variant="destructive" 
              onClick={this.resetErrorBoundary}
              className="mt-2"
            >
              Try again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
