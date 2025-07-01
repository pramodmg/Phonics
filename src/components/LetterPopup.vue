<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import SpeechProgressBar from './SpeechProgressBar.vue'

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
  }
})

/**
 * Events emitted by LetterPopup component
 */
const emit = defineEmits({
  'close': () => true
})

// Progress bar state
const showProgressBar = ref(false)

// Reference to the progress bar component
const progressBarRef = ref(null)

/**
 * Handle progress bar completion
 */
const onProgressComplete = () => {
  showProgressBar.value = false
  emit('close')
}

/**
 * Watch for popup visibility changes
 */
watch(() => props.isVisible, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // Popup opened - show progress bar
    showProgressBar.value = true
  } else if (!newValue) {
    // Popup closed - hide progress bar
    showProgressBar.value = false
  }
})

/**
 * Handle close popup
 */
const closePopup = () => {
  showProgressBar.value = false
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

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  showProgressBar.value = false
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
        ×
      </button>

      <!-- Header -->
      <div class="popup-header">
        <h2 id="popup-title" class="popup-title">Letter {{ letter }}</h2>
        <p class="popup-subtitle">Learn all the forms and sounds!</p>
      </div>

      <!-- Letter Forms -->
      <div class="letter-forms-section">
        <h3>Letter Forms</h3>
        <div class="letter-forms">
          <div class="letter-form">
            <span class="form-label">Uppercase</span>
            <span class="form-letter uppercase">{{ letter }}</span>
          </div>
          <div class="letter-form">
            <span class="form-label">Lowercase</span>
            <span class="form-letter lowercase">{{ letter.toLowerCase() }}</span>
          </div>
          <div class="letter-form">
            <span class="form-label">Cursive</span>
            <span class="form-letter cursive">{{ letter.toLowerCase() }}</span>
          </div>
        </div>
      </div>

      <!-- Phonics Section -->
      <div class="phonics-section">
        <h3>Phonics Sound</h3>
        <div class="phonics-display">
          <span class="phonics-sound">"{{ phoneticSound }}"</span>
          <p class="phonics-description">This letter makes the "{{ phoneticSound }}" sound</p>
        </div>
      </div>

      <!-- Example Section -->
      <div v-if="example.word" class="example-section">
        <h3>Example Word</h3>
        <div class="example-showcase">
          <span class="example-emoji-large">{{ example.emoji }}</span>
          <div class="example-text">
            <span class="example-word-large">{{ example.word }}</span>
            <p class="example-description">{{ example.word }} starts with the letter {{ letter }}!</p>
          </div>
        </div>
      </div>

      <!-- All Examples -->
      <div v-if="letterInfo.examples && letterInfo.examples.length > 1" class="all-examples-section">
        <h3>More Examples</h3>
        <div class="examples-grid">
          <div 
            v-for="(ex, index) in letterInfo.examples" 
            :key="index"
            class="mini-example"
            :class="{ active: ex.word === example.word }"
          >
            <span class="mini-emoji">{{ ex.emoji }}</span>
            <span class="mini-word">{{ ex.word }}</span>
          </div>
        </div>
      </div>



      <!-- Timer Progress Bar -->
      <SpeechProgressBar
        ref="progressBarRef"
        :is-visible="showProgressBar"
        label="Auto-closing in 3 seconds..."
        icon="⏱️"
        @complete="onProgressComplete"
      />
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* Popup content */
.popup-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: popup-enter 0.3s ease-out;
}

@keyframes popup-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
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
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

/* Header */
.popup-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-right: 2rem;
}

.popup-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.popup-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

/* Sections */
.letter-forms-section,
.phonics-section,
.example-section,
.all-examples-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.all-examples-section {
  border-bottom: none;
  margin-bottom: 0;
}

.letter-forms-section h3,
.phonics-section h3,
.example-section h3,
.all-examples-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  text-align: center;
}

/* Letter forms */
.letter-forms {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.letter-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-letter {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  min-width: 80px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.form-letter.uppercase {
  color: #007bff;
  border-color: #007bff;
}

.form-letter.lowercase {
  color: #28a745;
  border-color: #28a745;
}

.form-letter.cursive {
  color: #8e44ad;
  border-color: #8e44ad;
  font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
  font-style: italic;
}

/* Phonics */
.phonics-display {
  text-align: center;
}

.phonics-sound {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fd7e14;
  display: block;
  margin-bottom: 0.5rem;
}

.phonics-description {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

/* Example showcase */
.example-showcase {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 12px;
  border: 2px solid #2196f3;
}

.example-emoji-large {
  font-size: 4rem;
  line-height: 1;
}

.example-text {
  flex: 1;
}

.example-word-large {
  font-size: 2rem;
  font-weight: 700;
  color: #2196f3;
  display: block;
  margin-bottom: 0.5rem;
}

.example-description {
  font-size: 1rem;
  color: #2196f3;
  margin: 0;
  font-weight: 500;
}

/* Examples grid */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
}

.mini-example {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.mini-example.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.mini-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.mini-word {
  font-size: 0.75rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.mini-example.active .mini-word {
  color: #2196f3;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .popup-content {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  
  .popup-header {
    padding-right: 1.5rem;
  }
  
  .popup-title {
    font-size: 1.75rem;
  }
  
  .letter-forms {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-letter {
    font-size: 2.5rem;
    min-width: 60px;
  }
  
  .example-showcase {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .example-emoji-large {
    font-size: 3rem;
  }
  
  .example-word-large {
    font-size: 1.5rem;
  }
  
  .examples-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .popup-content {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .form-letter {
    font-size: 2rem;
    padding: 0.75rem;
  }
  
  .phonics-sound {
    font-size: 2rem;
  }
  
  .examples-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Progress bar styles are now handled by AutoProgressBar component */
</style> 