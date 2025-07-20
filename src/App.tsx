// src/App.tsx
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import NegotiationPage from './pages/NegotiationPage';

function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <LandingPage onRoomJoin={setSession} />;
  }

  return <NegotiationPage session={session} />;
}

export default App;