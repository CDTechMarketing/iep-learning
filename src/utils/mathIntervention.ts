import { RegroupingError } from '../types';

/**
 * Targeted Intervention System
 * Provides specific learning activities based on detected error patterns
 */

export interface InterventionPlan {
  errorType: string;
  message: string;
  activities: InterventionActivity[];
  scaffoldingLevel: 1 | 2 | 3; // 1=most support, 3=least support
  estimatedTime: string;
}

export interface InterventionActivity {
  type: 'video' | 'practice' | 'visual' | 'guided';
  description: string;
  problemCount?: number;
  supportLevel: 'high' | 'medium' | 'low';
}

/**
 * Get intervention plan for a specific error type
 */
export function provideIntervention(errorType: string): InterventionPlan {
  const interventions: Record<string, InterventionPlan> = {
    'forgot-to-regroup': {
      errorType: 'forgot-to-regroup',
      message: 'I notice you\'re forgetting to carry or borrow. Let\'s practice that together!',
      activities: [
        {
          type: 'video',
          description: 'Watch: Carrying and Borrowing Explained (2 minutes)',
          supportLevel: 'high'
        },
        {
          type: 'visual',
          description: 'Practice: 5 problems with base-ten blocks',
          problemCount: 5,
          supportLevel: 'high'
        },
        {
          type: 'guided',
          description: 'Practice: 5 problems with step-by-step regrouping helper',
          problemCount: 5,
          supportLevel: 'medium'
        },
        {
          type: 'practice',
          description: 'Independent: 5 problems with hints available',
          problemCount: 5,
          supportLevel: 'low'
        }
      ],
      scaffoldingLevel: 1,
      estimatedTime: '15-20 minutes'
    },

    'subtracted-smaller-from-larger': {
      errorType: 'subtracted-smaller-from-larger',
      message: 'Remember: When the top number is smaller, we need to borrow!',
      activities: [
        {
          type: 'video',
          description: 'Watch: Borrowing in Subtraction Tutorial (2 minutes)',
          supportLevel: 'high'
        },
        {
          type: 'visual',
          description: 'Practice: 5 problems with visual unbundling using base-ten blocks',
          problemCount: 5,
          supportLevel: 'high'
        },
        {
          type: 'guided',
          description: 'Practice: 5 problems with step-by-step borrowing guide',
          problemCount: 5,
          supportLevel: 'medium'
        },
        {
          type: 'practice',
          description: 'Independent: 5 problems on your own',
          problemCount: 5,
          supportLevel: 'low'
        }
      ],
      scaffoldingLevel: 1,
      estimatedTime: '15-20 minutes'
    },

    'incorrect-carrying': {
      errorType: 'incorrect-carrying',
      message: 'You\'re trying to carry - great! Let\'s make sure we\'re doing it correctly.',
      activities: [
        {
          type: 'video',
          description: 'Watch: How to Carry Correctly (2 minutes)',
          supportLevel: 'high'
        },
        {
          type: 'visual',
          description: 'Practice: 3 problems watching blocks bundle into tens',
          problemCount: 3,
          supportLevel: 'high'
        },
        {
          type: 'guided',
          description: 'Practice: 5 problems with carrying reminders',
          problemCount: 5,
          supportLevel: 'medium'
        },
        {
          type: 'practice',
          description: 'Independent: 5 problems to check your understanding',
          problemCount: 5,
          supportLevel: 'low'
        }
      ],
      scaffoldingLevel: 2,
      estimatedTime: '12-15 minutes'
    },

    'incorrect-borrowing': {
      errorType: 'incorrect-borrowing',
      message: 'Borrowing is tricky! Let\'s practice breaking down tens into ones.',
      activities: [
        {
          type: 'video',
          description: 'Watch: Borrowing Step-by-Step (2 minutes)',
          supportLevel: 'high'
        },
        {
          type: 'visual',
          description: 'Practice: 5 problems watching tens unbundle into ones',
          problemCount: 5,
          supportLevel: 'high'
        },
        {
          type: 'guided',
          description: 'Practice: 5 problems with borrowing checklist',
          problemCount: 5,
          supportLevel: 'medium'
        },
        {
          type: 'practice',
          description: 'Independent: 5 problems to practice',
          problemCount: 5,
          supportLevel: 'low'
        }
      ],
      scaffoldingLevel: 2,
      estimatedTime: '15-20 minutes'
    },

    'place-value-error': {
      errorType: 'place-value-error',
      message: 'Let\'s review place value - understanding tens and ones is the key!',
      activities: [
        {
          type: 'video',
          description: 'Watch: Place Value Review (2 minutes)',
          supportLevel: 'high'
        },
        {
          type: 'visual',
          description: 'Practice: 5 problems identifying tens and ones with blocks',
          problemCount: 5,
          supportLevel: 'high'
        },
        {
          type: 'guided',
          description: 'Practice: 5 addition/subtraction problems with place value labels',
          problemCount: 5,
          supportLevel: 'medium'
        },
        {
          type: 'practice',
          description: 'Independent: 5 problems showing your work',
          problemCount: 5,
          supportLevel: 'low'
        }
      ],
      scaffoldingLevel: 1,
      estimatedTime: '15-20 minutes'
    }
  };

  return interventions[errorType] || {
    errorType: 'general',
    message: 'Let\'s practice together to build your skills!',
    activities: [
      {
        type: 'visual',
        description: 'Practice: 5 problems with base-ten blocks',
        problemCount: 5,
        supportLevel: 'high'
      },
      {
        type: 'guided',
        description: 'Practice: 5 problems with step-by-step help',
        problemCount: 5,
        supportLevel: 'medium'
      },
      {
        type: 'practice',
        description: 'Independent: 5 problems on your own',
        problemCount: 5,
        supportLevel: 'low'
      }
    ],
    scaffoldingLevel: 2,
    estimatedTime: '12-15 minutes'
  };
}

