/**
 * Alphabet Learning Constants
 * Centralized configuration for the Interactive Alphabet Learning application
 */

/**
 * Phonetic sounds for each letter of the alphabet
 */
export const PHONETIC_SOUNDS = {
  'A': 'ah',           // short a sound
  'B': 'buh',          // b sound
  'C': 'kuh',          // hard c sound
  'D': 'duh',          // d sound
  'E': 'eh',           // short e sound
  'F': 'fuh',          // f sound
  'G': 'guh',          // hard g sound
  'H': 'huh',          // h sound
  'I': 'ih',           // short i sound
  'J': 'juh',          // j sound
  'K': 'kuh',          // k sound
  'L': 'luh',          // l sound
  'M': 'muh',          // m sound
  'N': 'nuh',          // n sound
  'O': 'oh',           // short o sound
  'P': 'puh',          // p sound
  'Q': 'kwuh',         // qu sound
  'R': 'ruh',          // r sound
  'S': 'sss',          // s sound
  'T': 'tuh',          // t sound
  'U': 'uh',           // short u sound
  'V': 'vuh',          // v sound
  'W': 'wuh',          // w sound
  'X': 'ks',           // x sound
  'Y': 'yuh',          // y sound
  'Z': 'zzz'           // z sound
}

/**
 * Letter data with names and example words/emojis for each letter
 */
