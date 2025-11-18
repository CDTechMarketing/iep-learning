import { TwoDigitMathProblem, TwoDigitMathAttempt, RegroupingError } from '../types';

/**
 * Error Pattern Analyzer
 * Detects specific types of mathematical errors to provide targeted feedback
 */

/**
 * Analyze a student's answer for common error patterns
 */
export function analyzeRegroupingErrors(
  problem: TwoDigitMathProblem,
  studentAnswer: number
): RegroupingError[] {
  const errors: RegroupingError[] = [];

  // Only analyze incorrect answers
  if (studentAnswer === problem.answer) {
    return errors;
  }

  const { operand1, operand2, operation } = problem;

  // Extract place values
  const ones1 = operand1 % 10;
  const ones2 = operand2 % 10;
  const tens1 = Math.floor(operand1 / 10);
  const tens2 = Math.floor(operand2 / 10);

  const studentOnes = Math.abs(studentAnswer) % 10;
  const studentTens = Math.floor(Math.abs(studentAnswer) / 10);

  if (operation === 'addition') {
    const onesSum = ones1 + ones2;

    // Error 1: Forgot to carry when ones sum >= 10
    if (onesSum >= 10) {
      const expectedTens = tens1 + tens2 + 1; // +1 for carry
      const expectedOnes = onesSum % 10;

      // Check if they wrote the full ones sum without regrouping
      if (studentOnes === onesSum && studentTens === tens1 + tens2) {
        errors.push({
          type: 'forgot-to-regroup',
          location: 'ones-place',
          studentWork: `Student wrote ${onesSum} in ones place instead of carrying`
        });
      }

      // Check if they carried wrong amount
      else if (studentOnes === expectedOnes && studentTens !== expectedTens) {
        errors.push({
          type: 'incorrect-carrying',
          location: 'tens-place',
          studentWork: `Student got ones correct but didn't carry properly`
        });
      }

      // Check if they forgot to carry but got ones right
      else if (studentOnes === expectedOnes && studentTens === tens1 + tens2) {
        errors.push({
          type: 'forgot-to-regroup',
          location: 'tens-place',
          studentWork: `Student regrouped ones correctly but forgot to add carried 1`
        });
      }
    }

    // Error 2: Place value confusion
    if (studentAnswer === ones1 + ones2 || studentAnswer === tens1 + tens2) {
      errors.push({
        type: 'place-value-error',
        location: 'ones-place',
        studentWork: `Student only added one place value`
      });
    }

  } else if (operation === 'subtraction') {
    // Error 1: Subtracted smaller from larger (common mistake)
    if (ones1 < ones2) {
      const wrongOnes = ones2 - ones1; // They subtracted backwards

      if (studentOnes === wrongOnes) {
        errors.push({
          type: 'subtracted-smaller-from-larger',
          location: 'ones-place',
          studentWork: `Student subtracted ${ones1} from ${ones2} instead of borrowing`
        });
      }
    }

    // Error 2: Forgot to borrow
    if (ones1 < ones2) {
      const expectedOnes = (ones1 + 10) - ones2;
      const expectedTens = (tens1 - 1) - tens2;

      // They got wrong ones but didn't account for borrowing in tens
      if (studentTens === tens1 - tens2) {
        errors.push({
          type: 'incorrect-borrowing',
          location: 'tens-place',
          studentWork: `Student didn't reduce tens after borrowing`
        });
      }
    }

    // Error 3: Borrowed but didn't add 10 to ones
    if (ones1 < ones2) {
      const expectedTens = (tens1 - 1) - tens2;

      // If they got tens right (showing they borrowed) but ones wrong
      if (studentTens === expectedTens && studentOnes !== (ones1 + 10) - ones2) {
        errors.push({
          type: 'incorrect-borrowing',
          location: 'ones-place',
          studentWork: `Student borrowed from tens but didn't add 10 to ones`
        });
      }
    }

    // Error 4: Place value confusion
    if (studentAnswer === Math.abs(ones1 - ones2) || studentAnswer === Math.abs(tens1 - tens2)) {
      errors.push({
        type: 'place-value-error',
        location: 'ones-place',
        studentWork: `Student only subtracted one place value`
      });
    }
  }

  return errors;
}

/**
 * Get human-readable explanation for an error type
 */
