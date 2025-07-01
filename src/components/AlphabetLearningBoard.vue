<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAlphabetLearning } from '../composables/useAlphabetLearning.js'
import AlphabetLetter from './AlphabetLetter.vue'
import LetterPopup from './LetterPopup.vue'
import ConfettiCelebration from './ConfettiCelebration.vue'
import { achievementService } from '../services/achievementService.js'
import { PROGRESS_MESSAGES, A11Y_CONFIG } from '../constants/alphabet.js'

// Use the alphabet learning composable
const {
  alphabet,
  totalClicks,
  handleLetterClick,
  isLetterAnimating,
  getLetterClickCount,
  hasLetterBeenClicked,
  hasLetterReachedMaxClicks,
  handleKeyboardInput,
  resetProgress,
  getStatistics,
  animatingLetters,
  celebrationShown,
  resetCelebration,
  MAX_CLICKS_PER_LETTER
} = useAlphabetLearning()

// Current active letter state
const currentActiveLetter = ref(null)
const currentActiveExample = ref(null)

// Popup state
const showPopup = ref(false)
const popupData = ref({
  letter: '',
  letterInfo: {},
  example: {},
  phoneticSound: ''
})

// Keyboard navigation state
const highlightedLetter = ref(null)
const highlightTimeout = ref(null)

// Reload prevention notification
const showReloadNotification = ref(false)
const reloadNotificationTimeout = ref(null)

// Progress tracking removed - popup now uses simple 3-second timer

// Computed properties for UI state
const stats = computed(() => getStatistics())

const achievements = computed(() => {
  const currentStats = stats.value
  return achievementService.getUnlockedAchievements(currentStats)
})

const progressMessage = computed(() => {
  const { exploredLetters, isComplete } = stats.value
  
  if (isComplete) return PROGRESS_MESSAGES.COMPLETE
  if (exploredLetters === 0) return PROGRESS_MESSAGES.INITIAL
  if (exploredLetters < 5) return PROGRESS_MESSAGES.FIRST_STEPS
  if (exploredLetters < 13) return PROGRESS_MESSAGES.BUILDING_MOMENTUM
  if (exploredLetters < 20) return PROGRESS_MESSAGES.HOME_STRETCH
  return PROGRESS_MESSAGES.ALMOST_COMPLETE
})

/**
 * Handle letter click events from child components
 */
const onLetterClick = (letter) => {
  console.log(`Letter ${letter} clicked`)
  
  // 1. Handle click counting and animation
  handleLetterClick(letter)
  
  // 2. Get letter data and current example
  const letterData = getLetterData(letter)
  const currentExample = getCurrentExampleForLetter(letter)
  
  // 3. Update sidebar
  currentActiveLetter.value = letter
  currentActiveExample.value = currentExample
  
  // 4. Set popup data and show popup
  popupData.value = {
    letter: letter,
    letterInfo: letterData,
    example: currentExample,
    phoneticSound: getPhoneticSound(letter)
  }
  showPopup.value = true
  
  // 5. Start speech immediately
  pronounceLetterAndWord(letter, currentExample)
}

/**
 * Handle example change events from child components
 */
const onExampleChanged = (data) => {
  currentActiveLetter.value = data.letter
  currentActiveExample.value = data.example
}

/**
 * Handle show popup events from child components
 */
const onShowPopup = (data) => {
  popupData.value = data
  showPopup.value = true
}

/**
 * Handle close popup
 */
const onClosePopup = () => {
  showPopup.value = false
}

// Speech is now managed directly in this component
// No need for child component speech event handlers

/**
 * Reset all learning progress
 */
const onResetProgress = () => {
  if (confirm('Are you sure you want to reset all your progress?')) {
    resetProgress()
  }
}

// Single help state
const showHelp = ref(false)

/**
 * Toggle help visibility
 */
const toggleHelp = () => {
  showHelp.value = !showHelp.value
  
  if (showHelp.value) {
    // Add outside click listener
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick)
    }, 0)
  } else {
    document.removeEventListener('click', handleOutsideClick)
  }
}

/**
 * Handle outside click to close help
 */
const handleOutsideClick = (event) => {
  const isHelpButton = event.target.closest('.help-button')
  const isHelpContent = event.target.closest('.help-content')
  
  if (!isHelpButton && !isHelpContent) {
    showHelp.value = false
    document.removeEventListener('click', handleOutsideClick)
  }
}

