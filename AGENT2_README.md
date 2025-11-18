# Agent 2: Reading Phonics Specialist

## Overview
Agent 2 provides comprehensive phonics instruction focusing on **Vowel Teams** and **R-Controlled Vowels**, designed specifically for students with autism and learning disabilities preparing for GED-level reading.

## Implementation Summary

### Content Coverage
- **Total Units**: 15 complete units
- **Total Activities**: 225+ reading activities
- **Estimated Time**: 35-45 hours of instruction
- **Target Level**: 3rd grade reading skills progressing toward GED readiness

### Unit Breakdown

#### Vowel Teams (8 Units)
1. **AI/AY** - rain, play, day, train, stay (15 activities)
2. **EE/EA** - see, tree, read, eat, feel (15 activities)
3. **OA/OW** - boat, snow, road, grow, coat (15 activities)
4. **OI/OY** - coin, boy, toy, join, joy (15 activities)
5. **AU/AW** - saw, draw, caught, taught (15 activities)
6. **OO (long)** - moon, soon, pool, cool, food (15 activities)
7. **OO (short)** - book, look, took, good, wood (15 activities)
8. **Mixed Vowel Teams** - Comprehensive review (18 activities)

#### R-Controlled Vowels (5 Units)
9. **AR** - car, star, park, far, farm (15 activities)
10. **ER** - her, fern, term, after, never (15 activities)
11. **IR** - bird, girl, first, dirt, shirt (15 activities)
12. **OR** - for, store, horn, more, sport (15 activities)
13. **UR** - fur, turn, burn, hurt, purple (15 activities)

#### Integration Units (2 Units)
14. **R-Controlled Mixed** - All r-controlled vowels review (18 activities)
15. **Complete Phonics Integration** - Vowel teams + R-controlled (20 activities)

## Design Principles

### Autism/LD-Friendly Features
- **Errorless Learning**: Progressive difficulty from simple to complex
- **Multi-sensory Support**: Visual text display + audio pronunciation
- **Predictable Structure**: Consistent activity format across all units
- **Visual Supports**: Clear, large text with high contrast
- **Pacing Control**: Break prompts and manual advancement options
- **Success-Oriented**: Achievable goals with positive reinforcement

### Progressive Complexity
Each unit follows a proven instructional pattern:

1. **Single Words** (Activities 1-6)
   - Individual target words
   - Focus on phonics pattern recognition
   - Example: "rain", "play", "day"

2. **Phrase Building** (Activities 7-11)
   - Progressive sentence building
   - Example: "rain" → "the rain" → "in the rain"

3. **Complete Sentences** (Activities 12-15)
   - Full sentences incorporating multiple words
   - Example: "I can paint on a sunny day"

### High-Frequency Vocabulary
All units use grade-appropriate, high-frequency words that students will encounter in:
- Daily reading
- GED preparation materials
- Real-world contexts

## Technical Implementation

### File Structure
```
src/
  utils/
    seedAgent2Phonics.ts    # Seed data for all 15 units
  db.ts                      # Database integration
```

### Database Schema
Uses existing schema from `types.ts`:

```typescript
interface Unit {
  id: string;              // e.g., 'vowel-team-ai-ay-001'
  title: string;           // e.g., 'AI/AY Vowel Team — Rain, Play, Day'
  tags: string[];          // e.g., ['vowel-team', 'ai', 'ay', 'agent-2']
  goalStars: number[];     // e.g., [8, 15] - stars needed for milestones
  createdAt: Date;
}

interface Phrase {
  id: string;              // e.g., 'vowel-team-ai-ay-001-phrase-1'
  unitId: string;          // Links to parent unit
  lines: string[];         // Progressive sentence building
}
```

### Auto-Seeding
The database automatically seeds Agent 2 units on first initialization:

```typescript
// In db.ts
export async function initializeDatabase() {
  const unitsCount = await db.units.count();
  if (unitsCount === 0) {
    await seedInitialData();
    await seedAgent2PhonicsUnits();  // Agent 2 auto-seed
  }
}
```

### Manual Seeding (Development)
For testing or re-seeding:

```typescript
import { seedAgent2Only } from './db';

// Call this function to seed only Agent 2 units
await seedAgent2Only();
```

## Student Experience

### Reading Practice Flow
1. Student selects a phonics unit from the home screen
2. Unit displays phrases progressively:
   - Start with single word
   - Build to full sentences line-by-line
3. Audio support available:
   - **Listen**: Hear the whole word/sentence
   - **Sound Out**: Hear phonemes individually then blended
4. Track progress with star rewards
5. Break prompts every 6 activities (configurable)

### Gamification
- **Goal Stars**: Each unit has 2 milestones (e.g., 8 stars, 15 stars)
- **Visual Progress**: Star counter at top of screen
- **Rewards**: Unlock rewards at milestones (defined in rewards table)
- **Success Feedback**: "Done! ⭐" after each activity

## Testing the Implementation

