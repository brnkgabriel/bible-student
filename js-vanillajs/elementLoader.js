// @ts-check
import { CustomElement } from './customElement.js'

/**
 * Load a single element
 * @param {string} elementName The name of the element
 * @returns {Promise<CustomElement>} The element
 */
export async function loadElement(elementName) {
  const response = await fetch(`./templates/${elementName}.html`)
  const element = await response.text()
  return new CustomElement(element)
}