// Words up to 12 letters are allowed. The supplemental bank tops out at 10
// letters; a handful of the hand-curated words below run up to 12.
const MAX_WORD_LENGTH = 12;

const PROPER_NOUN_CLUE_PATTERNS = [
  /\b(?:United States|U\.S\.|American|English|British|French|German|Italian|Spanish|Russian|Chinese|Japanese|Indian|Irish|Scottish|Welsh|Dutch|Greek|Roman|Belgian|Canadian|Australian|African|European|Asian|Louisianian|Acadian|Cajun|Flemish)\b/i,
  /\b(?:composer|filmmaker|writer|novelist|poet|artist|painter|sculptor|philosopher|statesman|president|emperor|king|queen|prince|princess|saint|biblical|mythology|mythological|deity|god|goddess)\b/i,
  /\b(?:country|county|city|town|province|state|capital|island|river|mountain|language|dialect|religion|church|sect|tribe|empire|dynasty)\b/i,
  /\b(?:genus|family|order|species)\s+[A-Z][a-z]+/,
  /\([a-z]*\s*\d{3,4}(?:-\d{0,4})?\)/i,
  /\b(?:Allah|Bible|England|Scotland|Wales|Ireland|France|Germany|Italy|Spain|Russia|China|Japan|India|Belgium|Canada|Australia|Africa|Europe|Asia|Mars|Venus|Jupiter|Saturn)\b/i,
];

function isAllowedWordEntry(entry, maxLen = MAX_WORD_LENGTH) {
  if (!entry || typeof entry.word !== 'string' || typeof entry.clue !== 'string') return false;
  if (entry.word.length > maxLen) return false;
  if (!/^[A-Z]+$/.test(entry.word)) return false;
  if (/\b[A-Z][a-z]{2,}\b/.test(entry.clue.replace(/^[A-Z][a-z]+\b/, ''))) return false;
  return !PROPER_NOUN_CLUE_PATTERNS.some(pattern => pattern.test(entry.clue));
}

// Hand-picked seed words, folded into the difficulty-sorted candidate pool
// below alongside the supplemental bank. Kept here (rather than generated)
// because their clues are better-written than frequency-derived ones.
const POOL_5_6 = [
  ['WATER', 'H2O in liquid form'], ['HOUSE', 'Place where you live'], ['MUSIC', 'Art of organized sound'],
  ['BREAD', 'Baked staple food'], ['CLOUD', 'Fluffy shape in the sky'], ['RIVER', 'Flowing body of fresh water'],
  ['STONE', 'Small piece of rock'], ['TIGER', 'Striped big cat'], ['CANDLE', 'Wax stick with a wick'],
  ['FOREST', 'Large area covered in trees'], ['DESERT', 'Dry sandy region'], ['ISLAND', 'Land surrounded by water'],
  ['WINTER', 'Coldest season of the year'], ['SPIDER', 'Eight-legged web spinner'], ['CASTLE', 'Fortified medieval home'],
  ['PENCIL', 'Writing tool with graphite'], ['BOTTLE', 'Container for liquid'], ['FLOWER', 'Blooming part of a plant'],
  ['RABBIT', 'Long-eared hopping mammal'], ['SILVER', 'Shiny grey precious metal'], ['GOLDEN', 'Color of gold'],
  ['ANIMAL', 'Living creature, not a plant'], ['FAMILY', 'Group of related people'], ['TURTLE', 'Slow reptile with a shell'],
  ['DRAGON', 'Mythical fire-breathing beast'], ['PIRATE', 'Seafaring outlaw'], ['WIZARD', 'Magic-wielding sorcerer'],
];

