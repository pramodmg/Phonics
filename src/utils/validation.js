/**
 * @fileoverview Validation utilities for the Interactive Alphabet Learning application
 * Provides centralized validation functions with detailed error reporting
 */

import { VALIDATION_RULES } from '../constants/alphabet.js'

/**
 * Validates a letter input
 * @param {*} letter - The letter to validate
 * @returns {ValidationResult} Validation result object
 */
export function validateLetter(letter) {
  if (typeof letter !== 'string') {
    return {
      isValid: false,
      error: 'Letter must be a string',
      value: null
    }
  }

  if (!VALIDATION_RULES.LETTER.PATTERN.test(letter)) {
    return {
      isValid: false,
      error: VALIDATION_RULES.LETTER.ERROR_MESSAGE,
      value: null
    }
  }

  return {
    isValid: true,
    value: letter
  }
}

/**
 * Validates a click count input
 * @param {*} count - The click count to validate
 * @returns {ValidationResult} Validation result object
 */
export function validateClickCount(count) {
  if (typeof count !== 'number' || isNaN(count)) {
    return {
      isValid: false,
      error: 'Click count must be a number',
      value: null
    }
  }

  if (count < VALIDATION_RULES.CLICK_COUNT.MIN || count > VALIDATION_RULES.CLICK_COUNT.MAX) {
    return {
      isValid: false,
      error: VALIDATION_RULES.CLICK_COUNT.ERROR_MESSAGE,
      value: null
    }
  }

  if (!Number.isInteger(count)) {
    return {
      isValid: false,
      error: 'Click count must be an integer',
      value: null
    }
  }

  return {
    isValid: true,
    value: count
  }
}

/**
 * Validates an animation key
 * @param {*} animationKey - The animation key to validate
 * @returns {ValidationResult} Validation result object
 */
export function validateAnimationKey(animationKey) {
  if (animationKey === null || animationKey === undefined) {
    return {
      isValid: true,
      value: animationKey
    }
  }

  const keyType = typeof animationKey
  if (!VALIDATION_RULES.ANIMATION_KEY.TYPES.includes(keyType)) {
    return {
      isValid: false,
      error: VALIDATION_RULES.ANIMATION_KEY.ERROR_MESSAGE,
      value: null
    }
  }

  return {
    isValid: true,
    value: animationKey
  }
}

/**
 * Validates component props for AlphabetLetter
 * @param {Object} props - Props object to validate
 * @returns {ValidationResult} Validation result object
 */
export function validateAlphabetLetterProps(props) {
  const errors = []
  
  // Validate letter
  const letterValidation = validateLetter(props.letter)
  if (!letterValidation.isValid) {
    errors.push(`Letter: ${letterValidation.error}`)
  }

  // Validate click count
  const clickCountValidation = validateClickCount(props.clickCount)
  if (!clickCountValidation.isValid) {
    errors.push(`Click count: ${clickCountValidation.error}`)
  }

  // Validate isAnimating
  if (typeof props.isAnimating !== 'boolean') {
    errors.push('isAnimating must be a boolean')
  }

  // Validate animation key
  const animationKeyValidation = validateAnimationKey(props.animationKey)
  if (!animationKeyValidation.isValid) {
    errors.push(`Animation key: ${animationKeyValidation.error}`)
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : undefined,
    value: errors.length === 0 ? props : null
  }
}

/**
 * Validates learning statistics object
 * @param {Object} stats - Statistics object to validate
 * @returns {ValidationResult} Validation result object
 */
export function validateLearningStatistics(stats) {
  const errors = []
  
  if (typeof stats !== 'object' || stats === null) {
    return {
      isValid: false,
      error: 'Statistics must be an object',
      value: null
    }
  }

  // Required properties
  const required = ['totalClicks', 'exploredLetters', 'remainingLetters', 'completionPercentage', 'isComplete']
  
  for (const prop of required) {
    if (!(prop in stats)) {
      errors.push(`Missing required property: ${prop}`)
    }
  }

  // Validate types and ranges
  if (typeof stats.totalClicks !== 'number' || stats.totalClicks < 0) {
    errors.push('totalClicks must be a non-negative number')
  }

  if (typeof stats.exploredLetters !== 'number' || stats.exploredLetters < 0 || stats.exploredLetters > 26) {
    errors.push('exploredLetters must be a number between 0 and 26')
  }

  if (typeof stats.remainingLetters !== 'number' || stats.remainingLetters < 0 || stats.remainingLetters > 26) {
    errors.push('remainingLetters must be a number between 0 and 26')
  }

  if (typeof stats.completionPercentage !== 'number' || stats.completionPercentage < 0 || stats.completionPercentage > 100) {
    errors.push('completionPercentage must be a number between 0 and 100')
  }

  if (typeof stats.isComplete !== 'boolean') {
    errors.push('isComplete must be a boolean')
  }

  // Logical validation
  if (stats.exploredLetters + stats.remainingLetters !== 26) {
    errors.push('exploredLetters + remainingLetters must equal 26')
  }

  if (stats.isComplete && stats.exploredLetters !== 26) {
    errors.push('isComplete should be true only when exploredLetters equals 26')
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : undefined,
    value: errors.length === 0 ? stats : null
  }
}

/**
 * Validates keyboard event for letter interaction
 * @param {KeyboardEvent} event - Keyboard event to validate
 * @returns {ValidationResult} Validation result object
 */
export function validateKeyboardEvent(event) {
  if (!(event instanceof KeyboardEvent)) {
    return {
      isValid: false,
      error: 'Event must be a KeyboardEvent',
      value: null
    }
  }

  const { TRIGGER_KEYS } = VALIDATION_RULES.KEYBOARD || { TRIGGER_KEYS: ['Enter', ' '] }
  
  if (!TRIGGER_KEYS.includes(event.key)) {
    return {
      isValid: false,
      error: `Key '${event.key}' is not a valid trigger key`,
      value: null
    }
  }

  return {
    isValid: true,
    value: event
  }
}

/**
 * Sanitizes and validates user input
 * @param {*} input - Raw user input
 * @param {string} type - Expected type ('letter', 'clickCount', 'animationKey')
 * @returns {ValidationResult} Validation result object
 */
export function sanitizeInput(input, type) {
  switch (type) {
    case 'letter':
      // Convert to uppercase and validate
      const letter = typeof input === 'string' ? input.toUpperCase().trim() : input
      return validateLetter(letter)
    
    case 'clickCount':
      // Convert to number and validate
      const count = typeof input === 'string' ? parseInt(input, 10) : input
      return validateClickCount(count)
    
    case 'animationKey':
      // Validate as-is
      return validateAnimationKey(input)
    
    default:
      return {
        isValid: false,
        error: `Unknown validation type: ${type}`,
        value: null
      }
  }
}

/**
 * Batch validation utility
 * @param {Array<{value: *, validator: Function}>} validations - Array of validation objects
 * @returns {ValidationResult} Combined validation result
 */
export function validateBatch(validations) {
  const errors = []
  const values = {}
  
  for (let i = 0; i < validations.length; i++) {
    const { value, validator, key } = validations[i]
    const result = validator(value)
    
    if (!result.isValid) {
      errors.push(`${key || `Item ${i}`}: ${result.error}`)
    } else {
      values[key || i] = result.value
    }
  }
  
  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : undefined,
    value: errors.length === 0 ? values : null
  }
} 