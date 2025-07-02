<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'

/**
 * Props for LetterPopup component
 */
const props = defineProps({
  /** Whether the popup is visible */
  isVisible: {
    type: Boolean,
    default: false
  },
  
  /** The letter to display */
  letter: {
    type: String,
    default: ''
  },
  
  /** Letter information object */
  letterInfo: {
    type: Object,
    default: () => ({})
  },
  
  /** Current example object */
  example: {
    type: Object,
    default: () => ({})
  },
  
  /** Phonetic sound */
  phoneticSound: {
    type: String,
    default: ''
  },
  
  /** Array of visited words */
  visitedWords: {
    type: Array,
    default: () => []
  }
})

/**
 * Events emitted by LetterPopup component
 */
const emit = defineEmits({
  'close': () => true,
  'word-clicked': (word) => true
})

// Interactive state
const hoveredSection = ref(null)
const clickedElement = ref(null)
const showSuccessMessage = ref(false)
const lastClickedWord = ref('')

// Audio functions for kids-friendly interaction
const playClickSound = () => {
  // Create a simple click sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.1)
}

const playHoverSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 600
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.05)
}

// Interactive handlers
const handleSectionHover = (sectionName) => {
  hoveredSection.value = sectionName
  playHoverSound()
}

const handleSectionLeave = () => {
  hoveredSection.value = null
}

const handleElementClick = (elementType, data) => {
  clickedElement.value = { type: elementType, data }
  playClickSound()
  
  // Clear the clicked state after animation
  setTimeout(() => {
    clickedElement.value = null
  }, 300)
  
  // Emit word click for tracking
  if (elementType === 'word') {
    emit('word-clicked', data)
  }
}

// Check if word is visited
const isWordVisited = (word) => {
  return props.visitedWords.includes(word)
}

// Count visited words
const visitedWordsCount = computed(() => {
  return props.letterInfo.examples ? 
    props.letterInfo.examples.filter(ex => isWordVisited(ex.word)).length : 0
})

// Handle word click with success message
const handleWordClick = (word) => {
  handleElementClick('word', word)
  
  if (!isWordVisited(word)) {
    lastClickedWord.value = word
    showSuccessMessage.value = true
    
    // Hide success message after 2 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 2000)
  }
}



/**
 * Handle close popup
 */
const closePopup = () => {
  emit('close')
}

/**
 * Handle click outside popup
 */
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closePopup()
  }
}

/**
 * Handle keyboard events
 */
const handleKeydown = (event) => {
  if (event.code === 'Escape') {
    closePopup()
  }
}