const POOL_7 = [
  ['THUNDER', 'Loud sound after lightning'], ['RAINBOW', 'Colorful arc after rain'], ['FREEDOM', 'State of being free'],
  ['CAPTAIN', 'Leader of a ship or team'], ['VILLAGE', 'Small rural community'], ['HARVEST', 'Gathering of ripe crops'],
  ['AIRPORT', 'Place where planes take off'], ['BALLOON', 'Inflatable rubber toy'], ['CHICKEN', 'Common farmyard bird'],
  ['COMPASS', 'Tool that points north'], ['DIAMOND', 'Hardest natural gemstone'], ['PICTURE', 'Visual image or photo'],
  ['KITCHEN', 'Room for cooking'], ['LIBRARY', 'Place full of books'], ['MONSTER', 'Scary fictional creature'],
  ['PAINTER', 'Artist who works with a brush'], ['PENGUIN', 'Flightless Antarctic bird'], ['RAILWAY', 'Track for trains'],
  ['TORNADO', 'Violent spinning windstorm'], ['TRAFFIC', 'Vehicles moving on roads'], ['VAMPIRE', 'Blood-drinking mythical creature'],
  ['WARRIOR', 'Skilled fighter in battle'], ['FISHING', 'Sport of catching fish'], ['HOLIDAY', 'Day of celebration or rest'],
  ['JOURNAL', 'Personal daily record'], ['LEOPARD', 'Spotted big cat'], ['NETWORK', 'Connected system of things'],
  ['PACKAGE', 'Wrapped parcel'], ['QUALITY', 'Standard of excellence'], ['SEASIDE', 'Coastal area by the sea'],
  ['STADIUM', 'Large sports venue'], ['TEACHER', 'Person who instructs students'], ['TEXTURE', 'How something feels to touch'],
  ['UNICORN', 'Mythical horned horse'], ['WEATHER', 'Daily state of the atmosphere'], ['AMAZING', 'Causing great surprise'],
];

const POOL_8_9 = [
  ['DAUGHTER', 'Female child'], ['SANDWICH', 'Food between two bread slices'], ['UMBRELLA', 'Protects you from rain'],
  ['VACATION', 'Trip away from work'], ['WATERFALL', 'Cascading stream over a cliff'], ['AIRPLANE', 'Flying passenger vehicle'],
  ['BACKPACK', 'Bag carried on the shoulders'], ['BASEBALL', 'Bat-and-ball American sport'], ['BUILDING', 'Structure with walls and a roof'],
  ['CAMPFIRE', 'Outdoor fire for warmth or cooking'], ['DINOSAUR', 'Extinct prehistoric reptile'], ['DOORBELL', 'Rings when pressed at the entrance'],
  ['EARRINGS', 'Jewelry worn on the ears'], ['FOOTBALL', 'Sport played with a round ball'], ['HAMBURGER', 'Beef patty in a bun'],
  ['HURRICANE', 'Powerful tropical storm'], ['LANDSCAPE', 'Scenic view of natural land'], ['MOONLIGHT', 'Glow from the moon at night'],
  ['NOTEBOOK', 'Book for writing notes'], ['OVERCOAT', 'Long warm outer garment'], ['PAINTING', 'Artwork made with paint'],
  ['PASSPORT', 'Document for international travel'], ['SNOWFLAKE', 'Unique ice crystal that falls in winter'], ['SUNSHINE', 'Light and warmth from the sun'],
  ['SUITCASE', 'Case for packing travel clothes'], ['TELESCOPE', 'Instrument for viewing distant stars'], ['TREASURE', 'Valuable hidden hoard'],
  ['TRIANGLE', 'Three-sided shape'], ['TROMBONE', 'Slide brass instrument'], ['WARDROBE', 'Cabinet for storing clothes'],
  ['WHIRLWIND', 'Rapidly rotating column of air'], ['XYLOPHONE', 'Percussion instrument with wooden bars'], ['YOUNGSTER', 'A young person'],
  ['ARMCHAIR', 'Cushioned chair with armrests'], ['BIRTHDAY', "Annual anniversary of one's birth"], ['BLACKOUT', 'Total loss of electric power'],
  ['BOOKCASE', 'Shelving unit for books'], ['BOOKWORM', 'Someone who loves reading'], ['BROADCAST', 'Transmit a program to an audience'],
  ['CHAMPION', 'Winner of a contest'], ['CHEMISTRY', 'Science of matter and reactions'], ['CLASSICAL', 'Style associated with ancient tradition'],
  ['COMPUTER', 'Electronic device for processing data'], ['DELICIOUS', 'Very tasty'], ['DIRECTOR', 'Person who oversees a film or show'],
];

