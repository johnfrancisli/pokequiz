import React, { useState, useEffect } from 'react';
import { Question } from '../types/game';

interface QuestionBoxProps {
  question: Question | null;
  onAnswer: (optionIndex: number) => void;
  isAnswerSubmitted: boolean;
  playerSelectedOptionIndex: number | null;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ 
  question, 
  onAnswer, 
  isAnswerSubmitted,
  playerSelectedOptionIndex 
}) => {
  
  if (!question) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">問題を読み込んでいます...</p>
      </div>
    );
  }

  const handleOptionClick = (index: number) => {
    if (isAnswerSubmitted) return;
    onAnswer(index);
  };

  const getOptionClassName = (optionIndex: number) => {
    const baseClasses = "p-3 rounded-lg text-left transition-all duration-200 ";
    
    if (isAnswerSubmitted) {
      // Correct answer is always highlighted in green
      if (optionIndex === question.correctAnswer) {
        return baseClasses + "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500 text-green-800";
      }
      // Wrong selected answer is highlighted in red
      if (optionIndex === playerSelectedOptionIndex && optionIndex !== question.correctAnswer) {
        return baseClasses + "bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-500 text-red-800";
      }
      // Other options are greyed out
      return baseClasses + "bg-gray-50 border-2 border-gray-200 text-gray-500 opacity-70";
    }
    
    // Default state (not answered yet)
    return baseClasses + "bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-800 border-2 border-transparent";
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{question.text}</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={isAnswerSubmitted}
            className={getOptionClassName(index)}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;