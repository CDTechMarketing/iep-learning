import { TwoDigitMathProblem } from '../types';

/**
 * Math Problem Generator for Two-Digit Addition and Subtraction
 * Generates problems across 5 difficulty levels with controlled regrouping
 */

// Helper function to generate random number within range
function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to create problem object
function createProblem(
  operand1: number,
  operand2: number,
  operation: 'addition' | 'subtraction',
  difficulty: 1 | 2 | 3 | 4 | 5,
  contextType: 'abstract' | 'money' | 'measurement' | 'story-problem' = 'abstract',
  storyProblem?: string
): TwoDigitMathProblem {
  const answer = operation === 'addition' ? operand1 + operand2 : operand1 - operand2;

  // Determine if regrouping is required
  const ones1 = operand1 % 10;
  const ones2 = operand2 % 10;
  const tens1 = Math.floor(operand1 / 10);
  const tens2 = Math.floor(operand2 / 10);

  let requiresRegrouping = false;
  let regroupingType: 'ones-to-tens' | 'tens-to-ones' | 'both' | undefined;

  if (operation === 'addition') {
    if (ones1 + ones2 >= 10) {
      requiresRegrouping = true;
      regroupingType = 'ones-to-tens';
    }
  } else if (operation === 'subtraction') {
    if (ones1 < ones2) {
      requiresRegrouping = true;
      regroupingType = 'tens-to-ones';
    }
  }

  // Determine scaffolding level based on difficulty
  const scaffoldingLevel: 1 | 2 | 3 = difficulty <= 2 ? 1 : difficulty <= 4 ? 2 : 3;

  return {
    id: `${operation}-${difficulty}-${Date.now()}-${random(1000, 9999)}`,
    operation,
    operand1,
    operand2,
    answer,
    requiresRegrouping,
    regroupingType,
    difficulty,
    contextType,
    storyProblem,
    visualSupport: difficulty <= 2 ? 'base-ten-blocks' : undefined,
    scaffoldingLevel
  };
}

/**
 * Level 1: Addition without regrouping (23 + 45 = 68)
 * Ensures ones place sum is less than 10
 */
export function generateLevel1Addition(): TwoDigitMathProblem {
  const ones1 = random(1, 4);
  const ones2 = random(1, 5 - ones1); // Ensure no regrouping
  const tens1 = random(1, 5);
  const tens2 = random(1, 5);

  const operand1 = tens1 * 10 + ones1;
  const operand2 = tens2 * 10 + ones2;

  return createProblem(operand1, operand2, 'addition', 1);
}

/**
 * Level 2: Addition with regrouping (28 + 47 = 75)
 * Forces ones place sum to be >= 10
 */
export function generateLevel2Addition(): TwoDigitMathProblem {
  const ones1 = random(5, 9);
  const ones2 = random(Math.max(1, 10 - ones1 + 1), 9); // Force regrouping
  const tens1 = random(1, 7);
  const tens2 = random(1, 9 - tens1); // Ensure answer < 100

  const operand1 = tens1 * 10 + ones1;
  const operand2 = tens2 * 10 + ones2;

  return createProblem(operand1, operand2, 'addition', 2);
}

/**
 * Level 3: Subtraction without regrouping (58 - 23 = 35)
 * Ensures top ones digit >= bottom ones digit
 */
export function generateLevel3Subtraction(): TwoDigitMathProblem {
  const ones2 = random(1, 8);
  const ones1 = random(ones2, 9); // Ensure no regrouping needed
  const tens2 = random(1, 7);
  const tens1 = random(tens2 + 1, 9); // Ensure positive answer

  const operand1 = tens1 * 10 + ones1;
  const operand2 = tens2 * 10 + ones2;

  return createProblem(operand1, operand2, 'subtraction', 3);
}

/**
 * Level 4: Subtraction with regrouping (52 - 27 = 25)
 * Forces ones place to require borrowing
 */
export function generateLevel4Subtraction(): TwoDigitMathProblem {
  const ones1 = random(0, 4);
  const ones2 = random(ones1 + 1, 9); // Force regrouping
  const tens1 = random(3, 9);
  const tens2 = random(1, tens1 - 1); // Ensure positive answer and borrowing is possible

  const operand1 = tens1 * 10 + ones1;
  const operand2 = tens2 * 10 + ones2;

  return createProblem(operand1, operand2, 'subtraction', 4);
}

