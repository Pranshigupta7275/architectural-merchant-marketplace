import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
          <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Something went wrong</h2>
            <p className="text-gray-600 text-sm mb-6">
              We apologize for the inconvenience. An unexpected error occurred while rendering this page.
            </p>
            <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
              <summary className="text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer mb-2">
                Technical Details
              </summary>
              <pre className="text-xs text-red-600 whitespace-pre-wrap break-words">
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="px-6 py-3 bg-[#111827] text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
