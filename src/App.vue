<script setup>
import AlphabetLearningBoard from './components/AlphabetLearningBoard.vue'
</script>

<template>
  <div class="app-container">
    <AlphabetLearningBoard />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}
</style>

<style>
/* Override global styles for clean full-screen layout */
#app {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw;
  height: 100vh;
}

body {
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}
</style>
