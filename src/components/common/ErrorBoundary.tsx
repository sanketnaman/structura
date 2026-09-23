import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  onNavigate?: (view: string) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: unknown): State {
    const normalizedError = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : error ? JSON.stringify(error) : 'Unknown calculation exception');
    return { hasError: true, error: normalizedError };
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('STRUCTURA Uncaught Error:', error, errorInfo);
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          onNavigate={this.props.onNavigate}
        />
      );
    }

    return this.props.children;
  }
}
