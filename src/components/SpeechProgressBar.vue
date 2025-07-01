<script setup>
import { ref, watch, onUnmounted } from 'vue'

/**
 * Props for TimerProgressBar component
 */
const props = defineProps({
  /** Whether the progress bar should be visible */
  isVisible: {
    type: Boolean,
    default: false
  },

  /** Custom label text */
  label: {
    type: String,
    default: 'Auto-closing in 3 seconds...'
  },

  /** Custom icon */
  icon: {
    type: String,
    default: '⏱️'
  }
})

/**
 * Events emitted by TimerProgressBar component
 */
const emit = defineEmits({
  'complete': () => true
})

// Progress state
const progressWidth = ref(0)
const progressInterval = ref(null)
const startTime = ref(null)

// Constants
const TIMER_DURATION = 3000 // 3 seconds

/**
 * Start progress animation
 */
const startProgress = () => {
  // Reset state
  progressWidth.value = 0
  startTime.value = Date.now()

  // Clear any existing interval
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }

  // Update progress every 30ms for smooth animation
  progressInterval.value = setInterval(() => {
    updateProgress()
  }, 30)
}

/**
 * Update progress based on time elapsed
 */
const updateProgress = () => {
  if (!startTime.value) return

  const now = Date.now()
  const elapsed = now - startTime.value
  const progress = Math.min((elapsed / TIMER_DURATION) * 100, 100)

  progressWidth.value = progress

  // Check if timer completed
  if (progress >= 100) {
    clearInterval(progressInterval.value)
    emit('complete')
  }
}

/**
 * Reset progress
 */
const reset = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
  progressWidth.value = 0
  startTime.value = null
}

/**
 * Watch for visibility changes - start timer when visible
 */
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // Progress bar became visible - start 3-second timer
    startProgress()
  } else {
    // Progress bar hidden - reset
    reset()
  }
})

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
})
</script>

<template>
  <div v-if="isVisible" class="speech-progress-bar">
    <div class="progress-label">
      <span class="progress-icon">{{ icon }}</span>
      <span class="progress-text">{{ label }}</span>
    </div>
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${progressWidth}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.speech-progress-bar {
  margin-top: 1.5rem;
  padding: 1.5rem 0;
  border-top: 2px solid #e9ecef;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.progress-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  justify-content: center;
}

.progress-icon {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.progress-icon.animate-pulse {
  animation: pulse-icon 1.5s ease-in-out infinite;
}

.progress-text {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
}

.progress-track {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 2px solid #f8f9fa;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.1s ease-out;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.5);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(20px);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .speech-progress-bar {
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .progress-text {
    font-size: 0.9rem;
  }

  .progress-track {
    height: 10px;
  }
}
</style>