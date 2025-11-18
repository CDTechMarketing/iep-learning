import { db } from '../db';

/**
 * Agent 2: Reading Phonics Specialist
 * Vowel Teams + R-Controlled Vowels
 * Target: 35-45 hours, ~130-200 activities
 *
 * Design Principles:
 * - Multi-sensory learning (visual + audio support)
 * - Errorless learning approach (simple to complex)
 * - High-frequency words for 3rd grade level
 * - Progressive sentence building
 * - Autism/LD-friendly pacing
 */

export async function seedAgent2PhonicsUnits() {
  const units = [
    // ========== VOWEL TEAMS ==========

    // Unit 1: AI/AY Vowel Team
    {
      unit: {
        id: 'vowel-team-ai-ay-001',
        title: 'AI/AY Vowel Team — Rain, Play, Day',
        tags: ['vowel-team', 'ai', 'ay', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['rain'] },
        { lines: ['play'] },
        { lines: ['day'] },
        { lines: ['train'] },
        { lines: ['stay'] },
        { lines: ['paint'] },
        { lines: ['rain', 'the rain'] },
        { lines: ['play', 'I play'] },
        { lines: ['day', 'a sunny day'] },
        { lines: ['train', 'the train', 'the train can go'] },
        { lines: ['stay', 'I stay', 'I stay and play'] },
        { lines: ['paint', 'I paint', 'I paint in the rain'] },
        { lines: ['I play in the rain'] },
        { lines: ['The train will stay'] },
        { lines: ['I can paint on a sunny day'] }
      ]
    },

    // Unit 2: EE/EA Vowel Team
    {
      unit: {
        id: 'vowel-team-ee-ea-002',
        title: 'EE/EA Vowel Team — See, Tree, Read',
        tags: ['vowel-team', 'ee', 'ea', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['see'] },
        { lines: ['tree'] },
        { lines: ['read'] },
        { lines: ['eat'] },
        { lines: ['feel'] },
        { lines: ['seat'] },
        { lines: ['see', 'I see'] },
        { lines: ['tree', 'a tree', 'a green tree'] },
        { lines: ['read', 'I read', 'I read a book'] },
        { lines: ['eat', 'we eat', 'we eat at the seat'] },
        { lines: ['feel', 'I feel', 'I feel the tree'] },
        { lines: ['I see a green tree'] },
        { lines: ['We read and eat'] },
        { lines: ['I feel the seat'] },
        { lines: ['We can see the tree and read'] }
      ]
    },

    // Unit 3: OA/OW Vowel Team
    {
      unit: {
        id: 'vowel-team-oa-ow-003',
        title: 'OA/OW Vowel Team — Boat, Snow, Road',
        tags: ['vowel-team', 'oa', 'ow', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['boat'] },
        { lines: ['snow'] },
        { lines: ['road'] },
        { lines: ['grow'] },
        { lines: ['coat'] },
        { lines: ['show'] },
        { lines: ['boat', 'the boat'] },
        { lines: ['snow', 'white snow'] },
        { lines: ['road', 'the road', 'the long road'] },
        { lines: ['grow', 'I grow', 'I grow in the snow'] },
        { lines: ['coat', 'my coat', 'my warm coat'] },
        { lines: ['The boat is on the road'] },
        { lines: ['I show the snow'] },
        { lines: ['The coat will grow'] },
        { lines: ['We see the boat on the long road'] }
      ]
    },

    // Unit 4: OI/OY Vowel Team
    {
      unit: {
        id: 'vowel-team-oi-oy-004',
        title: 'OI/OY Vowel Team — Coin, Boy, Toy',
        tags: ['vowel-team', 'oi', 'oy', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['coin'] },
        { lines: ['boy'] },
        { lines: ['toy'] },
        { lines: ['join'] },
        { lines: ['joy'] },
        { lines: ['point'] },
        { lines: ['coin', 'the coin'] },
        { lines: ['boy', 'a boy', 'a happy boy'] },
        { lines: ['toy', 'the toy', 'the fun toy'] },
        { lines: ['join', 'we join', 'we join and play'] },
        { lines: ['joy', 'with joy'] },
        { lines: ['The boy has a coin'] },
        { lines: ['I point to the toy'] },
        { lines: ['We join with joy'] },
        { lines: ['The boy can play with the fun toy'] }
      ]
    },

    // Unit 5: AU/AW Vowel Team
    {
      unit: {
        id: 'vowel-team-au-aw-005',
        title: 'AU/AW Vowel Team — Saw, Draw, Caught',
        tags: ['vowel-team', 'au', 'aw', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['saw'] },
        { lines: ['draw'] },
        { lines: ['paw'] },
        { lines: ['caught'] },
        { lines: ['taught'] },
        { lines: ['yawn'] },
        { lines: ['saw', 'I saw'] },
        { lines: ['draw', 'I draw', 'I draw a paw'] },
        { lines: ['paw', 'the paw', 'the big paw'] },
        { lines: ['caught', 'I caught', 'I caught it'] },
        { lines: ['taught', 'she taught', 'she taught me'] },
        { lines: ['I saw the big paw'] },
        { lines: ['I draw and yawn'] },
        { lines: ['She taught me to draw'] },
        { lines: ['I saw and caught the paw'] }
      ]
    },

    // Unit 6: OO (long) Vowel Team
    {
      unit: {
        id: 'vowel-team-oo-long-006',
        title: 'OO (long) Vowel Team — Moon, Soon, Pool',
        tags: ['vowel-team', 'oo-long', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['moon'] },
        { lines: ['soon'] },
        { lines: ['pool'] },
        { lines: ['cool'] },
        { lines: ['food'] },
        { lines: ['room'] },
        { lines: ['moon', 'the moon'] },
        { lines: ['soon', 'very soon'] },
        { lines: ['pool', 'the pool', 'the cool pool'] },
        { lines: ['cool', 'so cool'] },
        { lines: ['food', 'good food', 'good food in the room'] },
        { lines: ['I see the moon'] },
        { lines: ['The pool is cool'] },
        { lines: ['Soon we eat food'] },
        { lines: ['The moon is in the room very soon'] }
      ]
    },

    // Unit 7: OO (short) Vowel Team
    {
      unit: {
        id: 'vowel-team-oo-short-007',
        title: 'OO (short) Vowel Team — Book, Look, Took',
        tags: ['vowel-team', 'oo-short', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['book'] },
        { lines: ['look'] },
        { lines: ['took'] },
        { lines: ['good'] },
        { lines: ['wood'] },
        { lines: ['stood'] },
        { lines: ['book', 'the book'] },
        { lines: ['look', 'I look', 'I look at it'] },
        { lines: ['took', 'I took', 'I took the book'] },
        { lines: ['good', 'so good'] },
        { lines: ['wood', 'the wood', 'the good wood'] },
        { lines: ['I look at the book'] },
        { lines: ['I took the good wood'] },
        { lines: ['I stood and looked'] },
        { lines: ['The book is good and I took it'] }
      ]
    },

    // Unit 8: Mixed Vowel Teams Review
    {
      unit: {
        id: 'vowel-team-mixed-008',
        title: 'Vowel Teams Review — All Teams',
        tags: ['vowel-team', 'review', 'mixed', 'agent-2'],
        goalStars: [10, 18],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['The rain will stay'] },
        { lines: ['I see a green tree'] },
        { lines: ['The boat is on the road'] },
        { lines: ['The boy has a toy'] },
        { lines: ['I saw the big paw'] },
        { lines: ['The moon is cool'] },
        { lines: ['I look at the book'] },
        { lines: ['I play in the rain and stay'] },
        { lines: ['We read and eat at the seat'] },
        { lines: ['The snow will grow on the road'] },
        { lines: ['The boy can join with joy'] },
        { lines: ['She taught me to draw'] },
        { lines: ['Soon we see the moon'] },
        { lines: ['I took the good book'] },
        { lines: ['I can see the train on the long road'] },
        { lines: ['The happy boy will play with the toy in the snow'] },
        { lines: ['I read the good book and eat food soon'] },
        { lines: ['We stay and look at the cool moon'] }
      ]
    },

    // ========== R-CONTROLLED VOWELS ==========

    // Unit 9: AR R-Controlled
    {
      unit: {
        id: 'r-control-ar-009',
        title: 'AR R-Controlled — Car, Star, Park',
        tags: ['r-controlled', 'ar', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['car'] },
        { lines: ['star'] },
        { lines: ['park'] },
        { lines: ['far'] },
        { lines: ['farm'] },
        { lines: ['start'] },
        { lines: ['car', 'the car'] },
        { lines: ['star', 'a star', 'a bright star'] },
        { lines: ['park', 'the park', 'the big park'] },
        { lines: ['far', 'so far', 'not too far'] },
        { lines: ['farm', 'the farm'] },
        { lines: ['I see the car'] },
        { lines: ['The star is far'] },
        { lines: ['We start at the park'] },
        { lines: ['The car can go to the farm'] }
      ]
    },

    // Unit 10: ER R-Controlled
    {
      unit: {
        id: 'r-control-er-010',
        title: 'ER R-Controlled — Her, Fern, Term',
        tags: ['r-controlled', 'er', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['her'] },
        { lines: ['fern'] },
        { lines: ['term'] },
        { lines: ['after'] },
        { lines: ['never'] },
        { lines: ['under'] },
        { lines: ['her', 'with her'] },
        { lines: ['fern', 'the fern', 'a green fern'] },
        { lines: ['term', 'the term'] },
        { lines: ['after', 'after me'] },
        { lines: ['never', 'never stop'] },
        { lines: ['I see her'] },
        { lines: ['The fern is green'] },
        { lines: ['After the term'] },
        { lines: ['I will never go under her'] }
      ]
    },

    // Unit 11: IR R-Controlled
    {
      unit: {
        id: 'r-control-ir-011',
        title: 'IR R-Controlled — Bird, Girl, First',
        tags: ['r-controlled', 'ir', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['bird'] },
        { lines: ['girl'] },
        { lines: ['first'] },
        { lines: ['dirt'] },
        { lines: ['shirt'] },
        { lines: ['third'] },
        { lines: ['bird', 'the bird'] },
        { lines: ['girl', 'a girl', 'a happy girl'] },
        { lines: ['first', 'the first', 'the first one'] },
        { lines: ['dirt', 'in the dirt'] },
        { lines: ['shirt', 'my shirt', 'my red shirt'] },
        { lines: ['I see the bird'] },
        { lines: ['The girl is first'] },
        { lines: ['My shirt has dirt'] },
        { lines: ['The bird is the first in the dirt'] }
      ]
    },

    // Unit 12: OR R-Controlled
    {
      unit: {
        id: 'r-control-or-012',
        title: 'OR R-Controlled — For, Store, Horn',
        tags: ['r-controlled', 'or', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['for'] },
        { lines: ['store'] },
        { lines: ['horn'] },
        { lines: ['more'] },
        { lines: ['sport'] },
        { lines: ['short'] },
        { lines: ['for', 'for me'] },
        { lines: ['store', 'the store', 'the big store'] },
        { lines: ['horn', 'the horn'] },
        { lines: ['more', 'I want more'] },
        { lines: ['sport', 'a sport', 'a fun sport'] },
        { lines: ['This is for me'] },
        { lines: ['I go to the store'] },
        { lines: ['The horn is short'] },
        { lines: ['I want more of the fun sport'] }
      ]
    },

    // Unit 13: UR R-Controlled
    {
      unit: {
        id: 'r-control-ur-013',
        title: 'UR R-Controlled — Fur, Turn, Burn',
        tags: ['r-controlled', 'ur', 'agent-2'],
        goalStars: [8, 15],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['fur'] },
        { lines: ['turn'] },
        { lines: ['burn'] },
        { lines: ['hurt'] },
        { lines: ['purple'] },
        { lines: ['nurse'] },
        { lines: ['fur', 'soft fur'] },
        { lines: ['turn', 'I turn', 'I turn around'] },
        { lines: ['burn', 'it can burn'] },
        { lines: ['hurt', 'do not hurt'] },
        { lines: ['purple', 'a purple', 'a purple shirt'] },
        { lines: ['The fur is soft'] },
        { lines: ['I turn and burn'] },
        { lines: ['The nurse has purple'] },
        { lines: ['Do not hurt the soft fur'] }
      ]
    },

    // Unit 14: R-Controlled Mixed Review
    {
      unit: {
        id: 'r-control-mixed-014',
        title: 'R-Controlled Review — All R-Vowels',
        tags: ['r-controlled', 'review', 'mixed', 'agent-2'],
        goalStars: [10, 18],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['The car is at the park'] },
        { lines: ['I see her with the fern'] },
        { lines: ['The bird is first'] },
        { lines: ['I go to the store for more'] },
        { lines: ['The fur is purple'] },
        { lines: ['The star is far from the farm'] },
        { lines: ['After the term, never stop'] },
        { lines: ['The girl has a red shirt'] },
        { lines: ['The horn is for the sport'] },
        { lines: ['I turn and do not hurt'] },
        { lines: ['The car can start and go far to the park'] },
        { lines: ['I see her after the term with the green fern'] },
        { lines: ['The first bird is in the dirt'] },
        { lines: ['I want more from the big store'] },
        { lines: ['The nurse has a purple shirt with soft fur'] },
        { lines: ['The happy girl will turn and start the fun sport'] },
        { lines: ['The bright star is far from the farm and park'] },
        { lines: ['I will never hurt the bird with the red shirt'] }
      ]
    },

    // Unit 15: Complete Phonics Integration
    {
      unit: {
        id: 'phonics-integration-015',
        title: 'Complete Phonics — Vowel Teams + R-Controlled',
        tags: ['vowel-team', 'r-controlled', 'integration', 'agent-2'],
        goalStars: [12, 20],
        createdAt: new Date()
      },
      phrases: [
        { lines: ['I see the bird in the rain'] },
        { lines: ['The boy can play at the park'] },
        { lines: ['I read the book in the car'] },
        { lines: ['The girl has a toy boat'] },
        { lines: ['I saw the moon from the store'] },
        { lines: ['The train will stay at the farm'] },
        { lines: ['I look at the star and feel joy'] },
        { lines: ['The bird can eat food near the tree'] },
        { lines: ['The boy will draw in the dirt at the park'] },
        { lines: ['I caught the coin and took it to her'] },
        { lines: ['The purple bird will turn in the snow'] },
        { lines: ['Soon the girl can read the good book'] },
        { lines: ['I play the sport for fun in the cool rain'] },
        { lines: ['The car will go far on the long road to the store'] },
        { lines: ['After the rain, I saw the bright star in the sky'] },
        { lines: ['The happy boy and girl will join and play with the toy'] },
        { lines: ['I can see the green fern and the bird near the pool'] },
        { lines: ['The nurse taught me to read the book with the purple cover'] },
        { lines: ['I will never hurt the bird with soft fur in the park'] },
        { lines: ['Soon we can eat good food and look at the moon together'] }
      ]
    }
  ];

  // Add all units and their phrases to the database
  for (const unitData of units) {
    await db.units.add(unitData.unit);

    const phrasesWithIds = unitData.phrases.map((phrase, index) => ({
      id: `${unitData.unit.id}-phrase-${index + 1}`,
      unitId: unitData.unit.id,
      lines: phrase.lines
    }));

    await db.phrases.bulkAdd(phrasesWithIds);
  }

  console.log('✅ Agent 2 Phonics units seeded successfully!');
  console.log(`   - ${units.length} units created`);
  console.log(`   - ${units.reduce((sum, u) => sum + u.phrases.length, 0)} total activities`);
}
