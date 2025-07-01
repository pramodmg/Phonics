<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'

/**
 * Props for AutoProgressBar component
 */
const props = defineProps({
  /** Whether the progress bar should be visible */
  isVisible: {
    type: Boolean,
    default: false
  },
  
  /** Duration in milliseconds for the progress bar to complete */
  duration: {
    type: Number,
    default: 3000
  },
  
  /** Whether to auto-start when becoming visible */
  autoStart: {
    type: Boolean,
    default: true
  },
  
  /** Custom label text */
  label: {
    type: String,
    default: 'Progress...'
  },
  
  /** Custom icon */
  icon: {
    type: String,
    default: '⏳'
  },
  
  /** Whether the progress is paused */
  isPaused: {
    type: Boolean,
    default: false
  }
})

/**
 * Events emitted by AutoProgressBar component
 */
const emit = defineEmits({
  'complete': () => true,
  'started': () => true,
  'paused': () => true,
  'resumed': () => true
})

// Progress state
const progressWidth = ref(0)
const isRunning = ref(false)
const startTime = ref(null)
const pausedTime = ref(0)
const progressInterval = ref(null)

// Computed properties
const isActive = computed(() => props.isVisible && isRunning.value)

/**
 * Start the progress bar
 */
const start = () => {
  if (isRunning.value) return
  
  console.log(`Starting progress bar with duration: ${props.duration}ms`)
  isRunning.value = true
  progressWidth.value = 0
  startTime.value = Date.now()
  pausedTime.value = 0
  
  startProgressAnimation()
  emit('started')
}

/**
 * Pause the progress bar
 */
const pause = () => {
  if (!isRunning.value) return
  
  console.log('Pausing progress bar')
  clearInterval(progressInterval.value)
  pausedTime.value = Date.now() - startTime.value
  isRunning.value = false
  emit('paused')
}

/**
 * Resume the progress bar
 */
const resume = () => {
  if (isRunning.value) return
  
  console.log('Resuming progress bar')
  isRunning.value = true
  startTime.value = Date.now() - pausedTime.value
  startProgressAnimation()
  emit('resumed')
}

/**
 * Reset the progress bar
 */
const reset = () => {
  console.log('Resetting progress bar')
  clearInterval(progressInterval.value)
  isRunning.value = false
  progressWidth.value = 0
  startTime.value = null
  pausedTime.value = 0
}

/**
 * Complete the progress bar immediately
 */
const complete = () => {
  const elapsed = startTime.value ? Date.now() - startTime.value : 0
  console.log(`Completing progress bar after ${elapsed}ms runtime`)
  clearInterval(progressInterval.value)
  progressWidth.value = 100
  isRunning.value = false
  
  // Longer delay to show completion before emitting
  setTimeout(() => {
    console.log('Emitting complete event')
    emit('complete')
  }, 500) // Increased from 200ms
}

/**
 * Start the progress animation loop
 */
const startProgressAnimation = () => {
  clearInterval(progressInterval.value)
  
  progressInterval.value = setInterval(() => {
    if (!isRunning.value) {
      clearInterval(progressInterval.value)
      return
    }
    
    const elapsed = Date.now() - startTime.value
    const progress = Math.min((elapsed / props.duration) * 100, 100)
    progressWidth.value = progress
    
    // Add minimum runtime protection - don't complete before 3 seconds
    const minimumRuntime = 3000
    if (progress >= 100 && elapsed >= minimumRuntime) {
      console.log(`Progress bar completing after ${elapsed}ms (duration: ${props.duration}ms)`)
      complete()
    } else if (progress >= 100) {
      console.log(`Progress would complete but waiting for minimum runtime (${elapsed}ms < ${minimumRuntime}ms)`)
    }
  }, 50) // Update every 50ms for smooth animation
}

/**
 * Watch for visibility changes
 */
watch(() => props.isVisible, (newValue) => {
  if (newValue && props.autoStart && !isRunning.value) {
    start()
  } else if (!newValue) {
    reset()
  }
}, { immediate: true })

/**
 * Watch for pause state changes
 */
watch(() => props.isPaused, (newValue) => {
  if (newValue && isRunning.value) {
    pause()
  } else if (!newValue && !isRunning.value && props.isVisible) {
    resume()
  }
})

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  clearInterval(progressInterval.value)
})

// Expose methods for parent components
defineExpose({
  start,
  pause,
  resume,
  reset,
  complete
})
</script>

<template>
  <div v-if="isVisible" class="auto-progress-bar">
    <div class="progress-label">
      <span class="progress-icon" :class="{ 'animate-pulse': isActive }">{{ icon }}</span>
      <span class="progress-text">{{ label }}</span>
    </div>
    <div class="progress-track">
      <div 
        class="progress-fill" 
        :style="{ width: `${progressWidth}%` }"
        :class="{ 'paused': isPaused }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.auto-progress-bar {
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
  transition: width 0.3s ease-out;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.5);
  position: relative;
}

.progress-fill.paused {
  background: linear-gradient(90deg, #ffc107 0%, #ff8c00 100%);
  animation: pause-pulse 1s ease-in-out infinite;
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

@keyframes pause-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .auto-progress-bar {
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