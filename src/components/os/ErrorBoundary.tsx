import React, { Component, type ReactNode } from 'react';
import { BSOD } from './BSOD';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | undefined;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: undefined
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return <BSOD error={this.state.error} />;
        }

        return this.props.children;
    }
}