const POOL_9_11 = [
  ['ABSOLUTELY', 'Completely, without doubt'], ['ACCOUNTANT', 'Person who manages financial records'], ['AMBULANCE', 'Emergency medical vehicle'],
  ['ASTRONAUT', 'Space traveler'], ['BASKETBALL', 'Hoop sport played with a ball'], ['BEAUTIFUL', 'Very pleasing to look at'],
  ['BLUEPRINT', 'Detailed technical plan'], ['CATERPILLAR', 'Larva that becomes a butterfly'], ['CROCODILE', 'Large toothy river reptile'],
  ['DEMOCRACY', 'Government by the people'], ['DICTIONARY', 'Book of word meanings'], ['DISCOVERY', 'Act of finding something new'],
  ['EARTHQUAKE', 'Sudden shaking of the ground'], ['EDUCATION', 'Process of teaching and learning'], ['ELECTRICITY', 'Power that flows through wires'],
  ['EMERGENCY', 'Sudden serious situation'], ['EXCELLENT', 'Extremely good'], ['EXPERIMENT', 'Scientific test to discover something'],
  ['FASCINATED', 'Very interested'], ['FIREFIGHTER', 'Person who puts out fires'], ['FRIENDSHIP', 'Bond between friends'],
  ['FURNITURE', 'Movable items in a room'], ['GRATITUDE', 'Feeling of thankfulness'], ['GYMNASTICS', 'Sport of acrobatic exercises'],
  ['HELICOPTER', 'Aircraft with spinning rotor blades'], ['IMPORTANT', 'Of great significance'], ['INCREDIBLE', 'Hard to believe, amazing'],
  ['INTERVIEW', 'Formal meeting to ask questions'], ['INVENTION', 'Newly created device or idea'], ['JOURNALIST', 'Person who writes the news'],
  ['KILOMETER', 'Unit of distance, 1000 meters'], ['LABORATORY', 'Room for scientific experiments'], ['LEADERSHIP', 'Ability to guide others'],
  ['LIGHTHOUSE', 'Tower that guides ships at night'], ['MAGNIFICENT', 'Extremely beautiful or elaborate'], ['MECHANICAL', 'Relating to machines'],
  ['MICROPHONE', 'Device that captures sound'], ['MICROSCOPE', 'Instrument for viewing tiny things'], ['MOTORCYCLE', 'Two-wheeled motor vehicle'],
  ['MYSTERIOUS', 'Difficult to understand or explain'], ['NECESSARY', 'Required, needed'], ['NEIGHBOUR', 'Person who lives next door'],
  ['NUTRITIOUS', 'Rich in nourishment'], ['OBSERVATORY', 'Building for watching the stars'], ['ORCHESTRA', 'Large group of musicians'],
  ['PARLIAMENT', "Body that makes a country's laws"], ['PASSENGER', 'Person riding in a vehicle'], ['PERSONALITY', 'Set of traits that define someone'],
  ['POPULATION', 'Number of people in a place'], ['PRINCIPAL', 'Head of a school'], ['RESTAURANT', 'Place where meals are served'],
  ['SATELLITE', 'Object that orbits a planet'], ['SCIENTIST', 'Person who studies science'], ['SKYSCRAPER', 'Very tall city building'],
];

