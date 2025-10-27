const WORD_LIST = [
  "HAPPY", "SMILE", "PEACE", "LIGHT", "BRAVE",
  "FAITH", "GRACE", "HEART", "DREAM", "TRUST",
  "POWER", "MUSIC", "DANCE", "LAUGH", "ENJOY",
  "CHARM", "PRIDE", "WORTH", "NOBLE", "HONOR",
  "GLORY", "CHEER", "MIRTH", "JOLLY", "BLISS",
  "LUCKY", "SUNNY", "GRAND", "SWEET", "FRESH",
  "CLEAR", "TRUTH", "SMART", "SHARP", "QUICK",
  "AGILE", "FOCUS", "ALERT", "AWARE", "AWAKE",
  "ALIVE", "VITAL", "SPARK", "SHINE", "BRING",
  "RELAX", "QUIET", "STILL", "GIFTS", "LOVED",
  "SHARE", "HELPS", "GUIDE", "TEACH", "LEARN",
  "THINK", "WALKS", "BUILD", "REACH", "CLIMB",
];

if (WORD_LIST.some(word => word.length !== 5)) {
  console.error("WORD_LIST contains non-5-letter words:", WORD_LIST.filter(w => w.length !== 5));
}

export function getDailyWord(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % WORD_LIST.length;
  const word = WORD_LIST[index];
  
  if (word.length !== 5) {
    console.error(`Word "${word}" is not 5 letters long! Defaulting to HAPPY.`);
    return "HAPPY";
  }
  
  return word;
}

export function getPuzzleNumber(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
}

export function isValidWord(word: string): boolean {
  return word.length === 5 && /^[A-Z]+$/.test(word);
}
