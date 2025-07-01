/**
 * @fileoverview Type definitions for the Interactive Alphabet Learning application
 * Using JSDoc for type safety and better developer experience
 */

/**
 * Represents a single letter in the alphabet
 * @typedef {string} AlphabetLetter
 * @description A single uppercase letter from A-Z
 * @example 'A', 'B', 'Z'
 */

/**
 * Letter click count for a specific letter
 * @typedef {number} LetterClickCount
 * @description Non-negative integer representing how many times a letter has been clicked
 * @minimum 0
 */

/**
 * Animation key for tracking letter animations
 * @typedef {string|number|null} AnimationKey
 * @description Unique identifier for letter animations, can be timestamp or custom string
 */

/**
 * Learning statistics object
 * @typedef {Object} LearningStatistics
 * @property {number} totalClicks - Total number of clicks across all letters
 * @property {number} exploredLetters - Number of unique letters that have been clicked
 * @property {number} remainingLetters - Number of letters not yet explored
 * @property {number} completionPercentage - Percentage of alphabet completion (0-100)
 * @property {boolean} isComplete - Whether all letters have been explored
 */

/**
 * Achievement definition object
 * @typedef {Object} Achievement
 * @property {string} emoji - Emoji representation of the achievement
 * @property {string} title - Achievement title
 * @property {string} description - Achievement description
 */

/**
 * Letter animation state
 * @typedef {Object} LetterAnimationState
 * @property {boolean} isAnimating - Whether the letter is currently animating
 * @property {AnimationKey} animationKey - Unique key for the animation
 * @property {number} startTime - Timestamp when animation started
 */

/**
 * Composable return type for useAlphabetLearning
 * @typedef {Object} AlphabetLearningComposable
 * @property {AlphabetLetter[]} alphabet - Array of all alphabet letters
 * @property {import('vue').Ref<number>} totalClicks - Reactive total clicks count
 * @property {Object} clickedLetters - Reactive object tracking clicks per letter
 * @property {Object} animatingLetters - Reactive object tracking animation states
 * @property {function(AlphabetLetter): void} handleLetterClick - Function to handle letter clicks
 * @property {function(AlphabetLetter): boolean} isLetterAnimating - Check if letter is animating
 * @property {function(AlphabetLetter): LetterClickCount} getLetterClickCount - Get click count for letter
 * @property {function(AlphabetLetter): boolean} hasLetterBeenClicked - Check if letter has been clicked
 * @property {function(): void} resetProgress - Reset all learning progress
 * @property {function(): LearningStatistics} getStatistics - Get current learning statistics
 */

/**
 * Props for AlphabetLetter component
 * @typedef {Object} AlphabetLetterProps
 * @property {AlphabetLetter} letter - The letter to display
 * @property {LetterClickCount} clickCount - Number of times this letter has been clicked
 * @property {boolean} isAnimating - Whether the letter is currently animating
 * @property {AnimationKey} animationKey - Unique key for animation re-triggering
 */

/**
 * Events emitted by AlphabetLetter component
 * @typedef {Object} AlphabetLetterEvents
 * @property {function(AlphabetLetter): void} letter-clicked - Emitted when letter is clicked
 */

/**
 * Progress message configuration object
 * @typedef {Object} ProgressMessageConfig
 * @property {number} threshold - Number of explored letters threshold
 * @property {string} message - Progress message to display
 */

/**
 * UI grid configuration
 * @typedef {Object} GridConfig
 * @property {number} columnsMobile - Number of columns on mobile devices
 * @property {number} columnsTablet - Number of columns on tablet devices
 * @property {number} columnsDesktop - Number of columns on desktop devices
 * @property {string} gap - Grid gap size
 */

/**
 * Accessibility configuration
 * @typedef {Object} AccessibilityConfig
 * @property {Object} ariaLabels - ARIA label mappings
 * @property {string[]} triggerKeys - Keys that trigger letter clicks
 * @property {Object} announcements - Screen reader announcement functions
 */

/**
 * Animation configuration
 * @typedef {Object} AnimationConfig
 * @property {number} duration - Animation duration in milliseconds
 * @property {string[]} effects - Available animation effects
 * @property {boolean} respectReducedMotion - Whether to respect prefers-reduced-motion
 */

/**
 * Validation result object
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the validation passed
 * @property {string} [error] - Error message if validation failed
 * @property {*} [value] - Validated/transformed value
 */

/**
 * Performance metrics object
 * @typedef {Object} PerformanceMetrics
 * @property {number} renderTime - Component render time in milliseconds
 * @property {number} animationFrameRate - Current animation frame rate
 * @property {number} memoryUsage - Approximate memory usage
 */

/**
 * Error information object
 * @typedef {Object} ErrorInfo
 * @property {string} code - Error code
 * @property {string} message - Human-readable error message
 * @property {Error} [originalError] - Original error object if available
 * @property {Object} [context] - Additional context about the error
 */

/**
 * Event handler function signatures
 */

/**
 * Letter click event handler
 * @typedef {function(AlphabetLetter): void} LetterClickHandler
 */

/**
 * Progress update event handler
 * @typedef {function(LearningStatistics): void} ProgressUpdateHandler
 */

/**
 * Achievement unlock event handler
 * @typedef {function(Achievement): void} AchievementUnlockHandler
 */

/**
 * Error handler function
 * @typedef {function(ErrorInfo): void} ErrorHandler
 */

/**
 * Keyboard event handler
 * @typedef {function(KeyboardEvent): void} KeyboardEventHandler
 */

// Export types for use in other modules (JSDoc doesn't export, but this serves as documentation)
export const TYPES = {
  // This is mainly for documentation purposes
  // In a TypeScript project, these would be actual type exports
} 