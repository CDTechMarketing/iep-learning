import { TwoDigitMathProblem } from '../types';

/**
 * Word Problem Helper
 * Teaches systematic problem-solving process for story problems
 * Uses the READ-KNOW-NEED-PLAN-SOLVE-CHECK framework
 */

export interface ProblemSolvingStep {
  stepNumber: number;
  stepName: string;
  question: string;
  hint: string;
  example?: string;
}

/**
 * Get the 6-step problem-solving framework
 */
export function getProblemSolvingSteps(problem: TwoDigitMathProblem): ProblemSolvingStep[] {
  if (!problem.storyProblem) {
    return [];
  }

  return [
    {
      stepNumber: 1,
      stepName: 'READ',
      question: 'Read the problem carefully. What is happening in this story?',
      hint: 'Read it twice! First time to understand the story, second time to find the math.',
      example: 'This problem is about someone getting or losing something.'
    },
    {
      stepNumber: 2,
      stepName: 'KNOW',
      question: 'What do I KNOW? What numbers are given in the problem?',
      hint: 'Underline or highlight the important numbers in the story.',
      example: `I know: ${problem.operand1} and ${problem.operand2}`
    },
    {
      stepNumber: 3,
      stepName: 'NEED',
      question: 'What do I NEED to find? What is the question asking?',
      hint: 'Circle or highlight the question. Look for question words like "how many" or "how much".',
      example: 'I need to find the total / the difference / how many are left'
    },
    {
      stepNumber: 4,
      stepName: 'PLAN',
      question: 'Should I add or subtract? Why?',
      hint: 'Add when combining, getting more, or finding a total. Subtract when taking away, comparing, or finding what\'s left.',
      example: problem.operation === 'addition'
        ? 'I will ADD because we are combining or finding a total.'
        : 'I will SUBTRACT because something is being taken away or we\'re finding what\'s left.'
    },
    {
      stepNumber: 5,
      stepName: 'SOLVE',
      question: 'Now solve the math problem!',
      hint: 'Use the strategy that works best for you: vertical algorithm, mental math, number line, or blocks.',
      example: `${problem.operand1} ${problem.operation === 'addition' ? '+' : '−'} ${problem.operand2} = ?`
    },
    {
      stepNumber: 6,
      stepName: 'CHECK',
      question: 'Does my answer make sense?',
      hint: 'Ask yourself: Is the answer reasonable? Did I answer the question that was asked?',
      example: `Does ${problem.answer} make sense in this story?`
    }
  ];
}

/**
 * Get sentence frames to help students explain their thinking
 */
export function getSentenceFrames(): {
  know: string[];
  need: string[];
  plan: string[];
  answer: string[];
} {
  return {
    know: [
      'I know that _____',
      'The problem tells me that _____',
      'The important numbers are _____'
    ],
    need: [
      'I need to find _____',
      'The question is asking me to _____',
      'I am looking for _____'
    ],
    plan: [
      'I will _____ (add/subtract) because _____',
      'My strategy is to _____',
      'I chose to _____ because _____'
    ],
    answer: [
      'My answer is _____',
      'The answer to the question is _____',
      'There are _____ in total / left'
    ]
  };
}

/**
 * Analyze word problem keywords to help identify operation
 */
export function identifyKeywords(problemText: string): {
  additionKeywords: string[];
  subtractionKeywords: string[];
  suggestedOperation: 'addition' | 'subtraction' | 'unclear';
} {
  const additionWords = [
    'total', 'altogether', 'in all', 'combined', 'sum',
    'more', 'plus', 'add', 'both', 'together', 'gained',
    'earned', 'bought', 'received', 'got'
  ];

  const subtractionWords = [
    'left', 'remaining', 'difference', 'how many more',
    'fewer', 'less', 'minus', 'subtract', 'take away',
    'gave away', 'lost', 'spent', 'sold', 'flew away',
    'ate', 'used'
  ];

  const textLower = problemText.toLowerCase();

  const foundAddition = additionWords.filter(word => textLower.includes(word));
  const foundSubtraction = subtractionWords.filter(word => textLower.includes(word));

  let suggestedOperation: 'addition' | 'subtraction' | 'unclear' = 'unclear';

  if (foundAddition.length > foundSubtraction.length) {
    suggestedOperation = 'addition';
  } else if (foundSubtraction.length > foundAddition.length) {
    suggestedOperation = 'subtraction';
  }

  return {
    additionKeywords: foundAddition,
    subtractionKeywords: foundSubtraction,
    suggestedOperation
  };
}

/**
 * Get visual representation suggestion based on context type
 */
export function getVisualSuggestion(contextType: string): string {
  const suggestions: Record<string, string> = {
    'money': 'Draw coins or dollar bills to represent the amounts.',
    'measurement': 'Draw a ruler or measuring cup to show the lengths or amounts.',
    'story-problem': 'Draw a picture of the objects or people in the story.',
    'abstract': 'Use base-ten blocks or draw a number line.'
  };

  return suggestions[contextType] || 'Draw a picture to help you visualize the problem.';
}

/**
 * Generate comprehension questions about the word problem
 */
export function generateComprehensionQuestions(problem: TwoDigitMathProblem): {
  question: string;
  answer: string;
}[] {
  if (!problem.storyProblem) {
    return [];
  }

  return [
    {
      question: 'What is this problem about?',
      answer: 'This will vary based on the problem - look for the main topic/subject'
    },
    {
      question: 'What numbers are important in this problem?',
      answer: `${problem.operand1} and ${problem.operand2}`
    },
    {
      question: 'What is the problem asking you to find?',
      answer: 'The total / the difference / how many are left (depends on problem)'
    },
    {
      question: 'Should you add or subtract to solve this?',
      answer: problem.operation === 'addition' ? 'Add' : 'Subtract'
    },
    {
      question: 'What is your answer?',
      answer: problem.answer.toString()
    }
  ];
}

/**
 * Provide feedback on student's problem-solving approach
 */
export function provideFeedback(
  step: number,
  studentResponse: string,
  problem: TwoDigitMathProblem
): { isCorrect: boolean; feedback: string; hint?: string } {
  const steps = getProblemSolvingSteps(problem);
  const currentStep = steps[step - 1];

  if (!currentStep) {
    return {
      isCorrect: false,
      feedback: 'Invalid step number',
      hint: 'Please select a valid step (1-6)'
    };
  }

  // Step 4 (PLAN) - check if they identified correct operation
  if (step === 4) {
    const response = studentResponse.toLowerCase();
    const correctOperation = problem.operation === 'addition' ? 'add' : 'subtract';
    const isCorrect = response.includes(correctOperation);

    return {
      isCorrect,
      feedback: isCorrect
        ? 'Great job! You identified the correct operation!'
        : `Not quite. Think about whether we're combining things or taking them away.`,
      hint: isCorrect ? undefined : currentStep.hint
    };
  }

  // Step 5 (SOLVE) - check if answer is correct
  if (step === 5) {
    const studentAnswer = parseInt(studentResponse);
    const isCorrect = studentAnswer === problem.answer;

    return {
      isCorrect,
      feedback: isCorrect
        ? 'Excellent! Your math is correct!'
        : `Not quite. Double-check your calculation: ${problem.operand1} ${problem.operation === 'addition' ? '+' : '−'} ${problem.operand2}`,
      hint: isCorrect ? undefined : 'Try using base-ten blocks or the vertical method.'
    };
  }

  // For other steps, provide general encouragement
  return {
    isCorrect: true,
    feedback: 'Good thinking! Keep going!',
    hint: currentStep.hint
  };
}
