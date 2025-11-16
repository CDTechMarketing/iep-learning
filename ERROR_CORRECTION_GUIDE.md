# Error Correction Guide (Model-Lead-Test)

## Overview

The IEP Learning App implements an evidence-based error correction system using the **Model-Lead-Test** approach from Applied Behavior Analysis (ABA). This method is specifically designed for students with autism and learning disabilities, providing structured teaching when mistakes occur.

## What is Model-Lead-Test?

Model-Lead-Test is a three-step teaching procedure that helps students learn from their mistakes:

### 1. **Model** (Show)
- The app **shows** the student the correct answer
- Displays for 3 seconds (configurable)
- Includes visual aids (number lines, ten frames, word pictures)
- Uses green highlighting and animation to draw attention
- Speaks the answer if audio is enabled

### 2. **Lead** (Guide)
- The app **guides** the student to the correct answer
- Shows an animated pointer/arrow pointing to the correct answer
- Displays for 3 seconds (configurable)
- Reinforces the correct response location
- Prompts student to notice where the answer is

### 3. **Test** (Try Again)
- The student **independently selects** the correct answer
- Same options as the original question
- If correct: Celebrates success with animation and stars
- If still incorrect: Repeats the cycle (up to 2 times by default)

## Evidence Base

### Research Support
- Developed from Applied Behavior Analysis (ABA) principles
- Widely used in special education for autism
- Recommended by Council for Exceptional Children (CEC)
- Effective for teaching academic skills to students with developmental disabilities

### Why It Works
- **Reduces frustration**: Student receives immediate teaching instead of just "try again"
- **Builds independence**: Progresses from full support (model) to independent response (test)
- **Prevents repeated errors**: Student doesn't practice the wrong answer
- **Increases confidence**: High success rate on retry after instruction
- **Provides data**: Tracks correction cycles needed for each problem

## Implementation in the App

### Math Practice Integration

When a student selects an incorrect answer:

```
Wrong Answer → Brief feedback (1.5s) → ERROR CORRECTION FLOW
                                          ↓
                                    [MODEL: 3s]
                                    Shows correct answer
                                          ↓
                                    [LEAD: 3s]
                                    Points to correct answer
                                          ↓
                                    [TEST: Wait for response]
                                    Student tries again
                                          ↓
                              Correct? → Celebrate → Next Problem
                                  ↓
                              Still wrong? → Repeat cycle (max 2 cycles)
```

### Visual Aids

The error correction system includes problem-specific visual supports:

**Number Identification:**
- **Number Line**: Shows range of numbers with the correct number highlighted
- Example: For "23", shows 18-28 with 23 highlighted and pulsing

**Addition Problems:**
- **Ten Frames**: Shows the answer quantity in filled ten-frame grids
- Example: For "7+8=15", shows 1 full ten-frame + 5 dots in second frame

**Reading (Future):**
- **Word Visuals**: Shows picture representation and phoneme breakdown
- Example: For "cat", shows 🐱 and c-a-t letter breakdown

## Settings & Configuration

Parents and teachers can customize error correction in **Settings → Error Correction**:

### Enable/Disable
- **Default**: ON
- Toggles the entire error correction system
- When OFF, wrong answers just show "Keep trying!" and move on

### Model Duration
- **Range**: 2-10 seconds
- **Default**: 3 seconds
- How long to display the correct answer in Step 1

### Lead Duration
- **Range**: 2-10 seconds
- **Default**: 3 seconds
- How long to display the guided prompt in Step 2

### Maximum Cycles
- **Range**: 1-3 cycles
- **Default**: 2 cycles
- How many times to repeat Model-Lead-Test if student still incorrect
- After max cycles, moves to next problem

### Celebrate Correction
- **Default**: ON
- Awards a star when student answers correctly after correction
- Reinforces learning from mistakes

## Data Tracking

### Error Correction Logs

Every error correction instance is logged in the database:

```typescript
{
  id: string;
  sessionLogId: string;          // Links to session
  problemId: string;              // Which problem was corrected
  problemType: 'math' | 'reading';
  incorrectAnswer: number | string;
  correctAnswer: number | string;
  correctionCyclesNeeded: number; // 1-3 (or max cycles)
  finallyCorrect: boolean;        // Did they get it right eventually?
  timestamp: Date;
}
```

### Analytics (Future Feature)

Parent Dashboard will show:
- **Correction Rate**: % of problems needing correction
- **Success After Correction**: % correct on first retry after correction
- **Cycles Needed**: Average cycles per corrected problem
- **Improvement Trends**: Are corrections decreasing over time?

## Best Practices

### For Parents/Teachers

1. **Trust the Process**
   - Let the app complete all 3 steps before intervening
   - Avoid giving verbal prompts during the correction flow
   - The student needs to attempt independently in the Test phase

2. **Use Default Settings First**
   - 3 seconds per step is research-based
   - 2 cycles max prevents frustration
   - Only adjust if student shows consistent difficulty

3. **Celebrate Learning from Mistakes**
   - Praise effort when student gets it right after correction
   - Example: "You learned from that! Great job!"
   - Avoid saying "You got it wrong before"