const POOL_10_12 = [
  ['ACCESSIBLE', 'Easy to reach or use'], ['AFFORDABLE', 'Reasonably priced'], ['ANNIVERSARY', 'Yearly recurring date of an event'],
  ['APPRECIATE', 'To value or be grateful for'], ['ASSOCIATION', 'Group formed for a common purpose'], ['ATTRACTIVE', 'Pleasing in appearance'],
  ['BIODIVERSITY', 'Variety of life in an ecosystem'], ['CALCULATION', 'Process of computing a result'], ['CERTIFICATE', 'Document proving an achievement'],
  ['CHALLENGING', "Difficult, testing one's ability"], ['COLLABORATE', 'To work together on something'], ['COMFORTABLE', 'Providing physical ease'],
  ['COMPETITION', 'Contest between rivals'], ['COMPLICATED', 'Not simple, hard to understand'], ['CONFIDENTIAL', 'Meant to be kept secret'],
  ['CONSTRUCTION', 'Process of building something'], ['CONTINUOUS', 'Happening without a break'], ['COORDINATOR', 'Person who organizes an activity'],
  ['CREATIVITY', 'Ability to produce original ideas'], ['DECLARATION', 'Formal public statement'], ['DEMONSTRATE', 'To clearly show something'],
  ['DEPARTMENT', 'Division within an organization'], ['DESTINATION', 'Place someone is traveling to'], ['DEVELOPMENT', 'Process of growing or improving'],
  ['DIFFICULTY', 'State of being hard to do'], ['DISAPPOINTED', "Sad because expectations weren't met"], ['DISTRIBUTION', 'Act of spreading things out'],
  ['EDUCATIONAL', 'Relating to teaching or learning'], ['ENGINEERING', 'Application of science to design things'], ['ENTHUSIASTIC', 'Full of eager enjoyment'],
  ['EXAGGERATION', 'Overstatement of the truth'], ['EXPLANATION', 'Statement that makes something clear'], ['FASCINATING', 'Extremely interesting'],
  ['FOUNDATION', 'Base that supports a structure'], ['GOVERNMENT', 'System that governs a country'], ['GRADUATION', 'Ceremony marking course completion'],
  ['HANDWRITING', 'Personal style of writing by hand'], ['ILLUSTRATION', 'Picture that explains something'], ['IMAGINATIVE', 'Having a creative imagination'],
  ['IMPRESSIVE', 'Evoking admiration'], ['INFORMATION', 'Facts provided or learned'], ['INSTALLATION', 'Act of setting something up'],
  ['INTELLIGENT', 'Having great mental capacity'], ['INTERACTION', 'Communication between people'], ['INTERESTING', "Holding one's attention"],
  ['INTRODUCTION', 'Opening section of something'], ['INVESTIGATE', 'To carefully examine facts'], ['INVITATION', 'Request to attend an event'],
  ['MAINTENANCE', 'Upkeep of something in good condition'], ['MANAGEMENT', 'Act of running an organization'], ['MARSHMALLOW', 'Soft sweet campfire treat'],
  ['MASTERPIECE', "An artist's greatest work"], ['NEGOTIATION', 'Discussion aimed at reaching agreement'], ['OBSERVATION', 'Act of watching closely'],
  ['ORGANIZATION', 'Structured group with a purpose'], ['PARTICIPANT', 'Person taking part in something'],
];

