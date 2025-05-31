import React, { useState } from 'react';
import { Question } from '../types/game';

interface QuestionBoxProps {
  question: Question | null;
  onAnswer: (optionIndex: number) => void;
  disabled: boolean;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ question, onAnswer, disabled }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  if (!question) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">Loading question...</p>
      </div>
    );
  }

  const handleOptionClick = (index: number) => {
    if (disabled) return;
    
    setSelectedOption(index);
    onAnswer(index);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{question.text}</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={disabled}
            className={`p-3 rounded-lg text-left transition-all duration-200 
              ${selectedOption === index
                ? selectedOption === question.correctAnswer 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500 text-green-800' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-500 text-red-800'
                : 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-800'
              } 
              ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;