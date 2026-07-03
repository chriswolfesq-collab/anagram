const CONFIG = {
  accentColor: '#10B981',
  tileShape: 'square', // 'square' | 'circle'
};
const MAX_WORD_LENGTH = 8;

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

// Word pools for the 44 generated stages that fill in between the 6
// hand-authored anchor stages. Grouped by difficulty band so level count
// per stage climbs smoothly (never drops) across all 50 stages.

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

const BAND1_NAMES = ['First Steps', 'Getting Started', 'Easy Does It', 'Quick Words', 'Word Starter', 'Simple Words', 'Basic Training', 'Word Rookie', 'Rookie Finale'];
const BAND2_NAMES = ['Gaining Momentum', 'Word Runner', 'Speed Round', 'Quick Thinker', 'Fast Track', 'Word Sprinter', 'Rapid Fire', 'Swift Solver', 'Speed Finale'];
const BAND3_NAMES = ['Word Wizard', 'Vocabulary Vault', 'Letter Craft', 'Word Architect', 'Wordsmith', 'Language Lab', 'Syntax Sprint', 'Lexicon Leap', 'Master Finale'];
const BAND4_NAMES = ['Brain Teaser', 'Mind Bender', 'Cerebral Challenge', "Thinker's Trial", 'Puzzle Master', 'Riddle Range', 'Logic Loop', 'Puzzle Prodigy', 'Pro Finale'];
const BAND5_NAMES = ['Expert Zone', 'Advanced Play', 'High Stakes', 'Elite Words', 'Pro League', 'Championship', 'Word Warrior', 'Vanguard'];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Time budget shrinks as the global stage index climbs and grows slightly
// for longer words, mirroring the hand-tuned pacing of the anchor stages.
function levelTime(word, stageIndex) {
  const t = 46 - stageIndex * 0.55 - (word.length - 5);
  return Math.max(10, Math.round(t));
}

function buildLevels(pairs, stageIndex) {
  return pairs.map(([word, clue]) => ({ word, clue, time: levelTime(word, stageIndex) }));
}

const band1New = chunk(POOL_5_6, 3);
const band2New = chunk(POOL_7, 4);
const band3New = chunk(POOL_8_9, 5);
const band4New = chunk(POOL_9_11, 6);
const band5New = chunk(POOL_10_12, 7);