// Computed properties for enhanced content
const letterFacts = computed(() => {
  const facts = {
    'A': ['First letter of the alphabet!', 'Most common vowel in English', 'Appears in 43,000+ English words'],
    'B': ['Second letter of the alphabet', 'Makes bubbling sounds', 'Found in 15,000+ English words'],
    'C': ['Third letter of the alphabet', 'Can sound like "K" or "S"', 'Very versatile letter'],
    'D': ['Fourth letter of the alphabet', 'Makes a drumming sound', 'Common in many languages'],
    'E': ['Most used letter in English!', 'A vowel that appears everywhere', 'In 87% of English words'],
    'F': ['Makes a fun "fff" sound', 'Like the sound of wind', 'Found in 8,000+ words'],
    'G': ['Can be hard or soft', 'Like in "go" or "gentle"', 'Great for tongue twisters'],
    'H': ['The "breathy" letter', 'Often silent in words', 'Helps other letters'],
    'I': ['The "me" vowel', 'Shortest vowel sound', 'In 70% of English words'],
    'J': ['The "jumping" letter', 'Newest letter (added 500 years ago)', 'Makes a "juh" sound'],
    'K': ['The "kicking" letter', 'Same sound as hard C', 'Often followed by N'],
    'L': ['The "liquid" letter', 'Your tongue touches the roof', 'In 40% of English words'],
    'M': ['Your lips touch together', 'Makes a humming sound', 'Very common letter'],
    'N': ['The "nasal" letter', 'Sound comes through nose', 'In 67% of English words'],
    'O': ['The "round" vowel', 'Your mouth makes a circle', 'Second most common vowel'],
    'P': ['The "popping" letter', 'Air puffs out', 'Like a little explosion'],
    'Q': ['Always followed by U', 'Makes a "kw" sound', 'The cooperative letter'],
    'R': ['The "rolling" letter', 'Can be tricky to say', 'In 75% of English words'],
    'S': ['The "snake" letter', 'Makes a hissing sound', 'Very common letter'],
    'T': ['The "tapping" letter', 'Tongue taps the roof', 'Most common consonant'],
    'U': ['The "moon" vowel', 'Your lips make a circle', 'Less common vowel'],
    'V': ['The "vibrating" letter', 'Teeth touch lower lip', 'Makes things vivid'],
    'W': ['The "double-u" letter', 'Youngest English letter', 'Makes "wuh" sound'],
    'X': ['The "crossing" letter', 'Can sound like Z or KS', 'The mysterious letter'],
    'Y': ['Sometimes a vowel!', 'The "yes" letter', 'Very flexible letter'],
    'Z': ['Last letter of alphabet', 'The "buzzing" letter', 'Like a bee sound']
  }
  return facts[props.letter] || ['Amazing letter!', 'Has its own special sound', 'Important for reading']
})

const writingTips = computed(() => {
  const tips = {
    'A': 'Start at the top, draw a line down left, then right, then add the middle bar',
    'B': 'Draw a line down, then add two bumps on the right side',
    'C': 'Draw a circle but leave it open on the right side',
    'D': 'Draw a line down, then add a curved line to make it round',
    'E': 'Draw a line down, then add three lines going right (top, middle, bottom)',
    'F': 'Like E, but only two lines going right (top and middle)',
    'G': 'Like C, but add a small line going in at the bottom',
    'H': 'Two lines down, then connect them in the middle',
    'I': 'A line down with a dot on top',
    'J': 'Like I, but curve the bottom and add a dot on top',
    'K': 'A line down, then two diagonal lines meeting in the middle',
    'L': 'A line down, then a line going right at the bottom',
    'M': 'Two lines down, then two diagonal lines meeting at the top',
    'N': 'Two lines down connected by a diagonal line',
    'O': 'Draw a perfect circle',
    'P': 'A line down, then add a bump at the top',
    'Q': 'Like O, but add a small tail at the bottom right',
    'R': 'Like P, but add a diagonal line from the middle',
    'S': 'Like a snake - curved at top and bottom',
    'T': 'A line down with a line across the top',
    'U': 'Two lines down that curve together at the bottom',
    'V': 'Two diagonal lines that meet at the bottom',
    'W': 'Like two V\'s connected together',
    'X': 'Two diagonal lines that cross in the middle',
    'Y': 'Two diagonal lines meeting in the middle, then a line down',
    'Z': 'A line across, diagonal down, then another line across'
  }
  return tips[props.letter] || 'Practice makes perfect!'
})

