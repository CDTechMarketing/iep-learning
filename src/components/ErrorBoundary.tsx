/**
 * Error Boundary Component
 *
 * Catches React errors and prevents white screen of death
 * Provides kid-friendly error message and recovery options
 */

import { Component, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to our logging system
    logger.critical(
      'react-error-boundary',
      'React component error caught',
      error,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    );

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // If too many errors, might be in error loop
    if (this.state.errorCount > 3) {
      logger.critical(
        'react-error-boundary',
        'Multiple errors detected - possible error loop',
        error,
        { errorCount: this.state.errorCount }
      );
    }
  }

  handleReset = () => {
    logger.info('react-error-boundary', 'User reset error boundary');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    logger.info('react-error-boundary', 'User navigated home from error');
    window.location.href = '/';
  };

  handleReload = () => {
    logger.info('react-error-boundary', 'User reloaded page from error');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default kid-friendly error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
            {/* Kid-Friendly Error Icon */}
            <div className="text-8xl mb-6">😅</div>

            {/* Kid-Friendly Title */}
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h1>

            {/* Simple Explanation */}
            <p className="text-2xl text-gray-600 mb-8">
              Don't worry! This happens sometimes.
              <br />
              Let's try to fix it!
            </p>

            {/* Recovery Options */}
            <div className="space-y-4 mb-8">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg text-xl font-bold"
              >
                <RefreshCw className="w-8 h-8" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg text-xl font-bold"
              >
                <Home className="w-8 h-8" />
                Go to Home Screen
              </button>

              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-300 text-gray-700 rounded-2xl hover:bg-gray-400 transition-colors text-lg font-semibold"
              >
                <AlertTriangle className="w-6 h-6" />
                Reload Page (Last Resort)
              </button>
            </div>

            {/* Parent/Developer Info (Collapsible) */}
            <details className="mt-8 text-left bg-gray-50 rounded-xl p-4">
              <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900">
                Technical Details (for parents/teachers)
              </summary>
              <div className="mt-4 space-y-2">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm font-mono text-red-600 mb-2">
                    <strong>Error:</strong> {this.state.error?.message}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Location:</strong> {this.state.error?.stack?.split('\n')[1]?.trim()}
                  </p>
                  {import.meta.env.DEV && this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-600">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-gray-600 overflow-auto mt-2 p-2 bg-gray-100 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
                <p className="text-xs text-gray-500 italic">
                  This error has been logged for debugging. You can export logs from the Parent Dashboard.
                </p>
              </div>
            </details>

            {/* Error Loop Warning */}
            {this.state.errorCount > 3 && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                <p className="text-red-800 font-semibold">
                  ⚠️ Multiple errors detected. Please reload the page or contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based wrapper for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