const STAGES = [
  {
    name: 'Warm Up',
    levels: [
      { word: 'OCEAN', clue: 'Vast saltwater body', time: 45 },
      { word: 'GARDEN', clue: 'Where flowers bloom', time: 40 },
      { word: 'PLANET', clue: 'Earth is one', time: 40 },
    ],
  },
  ...band1New.map((pairs, i) => ({ name: BAND1_NAMES[i], levels: buildLevels(pairs, 1 + i) })),
  {
    name: 'Picking Up Speed',
    levels: [
      { word: 'WHISPER', clue: 'Speak very softly', time: 35 },
      { word: 'JOURNEY', clue: 'A long trip', time: 35 },
      { word: 'MYSTERY', clue: 'Unsolved puzzle', time: 33 },
      { word: 'BALANCE', clue: 'Steady equilibrium', time: 32 },
    ],
  },
  ...band2New.map((pairs, i) => ({ name: BAND2_NAMES[i], levels: buildLevels(pairs, 11 + i) })),
  {
    name: 'Word Master',
    levels: [
      { word: 'SYMPHONY', clue: 'Orchestral piece', time: 30 },
      { word: 'ADVENTURE', clue: 'Exciting undertaking', time: 28 },
      { word: 'CROSSWORD', clue: 'A grid puzzle like this one', time: 28 },
      { word: 'ELEPHANT', clue: 'Large trunked mammal', time: 26 },
      { word: 'CHOCOLATE', clue: 'Sweet treat from cacao', time: 26 },
    ],
  },
  ...band3New.map((pairs, i) => ({ name: BAND3_NAMES[i], levels: buildLevels(pairs, 21 + i) })),
  {
    name: 'Puzzle Pro',
    levels: [
      { word: 'KEYBOARD', clue: 'Typing device', time: 24 },
      { word: 'KANGAROO', clue: 'Hopping Australian marsupial', time: 24 },
      { word: 'MOUNTAIN', clue: 'Large natural elevation', time: 23 },
      { word: 'BUTTERFLY', clue: 'Insect with colorful wings', time: 22 },
      { word: 'KNOWLEDGE', clue: 'Information and understanding', time: 22 },
      { word: 'KINDNESS', clue: 'Quality of being generous', time: 20 },
    ],
  },
  ...band4New.map((pairs, i) => ({ name: BAND4_NAMES[i], levels: buildLevels(pairs, 31 + i) })),
  ...band5New.map((pairs, i) => ({ name: BAND5_NAMES[i], levels: buildLevels(pairs, 40 + i) })),
  {
    name: 'Expert',
    levels: [
      { word: 'FANTASTIC', clue: 'Extremely good', time: 22 },
      { word: 'INSTRUMENT', clue: 'Tool for making music', time: 20 },
      { word: 'TELEVISION', clue: 'Screen device for broadcasts', time: 20 },
      { word: 'UNIVERSITY', clue: 'Higher education institution', time: 19 },
      { word: 'GENERATION', clue: 'People born around the same time', time: 18 },
      { word: 'IMAGINATION', clue: 'Ability to form mental images', time: 18 },
      { word: 'CELEBRATION', clue: 'Festive event marking an occasion', time: 17 },
      { word: 'HOSPITALITY', clue: 'Friendly treatment of guests', time: 16 },
    ],
  },
  {
    name: 'Grandmaster',
    levels: [
      { word: 'ATMOSPHERE', clue: 'Layer of gases around a planet', time: 18 },
      { word: 'PHOTOGRAPHY', clue: 'Art of capturing images with light', time: 17 },
      { word: 'ENVIRONMENT', clue: 'Natural surroundings', time: 17 },
      { word: 'OPPORTUNITY', clue: 'Favorable chance', time: 16 },
      { word: 'INSPIRATION', clue: 'Stimulus for creative ideas', time: 16 },
      { word: 'CONVERSATION', clue: 'Talk between people', time: 15 },
      { word: 'ARCHITECTURE', clue: 'Art of designing buildings', time: 15 },
      { word: 'INDEPENDENCE', clue: 'Freedom from control', time: 14 },
      { word: 'ENTREPRENEUR', clue: 'Business founder who takes risks', time: 14 },
      { word: 'CIVILIZATION', clue: 'Complex organized society', time: 13 },
    ],
  },
];

function enforceWordRules(maxLen) {
  const used = new Set(STAGES.flatMap(s => s.levels.filter(l => isAllowedWordEntry(l, maxLen)).map(l => l.word)));
  const replacements = (typeof SUPPLEMENTAL_WORDS === 'undefined' ? [] : SUPPLEMENTAL_WORDS)
    .filter(entry => isAllowedWordEntry(entry, maxLen) && !used.has(entry.word));
  let replacementIndex = 0;
  STAGES.forEach((stage, stageIdx) => {
    stage.levels = stage.levels.map(level => {
      if (isAllowedWordEntry(level, maxLen)) return level;
      const replacement = replacements[replacementIndex++];
      if (!replacement) return null;
      used.add(replacement.word);
      return {
        word: replacement.word,
        clue: replacement.clue,
        time: Math.max(10, Math.min(level.time, levelTime(replacement.word, stageIdx))),
      };
    }).filter(Boolean);
  });
}

enforceWordRules(MAX_WORD_LENGTH);

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

// Re-rank the curated stage words with the full difficulty model so the
// 50-stage progression climbs by real difficulty, not just word length.
(function sortStagesByDifficulty() {
  const allLevels = STAGES.flatMap(s => s.levels);
  allLevels.forEach(l => { l.difficulty = computeWordDifficulty(l.word); });
  allLevels.sort((a, b) => a.difficulty - b.difficulty);
  let i = 0;
  STAGES.forEach(stage => {
    stage.levels = stage.levels.map(() => allLevels[i++]);
  });
})();

// Stages stay curated; Timed and Daily 5 draw from this larger bank so repeat
// words are much less common.
const STAGE_WORDS = STAGES.flatMap(s => s.levels.map(l => [l.word, l.clue, l.difficulty]));
const STAGE_WORD_SET = new Set(STAGE_WORDS.map(([word]) => word));
const SUPPLEMENTAL_WORD_PAIRS = (typeof SUPPLEMENTAL_WORDS === 'undefined' ? [] : SUPPLEMENTAL_WORDS)
  .filter(entry => isAllowedWordEntry(entry) && !STAGE_WORD_SET.has(entry.word))
  .map(entry => [entry.word, entry.clue, computeWordDifficulty(entry.word)]);