export function getErrorExplanation(error: RegroupingError): string {
  const explanations: Record<string, string> = {
    'forgot-to-regroup':
      'You forgot to regroup (carry or borrow). When the ones place sum is 10 or more, ' +
      'or when you can\'t subtract the ones, you need to regroup!',

    'incorrect-carrying':
      'You tried to carry, but the amount wasn\'t quite right. Remember: when ones add up to ' +
      '10 or more, carry 1 ten to the tens place.',

    'incorrect-borrowing':
      'You tried to borrow, but didn\'t complete the process. Remember: borrow 1 ten (making it 10 ones) ' +
      'and reduce the tens place by 1.',

    'subtracted-smaller-from-larger':
      'You subtracted the smaller number from the larger one in the ones place. ' +
      'Remember: always subtract bottom from top. If you can\'t, you need to borrow!',

    'place-value-error':
      'It looks like you only worked with one place value. Remember to add/subtract BOTH the tens ' +
      'AND the ones, then combine them for your final answer.'
  };

  return explanations[error.type] || 'Keep trying! Check your work step by step.';
}

/**
 * Get specific hint based on error type
 */
export function getErrorHint(error: RegroupingError, problem: TwoDigitMathProblem): string {
  const ones1 = problem.operand1 % 10;
  const ones2 = problem.operand2 % 10;
  const tens1 = Math.floor(problem.operand1 / 10);
  const tens2 = Math.floor(problem.operand2 / 10);

  switch (error.type) {
    case 'forgot-to-regroup':
      if (problem.operation === 'addition') {
        return `${ones1} + ${ones2} = ${ones1 + ones2}. Since ${ones1 + ones2} is more than 9, ` +
               `write ${(ones1 + ones2) % 10} in the ones place and carry 1 to the tens place!`;
      } else {
        return `You can't subtract ${ones2} from ${ones1}. Borrow 1 ten to make it ${ones1 + 10} - ${ones2}!`;
      }

    case 'incorrect-carrying':
      return `After adding ${ones1} + ${ones2} = ${ones1 + ones2}, you should carry ${Math.floor((ones1 + ones2) / 10)} ` +
             `to the tens place. Don't forget to add it!`;

    case 'incorrect-borrowing':
      return `When you borrow 1 ten, the tens place changes from ${tens1} to ${tens1 - 1}, ` +
             `and the ones place becomes ${ones1 + 10}. Now you can subtract!`;

    case 'subtracted-smaller-from-larger':
      return `Always subtract top number minus bottom number: ${ones1} - ${ones2}. ` +
             `Since ${ones1} < ${ones2}, you need to borrow first!`;

    case 'place-value-error':
      return `Remember to work with BOTH place values:\n` +
             `Tens: ${tens1} ${problem.operation === 'addition' ? '+' : '-'} ${tens2}\n` +
             `Ones: ${ones1} ${problem.operation === 'addition' ? '+' : '-'} ${ones2}\n` +
             `Then combine your answers!`;

    default:
      return 'Check each step carefully. Try using base-ten blocks to visualize the problem!';
  }
}

/**
 * Determine if student needs intervention based on error patterns
 */
export function needsIntervention(errors: RegroupingError[], recentAttempts: TwoDigitMathAttempt[]): boolean {
  // If same error type appears 3+ times in recent attempts
  const errorTypes = errors.map(e => e.type);
  const recentErrors = recentAttempts
    .filter(a => !a.isCorrect && a.regroupingErrors)
    .flatMap(a => a.regroupingErrors?.map(e => e.type) || []);

  for (const errorType of errorTypes) {
    const count = recentErrors.filter(e => e === errorType).length;
    if (count >= 3) {
      return true; // Same mistake 3+ times = needs intervention
    }
  }

  // If accuracy below 50% in last 10 attempts
  if (recentAttempts.length >= 10) {
    const last10 = recentAttempts.slice(-10);
    const correct = last10.filter(a => a.isCorrect).length;
    if (correct < 5) {
      return true;
    }
  }

  return false;
}

/**
 * Get recommended intervention strategy
 */
export function getRecommendedIntervention(errors: RegroupingError[]): string {
  const errorCounts: Record<string, number> = {};

  errors.forEach(error => {
    errorCounts[error.type] = (errorCounts[error.type] || 0) + 1;
  });

  // Find most common error
  const mostCommonError = Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const interventions: Record<string, string> = {
    'forgot-to-regroup': 'Practice with the Regrouping Helper tool and base-ten blocks.',
    'incorrect-carrying': 'Watch the carrying tutorial video and practice 10 problems with step-by-step guidance.',
    'incorrect-borrowing': 'Watch the borrowing tutorial video and practice with visual unbundling.',
    'subtracted-smaller-from-larger': 'Practice comparing numbers and using base-ten blocks for subtraction.',
    'place-value-error': 'Review place value concepts and practice with base-ten blocks.'
  };

  return interventions[mostCommonError] || 'Practice with step-by-step guidance and visual supports.';
}