const rhymingWords = computed(() => {
  const rhymes = {
    'A': ['bay', 'day', 'hay', 'jay', 'kay', 'lay', 'may', 'pay', 'ray', 'say', 'way'],
    'B': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'C': ['see', 'bee', 'free', 'knee', 'tea', 'tree', 'flee', 'three', 'spree'],
    'D': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'E': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'F': ['chef', 'clef', 'deaf', 'jeff', 'ref'],
    'G': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'H': ['ache', 'bake', 'cake', 'fake', 'jake', 'lake', 'make', 'rake', 'sake', 'take', 'wake'],
    'I': ['buy', 'cry', 'dry', 'eye', 'fly', 'guy', 'high', 'lie', 'my', 'pie', 'shy', 'sky', 'try', 'why'],
    'J': ['bay', 'day', 'hay', 'kay', 'lay', 'may', 'pay', 'ray', 'say', 'way'],
    'K': ['bay', 'day', 'hay', 'jay', 'lay', 'may', 'pay', 'ray', 'say', 'way'],
    'L': ['bell', 'cell', 'dell', 'fell', 'hell', 'jell', 'sell', 'tell', 'well', 'yell'],
    'M': ['am', 'cam', 'dam', 'ham', 'jam', 'lamb', 'ram', 'slam', 'spam', 'yam'],
    'N': ['ben', 'den', 'hen', 'ken', 'men', 'pen', 'ten', 'then', 'when', 'zen'],
    'O': ['bow', 'cow', 'how', 'now', 'plow', 'row', 'sow', 'tow', 'vow', 'wow'],
    'P': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'Q': ['cue', 'due', 'few', 'hue', 'mew', 'new', 'pew', 'sue', 'true', 'view'],
    'R': ['bar', 'car', 'far', 'jar', 'mar', 'par', 'star', 'tar', 'war'],
    'S': ['chess', 'dress', 'guess', 'less', 'mess', 'press', 'stress', 'yes'],
    'T': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'U': ['blue', 'clue', 'crew', 'drew', 'flew', 'glue', 'grew', 'knew', 'screw', 'threw', 'true'],
    'V': ['bee', 'free', 'glee', 'knee', 'sea', 'tea', 'tree', 'flee', 'three'],
    'W': ['blue', 'clue', 'crew', 'drew', 'flew', 'glue', 'grew', 'knew', 'screw', 'threw', 'true'],
    'X': ['hex', 'flex', 'next', 'sex', 'tex', 'vex'],
    'Y': ['buy', 'cry', 'dry', 'eye', 'fly', 'guy', 'high', 'lie', 'my', 'pie', 'shy', 'sky', 'try', 'why'],
    'Z': ['fuzz', 'buzz', 'jazz', 'fizz', 'quiz']
  }
  return rhymes[props.letter]?.slice(0, 6) || ['fun', 'sun', 'run']
})

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  // No cleanup needed
})
</script>

