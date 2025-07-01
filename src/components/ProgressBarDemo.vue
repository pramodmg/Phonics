<script setup>
import { ref } from 'vue'
import AutoProgressBar from './AutoProgressBar.vue'

// Demo state
const showSpeechProgress = ref(false)
const showDownloadProgress = ref(false)
const showTimerProgress = ref(false)

// Progress bar references
const speechBarRef = ref(null)
const downloadBarRef = ref(null)
const timerBarRef = ref(null)

/**
 * Start speech simulation
 */
const startSpeechDemo = () => {
  showSpeechProgress.value = true
}

/**
 * Start download simulation
 */
const startDownloadDemo = () => {
  showDownloadProgress.value = true
}

/**
 * Start timer simulation
 */
const startTimerDemo = () => {
  showTimerProgress.value = true
}

/**
 * Handle progress completion
 */
const onSpeechComplete = () => {
  console.log('Speech simulation completed!')
  showSpeechProgress.value = false
}

const onDownloadComplete = () => {
  console.log('Download simulation completed!')
  showDownloadProgress.value = false
}

const onTimerComplete = () => {
  console.log('Timer completed!')
  showTimerProgress.value = false
}

/**
 * Pause/Resume demo
 */
const pauseDownload = () => {
  downloadBarRef.value?.pause()
}

const resumeDownload = () => {
  downloadBarRef.value?.resume()
}

const resetTimer = () => {
  timerBarRef.value?.reset()
}
</script>

<template>
  <div class="progress-demo">
    <h2>Independent Progress Bar Demo</h2>
    <p>Demonstrates how the AutoProgressBar component can be used independently for different purposes.</p>
    
    <!-- Speech Progress Example -->
    <div class="demo-section">
      <h3>Speech Progress (5 seconds)</h3>
      <button @click="startSpeechDemo" :disabled="showSpeechProgress">
        Start Speech Simulation
      </button>
      <AutoProgressBar
        ref="speechBarRef"
        :is-visible="showSpeechProgress"
        :duration="5000"
        :auto-start="true"
        label="Speaking letter and word..."
        icon="🔊"
        @complete="onSpeechComplete"
      />
    </div>

    <!-- Download Progress Example -->
    <div class="demo-section">
      <h3>Download Progress (8 seconds)</h3>
      <div class="button-group">
        <button @click="startDownloadDemo" :disabled="showDownloadProgress">
          Start Download
        </button>
        <button @click="pauseDownload" :disabled="!showDownloadProgress">
          Pause
        </button>
        <button @click="resumeDownload" :disabled="!showDownloadProgress">
          Resume
        </button>
      </div>
      <AutoProgressBar
        ref="downloadBarRef"
        :is-visible="showDownloadProgress"
        :duration="8000"
        :auto-start="true"
        label="Downloading file..."
        icon="📥"
        @complete="onDownloadComplete"
      />
    </div>

    <!-- Timer Example -->
    <div class="demo-section">
      <h3>Timer Progress (3 seconds)</h3>
      <div class="button-group">
        <button @click="startTimerDemo" :disabled="showTimerProgress">
          Start Timer
        </button>
        <button @click="resetTimer" :disabled="!showTimerProgress">
          Reset
        </button>
      </div>
      <AutoProgressBar
        ref="timerBarRef"
        :is-visible="showTimerProgress"
        :duration="3000"
        :auto-start="true"
        label="Timer countdown..."
        icon="⏰"
        @complete="onTimerComplete"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-demo {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-demo h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.progress-demo p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.demo-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.demo-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

button:hover:not(:disabled) {
  background: #5a6fd8;
}

button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}
</style> 