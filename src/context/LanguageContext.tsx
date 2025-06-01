import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'questionSet.title': 'Select Question Set',
    'questionSet.description': 'Enter a question set ID',
    'questionSet.placeholder': 'Question set ID (e.g. default)',
    'questionSet.start': 'Start',
    'questionSet.error': 'Failed to load question set',
    'level.title': 'Select Difficulty Level',
    'level.description': 'Choose your challenge level',
    'level.1': 'Beginner: Attack every 10 seconds',
    'level.2': 'Beginner+: Attack every 8.5 seconds',
    'level.3': 'Intermediate: Attack every 7 seconds',
    'level.4': 'Intermediate+: Attack every 5.5 seconds',
    'level.5': 'Advanced: Attack every 4 seconds',
    'level.6': 'Advanced+: Attack every 3.5 seconds',
    'level.7': 'Expert: Attack every 3 seconds',
    'level.8': 'Expert+: Attack every 2.5 seconds',
    'level.9': 'Master: Attack every 2 seconds',
    'level.10': 'Champion: Attack every 1.5 seconds',
    'starter.title': 'Choose Your Starter',
    'battle.victory': 'Victory!',
    'battle.defeat': 'Defeat!',
    'battle.playAgain': 'Play Again',
    'battle.sameQuestions': 'Play Again with Same Questions',
    'battle.newQuestions': 'Choose New Question Set',
    'battle.history': 'Battle History',
    'battle.timeRemaining': 'Time Remaining',
    'battle.timeout': 'Time Out',
    'battle.correct': 'Correct',
    'battle.incorrect': 'Incorrect',
    'battle.correctMark': '✓ Correct',
    'battle.answerTime': 'Answer Time: {time}s',
    'battle.loading': 'Loading question...',
    'attack.weak': 'Weak',
    'attack.ok': 'Normal',
    'attack.good': 'Good',
    'attack.effective': 'Effective',
    'attack.critical': 'Critical',
    'language.en': 'English',
    'language.ja': '日本語'
  },
  ja: {
    'questionSet.title': '問題セットを選択',
    'questionSet.description': '問題セットIDを入力してください',
    'questionSet.placeholder': '問題セットID (例: default)',
    'questionSet.start': '開始',
    'questionSet.error': '問題セットの読み込みに失敗しました',
    'level.title': '難易度を選んでください',
    'level.description': '挑戦レベルを選択してください',
    'level.1': '初級: 10秒ごとに攻撃',
    'level.2': '初級+: 8.5秒ごとに攻撃',
    'level.3': '中級: 7秒ごとに攻撃',
    'level.4': '中級+: 5.5秒ごとに攻撃',
    'level.5': '上級: 4秒ごとに攻撃',
    'level.6': '上級+: 3.5秒ごとに攻撃',
    'level.7': 'エキスパート: 3秒ごとに攻撃',
    'level.8': 'エキスパート+: 2.5秒ごとに攻撃',
    'level.9': 'マスター: 2秒ごとに攻撃',
    'level.10': 'チャンピオン: 1.5秒ごとに攻撃',
    'starter.title': '最初のポケモンを選んでください',
    'battle.victory': '勝利！',
    'battle.defeat': '敗北！',
    'battle.playAgain': 'もう一度プレイ',
    'battle.sameQuestions': '同じ問題セットでもう一度',
    'battle.newQuestions': '新しい問題セットを選ぶ',
    'battle.history': '問題の履歴',
    'battle.timeRemaining': '残り時間',
    'battle.timeout': '時間切れ',
    'battle.correct': '正解',
    'battle.incorrect': '不正解',
    'battle.correctMark': '✓ 正解',
    'battle.answerTime': '回答時間: {time}秒',
    'battle.loading': '問題を読み込んでいます...',
    'attack.weak': '弱い',
    'attack.ok': '普通',
    'attack.good': '良い',
    'attack.effective': '効果的',
    'attack.critical': 'クリティカル',
    'language.en': 'English',
    'language.ja': '日本語'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations.en];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};