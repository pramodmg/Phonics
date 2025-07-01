import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlphabetLetter from '../AlphabetLetter.vue'

describe('AlphabetLetter', () => {
  let wrapper

  const defaultProps = {
    letter: 'A',
    clickCount: 0,
    isAnimating: false,
    animationKey: null
  }

  beforeEach(() => {
    wrapper = mount(AlphabetLetter, {
      props: defaultProps
    })
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('Rendering', () => {
    it('should render the letter correctly', () => {
      expect(wrapper.find('.letter-text').text()).toBe('A')
    })

    it('should not show click count when count is 0', () => {
      expect(wrapper.find('.letter-count').exists()).toBe(false)
    })

    it('should show click count when count > 0', async () => {
      await wrapper.setProps({ clickCount: 3 })
      
      const countElement = wrapper.find('.letter-count')
      expect(countElement.exists()).toBe(true)
      expect(countElement.text()).toBe('3')
    })

    it('should not show animation effects when not animating', () => {
      expect(wrapper.find('.letter-effects').exists()).toBe(false)
    })

    it('should show animation effects when animating', async () => {
      await wrapper.setProps({ 
        isAnimating: true, 
        animationKey: '12345' 
      })
      
      expect(wrapper.find('.letter-effects').exists()).toBe(true)
      expect(wrapper.find('.sparkle-burst').exists()).toBe(true)
      expect(wrapper.find('.ripple-effect').exists()).toBe(true)
      expect(wrapper.findAll('.sparkle')).toHaveLength(4)
    })
  })

  describe('CSS Classes', () => {
    it('should always have letter-card class', () => {
      expect(wrapper.find('.letter-card').exists()).toBe(true)
    })

    it('should not have has-been-clicked class when clickCount is 0', () => {
      expect(wrapper.find('.letter-card.has-been-clicked').exists()).toBe(false)
    })

    it('should have has-been-clicked class when clickCount > 0', async () => {
      await wrapper.setProps({ clickCount: 1 })
      expect(wrapper.find('.letter-card.has-been-clicked').exists()).toBe(true)
    })

    it('should not have is-animating class when not animating', () => {
      expect(wrapper.find('.letter-card.is-animating').exists()).toBe(false)
    })

    it('should have is-animating class when animating', async () => {
      await wrapper.setProps({ isAnimating: true })
      expect(wrapper.find('.letter-card.is-animating').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const letterCard = wrapper.find('.letter-card')
      
      expect(letterCard.attributes('role')).toBe('button')
      expect(letterCard.attributes('tabindex')).toBe('0')
      expect(letterCard.attributes('aria-label')).toBe('Letter A. Clicked 0 times.')
    })

    it('should update aria-label based on click count', async () => {
      await wrapper.setProps({ clickCount: 1 })
      expect(wrapper.find('.letter-card').attributes('aria-label')).toBe('Letter A. Clicked 1 time.')
      
      await wrapper.setProps({ clickCount: 5 })
      expect(wrapper.find('.letter-card').attributes('aria-label')).toBe('Letter A. Clicked 5 times.')
    })

    it('should have correct data attributes', () => {
      const letterCard = wrapper.find('.letter-card')
      
      expect(letterCard.attributes('data-letter')).toBe('A')
      expect(letterCard.attributes('data-testid')).toBe('alphabet-letter-A')
    })
  })

  describe('Events', () => {
    it('should emit letter-clicked event on click', async () => {
      await wrapper.find('.letter-card').trigger('click')
      
      expect(wrapper.emitted('letter-clicked')).toBeTruthy()
      expect(wrapper.emitted('letter-clicked')[0]).toEqual(['A'])
    })

    it('should emit letter-clicked event on Enter key', async () => {
      await wrapper.find('.letter-card').trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('letter-clicked')).toBeTruthy()
      expect(wrapper.emitted('letter-clicked')[0]).toEqual(['A'])
    })

    it('should emit letter-clicked event on Space key', async () => {
      await wrapper.find('.letter-card').trigger('keydown', { key: ' ' })
      
      expect(wrapper.emitted('letter-clicked')).toBeTruthy()
      expect(wrapper.emitted('letter-clicked')[0]).toEqual(['A'])
    })

    it('should prevent default on Space key', async () => {
      const mockEvent = {
        key: ' ',
        preventDefault: vi.fn()
      }
      
      await wrapper.find('.letter-card').trigger('keydown', mockEvent)
      
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should not emit on other keys', async () => {
      await wrapper.find('.letter-card').trigger('keydown', { key: 'Tab' })
      await wrapper.find('.letter-card').trigger('keydown', { key: 'Escape' })
      await wrapper.find('.letter-card').trigger('keydown', { key: 'a' })
      
      expect(wrapper.emitted('letter-clicked')).toBeFalsy()
    })
  })

  describe('Props Validation', () => {
    it('should accept valid letter prop', () => {
      const letters = ['A', 'B', 'C', 'Z']
      
      letters.forEach(letter => {
        const wrapper = mount(AlphabetLetter, {
          props: { ...defaultProps, letter }
        })
        expect(wrapper.find('.letter-text').text()).toBe(letter)
        wrapper.unmount()
      })
    })

    it('should handle different clickCount values', async () => {
      const counts = [0, 1, 5, 10, 100]
      
      for (const count of counts) {
        await wrapper.setProps({ clickCount: count })
        
        if (count === 0) {
          expect(wrapper.find('.letter-count').exists()).toBe(false)
        } else {
          expect(wrapper.find('.letter-count').text()).toBe(count.toString())
        }
      }
    })

    it('should handle animation state changes', async () => {
      // Not animating
      expect(wrapper.find('.letter-effects').exists()).toBe(false)
      
      // Start animating
      await wrapper.setProps({ 
        isAnimating: true, 
        animationKey: 'key1' 
      })
      expect(wrapper.find('.letter-effects').exists()).toBe(true)
      
      // Stop animating
      await wrapper.setProps({ isAnimating: false })
      expect(wrapper.find('.letter-effects').exists()).toBe(false)
    })
  })

  describe('Animation Key Behavior', () => {
    it('should update animation effects when animation key changes', async () => {
      await wrapper.setProps({ 
        isAnimating: true, 
        animationKey: 'key1' 
      })
      
      const firstEffects = wrapper.find('.letter-effects')
      expect(firstEffects.exists()).toBe(true)
      
      await wrapper.setProps({ animationKey: 'key2' })
      
      const secondEffects = wrapper.find('.letter-effects')
      expect(secondEffects.exists()).toBe(true)
      // The key attribute forces Vue to re-render the element
      expect(wrapper.props('animationKey')).toBe('key2')
    })

    it('should handle null animation key', async () => {
      await wrapper.setProps({ 
        isAnimating: true, 
        animationKey: null 
      })
      
      expect(wrapper.find('.letter-effects').exists()).toBe(true)
    })
  })

  describe('Multiple Interactions', () => {
    it('should handle rapid clicks correctly', async () => {
      const letterCard = wrapper.find('.letter-card')
      
      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        await letterCard.trigger('click')
      }
      
      expect(wrapper.emitted('letter-clicked')).toHaveLength(5)
      wrapper.emitted('letter-clicked').forEach(event => {
        expect(event).toEqual(['A'])
      })
    })

    it('should handle mixed click and keyboard events', async () => {
      const letterCard = wrapper.find('.letter-card')
      
      await letterCard.trigger('click')
      await letterCard.trigger('keydown', { key: 'Enter' })
      await letterCard.trigger('keydown', { key: ' ' })
      
      expect(wrapper.emitted('letter-clicked')).toHaveLength(3)
    })
  })

  describe('Different Letters', () => {
    const letters = ['A', 'M', 'Z']
    
    letters.forEach(letter => {
      it(`should work correctly with letter ${letter}`, () => {
        const letterWrapper = mount(AlphabetLetter, {
          props: { ...defaultProps, letter }
        })
        
        expect(letterWrapper.find('.letter-text').text()).toBe(letter)
        expect(letterWrapper.find('.letter-card').attributes('data-letter')).toBe(letter)
        expect(letterWrapper.find('.letter-card').attributes('data-testid')).toBe(`alphabet-letter-${letter}`)
        expect(letterWrapper.find('.letter-card').attributes('aria-label')).toContain(`Letter ${letter}`)
        
        letterWrapper.unmount()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing props gracefully', () => {
      // Mount with minimal props
      const minimalWrapper = mount(AlphabetLetter, {
        props: { letter: 'B' }
      })
      
      expect(minimalWrapper.find('.letter-text').text()).toBe('B')
      expect(minimalWrapper.find('.letter-count').exists()).toBe(false)
      expect(minimalWrapper.find('.letter-effects').exists()).toBe(false)
      
      minimalWrapper.unmount()
    })
  })
}) 