/**
 * Get encouraging message based on progress
 */
export function getEncouragementMessage(
  correctStreak: number,
  totalAttempts: number,
  accuracy: number
): string {
  // Celebrate streaks
  if (correctStreak >= 5) {
    return '🌟 Amazing! You got 5 in a row correct! You\'re becoming a math expert!';
  }
  if (correctStreak >= 3) {
    return '🎉 Great job! Three correct answers in a row!';
  }

  // Celebrate milestones
  if (totalAttempts === 10) {
    return '💪 You\'ve completed 10 problems! Keep up the great effort!';
  }
  if (totalAttempts === 25) {
    return '🎯 Wow! 25 problems completed! You\'re working so hard!';
  }
  if (totalAttempts === 50) {
    return '🏆 Incredible! You\'ve solved 50 two-digit math problems!';
  }

  // Celebrate accuracy
  if (accuracy >= 90) {
    return '⭐ Outstanding accuracy! You really understand this!';
  }
  if (accuracy >= 80) {
    return '👍 You\'re doing really well! Keep practicing!';
  }

  // Encouragement for struggles
  if (accuracy < 50 && totalAttempts >= 5) {
    return '💙 These problems are challenging, but you\'re not giving up! That\'s what makes you stronger!';
  }

  // General encouragement
  const messages = [
    '🌈 Every problem makes you smarter!',
    '✨ You\'re learning and growing!',
    '🚀 Keep going - you\'ve got this!',
    '💫 Practice makes progress!',
    '🌻 You\'re doing great!'
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Determine if student should take a break
 */
export function shouldTakeBreak(
  consecutiveErrors: number,
  timeSpentMinutes: number,
  totalProblems: number
): { shouldBreak: boolean; reason?: string } {
  // After 3 consecutive errors
  if (consecutiveErrors >= 3) {
    return {
      shouldBreak: true,
      reason: 'You\'ve had a few tricky ones in a row. Let\'s take a quick break and come back fresh!'
    };
  }

  // After 20+ minutes of continuous work
  if (timeSpentMinutes >= 20) {
    return {
      shouldBreak: true,
      reason: 'You\'ve been working hard for 20 minutes! Great focus! Let\'s take a break.'
    };
  }

  // After completing 15+ problems in one session
  if (totalProblems >= 15) {
    return {
      shouldBreak: true,
      reason: 'Wow! You completed 15 problems! That\'s a lot of math! Time for a break!'
    };
  }

  return { shouldBreak: false };
}

/**
 * Generate practice recommendations
 */
export function getPracticeRecommendations(errors: RegroupingError[]): string[] {
  const recommendations: string[] = [];
  const errorTypes = new Set(errors.map(e => e.type));

  if (errorTypes.has('forgot-to-regroup') || errorTypes.has('incorrect-carrying')) {
    recommendations.push('Practice with base-ten blocks to visualize carrying');
    recommendations.push('Use the Regrouping Helper for step-by-step guidance');
  }

  if (errorTypes.has('subtracted-smaller-from-larger') || errorTypes.has('incorrect-borrowing')) {
    recommendations.push('Watch the borrowing tutorial video');
    recommendations.push('Practice unbundling tens with visual blocks');
  }

  if (errorTypes.has('place-value-error')) {
    recommendations.push('Review tens and ones place value');
    recommendations.push('Practice identifying tens and ones in numbers');
  }

  if (recommendations.length === 0) {
    recommendations.push('Keep practicing to build fluency');
    recommendations.push('Try different solving strategies');
  }

  return recommendations;
}
