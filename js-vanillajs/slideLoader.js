// @ts-check
import { Slide } from './slide.js'

/**
 * Load a single slide
 * @param {string} slideName The name of the slide
 * @returns {Promise<Slide>} The slide
 */
export async function loadSlide(slideName) {
  const response = await fetch(`./templates/${slideName}.html`)
  const slide = await response.text()
  return new Slide(slide)
}

