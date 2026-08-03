"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="max-w-md py-10 text-center">
            <h1 className="font-display text-2xl text-ink">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink-soft">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
            >
              Reload page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