/**
 * Level 5: Mixed multi-step word problems
 * Provides real-world context for two-digit operations
 */
export function generateLevel5StoryProblem(): TwoDigitMathProblem {
  const templates = [
    {
      operation: 'addition' as const,
      contexts: [
        { template: 'Sarah had {num1} stickers. She bought {num2} more. How many does she have now?', type: 'abstract' as const },
        { template: 'Jake scored {num1} points in the first game and {num2} in the second game. What was his total?', type: 'abstract' as const },
        { template: 'Mom had ${num1} and earned ${num2} more. How much money does she have?', type: 'money' as const },
        { template: 'The plant was {num1} cm tall. It grew {num2} cm more. How tall is it now?', type: 'measurement' as const }
      ]
    },
    {
      operation: 'subtraction' as const,
      contexts: [
        { template: 'There were {num1} birds in the tree. {num2} flew away. How many are left?', type: 'abstract' as const },
        { template: 'Maria had {num1} candies and gave {num2} to her friend. How many does she have left?', type: 'abstract' as const },
        { template: 'Dad had ${num1} and spent ${num2}. How much money is left?', type: 'money' as const },
        { template: 'A rope was {num1} cm long. We cut off {num2} cm. How long is the rope now?', type: 'measurement' as const }
      ]
    }
  ];

  // Randomly select operation and context
  const operationTemplate = templates[random(0, 1)];
  const context = operationTemplate.contexts[random(0, operationTemplate.contexts.length - 1)];
  const operation = operationTemplate.operation;

  // Generate appropriate numbers based on operation
  let operand1: number, operand2: number;

  if (operation === 'addition') {
    // Can use regrouping or not
    const useRegrouping = random(0, 1) === 1;
    if (useRegrouping) {
      const ones1 = random(5, 9);
      const ones2 = random(Math.max(1, 10 - ones1 + 1), 9);
      const tens1 = random(1, 6);
      const tens2 = random(1, 8 - tens1);
      operand1 = tens1 * 10 + ones1;
      operand2 = tens2 * 10 + ones2;
    } else {
      const ones1 = random(1, 4);
      const ones2 = random(1, 5 - ones1);
      const tens1 = random(1, 6);
      const tens2 = random(1, 6);
      operand1 = tens1 * 10 + ones1;
      operand2 = tens2 * 10 + ones2;
    }
  } else {
    // Subtraction - can use regrouping or not
    const useRegrouping = random(0, 1) === 1;
    if (useRegrouping) {
      const ones1 = random(0, 4);
      const ones2 = random(ones1 + 1, 9);
      const tens1 = random(4, 9);
      const tens2 = random(1, tens1 - 1);
      operand1 = tens1 * 10 + ones1;
      operand2 = tens2 * 10 + ones2;
    } else {
      const ones2 = random(1, 8);
      const ones1 = random(ones2, 9);
      const tens2 = random(1, 7);
      const tens1 = random(tens2 + 1, 9);
      operand1 = tens1 * 10 + ones1;
      operand2 = tens2 * 10 + ones2;
    }
  }

  // Format the story problem with actual numbers
  const storyText = context.template
    .replace('{num1}', operand1.toString())
    .replace('{num2}', operand2.toString());

  return createProblem(operand1, operand2, operation, 5, context.type, storyText);
}

/**
 * Generate a problem at a specific difficulty level
 */
export function generateProblemByLevel(level: 1 | 2 | 3 | 4 | 5): TwoDigitMathProblem {
  switch (level) {
    case 1:
      return generateLevel1Addition();
    case 2:
      return generateLevel2Addition();
    case 3:
      return generateLevel3Subtraction();
    case 4:
      return generateLevel4Subtraction();
    case 5:
      return generateLevel5StoryProblem();
  }
}

/**
 * Generate multiple problems at a specific level
 */
export function generateProblems(level: 1 | 2 | 3 | 4 | 5, count: number): TwoDigitMathProblem[] {
  const problems: TwoDigitMathProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(generateProblemByLevel(level));
  }
  return problems;
}

/**
 * Generate starter problem set (20 problems per level = 100 total)
 */
export function generateStarterProblems(): TwoDigitMathProblem[] {
  const allProblems: TwoDigitMathProblem[] = [];

  for (let level = 1; level <= 5; level++) {
    const levelProblems = generateProblems(level as 1 | 2 | 3 | 4 | 5, 20);
    allProblems.push(...levelProblems);
  }

  return allProblems;
}