/**
 * Handle keyboard events for letter navigation and system shortcuts
 */
const handleKeyDown = (event) => {
  // Handle Command+R (macOS) or Ctrl+R (Windows/Linux) to prevent page reload
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'r') {
    event.preventDefault()
    showReloadPrevention()
    return
  }
  
  // Handle F5 key (another common reload shortcut)
  if (event.key === 'F5') {
    event.preventDefault()
    showReloadPrevention()
    return
  }
  
  // Handle Ctrl+F5 or Cmd+Shift+R (hard reload shortcuts)
  if ((event.ctrlKey && event.key === 'F5') || 
      ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'r')) {
    event.preventDefault()
    showReloadPrevention()
    return
  }
  
  // Only handle letter keys (a-z, A-Z) - strict filtering
  const key = event.key
  
  // Check if it's exactly one letter character
  if (!/^[a-zA-Z]$/.test(key)) {
    return // Ignore non-letter keys
  }
  
  // Prevent default behavior for letter keys to avoid any unwanted browser actions
  event.preventDefault()
  
  const letter = key.toUpperCase()
  
  // Check if letter has reached max clicks before processing
  if (hasLetterReachedMaxClicks(letter)) {
    console.log(`Letter ${letter} has reached maximum clicks`)
    return
  }
  
  // Highlight the letter briefly
  highlightedLetter.value = letter
  
  // Clear any existing timeout
  if (highlightTimeout.value) {
    clearTimeout(highlightTimeout.value)
  }
  
  // Set timeout to remove highlight
  highlightTimeout.value = setTimeout(() => {
    highlightedLetter.value = null
  }, 1000) // Highlight for 1 second
  
  // Handle the keyboard input using the same logic as mouse clicks to avoid duplication
  onLetterClick(letter)
}

/**
 * Handle confetti celebration close
 */
const onCloseCelebration = () => {
  resetCelebration()
}



/**
 * Show reload prevention notification
 */
const showReloadPrevention = () => {
  showReloadNotification.value = true
  
  // Clear any existing timeout
  if (reloadNotificationTimeout.value) {
    clearTimeout(reloadNotificationTimeout.value)
  }
  
  // Auto-hide notification after 3 seconds
  reloadNotificationTimeout.value = setTimeout(() => {
    showReloadNotification.value = false
  }, 3000)
}

/**
 * Get letter data for a given letter
 */
const getLetterData = (letter) => {
  const letterData = {
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
        { word: 'Book', emoji: '📚' },
        { word: 'Butterfly', emoji: '🦋' },
        { word: 'Bear', emoji: '🐻' }
      ]
    },
    'C': { 
      name: 'Letter C', 
      examples: [
        { word: 'Cat', emoji: '🐱' },
        { word: 'Car', emoji: '🚗' },
        { word: 'Cake', emoji: '🎂' },
        { word: 'Cloud', emoji: '☁️' }
      ]
    },
    'D': { 
      name: 'Letter D', 
      examples: [
        { word: 'Dog', emoji: '🐶' },
        { word: 'Duck', emoji: '🦆' },
        { word: 'Dragon', emoji: '🐉' },
        { word: 'Diamond', emoji: '💎' }
      ]
    },
    'E': { 
      name: 'Letter E', 
      examples: [
        { word: 'Elephant', emoji: '🐘' },
        { word: 'Egg', emoji: '🥚' },
        { word: 'Earth', emoji: '🌍' },
        { word: 'Eagle', emoji: '🦅' }
      ]
    },
    'F': { 
      name: 'Letter F', 
      examples: [
        { word: 'Fish', emoji: '🐠' },
        { word: 'Fire', emoji: '🔥' },
        { word: 'Flower', emoji: '🌸' },
        { word: 'Frog', emoji: '🐸' }
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
  
  return letterData[letter] || { 
    name: `Letter ${letter}`, 
    examples: [{ word: letter, emoji: '❓' }] 
  }
}

/**
 * Get current example for a letter based on click count
 */
const getCurrentExampleForLetter = (letter) => {
  const letterData = getLetterData(letter)
  const examples = letterData.examples || []
  const clickCount = getLetterClickCount(letter)
  
  // Use click count to determine which example to show (cycling through)
  const exampleIndex = Math.max(0, (clickCount - 1) % examples.length)
  return examples[exampleIndex] || examples[0] || { word: letter, emoji: '❓' }
}

/**
 * Get phonetic sound for a letter
 */
const getPhoneticSound = (letter) => {
  const phoneticSounds = {
    'A': 'ah',           'B': 'buh',          'C': 'kuh',          'D': 'duh',
    'E': 'eh',           'F': 'fuh',          'G': 'guh',          'H': 'huh',
    'I': 'ih',           'J': 'juh',          'K': 'kuh',          'L': 'luh',
    'M': 'muh',          'N': 'nuh',          'O': 'oh',           'P': 'puh',
    'Q': 'kwuh',         'R': 'ruh',          'S': 'sss',          'T': 'tuh',
    'U': 'uh',           'V': 'vuh',          'W': 'wuh',          'X': 'ks',
    'Y': 'yuh',          'Z': 'zzz'
  }
  
  return phoneticSounds[letter] || letter
}

/**
 * Pronounce the letter using Web Speech API with phonics
 */
const pronounceLetter = (letter) => {
  // Check if speech synthesis is supported
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser')
    return
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    // Get phonetic sound for the letter
    const phoneticSound = getPhoneticSound(letter)
    
    // Create utterance for the phonetic sound
    const utterance = new SpeechSynthesisUtterance(phoneticSound)
    
    // Configure speech settings for clear phonics pronunciation
    utterance.rate = 0.6 // Even slower for phonics clarity
    utterance.pitch = 1.1 // Slightly lower pitch for phonics
    utterance.volume = 0.8 // Comfortable volume
    
    // Speak the phonetic sound
    window.speechSynthesis.speak(utterance)
  } catch (error) {
    console.warn('Error with speech synthesis:', error)
  }
}

