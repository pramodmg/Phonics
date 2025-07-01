import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAlphabetLearning } from '../useAlphabetLearning.js'

describe('useAlphabetLearning', () => {
  let alphabetLearning

  beforeEach(() => {
    alphabetLearning = useAlphabetLearning()
    // Reset any timers
    vi.clearAllTimers()
  })

  describe('Initial State', () => {
    it('should initialize with correct alphabet array', () => {
      expect(alphabetLearning.alphabet).toEqual([
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ])
    })

    it('should initialize with zero total clicks', () => {
      expect(alphabetLearning.totalClicks.value).toBe(0)
    })

    it('should initialize with empty clicked letters', () => {
      expect(Object.keys(alphabetLearning.clickedLetters)).toHaveLength(0)
    })

    it('should initialize with no animating letters', () => {
      expect(Object.keys(alphabetLearning.animatingLetters)).toHaveLength(0)
    })
  })

  describe('handleLetterClick', () => {
    it('should increment total clicks when letter is clicked', () => {
      alphabetLearning.handleLetterClick('A')
      expect(alphabetLearning.totalClicks.value).toBe(1)

      alphabetLearning.handleLetterClick('B')
      expect(alphabetLearning.totalClicks.value).toBe(2)
    })

    it('should track individual letter clicks', () => {
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('B')

      expect(alphabetLearning.clickedLetters.A).toBe(2)
      expect(alphabetLearning.clickedLetters.B).toBe(1)
    })

    it('should set letter as animating when clicked', () => {
      alphabetLearning.handleLetterClick('A')
      expect(alphabetLearning.isLetterAnimating('A')).toBe(true)
    })

    it('should not handle invalid letters', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      alphabetLearning.handleLetterClick('1')
      alphabetLearning.handleLetterClick('a')
      alphabetLearning.handleLetterClick('!')

      expect(alphabetLearning.totalClicks.value).toBe(0)
      expect(consoleSpy).toHaveBeenCalledTimes(3)
      
      consoleSpy.mockRestore()
    })

    it('should remove animation after timeout', async () => {
      vi.useFakeTimers()
      
      alphabetLearning.handleLetterClick('A')
      expect(alphabetLearning.isLetterAnimating('A')).toBe(true)

      // Fast forward 2 seconds
      vi.advanceTimersByTime(2000)
      
      // Allow promises to resolve
      await vi.runAllTimersAsync()
      
      expect(alphabetLearning.isLetterAnimating('A')).toBe(false)
      
      vi.useRealTimers()
    })
  })

  describe('isLetterAnimating', () => {
    it('should return false for non-animating letters', () => {
      expect(alphabetLearning.isLetterAnimating('A')).toBe(false)
    })

    it('should return true for animating letters', () => {
      alphabetLearning.handleLetterClick('A')
      expect(alphabetLearning.isLetterAnimating('A')).toBe(true)
    })
  })

  describe('getLetterClickCount', () => {
    it('should return 0 for unclicked letters', () => {
      expect(alphabetLearning.getLetterClickCount('A')).toBe(0)
    })

    it('should return correct count for clicked letters', () => {
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('A')

      expect(alphabetLearning.getLetterClickCount('A')).toBe(3)
    })
  })

  describe('hasLetterBeenClicked', () => {
    it('should return false for unclicked letters', () => {
      expect(alphabetLearning.hasLetterBeenClicked('A')).toBe(false)
    })

    it('should return true for clicked letters', () => {
      alphabetLearning.handleLetterClick('A')
      expect(alphabetLearning.hasLetterBeenClicked('A')).toBe(true)
    })
  })

  describe('resetProgress', () => {
    beforeEach(() => {
      // Set up some progress
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('B')
      alphabetLearning.handleLetterClick('A')
    })

    it('should reset total clicks to zero', () => {
      alphabetLearning.resetProgress()
      expect(alphabetLearning.totalClicks.value).toBe(0)
    })

    it('should clear clicked letters', () => {
      alphabetLearning.resetProgress()
      expect(Object.keys(alphabetLearning.clickedLetters)).toHaveLength(0)
    })

    it('should clear animating letters', () => {
      alphabetLearning.resetProgress()
      expect(Object.keys(alphabetLearning.animatingLetters)).toHaveLength(0)
    })
  })

  describe('getStatistics', () => {
    it('should return correct statistics for empty state', () => {
      const stats = alphabetLearning.getStatistics()
      
      expect(stats).toEqual({
        totalClicks: 0,
        exploredLetters: 0,
        remainingLetters: 26,
        completionPercentage: 0,
        isComplete: false
      })
    })

    it('should return correct statistics with partial progress', () => {
      // Click 5 different letters
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('B')
      alphabetLearning.handleLetterClick('C')
      alphabetLearning.handleLetterClick('D')
      alphabetLearning.handleLetterClick('E')
      alphabetLearning.handleLetterClick('A') // Duplicate click

      const stats = alphabetLearning.getStatistics()
      
      expect(stats).toEqual({
        totalClicks: 6,
        exploredLetters: 5,
        remainingLetters: 21,
        completionPercentage: 19, // Math.round((5/26) * 100)
        isComplete: false
      })
    })

    it('should return correct statistics for complete alphabet', () => {
      // Click all letters
      alphabetLearning.alphabet.forEach(letter => {
        alphabetLearning.handleLetterClick(letter)
      })

      const stats = alphabetLearning.getStatistics()
      
      expect(stats).toEqual({
        totalClicks: 26,
        exploredLetters: 26,
        remainingLetters: 0,
        completionPercentage: 100,
        isComplete: true
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple rapid clicks on same letter', () => {
      for (let i = 0; i < 10; i++) {
        alphabetLearning.handleLetterClick('A')
      }

      expect(alphabetLearning.getLetterClickCount('A')).toBe(10)
      expect(alphabetLearning.totalClicks.value).toBe(10)
    })

    it('should handle clicking all letters', () => {
      alphabetLearning.alphabet.forEach(letter => {
        alphabetLearning.handleLetterClick(letter)
      })

      expect(alphabetLearning.totalClicks.value).toBe(26)
      expect(Object.keys(alphabetLearning.clickedLetters)).toHaveLength(26)
    })

    it('should maintain separate animation states for different letters', () => {
      alphabetLearning.handleLetterClick('A')
      alphabetLearning.handleLetterClick('B')

      expect(alphabetLearning.isLetterAnimating('A')).toBe(true)
      expect(alphabetLearning.isLetterAnimating('B')).toBe(true)
      expect(alphabetLearning.isLetterAnimating('C')).toBe(false)
    })
  })
}) 