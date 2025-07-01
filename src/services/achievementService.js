/**
 * @fileoverview Achievement service for managing learning achievements
 * Provides centralized achievement logic and unlocking mechanisms
 */

import { ACHIEVEMENT_CONFIG } from '../constants/alphabet.js'

/**
 * Achievement Service Class
 * Manages achievement unlocking, tracking, and notifications
 */
export class AchievementService {
  constructor() {
    this.unlockedAchievements = new Set()
    this.achievementHistory = []
  }

  /**
   * Evaluates and returns currently unlocked achievements based on statistics
   * @param {LearningStatistics} stats - Current learning statistics
   * @returns {Achievement[]} Array of unlocked achievements
   */
  getUnlockedAchievements(stats) {
    const achievements = []
    const { exploredLetters, totalClicks } = stats
    
    // Letters-based achievements
    if (exploredLetters >= ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.FIRST_FIVE) {
      achievements.push(this.createAchievementObject('FIRST_FIVE'))
    }
    
    if (exploredLetters >= ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.HALFWAY_HERO) {
      achievements.push(this.createAchievementObject('HALFWAY_HERO'))
    }
    
    if (exploredLetters >= ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.ALPHABET_MASTER) {
      achievements.push(this.createAchievementObject('ALPHABET_MASTER'))
    }
    
    // Clicks-based achievements
    if (totalClicks >= ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CLICK_CHAMPION) {
      achievements.push(this.createAchievementObject('CLICK_CHAMPION'))
    }
    
    if (totalClicks >= ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CENTURY_CLUB) {
      achievements.push(this.createAchievementObject('CENTURY_CLUB'))
    }
    
    if (totalClicks >= ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.MEGA_CLICKER) {
      achievements.push(this.createAchievementObject('MEGA_CLICKER'))
    }
    
    return achievements
  }

  /**
   * Checks for newly unlocked achievements and returns them
   * @param {LearningStatistics} stats - Current learning statistics
   * @returns {Achievement[]} Array of newly unlocked achievements
   */
  checkForNewAchievements(stats) {
    const currentAchievements = this.getUnlockedAchievements(stats)
    const newAchievements = []
    
    for (const achievement of currentAchievements) {
      const achievementId = this.getAchievementId(achievement)
      
      if (!this.unlockedAchievements.has(achievementId)) {
        this.unlockedAchievements.add(achievementId)
        this.achievementHistory.push({
          achievement,
          unlockedAt: new Date(),
          stats: { ...stats }
        })
        newAchievements.push(achievement)
      }
    }
    
    return newAchievements
  }

  /**
   * Creates a formatted achievement object
   * @param {string} achievementKey - Key from ACHIEVEMENT_CONFIG.DEFINITIONS
   * @returns {Achievement} Formatted achievement object
   */
  createAchievementObject(achievementKey) {
    const definition = ACHIEVEMENT_CONFIG.DEFINITIONS[achievementKey]
    
    if (!definition) {
      throw new Error(`Unknown achievement key: ${achievementKey}`)
    }
    
    return {
      id: achievementKey,
      icon: definition.icon,
      title: definition.title,
      description: definition.description,
      displayText: definition.title // Remove icon from display text since we'll render it separately
    }
  }

  /**
   * Gets a unique identifier for an achievement
   * @param {Achievement} achievement - Achievement object
   * @returns {string} Unique achievement ID
   */
  getAchievementId(achievement) {
    return achievement.id || achievement.title
  }

  /**
   * Resets all achievement progress
   */
  resetAchievements() {
    this.unlockedAchievements.clear()
    this.achievementHistory = []
  }

  /**
   * Gets the achievement history
   * @returns {Array} Array of achievement history objects
   */
  getAchievementHistory() {
    return [...this.achievementHistory]
  }

  /**
   * Checks if a specific achievement is unlocked
   * @param {string} achievementKey - Achievement key to check
   * @returns {boolean} Whether the achievement is unlocked
   */
  isAchievementUnlocked(achievementKey) {
    return this.unlockedAchievements.has(achievementKey)
  }