// The original 6 hand-authored "anchor" stages' words, now folded into the
// general candidate pool below rather than pinned to fixed stage slots.
const ANCHOR_PAIRS = [
  ['OCEAN', 'Vast saltwater body'], ['GARDEN', 'Where flowers bloom'], ['PLANET', 'Earth is one'],
  ['WHISPER', 'Speak very softly'], ['JOURNEY', 'A long trip'], ['MYSTERY', 'Unsolved puzzle'], ['BALANCE', 'Steady equilibrium'],
  ['SYMPHONY', 'Orchestral piece'], ['ADVENTURE', 'Exciting undertaking'], ['CROSSWORD', 'A grid puzzle like this one'], ['ELEPHANT', 'Large trunked mammal'], ['CHOCOLATE', 'Sweet treat from cacao'],
  ['KEYBOARD', 'Typing device'], ['KANGAROO', 'Hopping Australian marsupial'], ['MOUNTAIN', 'Large natural elevation'], ['BUTTERFLY', 'Insect with colorful wings'], ['KNOWLEDGE', 'Information and understanding'], ['KINDNESS', 'Quality of being generous'],
  ['FANTASTIC', 'Extremely good'], ['INSTRUMENT', 'Tool for making music'], ['TELEVISION', 'Screen device for broadcasts'], ['UNIVERSITY', 'Higher education institution'], ['GENERATION', 'People born around the same time'], ['IMAGINATION', 'Ability to form mental images'], ['CELEBRATION', 'Festive event marking an occasion'], ['HOSPITALITY', 'Friendly treatment of guests'],
  ['ATMOSPHERE', 'Layer of gases around a planet'], ['PHOTOGRAPHY', 'Art of capturing images with light'], ['ENVIRONMENT', 'Natural surroundings'], ['OPPORTUNITY', 'Favorable chance'], ['INSPIRATION', 'Stimulus for creative ideas'], ['CONVERSATION', 'Talk between people'], ['ARCHITECTURE', 'Art of designing buildings'], ['INDEPENDENCE', 'Freedom from control'], ['ENTREPRENEUR', 'Business founder who takes risks'], ['CIVILIZATION', 'Complex organized society'],
];

// --- Word difficulty model ---
// A word's difficulty is a blend of five signals, not just its length:
//   1. Commonality (40%): frequency-derived score from the supplemental bank.
//      Rearranging letters into a word you rarely see is much harder than
//      into one you read every day.
//   2. Anagram density (20%): more distinct permutations means a larger
//      search space; repeated letters make that space smaller.
//   3. Pattern familiarity (15%): common chunks, prefixes, and suffixes give
//      players handles to grab onto.
//   4. Letter rarity (15%): words built from uncommon letters feel less
//      familiar and offer fewer recognizable patterns.
//   5. Length (10%): more tiles still matters, but it is not the whole model.

const FREQ_DIFFICULTY = new Map(
  (typeof SUPPLEMENTAL_WORDS === 'undefined' ? [] : SUPPLEMENTAL_WORDS)
    .map(entry => [entry.word, entry.difficulty])
);

const LETTER_RARITY = {
  E: 1, A: 3, R: 5, I: 5, O: 6, T: 6, N: 7, S: 8, L: 10, C: 14,
  U: 12, D: 13, P: 16, M: 15, H: 15, G: 19, B: 20, F: 20, Y: 22,
  W: 24, K: 28, V: 33, X: 60, Z: 70, J: 65, Q: 75,
};

const COMMON_CHUNKS = [
  'ING', 'TION', 'SION', 'MENT', 'NESS', 'LESS', 'ABLE', 'IBLE', 'ALLY',
  'ER', 'OR', 'ED', 'LY', 'AR', 'AL', 'EN', 'EL', 'LE', 'ST', 'TH', 'SH',
  'CH', 'PH', 'WH', 'QU', 'CK', 'OO', 'EE', 'EA', 'AI', 'OA', 'OU', 'IE',
  'IGH', 'IGHT', 'OUND', 'OUGH', 'ANT', 'ENT', 'IVE', 'OUS', 'FUL',
];

const COMMON_PREFIXES = [
  'RE', 'UN', 'IN', 'IM', 'DIS', 'MIS', 'PRE', 'PRO', 'CON', 'COM', 'TRANS',
];

const COMMON_SUFFIXES = [
  'ING', 'ED', 'ER', 'EST', 'LY', 'TION', 'SION', 'MENT', 'NESS', 'LESS',
  'ABLE', 'IBLE', 'FUL', 'OUS', 'IVE', 'AL',
];

const LOG_FACTORIAL = [0];
for (let i = 1; i <= MAX_WORD_LENGTH; i++) {
  LOG_FACTORIAL[i] = LOG_FACTORIAL[i - 1] + Math.log(i);
}

function clamp01to100(n) {
  return Math.max(1, Math.min(100, Math.round(n)));
}

function clampScore(n) {
  return Math.max(0, Math.min(100, n));
}

