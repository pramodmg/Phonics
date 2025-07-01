/**
 * Alphabet Learning Constants
 * Centralized configuration for the Interactive Alphabet Learning application
 */

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