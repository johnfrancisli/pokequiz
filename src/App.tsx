import React from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';
import { LanguageProvider } from './context/LanguageContext';
import { useSearchParams } from 'react-router-dom';

function App() {
  const [searchParams] = useSearchParams();
  const questionSetId = searchParams.get('q');

  return (
    <div className="min-h-screen bg-gray-100">
      <LanguageProvider>
        <GameProvider initialQuestionSetId={questionSetId}>
          <Game />
        </GameProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;