function anagramDensityScore(word) {
  const counts = {};
  for (const ch of word) counts[ch] = (counts[ch] || 0) + 1;

  let logPermutations = LOG_FACTORIAL[word.length] || 0;
  Object.values(counts).forEach(count => {
    logPermutations -= LOG_FACTORIAL[count] || 0;
  });

  const maxLogPermutations = LOG_FACTORIAL[MAX_WORD_LENGTH] || 1;
  return clampScore((logPermutations / maxLogPermutations) * 100);
}

function patternFamiliarityDifficulty(word) {
  const covered = new Array(word.length).fill(false);

  COMMON_CHUNKS.forEach(chunk => {
    let index = word.indexOf(chunk);
    while (index !== -1) {
      for (let i = index; i < index + chunk.length; i++) covered[i] = true;
      index = word.indexOf(chunk, index + 1);
    }
  });

  const coverage = covered.filter(Boolean).length / word.length;
  const prefixBonus = COMMON_PREFIXES.some(prefix => word.startsWith(prefix)) ? 0.15 : 0;
  const suffixBonus = COMMON_SUFFIXES.some(suffix => word.endsWith(suffix)) ? 0.15 : 0;
  const familiarity = clampScore((coverage + prefixBonus + suffixBonus) * 100);

  return 100 - familiarity;
}

function computeWordDifficulty(word) {
  // Commonality: real frequency data when we have it. The only words missing
  // from the frequency bank are the hand-curated stage words, which were
  // picked precisely because they're everyday-familiar — so the fallback
  // treats them as fairly common, nudged up slightly by length.
  const freq = FREQ_DIFFICULTY.has(word) ? FREQ_DIFFICULTY.get(word) : Math.min(60, 20 + (word.length - 5) * 4);

  const lengthScore = clampScore((word.length - 5) * 20);
  const densityScore = anagramDensityScore(word);
  const patternScore = patternFamiliarityDifficulty(word);

  const avgRarity = word.split('').reduce((sum, ch) => sum + (LETTER_RARITY[ch] || 20), 0) / word.length;
  const rarityScore = clampScore(avgRarity * 2.2);

  return clamp01to100(
    0.4 * freq +
    0.2 * densityScore +
    0.15 * patternScore +
    0.15 * rarityScore +
    0.1 * lengthScore
  );
}

// --- Stage progression ---
// 200 stages, grouped into 5 "arcs" of 40 stages each. Every arc has its own
// naming theme (adjective x noun combinations, ending in a themed "Finale"
// stage) and a fixed level count that only ever climbs arc-to-arc, so the
// player is never handed a shorter stage than the one before it.
const STAGE_ARCS = [
  { title: 'Rookie', adjectives: ['First', 'Easy', 'Simple', 'Quick', 'Basic', 'Gentle', 'Fresh', 'Bright'], nouns: ['Steps', 'Trail', 'Words', 'Round', 'Path'] },
  { title: 'Speed', adjectives: ['Swift', 'Rapid', 'Speedy', 'Nimble', 'Brisk', 'Zippy', 'Snappy', 'Agile'], nouns: ['Runner', 'Sprint', 'Dash', 'Chase', 'Rally'] },
  { title: 'Word', adjectives: ['Clever', 'Crafty', 'Sharp', 'Witty', 'Skilled', 'Deft', 'Keen', 'Astute'], nouns: ['Wordsmith', 'Lexicon', 'Wordplay', 'Vocabulary', 'Language'] },
  { title: 'Puzzle', adjectives: ['Bold', 'Tricky', 'Puzzling', 'Complex', 'Cerebral', 'Intense', 'Fierce', 'Daring'], nouns: ['Challenge', 'Riddle', 'Enigma', 'Trial', 'Gauntlet'] },
  { title: 'Grandmaster', adjectives: ['Elite', 'Master', 'Expert', 'Legendary', 'Supreme', 'Ultimate', 'Peerless', 'Storied'], nouns: ['League', 'Summit', 'Pinnacle', 'Vanguard', 'Champion'] },
];

