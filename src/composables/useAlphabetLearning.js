import { ref, reactive } from 'vue'
import { ALPHABET_CONFIG } from '../constants/alphabet.js'
import { validateLetter } from '../utils/validation.js'

/**
 * Composable for managing alphabet learning state and interactions
 * @returns {AlphabetLearningComposable} State and methods for alphabet learning
 */
export function useAlphabetLearning() {
  // Constants from configuration
  const ALPHABET = ALPHABET_CONFIG.LETTERS
  const ANIMATION_DURATION = ALPHABET_CONFIG.ANIMATION_DURATION
  const MAX_CLICKS_PER_LETTER = 4

  // Reactive state
  const totalClicks = ref(0)
  const clickedLetters = reactive({})
  const animatingLetters = reactive({})
  const celebrationShown = ref(false)

  /**
   * Handles click event for a letter
   * @param {AlphabetLetter} letter - The letter that was clicked
   */
  const handleLetterClick = (letter) => {
    // Validate the letter input
    const validation = validateLetter(letter)
    if (!validation.isValid) {
      console.warn(`Invalid letter: ${letter} - ${validation.error}`)
      return
    }

    // Check if letter has reached maximum clicks
    if (getLetterClickCount(letter) >= MAX_CLICKS_PER_LETTER) {
      console.log(`Letter ${letter} has reached maximum clicks (${MAX_CLICKS_PER_LETTER})`)
      return
    }

    // Track clicks for this letter
    if (!clickedLetters[letter]) {
      clickedLetters[letter] = 0
    }
    clickedLetters[letter]++
    totalClicks.value++

    // Trigger animation for this letter
    animatingLetters[letter] = Date.now() // Use timestamp as unique key

    // Reset animation after duration
    setTimeout(() => {
      delete animatingLetters[letter]
    }, ANIMATION_DURATION)

    // Check if we should trigger celebration
    checkForCelebration()
  }

  /**
   * Checks if a letter is currently animating
   * @param {string} letter - The letter to check
   * @returns {boolean} Whether the letter is animating
   */
  const isLetterAnimating = (letter) => {
    return !!animatingLetters[letter]
  }

  /**
   * Gets the click count for a specific letter
   * @param {string} letter - The letter to get count for
   * @returns {number} Number of times the letter has been clicked
   */
  const getLetterClickCount = (letter) => {
    return clickedLetters[letter] || 0
  }

  /**
   * Checks if a letter has been clicked at least once
   * @param {string} letter - The letter to check
   * @returns {boolean} Whether the letter has been clicked
   */
  const hasLetterBeenClicked = (letter) => {
    return getLetterClickCount(letter) > 0
  }

  /**
   * Checks if a letter has reached its maximum click limit
   * @param {string} letter - The letter to check
   * @returns {boolean} Whether the letter has reached max clicks
   */
  const hasLetterReachedMaxClicks = (letter) => {
    return getLetterClickCount(letter) >= MAX_CLICKS_PER_LETTER
  }

  /**
   * Checks if all letters have been visited at least once and triggers celebration
   */
  const checkForCelebration = () => {
    if (celebrationShown.value) return

    const visitedCount = Object.keys(clickedLetters).length
    if (visitedCount === ALPHABET.length) {
      celebrationShown.value = true
      return true
    }
    return false
  }

  /**
   * Handles keyboard input for letter selection
   * @param {string} key - The keyboard key pressed
   * @returns {boolean} Whether the key was a valid letter and processed
   */
  const handleKeyboardInput = (key) => {
    const letter = key.toUpperCase()
    
    // Check if the key is a valid letter
    if (ALPHABET.includes(letter)) {
      handleLetterClick(letter)
      return true
    }
    return false
  }

  /**
   * Resets the celebration flag
   */
  const resetCelebration = () => {
    celebrationShown.value = false
  }

  /**
   * Resets all learning progress
   */
  const resetProgress = () => {
    totalClicks.value = 0
    Object.keys(clickedLetters).forEach(key => {
      delete clickedLetters[key]
    })
    Object.keys(animatingLetters).forEach(key => {
      delete animatingLetters[key]
    })
    celebrationShown.value = false
  }

  /**
   * Gets learning statistics
   * @returns {LearningStatistics} Statistics about learning progress
   */
  const getStatistics = () => {
    const exploredLetters = Object.keys(clickedLetters).length
    const totalLetters = ALPHABET_CONFIG.TOTAL_LETTERS
    const completionPercentage = Math.round((exploredLetters / totalLetters) * 100)
    
    return {
      totalClicks: totalClicks.value,
      exploredLetters,
      remainingLetters: totalLetters - exploredLetters,
      completionPercentage,
      isComplete: exploredLetters === totalLetters
    }
  }

  return {
    // State
    alphabet: ALPHABET,
    totalClicks,
    clickedLetters,
    animatingLetters,
    celebrationShown,
    
    // Constants
    MAX_CLICKS_PER_LETTER,
    
    // Methods
    handleLetterClick,
    isLetterAnimating,
    getLetterClickCount,
    hasLetterBeenClicked,
    hasLetterReachedMaxClicks,
    handleKeyboardInput,
    checkForCelebration,
    resetCelebration,
    resetProgress,
    getStatistics
  }
} 