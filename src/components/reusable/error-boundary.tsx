"use client";

import type { ReactNode } from "react";
import React, { Component } from "react";
import { log } from "@/src/utils/logger/logger";

type ErrorBoundaryProps = {
  name: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      log.info("An error happed in the error boundary " + this.props.name);
      log.error(error);
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="m-2 size-full rounded-md border border-destructive bg-destructive/50">
            <div className="p-4">
              <h2 className="font-semibold text-contrast">
                {this.props.name
                  ? `Error in ${this.props.name}: ${this.state.error?.message}`
                  : `An error occurred: ${this.state.error?.message}`}
              </h2>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

//Example of usage:
// <ErrorBoundary name="MyComponent">
//   <MyComponent />
// </ErrorBoundary>
//
// <ErrorBoundary name="MyComponent" fallback={<MyFallbackComponent />}>
//   <MyComponent />
// </ErrorBoundary>
