<template>
  <div v-if="isVisible" class="confetti-container">
    <div class="confetti-message">
      <div class="celebration-emoji">🎉🎊🌟</div>
      <h2 class="celebration-title">Congratulations!</h2>
      <p class="celebration-text">You've explored all 26 letters of the alphabet!</p>
      <p class="celebration-subtext">Amazing job learning phonics! 🎯</p>
      <button class="celebration-button" @click="$emit('close')">
        Continue Learning! ✨
      </button>
    </div>
    <div
      v-for="n in 50"
      :key="n"
      class="confetti-piece"
      :style="getConfettiStyle(n)"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

/**
 * Generate random confetti piece styling
 */
const getConfettiStyle = (index) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
  const shapes = ['square', 'circle', 'triangle']
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
  const randomLeft = Math.random() * 100
  const randomDelay = Math.random() * 3
  const randomDuration = 3 + Math.random() * 2
  const randomSize = 8 + Math.random() * 6
  
  return {
    '--confetti-color': randomColor,
    '--confetti-left': `${randomLeft}%`,
    '--confetti-delay': `${randomDelay}s`,
    '--confetti-duration': `${randomDuration}s`,
    '--confetti-size': `${randomSize}px`,
    borderRadius: randomShape === 'circle' ? '50%' : randomShape === 'triangle' ? '0' : '2px',
    clipPath: randomShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
  }
}
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  pointer-events: none;
  overflow: hidden;
}

.confetti-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  pointer-events: auto;
  animation: celebrationBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  max-width: 90vw;
  max-height: 90vh;
}

.celebration-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: emojiDance 2s ease-in-out infinite;
}

.celebration-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.celebration-text {
  font-size: 1.25rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.celebration-subtext {
  font-size: 1rem;
  color: #4a5568;
  margin: 0 0 2rem 0;
}

.celebration-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.celebration-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.confetti-piece {
  position: absolute;
  width: var(--confetti-size);
  height: var(--confetti-size);
  background: var(--confetti-color);
  left: var(--confetti-left);
  animation: confettiFall var(--confetti-duration) var(--confetti-delay) ease-in infinite;
  pointer-events: none;
}

@keyframes confettiFall {
  0% {
    top: -20px;
    transform: rotateZ(0deg);
    opacity: 1;
  }
  100% {
    top: 100vh;
    transform: rotateZ(360deg);
    opacity: 0;
  }
}

@keyframes celebrationBounce {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes emojiDance {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .confetti-message {
    padding: 2rem;
    margin: 1rem;
  }
  
  .celebration-emoji {
    font-size: 3rem;
  }
  
  .celebration-title {
    font-size: 2rem;
  }
  
  .celebration-text {
    font-size: 1.1rem;
  }
  
  .celebration-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style> 