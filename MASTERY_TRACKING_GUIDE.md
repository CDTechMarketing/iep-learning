# Mastery Tracking & IEP Goal Progress - User Guide

## Overview

The Mastery Tracking system provides comprehensive skill mastery detection and IEP (Individualized Education Program) goal tracking for special needs education. This feature automatically analyzes student performance and provides data-driven insights for IEP meetings and instruction planning.

## Features

### 1. Skill Mastery Tracking
- **Automatic Detection**: Skills are automatically detected from session logs and grouped by learning units
- **Mastery Levels**: Three levels of mastery:
  - 🌱 **Emerging**: < 60% accuracy - skill is just beginning to develop
  - 📈 **Progressing**: 60-79% accuracy - skill is developing well
  - ✅ **Mastered**: ≥ 80% accuracy for 3+ consecutive sessions
- **Accuracy History**: Tracks the last 10 sessions for each skill
- **Visual Analytics**: Mini charts show accuracy trends over time

### 2. IEP Goals Dashboard
- **Create Goals**: Define measurable IEP goals with:
  - Description and category (reading, math, science, behavior)
  - Target date and measurement type (accuracy, frequency, duration)
  - Baseline data and target values
  - Related skills linking
- **Progress Tracking**: Automatic progress calculation based on linked skills
- **Status Indicators**:
  - 🟢 **Achieved**: 100% progress reached
  - 🔵 **On Track**: Progress matches expected timeline
  - 🔴 **At Risk**: Progress significantly behind expected timeline

### 3. Progress Reports
- **Comprehensive Summaries**: Printable reports including:
  - Executive summary with key metrics
  - Skill mastery breakdown by category
  - IEP goals status and progress
  - Data-driven recommendations
- **Date Range Filtering**: View progress over custom time periods
- **Print-Ready Format**: Optimized layout for IEP meetings and parent conferences

## How to Use

### Accessing Mastery Tracking

1. Navigate to the **Parent Dashboard** from the home screen
2. Use the navigation tabs at the top:
   - **📊 Analytics**: Session data and charts (existing view)
   - **🎯 IEP Goals**: Manage IEP goals
   - **⭐ Skill Mastery**: View all skills and mastery status
   - **📄 Progress Report**: Generate printable reports

### Creating an IEP Goal

1. Go to **🎯 IEP Goals** tab
2. Click **New Goal** button
3. Fill in the goal details:
   - **Description**: Clear, measurable goal statement (e.g., "Student will read CVC words with 80% accuracy")
   - **Category**: Reading, Math, Science, or Behavior
   - **Target Date**: When the goal should be achieved
   - **Measurement Type**: How progress is measured
     - Accuracy: Based on percentage correct
     - Frequency: Based on number of occurrences
     - Duration: Based on time spent
   - **Baseline Data**: Starting performance level
   - **Target Value**: Desired final performance level
   - **Notes**: Optional accommodations or strategies
4. Click **Create Goal**

### Linking Skills to Goals

1. Open an existing goal in the IEP Goals Dashboard
2. Click **Edit** button
3. In the form, you can link related skills
4. Skills automatically update goal progress as student practices

### Viewing Skill Mastery

1. Go to **⭐ Skill Mastery** tab
2. View statistics:
   - Total skills tracked
   - Number mastered, progressing, and emerging
3. Filter by:
   - **Category**: Reading, Math, Science
   - **Mastery Level**: Mastered, Progressing, Emerging
4. Click any skill card to view detailed history

### Generating Progress Reports

1. Go to **📄 Progress Report** tab
2. Select date range (default: last 30 days)
3. Review the report sections:
   - Executive Summary
   - Skill Mastery Summary
   - IEP Goals Summary
   - Recommendations
4. Click **Print Report** to print or save as PDF

## Mastery Criteria Settings

Configure when skills are considered "mastered":

1. Go to **Settings** from the home screen
2. Scroll to **Mastery Tracking** section
3. Adjust criteria:
   - **Accuracy Threshold** (60-100%): Required accuracy percentage (default: 80%)
   - **Consecutive Sessions** (1-10): How many sessions in a row above threshold (default: 3)
   - **Minimum Sessions** (3-15): Total sessions before mastery can be achieved (default: 5)