/**
 * Pronounce both the letter and the example word with emoji callout
 */
const pronounceLetterAndWord = (letter, example) => {
  // Check if speech synthesis is supported
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser')
    return
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    console.log(`Starting speech for ${letter}: ${example?.word || letter}`)
    
    // Get phonetic sound for the letter
    const phoneticSound = getPhoneticSound(letter)
    const wordText = example?.word || letter
    
    // Use just the word for speech (simpler and more reliable)
    const utterance = new SpeechSynthesisUtterance(wordText)
    utterance.rate = 0.6
    utterance.pitch = 1.1
    utterance.volume = 0.8
    
    // Handle speech completion
    utterance.onend = () => {
      console.log('Speech completed')
    }
    
    // Handle speech error
    utterance.onerror = () => {
      console.log('Speech error occurred')
    }
    
    // Start speaking
    window.speechSynthesis.speak(utterance)
    
  } catch (error) {
    console.warn('Error with speech synthesis:', error)
  }
}

/**
 * Pronounce just the example word (for emoji callout)
 */
const pronounceWord = (word) => {
  // Check if speech synthesis is supported
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser')
    return
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    // Create utterance for the word
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.rate = 0.7
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    // Speak the word
    window.speechSynthesis.speak(utterance)
  } catch (error) {
    console.warn('Error with speech synthesis:', error)
  }
}

/**
 * Handle browser reload attempts (refresh button, tab close, etc.)
 */
const handleBeforeUnload = (event) => {
  // Only show warning if user has made progress
  if (stats.value.totalClicks > 0) {
    const message = 'You have learning progress that will be lost. Are you sure you want to leave?'
    event.preventDefault()
    event.returnValue = message // For Chrome
    return message // For other browsers
  }
}

/**
 * Setup keyboard event listeners and page unload protection
 */
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
  
  // Clear any pending timeouts
  if (highlightTimeout.value) {
    clearTimeout(highlightTimeout.value)
  }
  if (reloadNotificationTimeout.value) {
    clearTimeout(reloadNotificationTimeout.value)
  }
})
</script>

