/**
 * Phonics Patterns Seed Data
 * Complete set of phonics patterns for all 8 levels
 */

import { PhonicsPattern } from '../types';

export const PHONICS_PATTERNS: PhonicsPattern[] = [
  // ============================================
  // LEVEL 1: LETTER SOUNDS (26 patterns)
  // ============================================
  {
    id: 'ls-a',
    name: 'Letter A',
    category: 'letter-sounds',
    level: 1,
    examples: ['ant', 'apple', 'alligator'],
    teachingTip: 'The letter A says /a/ as in apple. Focus on the short vowel sound.',
    description: 'Short A sound as in "apple"'
  },
  {
    id: 'ls-b',
    name: 'Letter B',
    category: 'letter-sounds',
    level: 1,
    examples: ['ball', 'bat', 'book'],
    teachingTip: 'B says /b/. Press lips together and release air.',
    description: 'B sound as in "ball"'
  },
  {
    id: 'ls-c',
    name: 'Letter C',
    category: 'letter-sounds',
    level: 1,
    examples: ['cat', 'cup', 'car'],
    teachingTip: 'C says /k/. Back of tongue touches soft palate.',
    description: 'Hard C sound as in "cat"'
  },
  {
    id: 'ls-d',
    name: 'Letter D',
    category: 'letter-sounds',
    level: 1,
    examples: ['dog', 'duck', 'door'],
    teachingTip: 'D says /d/. Tongue touches behind upper teeth.',
    description: 'D sound as in "dog"'
  },
  {
    id: 'ls-e',
    name: 'Letter E',
    category: 'letter-sounds',
    level: 1,
    examples: ['egg', 'elephant', 'elbow'],
    teachingTip: 'E says /e/ as in egg. Short vowel sound.',
    description: 'Short E sound as in "egg"'
  },
  {
    id: 'ls-f',
    name: 'Letter F',
    category: 'letter-sounds',
    level: 1,
    examples: ['fish', 'fox', 'fan'],
    teachingTip: 'F says /f/. Upper teeth touch lower lip.',
    description: 'F sound as in "fish"'
  },
  {
    id: 'ls-g',
    name: 'Letter G',
    category: 'letter-sounds',
    level: 1,
    examples: ['goat', 'game', 'gift'],
    teachingTip: 'G says /g/. Back of tongue touches soft palate.',
    description: 'Hard G sound as in "goat"'
  },
  {
    id: 'ls-h',
    name: 'Letter H',
    category: 'letter-sounds',
    level: 1,
    examples: ['hat', 'house', 'hand'],
    teachingTip: 'H says /h/. Breathe out air.',
    description: 'H sound as in "hat"'
  },
  {
    id: 'ls-i',
    name: 'Letter I',
    category: 'letter-sounds',
    level: 1,
    examples: ['igloo', 'insect', 'inch'],
    teachingTip: 'I says /i/ as in igloo. Short vowel sound.',
    description: 'Short I sound as in "igloo"'
  },
  {
    id: 'ls-j',
    name: 'Letter J',
    category: 'letter-sounds',
    level: 1,
    examples: ['jump', 'jar', 'jelly'],
    teachingTip: 'J says /j/. Soft sound with voiced air.',
    description: 'J sound as in "jump"'
  },
  {
    id: 'ls-k',
    name: 'Letter K',
    category: 'letter-sounds',
    level: 1,
    examples: ['kite', 'king', 'key'],
    teachingTip: 'K says /k/. Same sound as hard C.',
    description: 'K sound as in "kite"'
  },
  {
    id: 'ls-l',
    name: 'Letter L',
    category: 'letter-sounds',
    level: 1,
    examples: ['lion', 'lamp', 'leaf'],
    teachingTip: 'L says /l/. Tongue touches roof of mouth.',
    description: 'L sound as in "lion"'
  },
  {
    id: 'ls-m',
    name: 'Letter M',
    category: 'letter-sounds',
    level: 1,
    examples: ['monkey', 'moon', 'map'],
    teachingTip: 'M says /m/. Lips together, hum through nose.',
    description: 'M sound as in "monkey"'
  },
  {
    id: 'ls-n',
    name: 'Letter N',
    category: 'letter-sounds',
    level: 1,
    examples: ['nest', 'nose', 'net'],
    teachingTip: 'N says /n/. Tongue behind teeth, air through nose.',
    description: 'N sound as in "nest"'
  },
  {
    id: 'ls-o',
    name: 'Letter O',
    category: 'letter-sounds',
    level: 1,
    examples: ['octopus', 'otter', 'ox'],
    teachingTip: 'O says /o/ as in octopus. Short vowel sound.',
    description: 'Short O sound as in "octopus"'
  },
  {
    id: 'ls-p',
    name: 'Letter P',
    category: 'letter-sounds',
    level: 1,
    examples: ['pig', 'pan', 'pen'],
    teachingTip: 'P says /p/. Pop air from lips.',
    description: 'P sound as in "pig"'
  },
  {
    id: 'ls-q',
    name: 'Letter Q',
    category: 'letter-sounds',
    level: 1,
    examples: ['queen', 'quit', 'quick'],
    teachingTip: 'Q says /kw/. Always followed by U.',
    description: 'Q sound (qu) as in "queen"'
  },
  {
    id: 'ls-r',
    name: 'Letter R',
    category: 'letter-sounds',
    level: 1,
    examples: ['rabbit', 'run', 'red'],
    teachingTip: 'R says /r/. Tongue curls slightly.',
    description: 'R sound as in "rabbit"'
  },
  {
    id: 'ls-s',
    name: 'Letter S',
    category: 'letter-sounds',
    level: 1,
    examples: ['sun', 'snake', 'sock'],
    teachingTip: 'S says /s/. Air flows through teeth.',
    description: 'S sound as in "sun"'
  },
  {
    id: 'ls-t',
    name: 'Letter T',
    category: 'letter-sounds',
    level: 1,
    examples: ['top', 'tree', 'ten'],
    teachingTip: 'T says /t/. Tongue taps behind teeth.',
    description: 'T sound as in "top"'
  },
  {
    id: 'ls-u',
    name: 'Letter U',
    category: 'letter-sounds',
    level: 1,
    examples: ['umbrella', 'up', 'under'],
    teachingTip: 'U says /u/ as in umbrella. Short vowel sound.',
    description: 'Short U sound as in "umbrella"'
  },
  {
    id: 'ls-v',
    name: 'Letter V',
    category: 'letter-sounds',
    level: 1,
    examples: ['van', 'vine', 'vest'],
    teachingTip: 'V says /v/. Like F but with voice.',
    description: 'V sound as in "van"'
  },
  {
    id: 'ls-w',
    name: 'Letter W',
    category: 'letter-sounds',
    level: 1,
    examples: ['water', 'wagon', 'window'],
    teachingTip: 'W says /w/. Round lips and release.',
    description: 'W sound as in "water"'
  },
  {
    id: 'ls-x',
    name: 'Letter X',
    category: 'letter-sounds',
    level: 1,
    examples: ['box', 'fox', 'six'],
    teachingTip: 'X says /ks/. Usually at end of words.',
    description: 'X sound (/ks/) as in "box"'
  },
  {
    id: 'ls-y',
    name: 'Letter Y',
    category: 'letter-sounds',
    level: 1,
    examples: ['yellow', 'yes', 'yak'],
    teachingTip: 'Y says /y/ at beginning of words.',
    description: 'Y sound as in "yellow"'
  },
  {
    id: 'ls-z',
    name: 'Letter Z',
    category: 'letter-sounds',
    level: 1,
    examples: ['zebra', 'zip', 'zoo'],
    teachingTip: 'Z says /z/. Like S but with voice.',
    description: 'Z sound as in "zebra"'
  },

  // ============================================
  // LEVEL 2: CVC WORDS (5 patterns)
  // ============================================
  {
    id: 'cvc-short-a',
    name: 'CVC Short A',
    category: 'cvc',
    level: 2,
    examples: ['cat', 'bat', 'mat', 'sat', 'hat', 'rat', 'pat', 'fat'],
    teachingTip: 'Blend three sounds together: C-A-T makes "cat".',
    description: 'CVC words with short A vowel'
  },
  {
    id: 'cvc-short-e',
    name: 'CVC Short E',
    category: 'cvc',
    level: 2,
    examples: ['bed', 'red', 'pet', 'wet', 'ten', 'pen', 'hen', 'men'],
    teachingTip: 'Short E sounds like "eh" in the middle of words.',
    description: 'CVC words with short E vowel'
  },
  {
    id: 'cvc-short-i',
    name: 'CVC Short I',
    category: 'cvc',
    level: 2,
    examples: ['sit', 'bit', 'hit', 'kid', 'big', 'pig', 'dig', 'fig'],
    teachingTip: 'Short I is a quick "ih" sound.',
    description: 'CVC words with short I vowel'
  },
  {
    id: 'cvc-short-o',
    name: 'CVC Short O',
    category: 'cvc',
    level: 2,
    examples: ['dog', 'hot', 'pot', 'lot', 'top', 'hop', 'mop', 'pop'],
    teachingTip: 'Short O sounds like "ah" in the middle.',
    description: 'CVC words with short O vowel'
  },
  {
    id: 'cvc-short-u',
    name: 'CVC Short U',
    category: 'cvc',
    level: 2,
    examples: ['bug', 'cup', 'run', 'sun', 'fun', 'hug', 'rug', 'tub'],
    teachingTip: 'Short U sounds like "uh" in the middle.',
    description: 'CVC words with short U vowel'
  },

  // ============================================
  // LEVEL 3: DIGRAPHS (6 patterns)
  // ============================================
  {
    id: 'digraph-ch',
    name: 'Digraph CH',
    category: 'digraphs',
    level: 3,
    examples: ['chip', 'chop', 'chat', 'much', 'lunch', 'bench'],
    teachingTip: 'CH makes one sound: /ch/ as in "chip".',
    description: 'CH digraph - two letters, one sound'
  },
  {
    id: 'digraph-sh',
    name: 'Digraph SH',
    category: 'digraphs',
    level: 3,
    examples: ['ship', 'shop', 'fish', 'wish', 'dash', 'bash'],
    teachingTip: 'SH makes the /sh/ sound. Put finger to lips: "Shhh!"',
    description: 'SH digraph - quiet sound'
  },
  {
    id: 'digraph-th-voiced',
    name: 'Digraph TH (voiced)',
    category: 'digraphs',
    level: 3,
    examples: ['this', 'that', 'them', 'then', 'mother'],
    teachingTip: 'Voiced TH: tongue between teeth, feel vibration.',
    description: 'TH digraph with voice (as in "this")'
  },
  {
    id: 'digraph-th-unvoiced',
    name: 'Digraph TH (unvoiced)',
    category: 'digraphs',
    level: 3,
    examples: ['think', 'thank', 'path', 'math', 'bath'],
    teachingTip: 'Unvoiced TH: tongue between teeth, just air.',
    description: 'TH digraph without voice (as in "think")'
  },
  {
    id: 'digraph-wh',
    name: 'Digraph WH',
    category: 'digraphs',
    level: 3,
    examples: ['when', 'what', 'where', 'which', 'why', 'whale'],
    teachingTip: 'WH makes the /w/ sound at the start of question words.',
    description: 'WH digraph - question words'
  },
  {
    id: 'digraph-ph',
    name: 'Digraph PH',
    category: 'digraphs',
    level: 3,
    examples: ['phone', 'photo', 'graph', 'trophy'],
    teachingTip: 'PH sounds like F: "phone" sounds like "fone".',
    description: 'PH digraph sounds like F'
  },

  // ============================================
  // LEVEL 4: CONSONANT BLENDS (25 patterns)
  // ============================================
  // L-blends
  {
    id: 'blend-bl',
    name: 'BL Blend',
    category: 'blends',
    level: 4,
    examples: ['blue', 'black', 'block', 'blend', 'blow'],
    teachingTip: 'Blend /b/ and /l/ together smoothly.',
    description: 'BL consonant blend'
  },
  {
    id: 'blend-cl',
    name: 'CL Blend',
    category: 'blends',
    level: 4,
    examples: ['clap', 'clock', 'cloud', 'clean', 'climb'],
    teachingTip: 'Blend /k/ and /l/ together smoothly.',
    description: 'CL consonant blend'
  },
  {
    id: 'blend-fl',
    name: 'FL Blend',
    category: 'blends',
    level: 4,
    examples: ['flag', 'flip', 'fly', 'flower', 'flat'],
    teachingTip: 'Blend /f/ and /l/ together smoothly.',
    description: 'FL consonant blend'
  },
  {
    id: 'blend-gl',
    name: 'GL Blend',
    category: 'blends',
    level: 4,
    examples: ['glad', 'glass', 'glue', 'globe', 'glow'],
    teachingTip: 'Blend /g/ and /l/ together smoothly.',
    description: 'GL consonant blend'
  },
  {
    id: 'blend-pl',
    name: 'PL Blend',
    category: 'blends',
    level: 4,
    examples: ['plan', 'play', 'plus', 'plant', 'plate'],
    teachingTip: 'Blend /p/ and /l/ together smoothly.',
    description: 'PL consonant blend'
  },
  {
    id: 'blend-sl',
    name: 'SL Blend',
    category: 'blends',
    level: 4,
    examples: ['slip', 'slow', 'sleep', 'slide', 'slam'],
    teachingTip: 'Blend /s/ and /l/ together smoothly.',
    description: 'SL consonant blend'
  },
  // R-blends
  {
    id: 'blend-br',
    name: 'BR Blend',
    category: 'blends',
    level: 4,
    examples: ['brag', 'brick', 'brown', 'bring', 'brush'],
    teachingTip: 'Blend /b/ and /r/ together smoothly.',
    description: 'BR consonant blend'
  },
  {
    id: 'blend-cr',
    name: 'CR Blend',
    category: 'blends',
    level: 4,
    examples: ['crab', 'crack', 'cry', 'crown', 'cross'],
    teachingTip: 'Blend /k/ and /r/ together smoothly.',
    description: 'CR consonant blend'
  },
  {
    id: 'blend-dr',
    name: 'DR Blend',
    category: 'blends',
    level: 4,
    examples: ['drop', 'drum', 'dress', 'drink', 'dragon'],
    teachingTip: 'Blend /d/ and /r/ together smoothly.',
    description: 'DR consonant blend'
  },
  {
    id: 'blend-fr',
    name: 'FR Blend',
    category: 'blends',
    level: 4,
    examples: ['from', 'frog', 'free', 'fresh', 'fruit'],
    teachingTip: 'Blend /f/ and /r/ together smoothly.',
    description: 'FR consonant blend'
  },
  {
    id: 'blend-gr',
    name: 'GR Blend',
    category: 'blends',
    level: 4,
    examples: ['grab', 'grass', 'green', 'grow', 'grade'],
    teachingTip: 'Blend /g/ and /r/ together smoothly.',
    description: 'GR consonant blend'
  },
  {
    id: 'blend-pr',
    name: 'PR Blend',
    category: 'blends',
    level: 4,
    examples: ['prop', 'print', 'prize', 'proud', 'press'],
    teachingTip: 'Blend /p/ and /r/ together smoothly.',
    description: 'PR consonant blend'
  },
  {
    id: 'blend-tr',
    name: 'TR Blend',
    category: 'blends',
    level: 4,
    examples: ['trip', 'track', 'tree', 'truck', 'train'],
    teachingTip: 'Blend /t/ and /r/ together smoothly.',
    description: 'TR consonant blend'
  },
  // S-blends
  {
    id: 'blend-sc',
    name: 'SC Blend',
    category: 'blends',
    level: 4,
    examples: ['scar', 'scale', 'scan', 'scare', 'scout'],
    teachingTip: 'Blend /s/ and /k/ together smoothly.',
    description: 'SC consonant blend'
  },
  {
    id: 'blend-sk',
    name: 'SK Blend',
    category: 'blends',
    level: 4,
    examples: ['skip', 'skill', 'sky', 'skin', 'skate'],
    teachingTip: 'Blend /s/ and /k/ together smoothly.',
    description: 'SK consonant blend'
  },
  {
    id: 'blend-sm',
    name: 'SM Blend',
    category: 'blends',
    level: 4,
    examples: ['small', 'smell', 'smile', 'smart', 'smoke'],
    teachingTip: 'Blend /s/ and /m/ together smoothly.',
    description: 'SM consonant blend'
  },
  {
    id: 'blend-sn',
    name: 'SN Blend',
    category: 'blends',
    level: 4,
    examples: ['snap', 'snack', 'snake', 'snow', 'snail'],
    teachingTip: 'Blend /s/ and /n/ together smoothly.',
    description: 'SN consonant blend'
  },
  {
    id: 'blend-sp',
    name: 'SP Blend',
    category: 'blends',
    level: 4,
    examples: ['spin', 'spot', 'space', 'spell', 'spoon'],
    teachingTip: 'Blend /s/ and /p/ together smoothly.',
    description: 'SP consonant blend'
  },
  {
    id: 'blend-st',
    name: 'ST Blend',
    category: 'blends',
    level: 4,
    examples: ['stop', 'step', 'star', 'stick', 'story'],
    teachingTip: 'Blend /s/ and /t/ together smoothly.',
    description: 'ST consonant blend'
  },
  {
    id: 'blend-sw',
    name: 'SW Blend',
    category: 'blends',
    level: 4,
    examples: ['swim', 'swing', 'sweet', 'swam', 'swap'],
    teachingTip: 'Blend /s/ and /w/ together smoothly.',
    description: 'SW consonant blend'
  },
  // Ending blends
  {
    id: 'blend-nd',
    name: 'ND Ending Blend',
    category: 'blends',
    level: 4,
    examples: ['band', 'sand', 'hand', 'pond', 'wind'],
    teachingTip: 'Blend /n/ and /d/ at the end of words.',
    description: 'ND ending blend'
  },
  {
    id: 'blend-nt',
    name: 'NT Ending Blend',
    category: 'blends',
    level: 4,
    examples: ['ant', 'went', 'sent', 'tent', 'mint'],
    teachingTip: 'Blend /n/ and /t/ at the end of words.',
    description: 'NT ending blend'
  },
  {
    id: 'blend-st-end',
    name: 'ST Ending Blend',
    category: 'blends',
    level: 4,
    examples: ['fast', 'last', 'best', 'rest', 'list'],
    teachingTip: 'Blend /s/ and /t/ at the end of words.',
    description: 'ST ending blend'
  },
  {
    id: 'blend-lt',
    name: 'LT Ending Blend',
    category: 'blends',
    level: 4,
    examples: ['melt', 'felt', 'belt', 'tilt', 'salt'],
    teachingTip: 'Blend /l/ and /t/ at the end of words.',
    description: 'LT ending blend'
  },
  {
    id: 'blend-mp',
    name: 'MP Ending Blend',
    category: 'blends',
    level: 4,
    examples: ['jump', 'camp', 'lamp', 'bump', 'pump'],
    teachingTip: 'Blend /m/ and /p/ at the end of words.',
    description: 'MP ending blend'
  },

  // ============================================
  // LEVEL 5: LONG VOWEL PATTERNS (12 patterns)
  // ============================================
  {
    id: 'long-a-cvce',
    name: 'Long A (CVCe)',
    category: 'long-vowels',
    level: 5,
    examples: ['cake', 'make', 'lake', 'tape', 'game', 'name'],
    teachingTip: 'Silent E makes the vowel say its name: A says "ay".',
    description: 'Long A with magic E pattern'
  },
  {
    id: 'long-i-cvce',
    name: 'Long I (CVCe)',
    category: 'long-vowels',
    level: 5,
    examples: ['bike', 'like', 'hide', 'time', 'five', 'kite'],
    teachingTip: 'Silent E makes I say its name: "eye".',
    description: 'Long I with magic E pattern'
  },
  {
    id: 'long-o-cvce',
    name: 'Long O (CVCe)',
    category: 'long-vowels',
    level: 5,
    examples: ['hope', 'rope', 'home', 'bone', 'rose', 'note'],
    teachingTip: 'Silent E makes O say its name: "oh".',
    description: 'Long O with magic E pattern'
  },
  {
    id: 'long-u-cvce',
    name: 'Long U (CVCe)',
    category: 'long-vowels',
    level: 5,
    examples: ['cube', 'tube', 'cute', 'huge', 'use', 'mule'],
    teachingTip: 'Silent E makes U say its name: "you".',
    description: 'Long U with magic E pattern'
  },
  {
    id: 'long-ai',
    name: 'AI Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['rain', 'wait', 'tail', 'train', 'mail', 'paint'],
    teachingTip: 'AI says long A. When two vowels go walking, the first one does the talking.',
    description: 'AI vowel team makes long A sound'
  },
  {
    id: 'long-ay',
    name: 'AY Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['play', 'day', 'may', 'say', 'stay', 'gray'],
    teachingTip: 'AY says long A, usually at the end of words.',
    description: 'AY vowel team makes long A sound'
  },
  {
    id: 'long-ea',
    name: 'EA Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['each', 'read', 'teach', 'beach', 'team', 'clean'],
    teachingTip: 'EA usually says long E.',
    description: 'EA vowel team makes long E sound'
  },
  {
    id: 'long-ee',
    name: 'EE Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['see', 'tree', 'need', 'feet', 'keep', 'sleep'],
    teachingTip: 'EE says long E.',
    description: 'EE vowel team makes long E sound'
  },
  {
    id: 'long-oa',
    name: 'OA Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['boat', 'road', 'coat', 'soap', 'toast', 'goal'],
    teachingTip: 'OA says long O.',
    description: 'OA vowel team makes long O sound'
  },
  {
    id: 'long-ow',
    name: 'OW Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['show', 'grow', 'snow', 'low', 'blow', 'throw'],
    teachingTip: 'OW can say long O.',
    description: 'OW vowel team makes long O sound'
  },
  {
    id: 'long-igh',
    name: 'IGH Pattern',
    category: 'long-vowels',
    level: 5,
    examples: ['high', 'night', 'light', 'right', 'fight', 'bright'],
    teachingTip: 'IGH makes long I sound. GH is silent.',
    description: 'IGH pattern makes long I sound'
  },
  {
    id: 'long-ie',
    name: 'IE Vowel Team',
    category: 'long-vowels',
    level: 5,
    examples: ['pie', 'tie', 'lie', 'cried', 'dried', 'tried'],
    teachingTip: 'IE can say long I or long E.',
    description: 'IE vowel team makes long I sound'
  },

  // ============================================
  // LEVEL 6: R-CONTROLLED VOWELS (5 patterns)
  // ============================================
  {
    id: 'r-controlled-ar',
    name: 'AR (Bossy R)',
    category: 'r-controlled',
    level: 6,
    examples: ['car', 'far', 'star', 'park', 'barn', 'card'],
    teachingTip: 'R controls the A. AR says /ar/ as in "car".',
    description: 'AR makes the sound in "car"'
  },
  {
    id: 'r-controlled-er',
    name: 'ER (Bossy R)',
    category: 'r-controlled',
    level: 6,
    examples: ['her', 'fern', 'clerk', 'verb', 'teacher', 'runner'],
    teachingTip: 'ER says /er/ as in "her".',
    description: 'ER makes the sound in "her"'
  },
  {
    id: 'r-controlled-ir',
    name: 'IR (Bossy R)',
    category: 'r-controlled',
    level: 6,
    examples: ['bird', 'girl', 'first', 'shirt', 'stir', 'third'],
    teachingTip: 'IR says /er/ - same sound as ER!',
    description: 'IR makes the sound in "bird"'
  },
  {
    id: 'r-controlled-or',
    name: 'OR (Bossy R)',
    category: 'r-controlled',
    level: 6,
    examples: ['for', 'corn', 'horn', 'short', 'storm', 'horse'],
    teachingTip: 'OR says /or/ as in "for".',
    description: 'OR makes the sound in "for"'
  },
  {
    id: 'r-controlled-ur',
    name: 'UR (Bossy R)',
    category: 'r-controlled',
    level: 6,
    examples: ['fur', 'burn', 'turn', 'hurt', 'nurse', 'church'],
    teachingTip: 'UR says /er/ - same sound as ER and IR!',
    description: 'UR makes the sound in "fur"'
  },

  // ============================================
  // LEVEL 7: DIPHTHONGS (6 patterns)
  // ============================================
  {
    id: 'diphthong-oi',
    name: 'OI Diphthong',
    category: 'diphthongs',
    level: 7,
    examples: ['coin', 'oil', 'join', 'boil', 'point', 'noise'],
    teachingTip: 'OI says /oy/ as in "coin".',
    description: 'OI diphthong - two vowel sounds glide together'
  },
  {
    id: 'diphthong-oy',
    name: 'OY Diphthong',
    category: 'diphthongs',
    level: 7,
    examples: ['boy', 'toy', 'joy', 'enjoy', 'royal', 'loyal'],
    teachingTip: 'OY says /oy/, usually at the end of words.',
    description: 'OY diphthong - usually at word endings'
  },
  {
    id: 'diphthong-ou',
    name: 'OU Diphthong',
    category: 'diphthongs',
    level: 7,
    examples: ['out', 'loud', 'house', 'mouse', 'about', 'shout'],
    teachingTip: 'OU says /ow/ as in "out".',
    description: 'OU diphthong makes /ow/ sound'
  },
  {
    id: 'diphthong-ow',
    name: 'OW Diphthong',
    category: 'diphthongs',
    level: 7,
    examples: ['now', 'cow', 'how', 'down', 'town', 'brown'],
    teachingTip: 'OW can also say /ow/ as in "cow".',
    description: 'OW diphthong makes /ow/ sound'
  },
  {
    id: 'diphthong-au',
    name: 'AU Diphthong',
    category: 'diphthongs',
    level: 7,
    examples: ['cause', 'auto', 'pause', 'fault', 'launch'],
    teachingTip: 'AU says /aw/ as in "cause".',
    description: 'AU diphthong makes /aw/ sound'
  },
  {
    id: 'diphthong-aw',
    name: 'AW Diphthong',
    category: 'diphthongs',
    level: 7,
    examples: ['law', 'saw', 'paw', 'draw', 'crawl', 'hawk'],
    teachingTip: 'AW says /aw/ as in "saw".',
    description: 'AW diphthong makes /aw/ sound'
  },

  // ============================================
  // LEVEL 8: ADVANCED PATTERNS (8 patterns)
  // ============================================
  {
    id: 'advanced-silent-k',
    name: 'Silent K',
    category: 'advanced',
    level: 8,
    examples: ['knight', 'knife', 'knee', 'know', 'knock', 'knot'],
    teachingTip: 'K is silent when followed by N at the start of words.',
    description: 'Silent K in KN words'
  },
  {
    id: 'advanced-silent-w',
    name: 'Silent W',
    category: 'advanced',
    level: 8,
    examples: ['write', 'wrong', 'wrap', 'wrist', 'wreck', 'wrinkle'],
    teachingTip: 'W is silent when followed by R at the start of words.',
    description: 'Silent W in WR words'
  },
  {
    id: 'advanced-silent-b',
    name: 'Silent B',
    category: 'advanced',
    level: 8,
    examples: ['lamb', 'climb', 'thumb', 'comb', 'crumb', 'doubt'],
    teachingTip: 'B is often silent after M at the end of words.',
    description: 'Silent B in MB words'
  },
  {
    id: 'advanced-silent-l',
    name: 'Silent L',
    category: 'advanced',
    level: 8,
    examples: ['walk', 'talk', 'chalk', 'calm', 'half', 'would'],
    teachingTip: 'L is sometimes silent in words like "walk" and "calm".',
    description: 'Silent L in certain words'
  },
  {
    id: 'advanced-soft-c',
    name: 'Soft C',
    category: 'advanced',
    level: 8,
    examples: ['city', 'cent', 'circus', 'race', 'ice', 'dance'],
    teachingTip: 'C says /s/ before E, I, or Y.',
    description: 'Soft C sounds like S'
  },
  {
    id: 'advanced-soft-g',
    name: 'Soft G',
    category: 'advanced',
    level: 8,
    examples: ['gem', 'giant', 'giraffe', 'age', 'page', 'stage'],
    teachingTip: 'G says /j/ before E, I, or Y.',
    description: 'Soft G sounds like J'
  },
  {
    id: 'advanced-tion',
    name: 'TION Suffix',
    category: 'advanced',
    level: 8,
    examples: ['action', 'station', 'vacation', 'nation', 'motion'],
    teachingTip: 'TION says /shun/ at the end of words.',
    description: 'TION suffix makes /shun/ sound'
  },
  {
    id: 'advanced-le-ending',
    name: 'LE Ending',
    category: 'advanced',
    level: 8,
    examples: ['table', 'apple', 'little', 'purple', 'simple', 'middle'],
    teachingTip: 'LE at the end of words makes a /ul/ sound.',
    description: 'LE ending makes /ul/ sound'
  }
];

/**
 * Get all patterns for a specific level
 */
export function getPatternsByLevel(level: number): PhonicsPattern[] {
  return PHONICS_PATTERNS.filter(p => p.level === level);
}

/**
 * Get a pattern by ID
 */
export function getPatternById(id: string): PhonicsPattern | undefined {
  return PHONICS_PATTERNS.find(p => p.id === id);
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): PhonicsPattern[] {
  return PHONICS_PATTERNS.filter(p => p.category === category);
}

/**
 * Get all letter sound patterns
 */
export function getLetterSounds(): PhonicsPattern[] {
  return getPatternsByCategory('letter-sounds');
}

/**
 * Get all CVC patterns
 */
export function getCVCPatterns(): PhonicsPattern[] {
  return getPatternsByCategory('cvc');
}