const STAGES_PER_ARC = 40;

function levelsForArc(arcIndex) {
  return 5 + arcIndex; // 5, 6, 7, 8, 9 across the 5 arcs
}

function buildArcStageNames(arc) {
  const names = [];
  arc.adjectives.forEach(adjective => {
    arc.nouns.forEach(noun => names.push(`${adjective} ${noun}`));
  });
  names[names.length - 1] = `${arc.title} Finale`;
  return names;
}

function buildCandidatePool() {
  const seen = new Set();
  const candidates = [];
  [POOL_5_6, POOL_7, POOL_8_9, POOL_9_11, POOL_10_12, ANCHOR_PAIRS].forEach(pairs => {
    pairs.forEach(([word, clue]) => {
      if (seen.has(word)) return;
      const entry = { word, clue };
      if (!isAllowedWordEntry(entry, MAX_WORD_LENGTH)) return;
      seen.add(word);
      candidates.push(entry);
    });
  });
  (typeof SUPPLEMENTAL_WORDS === 'undefined' ? [] : SUPPLEMENTAL_WORDS).forEach(entry => {
    if (seen.has(entry.word)) return;
    if (!isAllowedWordEntry(entry, MAX_WORD_LENGTH)) return;
    seen.add(entry.word);
    candidates.push({ word: entry.word, clue: entry.clue });
  });
  candidates.forEach(c => { c.difficulty = computeWordDifficulty(c.word); });
  candidates.sort((a, b) => a.difficulty - b.difficulty);
  return candidates;
}

function buildStages(candidates) {
  const totalNeeded = STAGE_ARCS.reduce((sum, _, arcIndex) => sum + levelsForArc(arcIndex) * STAGES_PER_ARC, 0);
  if (candidates.length < totalNeeded) {
    throw new Error(`Not enough eligible words to build ${STAGE_ARCS.length * STAGES_PER_ARC} stages: need ${totalNeeded}, have ${candidates.length}`);
  }

  // Sample evenly by rank (not raw score) across the whole sorted pool, so
  // stage 1 gets genuinely the easiest words and the final stage genuinely
  // the hardest, with a smooth difficulty climb in between.
  const stride = (candidates.length - 1) / (totalNeeded - 1);
  const picked = [];
  for (let i = 0; i < totalNeeded; i++) {
    picked.push(candidates[Math.round(i * stride)]);
  }

  const stages = [];
  let cursor = 0;
  STAGE_ARCS.forEach((arc, arcIndex) => {
    const names = buildArcStageNames(arc);
    const levelCount = levelsForArc(arcIndex);
    for (let s = 0; s < STAGES_PER_ARC; s++) {
      const levels = picked.slice(cursor, cursor + levelCount).map(entry => ({
        word: entry.word,
        clue: entry.clue,
        difficulty: entry.difficulty,
      }));
      cursor += levelCount;
      stages.push({ name: names[s], levels });
    }
  });
  stages[0].name = 'Warm Up';
  return stages;
}

// Built once and shared: STAGES draws its 1400 words from here, and the
// remainder (already filtered and scored) becomes the extra pool for Timed,
// Survival, and Daily 5, so every word only ever runs through
// isAllowedWordEntry/computeWordDifficulty a single time.
const CANDIDATE_POOL = buildCandidatePool();
const STAGES = buildStages(CANDIDATE_POOL);

// Stages stay curated; Timed and Daily 5 draw from this larger bank so repeat
// words are much less common.
const STAGE_WORDS = STAGES.flatMap(s => s.levels.map(l => [l.word, l.clue, l.difficulty]));
const STAGE_WORD_SET = new Set(STAGE_WORDS.map(([word]) => word));
const SUPPLEMENTAL_WORD_PAIRS = CANDIDATE_POOL
  .filter(entry => !STAGE_WORD_SET.has(entry.word))
  .map(entry => [entry.word, entry.clue, entry.difficulty]);