const ALL_WORDS = STAGE_WORDS.concat(SUPPLEMENTAL_WORD_PAIRS);
const DAILY_WORDS = ALL_WORDS.filter(([, , difficulty]) => difficulty <= 65);
const ARCADE_TIME = 30;
const SURVIVAL_START_TIME = 30;
const SURVIVAL_MAX_TIME = 60;
const SURVIVAL_TIME_BONUS = 8;
const SURVIVAL_SKIP_PENALTY = 3;
const SURVIVAL_BASE_POINTS = 100;
const SURVIVAL_STREAK_BONUS_STEP = 25;
const SURVIVAL_FAST_SOLVE_SECONDS = 3;
const SURVIVAL_FAST_SOLVE_BONUS = 50;
const SURVIVAL_NO_SKIP_BONUS = 250;

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

// Pure helper shared by both modes: places a tapped tile into the next open
// slot and reports whether the word is complete (and what it spells).
function applyTap(scrambled, slots, tileId) {
  const tile = scrambled.find(t => t.id === tileId);
  if (!tile || tile.used) return null;
  const slotIdx = slots.findIndex(s => s === null);
  if (slotIdx === -1) return null;
  const newSlots = slots.slice();
  newSlots[slotIdx] = tileId;
  const newScrambled = scrambled.map(t => (t.id === tileId ? { ...t, used: true } : t));
  const filled = newSlots.every(s => s !== null);
  const word = filled ? newSlots.map(id => newScrambled.find(t => t.id === id).ch).join('') : null;
  return { scrambled: newScrambled, slots: newSlots, filled, word };
}

const STORAGE_KEY = 'anagram_wordgame_progress_v2';
const ARCADE_BEST_KEY = 'anagram_wordgame_arcade_best_v1';
const SURVIVAL_BEST_KEY = 'anagram_wordgame_survival_best_v1';
const DAILY_RESULT_KEY = 'anagram_wordgame_daily_result_v1';
const DAILY_COUNT = 5;

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  return Math.max(1000, next.getTime() - now.getTime());
}

function secondsUntilNextMidnight() {
  return Math.ceil(msUntilNextMidnight() / 1000);
}

function formatCountdown(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  return `${mins}:${String(secs).padStart(2, '0')}`;
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

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function dataUrlToFile(dataUrl, filename) {
  const [meta, data] = dataUrl.split(',');
  const mime = (meta.match(/data:(.*?);base64/) || [])[1] || 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

function fillFittedText(ctx, text, x, y, maxWidth, weight, maxSize, minSize, family) {
  let size = maxSize;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
    size -= 6;
  } while (size > minSize);
  ctx.fillText(text, x, y);
}

function makeScoreShareImage({ mode, score, scoreLabel, detail, bestLine, isNewBest }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, '#F7F2E8');
  bg.addColorStop(0.52, '#EAF7F0');
  bg.addColorStop(1, '#EDF2FF');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 205, 86, 0.32)';
  ctx.beginPath();
  ctx.arc(155, 155, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(79, 70, 229, 0.18)';
  ctx.beginPath();
  ctx.arc(965, 155, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(22, 32, 42, 0.055)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= canvas.width; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 70) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  roundRect(ctx, 110, 170, 860, 1010, 34);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(22, 32, 42, 0.1)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#16202A';
  ctx.font = '700 72px "Space Mono", monospace';
  ctx.fillText('ANAGRAM', 540, 305);

  ctx.fillStyle = '#047857';
  ctx.font = '700 34px "Space Mono", monospace';
  ctx.fillText(mode.toUpperCase(), 540, 405);

  ctx.fillStyle = '#16202A';
  fillFittedText(ctx, String(score), 540, 650, 740, 700, 210, 74, '"Space Mono", monospace');

  ctx.fillStyle = '#697586';
  ctx.font = '700 48px Inter, Arial, sans-serif';
  ctx.fillText(scoreLabel, 540, 730);

  ctx.fillStyle = isNewBest ? '#047857' : '#697586';
  ctx.font = '800 42px Inter, Arial, sans-serif';
  ctx.fillText(isNewBest ? 'New best score!' : bestLine, 540, 835);

  if (detail) {
    ctx.fillStyle = '#16202A';
    ctx.font = '700 34px "Space Mono", monospace';
    ctx.fillText(detail, 540, 925);
  }

  ctx.fillStyle = '#4F46E5';
  ctx.font = '700 30px "Space Mono", monospace';
  ctx.fillText('SHARE YOUR SCORE', 540, 1075);

  const dataUrl = canvas.toDataURL('image/png');
  return dataUrlToFile(dataUrl, `anagram-${mode.toLowerCase().replace(/\s+/g, '-')}-score.png`);
}

