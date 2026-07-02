const CONFIG = {
  accentColor: '#22C55E',
  tileShape: 'square', // 'square' | 'circle'
};

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

// Full word bank for Timed Challenge mode: every word used across all 50
// stages, drawn in a freshly shuffled order each run.
const ALL_WORDS = STAGES.flatMap(s => s.levels.map(l => [l.word, l.clue]));
const ARCADE_TIME = 30;

function shuffleArray(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
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

class Game {
  constructor(onChange) {
    this.onChange = onChange;
    this.arcadeTimerId = null;
    this.state = {
      screen: 'home',
      stageProgress: STAGES.map(() => 0),
      activeStage: 0,
      levelIndex: 0,
      scrambled: [],
      slots: [],
      status: 'playing',
      arcadeQueue: [],
      arcadeWord: '',
      arcadeClue: '',
      arcadeScore: 0,
      arcadeTimeLeft: ARCADE_TIME,
      arcadeBest: 0,
    };
    this.loadProgress();
    this.loadArcadeBest();
  }

  setState(patch) {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.onChange(this.state);
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

  goHome() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
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
    this.setState({ screen: 'arcadePlay', arcadeQueue: shuffleArray(ALL_WORDS), arcadeScore: 0 });
    this.loadNextArcadeWord();
  }

  loadNextArcadeWord() {
    if (this.arcadeTimerId) clearInterval(this.arcadeTimerId);
    let queue = this.state.arcadeQueue;
    if (queue.length === 0) queue = shuffleArray(ALL_WORDS);
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

  tapScrambled(tileId) {
    const { status, scrambled, slots } = this.state;
    if (status !== 'playing') return;
    const result = applyTap(scrambled, slots, tileId);
    if (!result) return;
    if (this.state.screen === 'arcadePlay') {
      this.resolveArcadeTap(result);
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
      this.setState({ screen: 'stageDone' });
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
