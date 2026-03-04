import React, { useState } from 'react';
import { Desktop } from './components/os/Desktop';
import { BootSequence } from './components/os/BootSequence';
import { ErrorBoundary } from './components/os/ErrorBoundary';

export default function App() {
  const [hasBooted, setHasBooted] = useState(false);

  return (
    <ErrorBoundary>
      {hasBooted ? (
        <Desktop />
      ) : (
        <BootSequence onComplete={() => setHasBooted(true)} />
      )}
    </ErrorBoundary>
  );
}