4. **Review Correction Data**
   - Check Parent Dashboard for correction patterns
   - Frequent corrections on same skill? May need direct teaching
   - No corrections at all? May need harder material

### When to Adjust Settings

**Increase Model/Lead Duration (to 4-5s) if:**
- Student seems rushed or anxious during correction
- Student looks away before absorbing the information
- Success rate after correction is low (<50%)

**Decrease Model/Lead Duration (to 2s) if:**
- Student loses attention during correction
- Student already understands before Test phase
- Student seems bored or disengaged

**Increase Max Cycles (to 3) if:**
- Student often fails after 2 cycles
- Student benefits from repetition
- You want more practice opportunities

**Decrease Max Cycles (to 1) if:**
- Student gets frustrated with multiple attempts
- You want to move through content faster
- Student rarely succeeds after 2 cycles anyway

## Technical Details

### Component Structure

```
ErrorCorrection.tsx
├── Props
│   ├── problemType: 'math' | 'reading'
│   ├── correctAnswer: number | string
│   ├── incorrectAnswer: number | string
│   ├── question: string
│   ├── allOptions?: array
│   ├── visualAid?: ReactNode
│   └── onComplete: (finallyCorrect, cyclesNeeded) => void
│
├── State
│   ├── step: 'model' | 'lead' | 'test'
│   ├── cycleCount: number
│   └── showCelebration: boolean
│
└── Flow
    ├── Auto-advance: Model → Lead → Test
    ├── Test response handler
    └── Completion callback with data
```

### Visual Aid Components

Located in `src/components/visualAids/`:

- **NumberLineVisual.tsx**: Number line with highlighted number
- **TenFrameVisual.tsx**: Ten frame grids with animated dots
- **WordVisual.tsx**: Word picture and phoneme breakdown

### Database Schema

```sql
-- Added in database version 2
CREATE TABLE errorCorrections (
  id TEXT PRIMARY KEY,
  sessionLogId TEXT,
  problemId TEXT,
  problemType TEXT,
  incorrectAnswer TEXT,
  correctAnswer TEXT,
  correctionCyclesNeeded INTEGER,
  finallyCorrect BOOLEAN,
  timestamp DATE
);
```

## Accessibility Features

### Visual
- **High contrast**: Green for correct, blue/purple/yellow for steps
- **Large text**: 8xl for answers during correction
- **Animated indicators**: Pulse, bounce effects to draw attention
- **Dyslexia font support**: Monospace option in settings

### Auditory
- **Text-to-speech**: Speaks answers if audio enabled
- **Encouraging messages**: "Let me show you!" (positive tone)
- **Celebration sounds**: Planned for future update

### Cognitive
- **Clear progression**: Visual dots show step 1, 2, 3
- **Consistent colors**: Each step has distinct color theme
- **Simple language**: Short, positive instructions
- **Automatic timing**: No pressure to manually advance

## Future Enhancements

### Planned Features
- [ ] Customizable encouragement messages
- [ ] Sound effects for each step
- [ ] Parent notification when correction happens
- [ ] Video modeling option (record parent showing answer)
- [ ] Error correction in Reading Practice (word selection)
- [ ] Adaptive cycle count based on student performance
- [ ] Detailed analytics dashboard with charts
- [ ] Printable error correction reports for IEP meetings

### Research Roadmap
- [ ] A/B test different durations to optimize learning
- [ ] Track long-term retention after error correction
- [ ] Compare outcomes with and without visual aids
- [ ] Analyze optimal max cycles for different age groups

## FAQ

**Q: Will error correction make my child dependent on help?**
A: No. The three-step process systematically fades support from full model to independent test. Research shows this builds independence over time.

**Q: What if my child still gets it wrong after 2 cycles?**
A: The app will move to the next problem to prevent frustration. Review this problem in a 1-on-1 session later, as it may need direct teaching first.

**Q: Should I turn error correction off sometimes?**
A: Use it during initial learning. You can disable it during practice/review sessions when the student has already mastered the skill and just needs fluency building.

**Q: Why doesn't Reading Practice have error correction?**
A: Currently, Reading Practice is a progressive phrase-reading activity without answer selection. Error correction will be added when we implement word/sentence selection activities.

**Q: Can I change the order of the steps?**
A: The Model-Lead-Test order is evidence-based and should not be changed. Skipping to Test without Model/Lead reduces learning effectiveness.

## References

- Cooper, J. O., Heron, T. E., & Heward, W. L. (2007). *Applied Behavior Analysis* (2nd ed.). Pearson.
- National Professional Development Center on ASD. (2020). *Evidence-Based Practices for Children with ASD*.
- Alberto, P. A., & Troutman, A. C. (2013). *Applied Behavior Analysis for Teachers* (9th ed.). Pearson.

## Support

For questions or issues with error correction:
- Check the **Parent Dashboard** for correction data
- Review **Settings** to ensure appropriate configuration
- Document patterns and discuss with your child's IEP team
- Report technical bugs via the app's feedback system

---

**Last Updated**: November 2025
**Feature Status**: ✅ Active in Math Practice
