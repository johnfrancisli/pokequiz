import { Question, QuestionSet } from '../types/game';

export async function loadQuestionSetData(id: string): Promise<QuestionSet> {
  try {
    const modules = import.meta.glob('./questionSets/*.json', { eager: true });
    const matchingFile = Object.entries(modules).find(([path]) => path.includes(`${id}.json`));
    
    if (!matchingFile) {
      throw new Error(`Question set "${id}" not found`);
    }
    
    return matchingFile[1].default as QuestionSet;
  } catch (error) {
    throw new Error(`Failed to load question set: ${error.message}`);
  }
}

// Fisher–Yates アルゴリズムで配列をシャッフルするヘルパー関数
export function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice(); // 元データを壊さないようにコピー
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getQuestionWithShuffledOptions(question: Question): Question {
  if (!question) return question;
  
  // options 全体をシャッフル
  const shuffledOptions = shuffleArray(question.options);

  // シャッフル後の配列内で、もともとの正解がどこに移ったか探す
  const correctReading = question.options[question.correctAnswer];
  const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctReading);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex
  };
}