### Verify Units Load
1. Start the application: `npm run dev`
2. Open browser to localhost
3. Check home screen shows all 15 Agent 2 units
4. Units should display with appropriate tags:
   - `vowel-team`, `r-controlled`, `agent-2`

### Test Reading Practice
1. Select any Agent 2 unit (e.g., "AI/AY Vowel Team")
2. Verify phrases display correctly
3. Test audio controls:
   - Toggle audio on/off
   - Click "Listen" button
   - Click "Sound Out" button
4. Progress through activities
5. Verify star tracking
6. Complete unit and check rewards screen

### Filter by Tags
Units are tagged for easy filtering:
- `agent-2` - All Agent 2 units
- `vowel-team` - All vowel team units (Units 1-8)
- `r-controlled` - All r-controlled units (Units 9-15)
- Specific patterns: `ai`, `ay`, `ee`, `ea`, `ar`, `er`, etc.
- `review` or `mixed` - Integration units

## Coordination with Other Agents

### Prerequisite Skills (Before Agent 2)
- **Agent 1**: Basic number recognition, simple fractions
- **Foundation**: CVC words (consonant-vowel-consonant)
- **Example**: Existing "Short A" unit (cat, sat, mat)

### Next Steps (After Agent 2)
- **Agent 3**: Multi-syllabic words building on phonics patterns
- **Agent 4**: Advanced multiplication/division

### Integration Points
- Agent 2 units can be mixed with other agents' units
- Progressive difficulty supports scaffolding
- Shared reward system maintains motivation across all agents

## Data & Analytics

### Tracking Capabilities
The existing `SessionLog` schema captures:
- Stars earned per session
- Total attempts and correct responses
- Milestones reached
- Date/time data for progress monitoring

### Parent Dashboard
Parents/educators can view:
- Progress across all units
- Time spent on phonics practice
- Strengths (faster progress) vs. areas needing support
- Milestone achievements

## Maintenance & Extension

### Adding More Units
To add additional phonics units:

1. Edit `src/utils/seedAgent2Phonics.ts`
2. Add unit object following the existing pattern
3. Include progressive phrases
4. Tag appropriately
5. Set goal stars (recommended: [8, 15] or [10, 18])

### Modifying Existing Units
Each unit is defined in the `units` array in `seedAgent2Phonics.ts`. Modifications are straightforward:
- Adjust phrases for difficulty
- Change goal stars for pacing
- Update tags for filtering

### Example Unit Template
```typescript
{
  unit: {
    id: 'unique-unit-id',
    title: 'Display Title — Sample Words',
    tags: ['category', 'pattern', 'agent-2'],
    goalStars: [8, 15],
    createdAt: new Date()
  },
  phrases: [
    { lines: ['word1'] },
    { lines: ['word2'] },
    { lines: ['word1', 'word1 phrase'] },
    // ... progressive building
    { lines: ['Complete sentence using target words'] }
  ]
}
```

## Accessibility Features

### Visual Accommodations
- **Dyslexia Font Toggle**: Optional monospace font (in settings)
- **Large Text**: 6xl font size for current line
- **High Contrast**: Blue text on white background
- **Clear Spacing**: Adequate line height and word spacing

### Cognitive Support
- **Consistent Layout**: Same interface across all units
- **Minimal Distractions**: Clean, focused design
- **Clear Feedback**: Visual (stars) and optional audio
- **Break Prompts**: Regular opportunities to rest

### Flexible Pacing
- **Manual Advancement**: Student controls progression
- **Auto-Advance Option**: Configurable delay (default: off)
- **No Time Pressure**: Untimed activities
- **Quit Anytime**: Easy exit to home screen

## Success Metrics

### Completion Indicators
- **Unit Completion**: All 15 phrases completed
- **Goal Achievement**: Stars reach both milestones
- **Skill Mastery**: Student can read sentences independently

### Expected Outcomes
After completing Agent 2, students should be able to:
- Recognize and read vowel team patterns (ai, ay, ee, ea, oa, ow, etc.)
- Decode r-controlled vowel words (ar, er, ir, or, ur)
- Read multi-word sentences containing these patterns
- Apply phonics skills to new words with similar patterns
- Build foundation for multi-syllabic word reading (Agent 3)

## Support & Troubleshooting

### Common Issues

**Units not showing:**
- Verify database initialization ran
- Check browser console for errors
- Clear browser cache/IndexedDB

**Audio not working:**
- Check browser supports Web Speech API
- Verify audio is enabled in settings
- Check system volume/permissions

**Progress not saving:**
- Ensure database writes are completing
- Check IndexedDB storage limits
- Verify session logs are being created

## Credits

**Designed for**: Students with autism and learning disabilities
**Educational Focus**: Phonics instruction for GED reading preparation
**Implementation**: Agent 2 of GED-track module development
**Framework**: React + TypeScript + Dexie (IndexedDB)

---

**Version**: 1.0
**Last Updated**: 2025-11-18
**Status**: ✅ Complete and tested
