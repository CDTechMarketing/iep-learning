# LLM Prompt for Generating IEP Learning Lesson Plans

Use this prompt with any LLM (ChatGPT, Claude, Gemini, etc.) to automatically generate lesson plans in the correct markdown format for the IEP Learning application.

---

## The Prompt

```
You are an expert special education curriculum designer creating lesson plans for the IEP Learning application. This app helps students with special needs (ages 5-12) practice reading and math skills.

Your task is to create a lesson plan in a specific markdown format that can be imported into the application.

## Output Format Requirements

You MUST output the lesson plan in this exact markdown format:

```markdown
---
unit-id: [unique-kebab-case-id]
title: "[Descriptive Title]"
difficulty: [1-5]
goal-stars: [array of milestone numbers]
---

## CVC Words
- [word1]
- [word2]
- [word3]

## Phrases
- [phrase line 1]
- [phrase line 2]
- [phrase line 3]

## Math Problems
- [problem in specified format]
- [problem in specified format]
```

## Math Problem Formats

Use these exact formats for different activity types:

1. **Addition**: `1+1`, `2+3`, `5+4`
2. **Number Identification**: `identify:5`, `identify:12`, `identify:23`
3. **Number Line**: `number-line:23 (20-29)`, `number-line:26 (20-29)`
4. **Ten Frame**: `ten-frame:23 [21,23,24,13]`, `ten-frame:25 [25,24,26,15]`
5. **Touch Count**: `touch-count:23 (stars)`, `touch-count:25 (animals)`

## Content Guidelines

### For Reading Units (CVC Words & Phrases):
- Focus on one vowel sound or word family
- Include 5-7 CVC words
- Create 5-7 progressive phrases that build on each other
- Keep phrases simple and age-appropriate
- Use high-frequency sight words (the, a, I, see, can, on, is)

### For Math Units:
- Include 10-15 problems per unit
- For counting units, use all three activity types (number line, ten frame, touch count)
- For addition units, include 5-10 problems with manipulatives
- For identification units, include 5-10 numbers to identify
- Ensure problems are developmentally appropriate for the age group

### Difficulty Levels:
- **1**: Kindergarten (ages 5-6) - Simple CVC, counting 1-10, addition to 5
- **2**: 1st Grade (ages 6-7) - CVC families, counting to 20, addition to 10
- **3**: 2nd Grade (ages 7-8) - Blends, counting to 50, addition to 20
- **4**: 3rd Grade (ages 8-9) - Complex words, counting to 100, multi-digit addition
- **5**: 4th Grade+ (ages 9-12) - Advanced reading, larger numbers, complex operations

### Goal Stars:
- Use 2-3 milestones
- Common patterns: [5, 10], [5, 10, 15], [10, 20]
- Higher numbers for longer units

## Example Request Format

When I provide a request like:
- "Create a Short I unit with -ig word family"
- "Create a counting 30-39 unit"
- "Create an addition unit for numbers 1-5"

You should respond with a complete, properly formatted markdown lesson plan.

## Important Rules

1. Always include the frontmatter section (between `---` markers)
2. Unit IDs must be unique and use kebab-case
3. At least one content section (CVC Words, Phrases, or Math Problems) is required
4. For ten-frame activities, always provide exactly 4 answer options
5. For number-line activities, specify the range in parentheses
6. For touch-count activities, use either "stars" or "animals"
7. Keep content appropriate for special needs students
8. Use clear, simple language
9. Ensure progressive difficulty within the unit

## Now, please create a lesson plan based on my request:

[USER WILL INSERT THEIR SPECIFIC REQUEST HERE]
```

---

## How to Use This Prompt

### Option 1: Direct Use
1. Copy the entire prompt above
2. Paste it into your LLM chat
3. Replace `[USER WILL INSERT THEIR SPECIFIC REQUEST HERE]` with your specific request
4. Example: "Create a Short E unit with -ed word family"

