import { useState } from 'react';
import { Desktop } from './components/os/Desktop';
import { BootSequence } from './components/os/BootSequence';
import { ErrorBoundary } from './components/os/ErrorBoundary';
import { LockScreen } from './components/os/LockScreen';

type Phase = 'boot' | 'lock' | 'desktop';

export default function App() {
  const [phase, setPhase] = useState<Phase>('boot');

  return (
    <ErrorBoundary>
      {phase === 'boot' && (
        <BootSequence onComplete={() => setPhase('lock')} />
      )}
      {phase === 'lock' && (
        <LockScreen onUnlock={() => setPhase('desktop')} />
      )}
      {phase === 'desktop' && <Desktop />}
    </ErrorBoundary>
  );
}