4. Click **Save Settings**

## Understanding the Data

### Mastery Level Calculation

A skill is marked as **Mastered** when ALL of these conditions are met:
- Student has completed at least the minimum number of sessions (default: 5)
- Student achieved accuracy ≥ threshold (default: 80%) for consecutive sessions (default: 3)
- Current average accuracy (last 3 sessions) ≥ threshold

### IEP Goal Progress Calculation

Progress is calculated based on measurement type:

**Accuracy-based goals**:
```
Progress = (Current Avg Accuracy - Baseline) / (Target - Baseline) × 100%
```

**Frequency-based goals**:
```
Progress = (Mastered Skills - Baseline) / (Target - Baseline) × 100%
```

**At-Risk Detection**:
A goal is flagged "at risk" when current progress is more than 20% behind the expected progress based on time elapsed.

## Best Practices

### For Parents/Teachers

1. **Set Realistic Goals**: Use baseline data from actual performance, not estimates
2. **Link Related Skills**: Connect IEP goals to specific practice units for automatic tracking
3. **Review Weekly**: Check the Skill Mastery view weekly to celebrate progress
4. **Adjust Criteria**: If default mastery criteria are too strict or too lenient, adjust in Settings
5. **Use Reports for IEP Meetings**: Generate progress reports before IEP meetings for data-driven discussions

### For Data Quality

1. **Complete Full Sessions**: Partial sessions may skew accuracy data
2. **Practice Regularly**: Mastery tracking works best with consistent practice (3-4 times per week)
3. **Review After 5+ Sessions**: Wait until at least 5 sessions are complete before making instructional decisions
4. **Track Multiple Skills**: Create different units for different skills to track mastery separately

## Troubleshooting

### Skills Not Showing Up

- **Cause**: No practice sessions completed yet
- **Solution**: Complete at least one session in a unit to generate skill mastery data

### Goal Progress Not Updating

- **Cause**: Skills not linked to the goal
- **Solution**: Edit the goal and link related skills, then click "Refresh Progress"

### Mastery Level Seems Wrong

- **Cause**: Mastery criteria may need adjustment
- **Solution**: Check Settings → Mastery Tracking and adjust thresholds

### Recently Mastered Skills Not Celebrating

- **Cause**: May have been mastered more than 7 days ago
- **Solution**: The "Recently Mastered" section shows skills mastered in the last 7 days

## Privacy & Data

- **Local Storage**: All mastery and IEP data is stored locally in your browser using IndexedDB
- **No Cloud Sync**: No data is sent to external servers
- **Export Options**: Use "Export Data" in Parent Dashboard to back up your data
- **Data Retention**: Data persists until you clear browser data or manually delete

## Technical Details

### Database Schema

**SkillMastery Table**:
- Stores one record per skill (unit)
- Auto-updated after each session completion
- Tracks accuracy history (last 10 sessions)

**IEPGoals Table**:
- Stores custom IEP goals
- Links to skill IDs for progress calculation
- Progress auto-updates when related skills change

### Automatic Updates

Mastery tracking updates automatically:
1. Student completes a practice session
2. Session log is saved to database
3. `updateMasteryFromSession()` analyzes the unit's performance
4. Skill mastery record is created or updated
5. All IEP goals linked to that skill are updated
6. UI reflects new mastery level and progress

## Evidence-Based Approach

This feature is designed based on:
- **Data-Based Decision Making**: Common practice in special education IEPs
- **Mastery Learning**: Concept that students should achieve mastery before advancing
- **Progress Monitoring**: Regular assessment to inform instruction (RTI framework)
- **SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound goals

## Support

For issues or questions:
1. Check this guide first
2. Review the Settings to ensure mastery criteria are configured
3. Verify that sessions are being completed and logged
4. Check browser console for any error messages

## Version History

- **v2.0** (Current): Full mastery tracking and IEP goals system
  - Skill mastery auto-detection
  - IEP goals dashboard
  - Progress reports
  - Configurable mastery criteria

---

**Last Updated**: November 2024
**Feature**: Tier 1, Prompt 1 - Mastery Tracking & IEP Goal Progress