<template>
  <div
    v-if="isVisible"
    class="popup-overlay"
    @click="handleOverlayClick"
    @keydown="handleKeydown"
    tabindex="0"
  >
    <div class="popup-content" role="dialog" aria-labelledby="popup-title">
      <!-- Close button -->
      <button class="close-button" @click="closePopup" aria-label="Close popup">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="close-text">Close</span>
      </button>

      <!-- Hero Header -->
      <div class="hero-header">
        <div class="hero-left">
          <div class="letter-display">
            <span class="main-letter">{{ letter }}</span>
            <div class="phonics-info">
              <span class="phonics-sound" @click="handleElementClick('sound', phoneticSound)">
                "{{ phoneticSound }}"
              </span>
              <span class="phonics-label">sounds like</span>
            </div>
          </div>
        </div>
        
        <div class="hero-right" v-if="example.word">
          <div class="featured-word-card">
            <span class="featured-emoji">{{ example.emoji }}</span>
            <div class="featured-word-info">
              <span class="featured-word">{{ example.word }}</span>
              <span class="featured-subtitle">Featured Word</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Letter Forms & Rhymes -->
      <div class="letter-forms-section">
        <div class="letter-forms-grid">
          <div class="letter-form" @click="handleElementClick('letter', letter)">
            <span class="form-letter uppercase">{{ letter }}</span>
            <span class="form-label">Uppercase</span>
          </div>
          <div class="letter-form" @click="handleElementClick('letter', letter.toLowerCase())">
            <span class="form-letter lowercase">{{ letter.toLowerCase() }}</span>
            <span class="form-label">Lowercase</span>
          </div>
          <div class="letter-form" @click="handleElementClick('letter', letter.toLowerCase())">
            <span class="form-letter cursive">{{ letter.toLowerCase() }}</span>
            <span class="form-label">Script</span>
          </div>
        </div>
        
        <!-- Rhymes Compact Row -->
        <div class="rhymes-compact-row">
          <span class="rhymes-label">🎵 Rhymes:</span>
          <div class="rhymes-tags">
            <span 
              v-for="(word, index) in rhymingWords" 
              :key="index" 
              class="rhyme-tag"
              @click="handleElementClick('rhyme', word)"
            >
              {{ word }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Content -->
        <div class="content-section">
          <div class="facts-card">
            <h3 class="section-title">
              <span class="title-icon">💡</span>
              Fun Facts
            </h3>
            <div class="facts-list">
              <div 
                v-for="(fact, index) in letterFacts" 
                :key="index" 
                class="fact-item"
                @click="handleElementClick('fact', fact)"
              >
                <span class="fact-number">{{ index + 1 }}</span>
                <span class="fact-text">{{ fact }}</span>
              </div>
            </div>
          </div>
          
          <div class="writing-card">
            <h3 class="section-title">
              <span class="title-icon">✍️</span>
              How to Write
            </h3>
            <p class="writing-instruction">{{ writingTips }}</p>
          </div>
        </div>

        <!-- Right Content -->
        <div class="content-section">
          <div class="examples-card">
            <div class="examples-header">
              <h3 class="section-title">
                <span class="title-icon">📚</span>
                Example Words
              </h3>
              <div class="progress-badge" v-if="visitedWordsCount > 0">
                {{ visitedWordsCount }}/{{ letterInfo.examples?.length || 0 }}
              </div>
            </div>
            
            <div class="examples-grid">
              <div 
                v-for="(ex, index) in letterInfo.examples" 
                :key="index"
                class="example-card"
                :class="{ 
                  visited: isWordVisited(ex.word),
                  featured: ex.word === example.word
                }"
                @click="handleWordClick(ex.word)"
              >
                <span class="example-emoji">{{ ex.emoji }}</span>
                <span class="example-word">{{ ex.word }}</span>
                <div v-if="isWordVisited(ex.word)" class="visited-check">
                  <span class="check-icon">✓</span>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </div>

      <!-- Success Message -->
      <Transition name="success">
        <div v-if="showSuccessMessage" class="success-message">
          <div class="success-content">
            <span class="success-icon">🎉</span>
            <span class="success-text">Great job exploring "{{ lastClickedWord }}"!</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Popup overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem 1rem;
}

/* Popup content */
.popup-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 0;
  max-width: 95vw;
  width: 100%;
  max-width: 1100px;
  height: auto;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  animation: popup-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
}

@keyframes popup-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Close button */
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  cursor: pointer;
  color: white;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  font-weight: 600;
  font-size: 0.9rem;
}

.close-button:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.close-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.close-text {
  font-size: 0.85rem;
  font-weight: 600;
}

/* Hero Header */
.hero-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem;
  padding-top: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.letter-display {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.main-letter {
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.phonics-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.phonics-sound {
  font-size: 1.5rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phonics-sound:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.phonics-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
}

.featured-word-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.featured-emoji {
  font-size: 2.5rem;
}

.featured-word-info {
  display: flex;
  flex-direction: column;
}

.featured-word {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.featured-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Letter Forms Section */
.letter-forms-section {
  padding: 1rem 2rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.letter-forms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.letter-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: #f8fafc;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.letter-form:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.form-letter {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.form-letter.uppercase {
  color: #667eea;
}

.form-letter.lowercase {
  color: #f093fb;
}

.form-letter.cursive {
  color: #4facfe;
  font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
  font-style: italic;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Rhymes Compact Row */
.rhymes-compact-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.rhymes-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
}

.rhymes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
}

.rhyme-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rhyme-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
}

/* Main Content */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
}

.content-section {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-section:first-child {
  border-right: 1px solid #e2e8f0;
}

/* Content Cards */
.facts-card,
.writing-card,
.examples-card,
.rhymes-card {
  background: #f8fafc;
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.2rem;
}

/* Facts */
.facts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 10px;
}