export const LETTER_DATA = {
  'A': {
    name: 'Letter A',
    examples: [
      { word: 'Apple', emoji: '🍎' },
      { word: 'Ant', emoji: '🐜' },
      { word: 'Airplane', emoji: '✈️' },
      { word: 'Arrow', emoji: '➡️' }
    ]
  },
  'B': {
    name: 'Letter B',
    examples: [
      { word: 'Ball', emoji: '⚽' },
      { word: 'Bear', emoji: '🐻' },
      { word: 'Book', emoji: '📚' },
      { word: 'Banana', emoji: '🍌' }
    ]
  },
  'C': {
    name: 'Letter C',
    examples: [
      { word: 'Cat', emoji: '🐱' },
      { word: 'Car', emoji: '🚗' },
      { word: 'Cake', emoji: '🎂' },
      { word: 'Crown', emoji: '👑' }
    ]
  },
  'D': {
    name: 'Letter D',
    examples: [
      { word: 'Dog', emoji: '🐶' },
      { word: 'Duck', emoji: '🦆' },
      { word: 'Diamond', emoji: '💎' },
      { word: 'Drum', emoji: '🥁' }
    ]
  },
  'E': {
    name: 'Letter E',
    examples: [
      { word: 'Elephant', emoji: '🐘' },
      { word: 'Egg', emoji: '🥚' },
      { word: 'Earth', emoji: '🌍' },
      { word: 'Eye', emoji: '👁️' }
    ]
  },
  'F': {
    name: 'Letter F',
    examples: [
      { word: 'Fish', emoji: '🐟' },
      { word: 'Fire', emoji: '🔥' },
      { word: 'Flower', emoji: '🌸' },
      { word: 'Flag', emoji: '🏳️' }
    ]
  },
  'G': {
    name: 'Letter G',
    examples: [
      { word: 'Giraffe', emoji: '🦒' },
      { word: 'Gift', emoji: '🎁' },
      { word: 'Guitar', emoji: '🎸' },
      { word: 'Grapes', emoji: '🍇' }
    ]
  },
  'H': {
    name: 'Letter H',
    examples: [
      { word: 'House', emoji: '🏠' },
      { word: 'Hat', emoji: '👒' },
      { word: 'Heart', emoji: '❤️' },
      { word: 'Horse', emoji: '🐴' }
    ]
  },
  'I': {
    name: 'Letter I',
    examples: [
      { word: 'Ice cream', emoji: '🍦' },
      { word: 'Island', emoji: '🏝️' },
      { word: 'Igloo', emoji: '🏔️' },
      { word: 'Insect', emoji: '🐛' }
    ]
  },
  'J': {
    name: 'Letter J',
    examples: [
      { word: 'Juice', emoji: '🧃' },
      { word: 'Jellyfish', emoji: '🎐' },
      { word: 'Jar', emoji: '🏺' },
      { word: 'Jacket', emoji: '🧥' }
    ]
  },
  'K': {
    name: 'Letter K',
    examples: [
      { word: 'Key', emoji: '🔑' },
      { word: 'Kite', emoji: '🪁' },
      { word: 'King', emoji: '👑' },
      { word: 'Kangaroo', emoji: '🦘' }
    ]
  },
  'L': {
    name: 'Letter L',
    examples: [
      { word: 'Lion', emoji: '🦁' },
      { word: 'Leaf', emoji: '🍃' },
      { word: 'Light', emoji: '💡' },
      { word: 'Lemon', emoji: '🍋' }
    ]
  },
  'M': {
    name: 'Letter M',
    examples: [
      { word: 'Mouse', emoji: '🐭' },
      { word: 'Moon', emoji: '🌙' },
      { word: 'Music', emoji: '🎵' },
      { word: 'Mountain', emoji: '⛰️' }
    ]
  },
  'N': {
    name: 'Letter N',
    examples: [
      { word: 'Nest', emoji: '🪹' },
      { word: 'Night', emoji: '🌃' },
      { word: 'Nose', emoji: '👃' },
      { word: 'Nut', emoji: '🥜' }
    ]
  },
  'O': {
    name: 'Letter O',
    examples: [
      { word: 'Orange', emoji: '🍊' },
      { word: 'Ocean', emoji: '🌊' },
      { word: 'Owl', emoji: '🦉' },
      { word: 'Octopus', emoji: '🐙' }
    ]
  },
  'P': {
    name: 'Letter P',
    examples: [
      { word: 'Pizza', emoji: '🍕' },
      { word: 'Penguin', emoji: '🐧' },
      { word: 'Planet', emoji: '🪐' },
      { word: 'Pineapple', emoji: '🍍' }
    ]
  },
  'Q': {
    name: 'Letter Q',
    examples: [
      { word: 'Queen', emoji: '👸' },
      { word: 'Question', emoji: '❓' },
      { word: 'Quilt', emoji: '🛏️' },
      { word: 'Quiet', emoji: '🤫' }
    ]
  },
  'R': {
    name: 'Letter R',
    examples: [
      { word: 'Robot', emoji: '🤖' },
      { word: 'Rainbow', emoji: '🌈' },
      { word: 'Rocket', emoji: '🚀' },
      { word: 'Rose', emoji: '🌹' }
    ]
  },
  'S': {
    name: 'Letter S',
    examples: [
      { word: 'Sun', emoji: '☀️' },
      { word: 'Star', emoji: '⭐' },
      { word: 'Snake', emoji: '🐍' },
      { word: 'Ship', emoji: '🚢' }
    ]
  },
  'T': {
    name: 'Letter T',
    examples: [
      { word: 'Tree', emoji: '🌳' },
      { word: 'Tiger', emoji: '🐅' },
      { word: 'Train', emoji: '🚂' },
      { word: 'Turtle', emoji: '🐢' }
    ]
  },
  'U': {
    name: 'Letter U',
    examples: [
      { word: 'Umbrella', emoji: '☂️' },
      { word: 'Unicorn', emoji: '🦄' },
      { word: 'Up', emoji: '⬆️' },
      { word: 'Universe', emoji: '🌌' }
    ]
  },
  'V': {
    name: 'Letter V',
    examples: [
      { word: 'Volcano', emoji: '🌋' },
      { word: 'Violin', emoji: '🎻' },
      { word: 'Van', emoji: '🚐' },
      { word: 'Victory', emoji: '✌️' }
    ]
  },
  'W': {
    name: 'Letter W',
    examples: [
      { word: 'Water', emoji: '💧' },
      { word: 'Whale', emoji: '🐋' },
      { word: 'Wind', emoji: '💨' },
      { word: 'Wolf', emoji: '🐺' }
    ]
  },
  'X': {
    name: 'Letter X',
    examples: [
      { word: 'X-ray', emoji: '🩻' },
      { word: 'Xylophone', emoji: '🎹' },
      { word: 'Box', emoji: '📦' },
      { word: 'Fox', emoji: '🦊' }
    ]
  },
  'Y': {
    name: 'Letter Y',
    examples: [
      { word: 'Yellow', emoji: '💛' },
      { word: 'Yo-yo', emoji: '🪀' },
      { word: 'Yacht', emoji: '🛥️' },
      { word: 'Yak', emoji: '🐂' }
    ]
  },
  'Z': {
    name: 'Letter Z',
    examples: [
      { word: 'Zebra', emoji: '🦓' },
      { word: 'Zoo', emoji: '🎪' },
      { word: 'Zipper', emoji: '🤐' },
      { word: 'Zero', emoji: '0️⃣' }
    ]
  }
}

/**
 * Core alphabet configuration
 */
export const ALPHABET_CONFIG = {
  /** The complete alphabet array */
  LETTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  
  /** Total number of letters in the alphabet */
  TOTAL_LETTERS: 26,
  
  /** Animation duration in milliseconds */
  ANIMATION_DURATION: 2000,
  
  /** Minimum animation duration (for validation) */
  MIN_ANIMATION_DURATION: 500,
  
  /** Maximum animation duration (for validation) */
  MAX_ANIMATION_DURATION: 5000
}

