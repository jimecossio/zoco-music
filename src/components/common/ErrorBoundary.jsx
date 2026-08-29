// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-base text-center">
          <div className="max-w-md w-full bg-bg-surface border border-red-500/20 p-8 rounded-3xl shadow-lg space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-xl font-bold text-brand-secondary">
              ¡Ups! Algo no salió como esperábamos
            </h1>
            <p className="text-xs text-text-muted">
              {this.state.error?.message || 'Ocurrió un error inesperado en la aplicación.'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-primary-dark text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              <RotateCcw size={16} /> Volver al Inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