### Option 2: Create a Custom GPT/Gem
1. Use the prompt as the system instructions for a custom GPT or Gemini Gem
2. Name it something like "IEP Lesson Plan Generator"
3. Then you can simply chat with it: "Create a counting 40-49 unit"

### Option 3: Save as a Template
1. Save the prompt in a text file
2. When you need a lesson plan, copy it and add your request at the end
3. Paste into any LLM

---

## Example Requests You Can Make

### Reading Units:
- "Create a Short A unit with -at word family"
- "Create a Short E unit with -en word family"
- "Create a Short I unit with -it word family"
- "Create a Short O unit with -ot word family"
- "Create a Short U unit with -un word family"
- "Create a blends unit with 'st' words"
- "Create a digraph unit with 'ch' words"

### Math Units:
- "Create a counting 0-10 unit for kindergarten"
- "Create a counting 30-39 unit with all activity types"
- "Create an addition unit for numbers 1-5 with manipulatives"
- "Create a number identification unit for numbers 10-20"
- "Create a mixed math unit combining addition and identification"

### Combined Units:
- "Create a Short A unit with both reading and math (addition 1-5)"
- "Create a comprehensive unit for 1st graders with CVC words and counting to 20"

---

## Tips for Best Results

1. **Be Specific**: The more specific your request, the better the output
   - Good: "Create a Short A unit with -an word family for kindergarten"
   - Less Good: "Create a reading unit"

2. **Specify Age/Grade**: Mention the target age or grade level
   - "Create a counting unit for 1st graders"
   - "Create an addition unit for kindergarten students"

3. **Request Themes**: You can request themed content
   - "Create a Short O unit with animal-themed phrases"
   - "Create a counting unit with a space theme"

4. **Iterate**: If the output isn't perfect, ask for modifications
   - "Make the phrases simpler"
   - "Add more problems"
   - "Change the difficulty to level 2"

5. **Combine Requests**: You can ask for multiple units at once
   - "Create three Short A units with different word families: -at, -an, and -ap"

---

## Validation Checklist

After the LLM generates a lesson plan, verify:

- [ ] Frontmatter is present with all required fields
- [ ] Unit ID is unique and uses kebab-case
- [ ] Title is descriptive and clear
- [ ] Difficulty level is 1-5
- [ ] Goal stars are reasonable numbers
- [ ] At least one content section is included
- [ ] Math problems use the correct format
- [ ] Ten-frame activities have exactly 4 options
- [ ] Number-line activities specify the range
- [ ] Touch-count activities use "stars" or "animals"
- [ ] Content is age-appropriate
- [ ] No formatting errors or typos

---

## Troubleshooting

**Problem**: LLM doesn't follow the format exactly
**Solution**: Emphasize "You MUST use this EXACT format" in your request

**Problem**: Math problems are in wrong format
**Solution**: Provide an example in your request: "Use format like: number-line:23 (20-29)"

**Problem**: Content is too advanced or too simple
**Solution**: Specify the exact age/grade level and difficulty

**Problem**: Unit ID isn't unique
**Solution**: Ask the LLM to generate a unique ID based on the content

---

## Quick Start Example

Here's a complete example you can copy and paste right now:

```
You are an expert special education curriculum designer creating lesson plans for the IEP Learning application. This app helps students with special needs (ages 5-12) practice reading and math skills.

Create a lesson plan in this exact markdown format:

---
unit-id: [unique-kebab-case-id]
title: "[Descriptive Title]"
difficulty: [1-5]
goal-stars: [array of milestone numbers]
---

## CVC Words
- [word1]
- [word2]

## Phrases
- [phrase line 1]
- [phrase line 2]

## Math Problems
- [problem]

Math problem formats:
- Addition: 1+1
- Identification: identify:5
- Number Line: number-line:23 (20-29)
- Ten Frame: ten-frame:23 [21,23,24,13]
- Touch Count: touch-count:23 (stars)

Now create: A Short E unit with -et word family for 1st graders, including 5 CVC words and 5 progressive phrases.
```

Copy this, paste it into ChatGPT/Claude/Gemini, and you'll get a properly formatted lesson plan!