<template>
  <div class="alphabet-learning-board">
    <!-- Header -->
    <header class="header">
      <h1 class="title">🌟 Learn Phonics & ABCs! 🌟</h1>
      <p class="subtitle">Fun Interactive Phonics Learning for Kids</p>
      <p class="description">Click on each letter to explore uppercase, lowercase, and cursive forms with phonics sounds and colorful examples!</p>
      

    </header>

    <!-- Main Grid -->
    <main 
      class="alphabet-grid" 
      role="main"
      :aria-label="A11Y_CONFIG.ARIA_LABELS.ALPHABET_GRID"
    >
      <AlphabetLetter
        v-for="letter in alphabet"
        :key="letter"
        :letter="letter"
        :click-count="getLetterClickCount(letter)"
        :is-animating="isLetterAnimating(letter)"
        :animation-key="animatingLetters[letter]"
        :has-reached-max-clicks="hasLetterReachedMaxClicks(letter)"
        :is-highlighted="highlightedLetter === letter"
        @letter-clicked="onLetterClick"
        @example-changed="onExampleChanged"
        @show-popup="onShowPopup"
        @close-popup="onClosePopup"
      />
    </main>

    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Progress -->
      <section class="progress">
        <h2>Your Progress</h2>
        <p class="progress-message">{{ progressMessage }}</p>
        
        <div class="stats">
          <div class="stat">
            <span class="stat-label">Letters Explored:</span>
            <span class="stat-value">{{ stats.exploredLetters }}/26</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Clicks:</span>
            <span class="stat-value">{{ stats.totalClicks }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Progress:</span>
            <span class="stat-value">{{ stats.completionPercentage }}%</span>
          </div>
        </div>

        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${stats.completionPercentage}%` }"
          ></div>
        </div>
      </section>

      <!-- Current Letter Display -->
      <section v-if="currentActiveLetter && currentActiveExample" class="current-letter-display">
        <h2>Current Letter</h2>
        <div class="letter-showcase">
          <div class="showcase-letter">{{ currentActiveLetter }}</div>
          <div class="showcase-example">
            <span class="showcase-emoji">{{ currentActiveExample.emoji }}</span>
            <span class="showcase-word">{{ currentActiveExample.word }}</span>
          </div>
        </div>
      </section>

      <!-- Achievements -->
      <section v-if="achievements.length > 0" class="achievements">
        <h2>Achievements</h2>
        <div class="achievement-list">
          <div 
            v-for="achievement in achievements" 
            :key="achievement.id"
            class="achievement"
            :title="achievement.description"
          >
            <font-awesome-icon :icon="achievement.icon" />
            <span>{{ achievement.displayText }}</span>
          </div>
        </div>
      </section>

      <!-- Controls -->
      <div class="controls">
        <button 
          class="reset-button"
          @click="onResetProgress"
          :disabled="stats.totalClicks === 0"
        >
          Clear Progress
        </button>
        
        <button 
          class="help-button"
          @click="toggleHelp"
          :class="{ active: showHelp }"
        >
          Help
        </button>
      </div>
    </aside>

    <!-- Help Content -->
    <div v-if="showHelp" class="help-content">
      <div class="help-card">
        <h3>How to Use</h3>
        <ul>
          <li>Click any letter to hear its phonics sound and open detailed view</li>
          <li>Press any letter key on your keyboard to quickly select it!</li>
          <li>Popup automatically closes after 3 seconds</li>
          <li>See uppercase, lowercase, and cursive forms of each letter</li>
          <li>Discover fun images and words that start with each letter</li>
          <li>Images change each time you click - explore all examples!</li>
          <li>Letters turn blue once you've explored them</li>
          <li>Each letter can be clicked up to {{ MAX_CLICKS_PER_LETTER }} times (turns green when complete)</li>
          <li>Complete all 26 letters to unlock a special celebration! 🎉</li>
          <li>Numbers show how many times you've clicked each letter</li>
          <li>Page reload protection keeps your progress safe! 🛡️</li>
        </ul>
      </div>
    </div>

    <!-- Letter Popup -->
    <LetterPopup
      :is-visible="showPopup"
      :letter="popupData.letter"
      :letter-info="popupData.letterInfo"
      :example="popupData.example"
      :phonetic-sound="popupData.phoneticSound"
      @close="onClosePopup"
    />

    <!-- Confetti Celebration -->
    <ConfettiCelebration
      :is-visible="celebrationShown"
      @close="onCloseCelebration"
    />

    <!-- Reload Prevention Notification -->
    <div v-if="showReloadNotification" class="reload-notification">
      <div class="notification-content">
        <div class="notification-icon">🛡️</div>
        <div class="notification-text">
          <strong>Page reload prevented!</strong>
          <br>Your learning progress is protected.
        </div>
        <button 
          class="notification-close" 
          @click="showReloadNotification = false"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/AlphabetLearningBoard.css"></style> 