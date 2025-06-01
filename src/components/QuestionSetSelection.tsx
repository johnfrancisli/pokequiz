import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const QuestionSetSelection: React.FC = () => {
  const { loadQuestionSet } = useGame();
  const { t } = useLanguage();
  const [questionSetId, setQuestionSetId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await loadQuestionSet(questionSetId);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('questionSet.error'));
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t('questionSet.title')}</h2>
      <p className="text-gray-600">{t('questionSet.description')}</p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={questionSetId}
            onChange={(e) => setQuestionSetId(e.target.value)}
            placeholder={t('questionSet.placeholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!questionSetId.trim()}
        >
          {t('questionSet.start')}
        </button>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>
      
      <LanguageSelector />
    </div>
  );
};

export default QuestionSetSelection;