.fact-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.fact-number {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.fact-text {
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.4;
}

/* Writing */
.writing-instruction {
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.5;
  margin: 0;
  background: white;
  padding: 0.75rem;
  border-radius: 10px;
  border-left: 4px solid #10b981;
}

/* Examples */
.examples-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.progress-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.example-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.example-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.example-card.visited {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #10b981;
}

.example-card.featured {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  border-color: #8b5cf6;
}

.example-emoji {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
}

.example-word {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
}

.visited-check {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #10b981;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}



/* Success Message */
.success-message {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}

.success-content {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.success-icon {
  font-size: 1.2rem;
}

/* Success Animation */
.success-enter-active,
.success-leave-active {
  transition: all 0.3s ease;
}

.success-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.success-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .popup-overlay {
    padding: 1rem;
  }

  .popup-content {
    max-width: 95vw;
    height: auto;
    max-height: 90vh;
  }

  .close-button {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .close-text {
    font-size: 0.75rem;
  }

  .hero-header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
    padding: 1rem 1.5rem 0.75rem;
    padding-top: 1.5rem;
  }

  .main-letter {
    font-size: 2.5rem;
  }

  .letter-forms-section {
    padding: 0.75rem 1.5rem;
  }

  .letter-forms-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .letter-form {
    padding: 0.75rem 0.5rem;
  }

  .form-letter {
    font-size: 1.5rem;
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .content-section {
    padding: 1rem;
  }

  .content-section:first-child {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .examples-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .example-card {
    padding: 0.5rem;
  }

  .example-emoji {
    font-size: 1.3rem;
  }

  .example-word {
    font-size: 0.85rem;
  }

  .rhymes-compact-row {
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
  }

  .rhymes-tags {
    gap: 0.3rem;
  }

  .rhyme-tag {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
}

/* Header */
.popup-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-right: 3rem;
  flex-shrink: 0;
}

.popup-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2d3436;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.popup-subtitle {
  font-size: 1rem;
  color: #636e72;
  margin: 0;
  font-weight: 500;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  margin-bottom: 1rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Sections */
.section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 1rem;
  border: none;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.section:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

.section-hovered {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.section h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #2d3436;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Interactive Elements */
.element-clicked {
  animation: clickPulse 0.3s ease-out;
  transform: scale(1.1);
}

@keyframes clickPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1.1); }
}

/* Letter Forms Interactivity */
.letter-form {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.letter-form:hover {
  transform: translateY(-3px);
}

.sparkle-effect {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.letter-form:hover .sparkle-effect {
  opacity: 1;
  animation: sparkle 1s infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
}

.sparkle-effect::before {
  content: '✨';
  font-size: 14px;
}

/* Phonics Sound Interactivity */
.phonics-sound {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.phonics-sound:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(253, 126, 20, 0.3);
}

.pulse-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  opacity: 0;
  border-radius: 8px;
  background: rgba(253, 126, 20, 0.2);
}

.phonics-sound:hover .pulse-effect {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
}

/* Writing Tips Animation */
.writing-tip {
  position: relative;
}

.writing-animation {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.section-hovered .writing-animation {
  opacity: 1;
  animation: write 2s ease-in-out infinite;
}

@keyframes write {
  0%, 100% { transform: rotate(-10deg) translate(0, 0); }
  25% { transform: rotate(5deg) translate(2px, -2px); }
  50% { transform: rotate(-5deg) translate(4px, -1px); }
  75% { transform: rotate(10deg) translate(2px, -3px); }
}

/* Letter Forms */
.letter-forms {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.letter-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #74b9ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-letter {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  padding: 0.75rem;
  background: white;
  border-radius: 10px;
  min-width: 55px;
  text-align: center;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.form-letter.uppercase {
  color: #74b9ff;
}

.form-letter.lowercase {
  color: #55a3ff;
}

.form-letter.cursive {
  color: #a29bfe;
  font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
  font-style: italic;
}








</style> 