  /**
   * Gets achievement progress for a specific achievement
   * @param {string} achievementKey - Achievement key to check
   * @param {LearningStatistics} stats - Current learning statistics
   * @returns {Object} Progress information
   */
  getAchievementProgress(achievementKey, stats) {
    const { exploredLetters, totalClicks } = stats
    
    switch (achievementKey) {
      case 'FIRST_FIVE':
        return {
          current: exploredLetters,
          target: ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.FIRST_FIVE,
          percentage: Math.min(100, (exploredLetters / ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.FIRST_FIVE) * 100)
        }
      
      case 'HALFWAY_HERO':
        return {
          current: exploredLetters,
          target: ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.HALFWAY_HERO,
          percentage: Math.min(100, (exploredLetters / ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.HALFWAY_HERO) * 100)
        }
      
      case 'ALPHABET_MASTER':
        return {
          current: exploredLetters,
          target: ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.ALPHABET_MASTER,
          percentage: Math.min(100, (exploredLetters / ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.ALPHABET_MASTER) * 100)
        }
      
      case 'CLICK_CHAMPION':
        return {
          current: totalClicks,
          target: ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CLICK_CHAMPION,
          percentage: Math.min(100, (totalClicks / ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CLICK_CHAMPION) * 100)
        }
      
      case 'CENTURY_CLUB':
        return {
          current: totalClicks,
          target: ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CENTURY_CLUB,
          percentage: Math.min(100, (totalClicks / ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CENTURY_CLUB) * 100)
        }
      
      case 'MEGA_CLICKER':
        return {
          current: totalClicks,
          target: ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.MEGA_CLICKER,
          percentage: Math.min(100, (totalClicks / ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.MEGA_CLICKER) * 100)
        }
      
      default:
        return {
          current: 0,
          target: 1,
          percentage: 0
        }
    }
  }

  /**
   * Gets next achievement suggestions based on current progress
   * @param {LearningStatistics} stats - Current learning statistics
   * @returns {Array} Array of suggested next achievements
   */
  getNextAchievementSuggestions(stats) {
    const suggestions = []
    const { exploredLetters, totalClicks } = stats
    
    // Check for next letter-based achievement
    if (exploredLetters < ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.FIRST_FIVE) {
      suggestions.push({
        achievement: this.createAchievementObject('FIRST_FIVE'),
        progress: this.getAchievementProgress('FIRST_FIVE', stats)
      })
    } else if (exploredLetters < ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.HALFWAY_HERO) {
      suggestions.push({
        achievement: this.createAchievementObject('HALFWAY_HERO'),
        progress: this.getAchievementProgress('HALFWAY_HERO', stats)
      })
    } else if (exploredLetters < ACHIEVEMENT_CONFIG.LETTERS_THRESHOLDS.ALPHABET_MASTER) {
      suggestions.push({
        achievement: this.createAchievementObject('ALPHABET_MASTER'),
        progress: this.getAchievementProgress('ALPHABET_MASTER', stats)
      })
    }
    
    // Check for next click-based achievement
    if (totalClicks < ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CLICK_CHAMPION) {
      suggestions.push({
        achievement: this.createAchievementObject('CLICK_CHAMPION'),
        progress: this.getAchievementProgress('CLICK_CHAMPION', stats)
      })
    } else if (totalClicks < ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.CENTURY_CLUB) {
      suggestions.push({
        achievement: this.createAchievementObject('CENTURY_CLUB'),
        progress: this.getAchievementProgress('CENTURY_CLUB', stats)
      })
    } else if (totalClicks < ACHIEVEMENT_CONFIG.CLICKS_THRESHOLDS.MEGA_CLICKER) {
      suggestions.push({
        achievement: this.createAchievementObject('MEGA_CLICKER'),
        progress: this.getAchievementProgress('MEGA_CLICKER', stats)
      })
    }
    
    return suggestions
  }
}

// Export a singleton instance
export const achievementService = new AchievementService()

// Export factory function for testing
export function createAchievementService() {
  return new AchievementService()
} 