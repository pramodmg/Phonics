<script setup>
import { computed, ref, watch } from 'vue'
import { LETTER_DATA, PHONETIC_SOUNDS } from '@/constants/alphabet'

/**
 * Props for AlphabetLetter component
 */
const props = defineProps({
  /** The letter to display */
  letter: {
    type: String,
    required: true,
    validator: (value) => /^[A-Z]$/.test(value)
  },
  
  /** Number of times this letter has been clicked */
  clickCount: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  
  /** Whether the letter is currently animating */
  isAnimating: {
    type: Boolean,
    default: false
  },
  
  /** Unique key for animation (forces re-render) */
  animationKey: {
    type: [Number, String],
    default: null
  },
  
  /** Whether the letter has reached maximum clicks */
  hasReachedMaxClicks: {
    type: Boolean,
    default: false
  },
  
  /** Whether the letter is highlighted (e.g., from keyboard input) */
  isHighlighted: {
    type: Boolean,
    default: false
  }
})

/**
 * Events emitted by AlphabetLetter component
 */
const emit = defineEmits({
  'letter-clicked': (letter) => typeof letter === 'string' && /^[A-Z]$/.test(letter),
  'example-changed': (data) => data && typeof data.letter === 'string' && data.example,
  'show-popup': (data) => data && typeof data.letter === 'string',
  'close-popup': () => true
})

/**
 * Current example index for rotation
 */
const currentExampleIndex = ref(0)

/**
 * Current example for the letter
 */
const currentExample = computed(() => {
  const letterInfo = getLetterInfo(props.letter)
  const examples = letterInfo.examples || []
  return examples[currentExampleIndex.value] || examples[0] || { word: props.letter, emoji: '❓' }
})

/**
 * Computed class names for the letter card
 */
const cardClasses = computed(() => ({
  'letter-card': true,
  'has-been-clicked': props.clickCount > 0,
  'is-animating': props.isAnimating,
  'has-reached-max-clicks': props.hasReachedMaxClicks,
  'is-highlighted': props.isHighlighted
}))

/**
 * Aria label for accessibility
 */
const ariaLabel = computed(() => {
  const baseLabel = `Letter ${props.letter}, makes the sound ${getPhoneticSound(props.letter)}. Clicked ${props.clickCount} time${props.clickCount !== 1 ? 's' : ''}.`
  if (props.clickCount > 0) {
    const example = currentExample.value
    return `${baseLabel} Currently showing: ${example.word}. Click to hear the phonics sound and see a new example.`
  }
  return `${baseLabel} Click to hear the phonics sound and see an example word.`
})

/**
 * Simple tooltip content
 */
const tooltipContent = computed(() => {
  const letterInfo = getLetterInfo(props.letter)
  const phoneticSound = getPhoneticSound(props.letter)
  const example = currentExample.value
  return `${letterInfo.name} - Sound: "${phoneticSound}" - ${example.word}`
})

/**
 * Handle letter click
 */
const handleClick = () => {
  // Don't process click if letter has reached max clicks
  if (props.hasReachedMaxClicks) {
    console.log(`Letter ${props.letter} has reached maximum clicks`)
    return
  }

  const letterInfo = getLetterInfo(props.letter)
  const examples = letterInfo.examples || []
  
  // If this is the first click, don't rotate yet, just show the first example
  if (props.clickCount === 0) {
    // Keep current index at 0 for first example
  } else {
    // Rotate to next example for subsequent clicks
    if (examples.length > 1) {
      currentExampleIndex.value = (currentExampleIndex.value + 1) % examples.length
    }
  }
  
  // Emit the current example (will be shown in sidebar)
  emit('example-changed', {
    letter: props.letter,
    example: currentExample.value,
    letterInfo: letterInfo
  })
  
  // Show popup with detailed letter information
  emit('show-popup', {
    letter: props.letter,
    letterInfo: letterInfo,
    example: currentExample.value,
    phoneticSound: getPhoneticSound(props.letter)
  })
  
  emit('letter-clicked', props.letter)
  // Speech is now handled by the parent component (AlphabetLearningBoard)
}

/**
 * Reset example index when letter changes
 */
watch(
  () => props.letter,
  () => {
    currentExampleIndex.value = 0
  }
)

/**
 * Get phonetic sound for a letter
 */
const getPhoneticSound = (letter) => {
  return PHONETIC_SOUNDS[letter] || letter
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
    
    // Function to select and set the best voice
    const selectVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        // Prefer high-quality English voices
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.default)
        ) || voices.find(voice => voice.lang.startsWith('en')) // Fallback to any English voice
        
        if (preferredVoice) {
          utterance.voice = preferredVoice
        }
      }
    }
    
    // Try to select voice immediately
    selectVoice()
    
    // If no voices are available yet, wait for them to load
    if (window.speechSynthesis.getVoices().length === 0) {
      const handleVoicesChanged = () => {
        selectVoice()
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      }
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
    }
    
    // Speak the phonetic sound
    window.speechSynthesis.speak(utterance)
    
  } catch (error) {
    console.error('Error pronouncing letter:', error)
  }
}

// Speech handling is now managed by AlphabetLearningBoard.vue
// This component only handles the click event

/**
 * Handle keyboard interaction
 */
const handleKeydown = (event) => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    handleClick()
  }
}

/**
 * Get letter information with multiple examples for rotation
 */
function getLetterInfo(letter) {
  return LETTER_DATA[letter] || {
    name: `Letter ${letter}`,
    examples: [{ word: letter, emoji: '❓' }]
  }
}
</script>

<template>
  <button
    :class="cardClasses"
    :aria-label="ariaLabel"
    :title="tooltipContent"
    @click="handleClick"
    @keydown="handleKeydown"
    role="button"
    tabindex="0"
  >
    <span class="letter-display">{{ letter }}</span>
    <span v-if="clickCount > 0" class="click-count">{{ clickCount }}</span>
  </button>
</template>

<style scoped src="../styles/AlphabetLetter.css"></style> 