function downloadShareImage(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getGameShareUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.href;
}

function withGameShareLink(text) {
  return `${text}\nPlay Anagram: ${getGameShareUrl()}`;
}

class Game {
  constructor(onChange) {
    this.onChange = onChange;
    this.arcadeTimerId = null;
    this.survivalTimerId = null;
    this.dailyTimerId = null;
    this.dailyResetTimerId = null;
    this.dailyCountdownTimerId = null;
    this.state = {
      screen: 'home',
      stageProgress: STAGES.map(() => 0),
      activeStage: 0,
      levelIndex: 0,
      stageShareStatus: '',
      scrambled: [],
      slots: [],
      status: 'playing',
      arcadeQueue: [],
      arcadeWord: '',
      arcadeClue: '',
      arcadeScore: 0,
      arcadeTimeLeft: ARCADE_TIME,
      arcadeBest: 0,
      arcadeShareStatus: '',
      survivalQueue: [],
      survivalWord: '',
      survivalClue: '',
      survivalScore: 0,
      survivalSolved: 0,
      survivalStreak: 0,
      survivalSkips: 0,
      survivalWordStartedAt: 0,
      survivalLastPoints: 0,
      survivalLastBonus: '',
      survivalNoSkipBonus: 0,
      survivalTimeLeft: SURVIVAL_START_TIME,
      survivalBest: 0,
      survivalShareStatus: '',
      dailyDate: todayKey(),
      dailyQueue: [],
      dailyIndex: 0,
      dailyWord: '',
      dailyClue: '',
      dailyStartedAt: 0,
      dailyElapsed: 0,
      dailyResetIn: secondsUntilNextMidnight(),
      dailyResult: null,
      dailyShareStatus: '',
    };
    this.loadProgress();
    this.loadArcadeBest();
    this.loadSurvivalBest();
    this.loadDailyResult();
    this.scheduleDailyReset();
    this.startDailyCountdown();
  }

  setState(patch) {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.onChange(this.state);
  }

  scheduleDailyReset() {
    if (this.dailyResetTimerId) clearTimeout(this.dailyResetTimerId);
    this.dailyResetTimerId = setTimeout(() => {
      this.handleDailyReset();
      this.scheduleDailyReset();
    }, msUntilNextMidnight());
  }

  startDailyCountdown() {
    if (this.dailyCountdownTimerId) clearInterval(this.dailyCountdownTimerId);
    this.dailyCountdownTimerId = setInterval(() => {
      this.setState({ dailyResetIn: secondsUntilNextMidnight() });
    }, 1000);
  }

  handleDailyReset() {
    const date = todayKey();
    const patch = {
      dailyDate: date,
      dailyElapsed: 0,
      dailyResetIn: secondsUntilNextMidnight(),
      dailyShareStatus: '',
    };
    if (this.state.screen === 'dailyDone') {
      patch.screen = 'home';
    }
    this.setState(patch);
  }

  loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved.stageProgress)) {
        const sp = STAGES.map((s, i) => Math.min(Math.max(saved.stageProgress[i] || 0, 0), s.levels.length));
        this.state.stageProgress = sp;
      }
    } catch (e) {}
  }

  saveProgress(stageProgress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stageProgress }));
    } catch (e) {}
  }

  loadArcadeBest() {
    try {
      const best = parseInt(localStorage.getItem(ARCADE_BEST_KEY), 10);
      if (!isNaN(best) && best > 0) this.state.arcadeBest = best;
    } catch (e) {}
  }

  saveArcadeBest(best) {
    try {
      localStorage.setItem(ARCADE_BEST_KEY, String(best));
    } catch (e) {}
  }

  loadSurvivalBest() {
    try {
      const best = parseInt(localStorage.getItem(SURVIVAL_BEST_KEY), 10);
      if (!isNaN(best) && best > 0) this.state.survivalBest = best;
    } catch (e) {}
  }

  saveSurvivalBest(best) {
    try {
      localStorage.setItem(SURVIVAL_BEST_KEY, String(best));
    } catch (e) {}
  }

  loadDailyResult() {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_RESULT_KEY) || 'null');
      if (saved && saved.date && typeof saved.elapsed === 'number') {
        this.state.dailyResult = saved;
      }
    } catch (e) {}
  }

  saveDailyResult(result) {
    try {
      localStorage.setItem(DAILY_RESULT_KEY, JSON.stringify(result));
    } catch (e) {}
  }

  isStageUnlocked(stageIdx, stageProgress) {
    if (stageIdx === 0) return true;
    return stageProgress[stageIdx - 1] >= STAGES[stageIdx - 1].levels.length;
  }

  shuffle(word) {
    let arr = word.split('').map((ch, i) => ({
      id: i + '-' + ch + '-' + Math.random().toString(36).slice(2, 7),
      ch,
      used: false,
    }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    if (arr.map(a => a.ch).join('') === word && word.length > 1) {
      const tmp = arr[0]; arr[0] = arr[1]; arr[1] = tmp;
    }
    return arr;
  }

  shuffleTiles() {
    const { status, scrambled } = this.state;
    if (status !== 'playing') return;
    const unusedTiles = shuffleArray(scrambled.filter(t => !t.used));
    let nextUnusedIndex = 0;
    const nextScrambled = scrambled.map(tile => {
      if (tile.used) return tile;
      return unusedTiles[nextUnusedIndex++];
    });
    this.setState({ scrambled: nextScrambled });
  }

  goHome() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    if (this.dailyTimerId) clearInterval(this.dailyTimerId);
    this.setState({ screen: 'home' });
  }

  openStage(stageIdx) {
    this.setState({ screen: 'levels', activeStage: stageIdx });
  }

  goToStages() {
    this.setState({ screen: 'stages' });
  }

  goToLevels() {
    this.setState({ screen: 'levels' });
  }

  startLevel(stageIdx, idx) {
    const lvl = STAGES[stageIdx].levels[idx];
    this.setState({
      screen: 'play',
      activeStage: stageIdx,
      levelIndex: idx,
      scrambled: this.shuffle(lvl.word),
      slots: new Array(lvl.word.length).fill(null),
      status: 'playing',
    });
  }

  // --- Timed Challenge mode ---

  startArcade() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    this.setState({ screen: 'arcadePlay', arcadeQueue: buildArcadeQueue(), arcadeScore: 0, arcadeShareStatus: '' });
    this.loadNextArcadeWord();
  }

  loadNextArcadeWord() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    let queue = this.state.arcadeQueue;
    if (queue.length === 0) queue = buildArcadeQueue();
    const [word, clue] = queue[0];
    this.setState({
      arcadeQueue: queue.slice(1),
      arcadeWord: word,
      arcadeClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      arcadeTimeLeft: ARCADE_TIME,
      status: 'playing',
    });
    this.arcadeTimerId = setInterval(() => {
      if (this.state.status !== 'playing') return;
      const t = this.state.arcadeTimeLeft - 1;
      if (t <= 0) {
        clearInterval(this.arcadeTimerId);
        this.endArcade();
      } else {
        this.setState({ arcadeTimeLeft: t });
      }
    }, 1000);
  }

  endArcade() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    const best = Math.max(this.state.arcadeBest, this.state.arcadeScore);
    this.saveArcadeBest(best);
    this.setState({ screen: 'arcadeOver', arcadeBest: best, status: 'over' });
  }

  exitArcade() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    this.setState({ screen: 'home' });
  }

  async shareImage({ text, file, statusKey }) {
    const downloadAndCopy = async () => {
      downloadShareImage(file);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {}
      }
      this.setState({ [statusKey]: 'Screenshot downloaded' });
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'Anagram Score', text, files: [file] });
        this.setState({ [statusKey]: 'Shared!' });
      } else {
        await downloadAndCopy();
      }
    } catch (e) {
      if (e && e.name === 'AbortError') {
        this.setState({ [statusKey]: 'Share canceled' });
      } else {
        await downloadAndCopy();
      }
    }
  }

  async shareArcade() {
    const text = withGameShareLink(`Timed Challenge: I solved ${this.state.arcadeScore} ${this.state.arcadeScore === 1 ? 'word' : 'words'} in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Timed Challenge',
      score: this.state.arcadeScore,
      scoreLabel: this.state.arcadeScore === 1 ? 'word solved' : 'words solved',
      detail: this.state.arcadeWord ? `Answer: ${this.state.arcadeWord}` : '',
      bestLine: `Best: ${this.state.arcadeBest}`,
      isNewBest: this.state.arcadeScore >= this.state.arcadeBest && this.state.arcadeScore > 0,
    });
    await this.shareImage({ text, file, statusKey: 'arcadeShareStatus' });
  }

  // --- Survival mode ---

  startSurvival() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    this.setState({
      screen: 'survivalPlay',
      survivalQueue: buildSurvivalQueue(),
      survivalScore: 0,
      survivalSolved: 0,
      survivalStreak: 0,
      survivalSkips: 0,
      survivalTimeLeft: SURVIVAL_START_TIME,
      survivalShareStatus: '',
      survivalLastPoints: 0,
      survivalLastBonus: '',
      survivalNoSkipBonus: 0,
    });
    this.loadNextSurvivalWord();
    this.startSurvivalTimer();
  }

  loadNextSurvivalWord() {
    let queue = this.state.survivalQueue;
    if (queue.length === 0) queue = buildSurvivalQueue();
    const [word, clue] = queue[0];
    this.setState({
      survivalQueue: queue.slice(1),
      survivalWord: word,
      survivalClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      survivalWordStartedAt: Date.now(),
      status: 'playing',
    });
  }

  startSurvivalTimer() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    this.survivalTimerId = setInterval(() => {
      if (this.state.screen !== 'survivalPlay') return;
      const t = this.state.survivalTimeLeft - 1;
      if (t <= 0) {
        clearInterval(this.survivalTimerId);
        this.endSurvival();
      } else {
        this.setState({ survivalTimeLeft: t });
      }
    }, 1000);
  }

  endSurvival() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    const survivalNoSkipBonus = this.state.survivalSolved > 0 && this.state.survivalSkips === 0 ? SURVIVAL_NO_SKIP_BONUS : 0;
    const finalScore = this.state.survivalScore + survivalNoSkipBonus;
    const best = Math.max(this.state.survivalBest, finalScore);
    this.saveSurvivalBest(best);
    this.setState({ screen: 'survivalOver', survivalScore: finalScore, survivalBest: best, survivalNoSkipBonus, status: 'over' });
  }

  exitSurvival() {
    if (this.survivalTimerId) clearInterval(this.survivalTimerId);
    this.setState({ screen: 'home' });
  }

  async shareSurvival() {
    const text = withGameShareLink(`Survival: I scored ${this.state.survivalScore} points in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Survival',
      score: this.state.survivalScore,
      scoreLabel: 'points',
      detail: this.state.survivalNoSkipBonus ? `No-skip bonus: +${this.state.survivalNoSkipBonus}` : `${this.state.survivalSkips} ${this.state.survivalSkips === 1 ? 'skip' : 'skips'} used`,
      bestLine: `Best: ${this.state.survivalBest} pts`,
      isNewBest: this.state.survivalScore >= this.state.survivalBest && this.state.survivalScore > 0,
    });
    await this.shareImage({ text, file, statusKey: 'survivalShareStatus' });
  }

  async shareStage() {
    const stage = STAGES[this.state.activeStage];
    const levelCount = stage.levels.length;
    const text = withGameShareLink(`I cleared ${stage.name} in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Stage Complete',
      score: stage.name,
      scoreLabel: 'stage cleared',
      detail: `Stage ${this.state.activeStage + 1} / ${STAGES.length}`,
      bestLine: `${levelCount} ${levelCount === 1 ? 'word' : 'words'} solved`,
      isNewBest: false,
    });
    await this.shareImage({ text, file, statusKey: 'stageShareStatus' });
  }

  // --- Daily 5 mode ---

  startDaily() {
    if (this.dailyTimerId) clearInterval(this.dailyTimerId);
    const date = todayKey();
    if (this.state.dailyResult && this.state.dailyResult.date === date) {
      this.setState({
        screen: 'dailyDone',
        dailyDate: date,
        dailyElapsed: this.state.dailyResult.elapsed,
        dailyShareStatus: '',
      });
      return;
    }
    const queue = dailyWordsForDate(date);
    const [word, clue] = queue[0];
    const startedAt = Date.now();
    this.setState({
      screen: 'dailyPlay',
      dailyDate: date,
      dailyQueue: queue,
      dailyIndex: 0,
      dailyWord: word,
      dailyClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      dailyStartedAt: startedAt,
      dailyElapsed: 0,
      dailyShareStatus: '',
      status: 'playing',
    });
    this.dailyTimerId = setInterval(() => {
      if (this.state.screen !== 'dailyPlay' || this.state.status !== 'playing') return;
      this.setState({ dailyElapsed: Math.floor((Date.now() - this.state.dailyStartedAt) / 1000) });
    }, 1000);
  }

  loadDailyWord(index) {
    const [word, clue] = this.state.dailyQueue[index];
    this.setState({
      dailyIndex: index,
      dailyWord: word,
      dailyClue: clue,
      scrambled: this.shuffle(word),
      slots: new Array(word.length).fill(null),
      status: 'playing',
    });
  }

  resolveDailyTap(result) {
    const { dailyWord, dailyIndex, dailyStartedAt } = this.state;
    if (result.filled && result.word === dailyWord) {
      this.setState({ scrambled: result.scrambled, slots: result.slots, status: 'success' });
      if (dailyIndex + 1 >= DAILY_COUNT) {
        const elapsed = Math.floor((Date.now() - dailyStartedAt) / 1000);
        const dailyResult = { date: this.state.dailyDate, elapsed };
        this.saveDailyResult(dailyResult);
        if (this.dailyTimerId) clearInterval(this.dailyTimerId);
        setTimeout(() => this.setState({ screen: 'dailyDone', dailyElapsed: elapsed, dailyResult }), 450);
      } else {
        setTimeout(() => this.loadDailyWord(dailyIndex + 1), 450);
      }
      return;
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots });
  }

  exitDaily() {
    if (this.dailyTimerId) clearInterval(this.dailyTimerId);
    this.setState({ screen: 'home' });
  }

  async shareDaily() {
    const result = this.state.dailyResult;
    const elapsed = result ? result.elapsed : this.state.dailyElapsed;
    const date = result ? result.date : this.state.dailyDate;
    const text = withGameShareLink(`Daily 5 ${date}: ${formatDuration(elapsed)} in Anagram`);
    const file = makeScoreShareImage({
      mode: 'Daily 5',
      score: formatDuration(elapsed),
      scoreLabel: 'completion time',
      detail: date,
      bestLine: `${DAILY_COUNT} / ${DAILY_COUNT} words solved`,
      isNewBest: false,
    });
    await this.shareImage({ text, file, statusKey: 'dailyShareStatus' });
  }

  tapScrambled(tileId) {
    const { status, scrambled, slots } = this.state;
    if (status !== 'playing') return;
    const result = applyTap(scrambled, slots, tileId);
    if (!result) return;
    if (this.state.screen === 'arcadePlay') {
      this.resolveArcadeTap(result);
    } else if (this.state.screen === 'survivalPlay') {
      this.resolveSurvivalTap(result);
    } else if (this.state.screen === 'dailyPlay') {
      this.resolveDailyTap(result);
    } else {
      this.resolveStagesTap(result);
    }
  }

  resolveStagesTap(result) {
    const { activeStage, levelIndex, stageProgress } = this.state;
    let newStatus = 'playing';
    if (result.filled) {
      const lvl = STAGES[activeStage].levels[levelIndex];
      if (result.word === lvl.word) {
        newStatus = 'success';
        const newProgress = stageProgress.slice();
        newProgress[activeStage] = Math.max(newProgress[activeStage], levelIndex + 1);
        this.saveProgress(newProgress);
        this.setState({ stageProgress: newProgress });
      }
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots, status: newStatus });
  }

  resolveArcadeTap(result) {
    const { arcadeWord, arcadeScore } = this.state;
    if (result.filled && result.word === arcadeWord) {
      if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
      this.setState({ scrambled: result.scrambled, slots: result.slots, status: 'success', arcadeScore: arcadeScore + 1 });
      setTimeout(() => this.loadNextArcadeWord(), 500);
      return;
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots });
  }

  resolveSurvivalTap(result) {
    const { survivalWord, survivalScore, survivalSolved, survivalStreak, survivalWordStartedAt, survivalTimeLeft } = this.state;
    if (result.filled && result.word === survivalWord) {
      const elapsed = (Date.now() - survivalWordStartedAt) / 1000;
      const nextStreak = survivalStreak + 1;
      const streakBonus = nextStreak % 5 === 0 ? (nextStreak / 5) * SURVIVAL_STREAK_BONUS_STEP : 0;
      const fastBonus = elapsed < SURVIVAL_FAST_SOLVE_SECONDS ? SURVIVAL_FAST_SOLVE_BONUS : 0;
      const points = SURVIVAL_BASE_POINTS + streakBonus + fastBonus;
      const bonusParts = [];
      if (streakBonus) bonusParts.push(`+${streakBonus} streak`);
      if (fastBonus) bonusParts.push(`+${fastBonus} fast`);
      this.setState({
        scrambled: result.scrambled,
        slots: result.slots,
        status: 'success',
        survivalScore: survivalScore + points,
        survivalSolved: survivalSolved + 1,
        survivalStreak: nextStreak,
        survivalTimeLeft: Math.min(SURVIVAL_MAX_TIME, survivalTimeLeft + SURVIVAL_TIME_BONUS),
        survivalLastPoints: points,
        survivalLastBonus: bonusParts.join(' · '),
      });
      setTimeout(() => this.loadNextSurvivalWord(), 500);
      return;
    }
    this.setState({ scrambled: result.scrambled, slots: result.slots });
  }

  skipSurvivalWord() {
    if (this.state.screen !== 'survivalPlay' || this.state.status !== 'playing') return;
    const survivalTimeLeft = Math.max(0, this.state.survivalTimeLeft - SURVIVAL_SKIP_PENALTY);
    this.setState({ survivalSkips: this.state.survivalSkips + 1, survivalStreak: 0, survivalLastPoints: 0, survivalLastBonus: 'Skipped', survivalTimeLeft });
    if (survivalTimeLeft <= 0) {
      if (this.survivalTimerId) clearInterval(this.survivalTimerId);
      this.endSurvival();
      return;
    }
    this.loadNextSurvivalWord();
  }

  tapSlot(slotIdx) {
    const { status, slots, scrambled } = this.state;
    if (status !== 'playing') return;
    const tileId = slots[slotIdx];
    if (!tileId) return;
    const newSlots = slots.slice();
    newSlots[slotIdx] = null;
    const newScrambled = scrambled.map(t => (t.id === tileId ? { ...t, used: false } : t));
    this.setState({ slots: newSlots, scrambled: newScrambled });
  }

  typeLetter(ch) {
    const { status, scrambled } = this.state;
    if (status !== 'playing') return;
    const tile = scrambled.find(t => t.ch === ch && !t.used);
    if (!tile) return;
    this.tapScrambled(tile.id);
  }

  backspace() {
    const { status, slots } = this.state;
    if (status !== 'playing') return;
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i] !== null) {
        this.tapSlot(i);
        return;
      }
    }
  }

  next() {
    const { activeStage, levelIndex } = this.state;
    const stage = STAGES[activeStage];
    const nextIdx = levelIndex + 1;
    if (nextIdx < stage.levels.length) {
      this.startLevel(activeStage, nextIdx);
    } else if (activeStage + 1 < STAGES.length) {
      this.setState({ screen: 'stageDone', stageShareStatus: '' });
    } else {
      this.setState({ screen: 'done' });
    }
  }

  afterStageDone() {
    const nextStage = this.state.activeStage + 1;
    if (nextStage < STAGES.length) {
      this.setState({ screen: 'levels', activeStage: nextStage });
    } else {
      this.setState({ screen: 'stages' });
    }
  }

  playAgain() {
    const reset = STAGES.map(() => 0);
    this.saveProgress(reset);
    this.setState({ stageProgress: reset, screen: 'stages' });
  }
}
