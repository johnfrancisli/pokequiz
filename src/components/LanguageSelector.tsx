import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe2 } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Globe2 size={20} className="text-gray-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'ja')}
        className="bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="en">{t('language.en')}</option>
        <option value="ja">{t('language.ja')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector