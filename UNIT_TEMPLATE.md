# Unit Template for IEP Learning App

Use this template to create new learning units that can be imported into the application.

## Template Format

```markdown
---
unit-id: unique-id-here
title: "Unit Title Here"
difficulty: 1
goal-stars: [5, 10, 15]
---

## CVC Words
- word1
- word2
- word3

## Phrases
- phrase line 1
- phrase line 2
- phrase line 3

## Math Problems
- 1+1
- 2+3
- 5+4
```

## Field Descriptions

### Frontmatter (between `---` markers)

- **unit-id**: Unique identifier in kebab-case (e.g., `short-e-001`, `counting-10-19`)
- **title**: Display name for the unit (e.g., "Short E — Bed, Red, Fed")
- **difficulty**: Optional number indicating difficulty level (1-5)
- **goal-stars**: Array of star milestones (e.g., `[5, 10]` means rewards at 5 and 10 stars)

### Content Sections

- **## CVC Words**: List of consonant-vowel-consonant words for reading practice
- **## Phrases**: Progressive phrase building (each line adds to previous)
- **## Math Problems**: Various math activity types (see formats below)

## Math Problem Formats

The app supports multiple types of math activities:

### 1. Addition (with manipulatives)
```
- 1+1
- 2+3
- 5+4
```

### 2. Number Identification
```
- identify:5
- identify:12
- identify:23
```

### 3. Number Line Activities
```
- number-line:23 (20-29)
- number-line:26 (20-29)
- number-line:21 (20-29)
```
Format: `number-line:ANSWER (RANGE_START-RANGE_END)`

### 4. Ten Frame Activities
```
- ten-frame:23 [21,23,24,13]
- ten-frame:25 [25,24,26,15]
- ten-frame:27 [27,26,28,17]
```
Format: `ten-frame:ANSWER [option1,option2,option3,option4]`

### 5. Touch and Count Activities
```
- touch-count:23 (stars)
- touch-count:25 (animals)
- touch-count:27 (stars)
```
Format: `touch-count:ANSWER (stars|animals)`

## Example: Short E Unit

```markdown
---
unit-id: short-e-bed-001
title: "Short E — Bed, Red, Fed"
difficulty: 1
goal-stars: [5, 10]
---

## CVC Words
- bed
- red
- fed

## Phrases
- the bed
- the red bed
- I see the red bed

## Math Problems
- 1+2
- 2+2
- 3+1
```

## Example: Counting Unit with All Activity Types

```markdown
---
unit-id: counting-20-29-complete
title: "Counting 20-29 - Complete Activities"
difficulty: 2
goal-stars: [5, 10, 15]
---

## Math Problems

### Number Line Activities
- number-line:23 (20-29)
- number-line:26 (20-29)
- number-line:21 (20-29)
- number-line:28 (20-29)
- number-line:24 (20-29)

### Ten Frame Activities
- ten-frame:23 [21,23,24,13]
- ten-frame:25 [25,24,26,15]
- ten-frame:27 [27,26,28,17]
- ten-frame:22 [22,21,23,12]
- ten-frame:29 [29,28,27,19]

### Touch and Count Activities
- touch-count:23 (stars)
- touch-count:25 (animals)
- touch-count:27 (stars)
- touch-count:21 (animals)
- touch-count:29 (stars)
```

## Example: Mixed Math Activities

```markdown
---
unit-id: mixed-math-001
title: "Mixed Math Practice"
difficulty: 2
goal-stars: [5, 10, 15]
---

## Math Problems

### Number Identification
- identify:5
- identify:12
- identify:8
- identify:20
- identify:15

### Addition with Manipulatives
- 1+1
- 2+3
- 5+4
- 3+2
- 4+5

### Number Line
- number-line:7 (0-10)
- number-line:15 (10-20)

### Ten Frame
- ten-frame:8 [6,7,8,9]
- ten-frame:14 [12,13,14,15]
```

## How to Import

1. Open the IEP Learning app
2. Click "Manage Units" from the home screen
3. Paste your markdown content into the import field
4. Click "Import Unit"
5. The unit will be validated and added to the database

## Notes

- At least one content section (CVC Words, Phrases, or Math Problems) is required
- Math problems currently only support simple addition (e.g., `1+1`, `2+3`)
- Tags are automatically generated based on content (e.g., units with CVC words get 'cvc' and 'reading' tags)
- Unit IDs must be unique across all units