const ALL_WORDS = STAGE_WORDS.concat(SUPPLEMENTAL_WORD_PAIRS);
// Cap matches the "harder" band's upper bound in dailyWordsForDate below, so
// the fifth daily word can actually reach that band instead of being
// silently truncated to whatever's left under a lower ceiling.
const DAILY_WORDS = ALL_WORDS.filter(([, , difficulty]) => difficulty <= 75);

function shuffleArray(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
}

function buildArcadeQueue() {
  const easy = shuffleArray(ALL_WORDS.filter(([, , difficulty]) => difficulty <= 35));
  const medium = shuffleArray(ALL_WORDS.filter(([, , difficulty]) => difficulty > 35 && difficulty <= 70));
  const hard = shuffleArray(ALL_WORDS.filter(([, , difficulty]) => difficulty > 70));
  const pools = { easy, medium, hard };
  const pattern = ['easy', 'easy', 'medium', 'easy', 'medium', 'hard'];
  const queue = [];
  let i = 0;
  while (pools.easy.length || pools.medium.length || pools.hard.length) {
    const preferred = pattern[i % pattern.length];
    const fallback = preferred === 'hard' ? ['medium', 'easy'] : preferred === 'medium' ? ['easy', 'hard'] : ['medium', 'hard'];
    const key = [preferred, ...fallback].find(name => pools[name].length);
    if (!key) break;
    queue.push(pools[key].pop());
    i++;
  }
  return queue;
}

const SURVIVAL_LENGTH_PATTERN = [
  5, 6, 5, 6, 5,
  7, 6, 5, 6, 7,
  5, 6, 5, 6, 8,
  6, 5, 6, 7, 6,
];

function buildSurvivalQueue() {
  const pools = {
    5: shuffleArray(ALL_WORDS.filter(([word]) => word.length === 5)),
    6: shuffleArray(ALL_WORDS.filter(([word]) => word.length === 6)),
    7: shuffleArray(ALL_WORDS.filter(([word]) => word.length === 7)),
    8: shuffleArray(ALL_WORDS.filter(([word]) => word.length === 8)),
  };
  const fallbackByLength = {
    5: [6, 7, 8],
    6: [5, 7, 8],
    7: [6, 5, 8],
    8: [7, 6, 5],
  };
  const queue = [];
  let i = 0;

  while (Object.values(pools).some(pool => pool.length)) {
    const preferred = SURVIVAL_LENGTH_PATTERN[i % SURVIVAL_LENGTH_PATTERN.length];
    const key = [preferred, ...fallbackByLength[preferred]].find(length => pools[length].length);
    if (!key) break;
    queue.push(pools[key].pop());
    i++;
  }
  return queue;
}

function seedFromString(str) {
  let seed = 2166136261;
  for (let i = 0; i < str.length; i++) {
    seed ^= str.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function seededRandom(seed) {
  let s = seed || 1;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 4294967296;
  };
}

// The date's seed picks a stable index into each band, but the bands
// themselves are just live filters over DAILY_WORDS/ALL_WORDS — so any future
// change to the word bank or difficulty model reshuffles which words a given
// date produces. Fine at this scale, but it means daily results aren't
// reproducible across a content deploy, and two players on the same date but
// different app versions won't necessarily get the same puzzle. A real fix
// would hash the word list (or pin a versioned snapshot) into the seed.
function dailyWordsForDate(dateKey) {
  const random = seededRandom(seedFromString(dateKey));
  const easy = DAILY_WORDS.filter(([, , difficulty]) => difficulty <= 30);
  const medium = DAILY_WORDS.filter(([, , difficulty]) => difficulty > 30 && difficulty <= 55);
  const harder = DAILY_WORDS.filter(([, , difficulty]) => difficulty > 55 && difficulty <= 75);
  const bands = [
    easy,
    easy,
    medium,
    medium,
    harder,
  ];
  return bands.map(band => band[Math.floor(random() * band.length)]);
}
