import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlphabetLearningBoard from '../AlphabetLearningBoard.vue'
import AlphabetLetter from '../AlphabetLetter.vue'

// Mock the composable
vi.mock('../../composables/useAlphabetLearning.js', () => ({
  useAlphabetLearning: vi.fn()
}))

describe('AlphabetLearningBoard', () => {
  let mockComposable
  let wrapper

  beforeEach(async () => {
    // Reset the mock before each test
    mockComposable = {
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      totalClicks: { value: 0 },
      handleLetterClick: vi.fn(),
      isLetterAnimating: vi.fn(() => false),
      getLetterClickCount: vi.fn(() => 0),
      hasLetterBeenClicked: vi.fn(() => false),
      resetProgress: vi.fn(),
      getStatistics: vi.fn(() => ({
        totalClicks: 0,
        exploredLetters: 0,
        remainingLetters: 26,
        completionPercentage: 0,
        isComplete: false
      })),
      animatingLetters: {}
    }

    const { useAlphabetLearning } = await import('../../composables/useAlphabetLearning.js')
    useAlphabetLearning.mockReturnValue(mockComposable)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Rendering', () => {
    it('renders the main title correctly', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const title = wrapper.find('.learning-title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Interactive Alphabet Learning')
    })

    it('renders the subtitle correctly', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const subtitle = wrapper.find('.learning-subtitle')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toContain('Click on each letter to explore and learn!')
    })

    it('renders all 26 alphabet letters', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const letters = wrapper.findAllComponents(AlphabetLetter)
      expect(letters).toHaveLength(26)
    })

    it('renders progress section with correct ARIA attributes', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const progressSection = wrapper.find('.progress-section')
      expect(progressSection.exists()).toBe(true)
      expect(progressSection.attributes('role')).toBe('region')
      expect(progressSection.attributes('aria-label')).toBe('Learning Progress')
    })
  })

  describe('Progress and Statistics', () => {
    it('displays initial progress message for no clicks', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const progressMessage = wrapper.find('.progress-message')
      expect(progressMessage.text()).toBe('Click any letter to start your learning journey!')
    })

    it('displays correct statistics for initial state', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const stats = wrapper.findAll('.stat-value')
      expect(stats[0].text()).toBe('0') // Total clicks
      expect(stats[1].text()).toBe('0/26') // Letters explored
      expect(stats[2].text()).toBe('0%') // Progress percentage
    })

    it('updates progress message based on explored letters', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 3,
        exploredLetters: 3,
        remainingLetters: 23,
        completionPercentage: 12,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const progressMessage = wrapper.find('.progress-message')
      expect(progressMessage.text()).toBe('Great start! Keep exploring more letters!')
    })

    it('displays completion message when all letters explored', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 26,
        exploredLetters: 26,
        remainingLetters: 0,
        completionPercentage: 100,
        isComplete: true
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const progressMessage = wrapper.find('.progress-message')
      expect(progressMessage.text()).toBe('Congratulations! You\'ve mastered the alphabet! 🎉')
    })

    it('renders progress bar with correct width', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 13,
        exploredLetters: 13,
        remainingLetters: 13,
        completionPercentage: 50,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const progressBar = wrapper.find('.progress-bar')
      expect(progressBar.attributes('style')).toContain('width: 50%')
      expect(progressBar.attributes('aria-valuenow')).toBe('50')
    })
  })

  describe('Achievements System', () => {
    it('does not show achievements section initially', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const achievementsSection = wrapper.find('.achievements-section')
      expect(achievementsSection.exists()).toBe(false)
    })

    it('shows "First Five" achievement', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 5,
        exploredLetters: 5,
        remainingLetters: 21,
        completionPercentage: 19,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const achievementsSection = wrapper.find('.achievements-section')
      expect(achievementsSection.exists()).toBe(true)
      expect(achievementsSection.text()).toContain('🌟 First Five!')
    })

    it('shows "Halfway Hero" achievement', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 13,
        exploredLetters: 13,
        remainingLetters: 13,
        completionPercentage: 50,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const achievementItems = wrapper.findAll('.achievement-item')
      const achievementTexts = achievementItems.map(item => item.text())
      expect(achievementTexts).toContain('🌟 First Five!')
      expect(achievementTexts).toContain('🚀 Halfway Hero!')
    })

    it('shows "Alphabet Master" achievement when complete', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 26,
        exploredLetters: 26,
        remainingLetters: 0,
        completionPercentage: 100,
        isComplete: true
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const achievementItems = wrapper.findAll('.achievement-item')
      const achievementTexts = achievementItems.map(item => item.text())
      expect(achievementTexts).toContain('🏆 Alphabet Master!')
    })

    it('shows click-based achievements', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 100,
        exploredLetters: 26,
        remainingLetters: 0,
        completionPercentage: 100,
        isComplete: true
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const achievementItems = wrapper.findAll('.achievement-item')
      const achievementTexts = achievementItems.map(item => item.text())
      expect(achievementTexts).toContain('💪 Click Champion!')
      expect(achievementTexts).toContain('🎯 Century Club!')
    })
  })

  describe('Letter Interactions', () => {
    it('passes correct props to AlphabetLetter components', () => {
      mockComposable.getLetterClickCount.mockImplementation((letter) => {
        return letter === 'A' ? 3 : 0
      })
      mockComposable.isLetterAnimating.mockImplementation((letter) => {
        return letter === 'A'
      })

      wrapper = mount(AlphabetLearningBoard)
      
      const firstLetter = wrapper.findAllComponents(AlphabetLetter)[0]
      expect(firstLetter.props('letter')).toBe('A')
      expect(firstLetter.props('clickCount')).toBe(3)
      expect(firstLetter.props('isAnimating')).toBe(true)
    })

    it('handles letter click events correctly', async () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const firstLetter = wrapper.findAllComponents(AlphabetLetter)[0]
      await firstLetter.vm.$emit('letter-clicked', 'A')
      
      expect(mockComposable.handleLetterClick).toHaveBeenCalledWith('A')
    })
  })

  describe('Reset Functionality', () => {
    it('renders reset button with correct initial state', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const resetButton = wrapper.find('.reset-button')
      expect(resetButton.exists()).toBe(true)
      expect(resetButton.attributes('disabled')).toBeDefined()
      expect(resetButton.text()).toContain('🔄 Reset Progress')
    })

    it('enables reset button when there are clicks', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 5,
        exploredLetters: 3,
        remainingLetters: 23,
        completionPercentage: 12,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const resetButton = wrapper.find('.reset-button')
      expect(resetButton.attributes('disabled')).toBeUndefined()
    })

    it('shows confirmation dialog and resets on confirm', async () => {
      // Mock window.confirm
      const originalConfirm = window.confirm
      window.confirm = vi.fn(() => true)

      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 5,
        exploredLetters: 3,
        remainingLetters: 23,
        completionPercentage: 12,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const resetButton = wrapper.find('.reset-button')
      await resetButton.trigger('click')
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to reset all your progress?')
      expect(mockComposable.resetProgress).toHaveBeenCalled()

      // Restore original confirm
      window.confirm = originalConfirm
    })

    it('does not reset when user cancels confirmation', async () => {
      // Mock window.confirm to return false
      const originalConfirm = window.confirm
      window.confirm = vi.fn(() => false)

      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 5,
        exploredLetters: 3,
        remainingLetters: 23,
        completionPercentage: 12,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const resetButton = wrapper.find('.reset-button')
      await resetButton.trigger('click')
      
      expect(window.confirm).toHaveBeenCalled()
      expect(mockComposable.resetProgress).not.toHaveBeenCalled()

      // Restore original confirm
      window.confirm = originalConfirm
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const progressSection = wrapper.find('.progress-section')
      expect(progressSection.attributes('role')).toBe('region')
      expect(progressSection.attributes('aria-label')).toBe('Learning Progress')

      const mainGrid = wrapper.find('.alphabet-grid')
      expect(mainGrid.attributes('role')).toBe('main')
      expect(mainGrid.attributes('aria-label')).toBe('Interactive Alphabet Letters')
    })

    it('has proper progress bar accessibility attributes', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 13,
        exploredLetters: 13,
        remainingLetters: 13,
        completionPercentage: 50,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const progressBar = wrapper.find('.progress-bar')
      expect(progressBar.attributes('role')).toBe('progressbar')
      expect(progressBar.attributes('aria-valuenow')).toBe('50')
      expect(progressBar.attributes('aria-valuemin')).toBe('0')
      expect(progressBar.attributes('aria-valuemax')).toBe('100')
      expect(progressBar.attributes('aria-label')).toBe('Learning progress: 50% complete')
    })

    it('has proper reset button accessibility', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const resetButton = wrapper.find('.reset-button')
      expect(resetButton.attributes('type')).toBe('button')
      expect(resetButton.attributes('aria-label')).toBe('Reset all learning progress')
    })
  })

  describe('Learning Tips Section', () => {
    it('renders learning tips', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      const tips = wrapper.findAll('.tip')
      expect(tips).toHaveLength(2)
      expect(tips[0].text()).toContain('Each letter shows how many times you\'ve clicked it!')
      expect(tips[1].text()).toContain('Use Tab to navigate and Enter/Space to click letters.')
    })
  })

  describe('Component Structure', () => {
    it('has the correct main container class', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      expect(wrapper.find('.alphabet-learning-board').exists()).toBe(true)
    })

    it('renders all major sections', () => {
      wrapper = mount(AlphabetLearningBoard)
      
      expect(wrapper.find('.learning-header').exists()).toBe(true)
      expect(wrapper.find('.progress-section').exists()).toBe(true)
      expect(wrapper.find('.alphabet-grid').exists()).toBe(true)
      expect(wrapper.find('.controls-section').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty achievements array', () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 0,
        exploredLetters: 0,
        remainingLetters: 26,
        completionPercentage: 0,
        isComplete: false
      })

      wrapper = mount(AlphabetLearningBoard)
      
      const achievementsSection = wrapper.find('.achievements-section')
      expect(achievementsSection.exists()).toBe(false)
    })

    it('handles maximum progress correctly', async () => {
      mockComposable.getStatistics.mockReturnValue({
        totalClicks: 150,
        exploredLetters: 26,
        remainingLetters: 0,
        completionPercentage: 100,
        isComplete: true
      })

      wrapper = mount(AlphabetLearningBoard)
      await wrapper.vm.$nextTick()
      
      const progressBar = wrapper.find('.progress-bar')
      expect(progressBar.attributes('style')).toContain('width: 100%')
      
      const progressMessage = wrapper.find('.progress-message')
      expect(progressMessage.text()).toBe('Congratulations! You\'ve mastered the alphabet! 🎉')
    })
  })
}) 