/**
 * Achievement thresholds and configuration
 */
export const ACHIEVEMENT_CONFIG = {
  /** Achievement thresholds for letters explored */
  LETTERS_THRESHOLDS: {
    FIRST_FIVE: 5,
    HALFWAY_HERO: 13,
    ALPHABET_MASTER: 26
  },
  
  /** Achievement thresholds for total clicks */
  CLICKS_THRESHOLDS: {
    CLICK_CHAMPION: 50,
    CENTURY_CLUB: 100,
    MEGA_CLICKER: 500
  },
  
  /** Achievement definitions with Font Awesome icons and messages */
  DEFINITIONS: {
    FIRST_FIVE: {
      icon: 'star',
      title: 'First Five!',
      description: 'Explored your first 5 letters'
    },
    HALFWAY_HERO: {
      icon: 'rocket',
      title: 'Halfway Hero!',
      description: 'You\'re halfway through the alphabet'
    },
    ALPHABET_MASTER: {
      icon: 'crown',
      title: 'Alphabet Master!',
      description: 'Mastered all 26 letters'
    },
    CLICK_CHAMPION: {
      icon: 'fire',
      title: 'Click Champion!',
      description: 'Made 50+ clicks'
    },
    CENTURY_CLUB: {
      icon: 'medal',
      title: 'Century Club!',
      description: 'Made 100+ clicks'
    },
    MEGA_CLICKER: {
      icon: 'gem',
      title: 'Mega Clicker!',
      description: 'Made 500+ clicks - Amazing dedication!'
    }
  }
}

/**
 * Progress message configuration
 */
export const PROGRESS_MESSAGES = {
  INITIAL: 'Click any letter to start your learning journey!',
  FIRST_STEPS: 'Great start! Keep exploring more letters!',
  BUILDING_MOMENTUM: 'You\'re doing amazing! Almost halfway there!',
  HOME_STRETCH: 'Outstanding progress! You\'re in the home stretch!',
  ALMOST_COMPLETE: 'So close to mastering all letters! Keep going!',
  COMPLETE: 'Congratulations! You\'ve mastered the alphabet!'
}

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  /** Grid configuration */
  GRID: {
    COLUMNS_MOBILE: 4,
    COLUMNS_TABLET: 6,
    COLUMNS_DESKTOP: 8,
    GAP: '1rem'
  },
  
  /** Animation classes */
  ANIMATION_CLASSES: {
    BOUNCE: 'letter-bounce',
    SPARKLE: 'letter-sparkle',
    GLOW: 'letter-glow',
    PULSE: 'letter-pulse'
  },
  
  /** Color themes */
  COLORS: {
    PRIMARY: '#4f46e5',
    SECONDARY: '#06b6d4',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}

/**
 * Accessibility configuration
 */
export const A11Y_CONFIG = {
  /** ARIA labels */
  ARIA_LABELS: {
    LEARNING_PROGRESS: 'Learning Progress',
    ALPHABET_GRID: 'Interactive Alphabet Letters',
    ACHIEVEMENTS: 'Achievements',
    RESET_BUTTON: 'Reset all learning progress'
  },
  
  /** Keyboard navigation */
  KEYBOARD: {
    TRIGGER_KEYS: ['Enter', ' '],
    NAVIGATION_KEYS: ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  },
  
  /** Screen reader announcements */
  ANNOUNCEMENTS: {
    LETTER_CLICKED: (letter, count) => `Letter ${letter} clicked. Count: ${count}`,
    ACHIEVEMENT_UNLOCKED: (achievement) => `Achievement unlocked: ${achievement}`,
    PROGRESS_UPDATE: (percentage) => `Progress updated: ${percentage}% complete`
  }
}

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  /** Letter validation */
  LETTER: {
    PATTERN: /^[A-Z]$/,
    ERROR_MESSAGE: 'Letter must be a single uppercase character A-Z'
  },
  
  /** Click count validation */
  CLICK_COUNT: {
    MIN: 0,
    MAX: 9999,
    ERROR_MESSAGE: 'Click count must be between 0 and 9999'
  },
  
  /** Animation key validation */
  ANIMATION_KEY: {
    REQUIRED: false,
    TYPES: ['string', 'number'],
    ERROR_MESSAGE: 'Animation key must be a string or number'
  }
}

/**
 * Performance configuration
 */
export const PERFORMANCE_CONFIG = {
  /** Debounce timings */
  DEBOUNCE: {
    CLICK_HANDLER: 100,
    RESIZE_HANDLER: 250,
    SEARCH_INPUT: 300
  },
  
  /** Animation performance */
  ANIMATION: {
    WILL_CHANGE_PROPERTIES: ['transform', 'opacity'],
    PREFER_REDUCED_MOTION: true
  }
} 