import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  onNavigate?: (view: string) => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onNavigate,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-micro font-mono text-red-500 uppercase tracking-wider">
          Runtime Exception Caught
        </span>
        <h1 className="text-display sm:text-display-md font-bold text-slate-900 dark:text-white">
          Calculation Engine Halted
        </h1>
        <p className="text-caption sm:text-body text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          An unexpected error occurred during state recalculation or 3D geometry initialization. Your browser has safely caught the exception.
        </p>
      </div>

      {error?.message && (
        <div className="p-3 rounded-tech bg-paper-100 dark:bg-charcoal-900 font-mono text-micro text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-left overflow-auto border border-paper-300 dark:border-charcoal-800">
          <code>{error.message}</code>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        {resetErrorBoundary && (
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="px-4 py-2 rounded-tech bg-accent text-white text-caption font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Calculation</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate('overview');
            } else {
              window.location.href = '/';
            }
          }}
          className="px-4 py-2 rounded-tech border border-paper-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-slate-800 dark:text-slate-200 text-caption font-medium hover:bg-paper-100 dark:hover:bg-charcoal-800 transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
