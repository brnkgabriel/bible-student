// @ts-check

import { DataBinding } from './dataBinding.js'

/**
 * Represents a slide
 */

export class Slide {

  /**
   * @constructor
   * @param {string} text - The content of the slide
   */
  constructor(text) {
    /**
     * Internal text representation of the slide
     * @type {string}
     */
    this._text = text
    /**
     * Context for embedded scripts
     * @type {object}
     */
    this._context = {}
    /**
     * Data bind helper
     * @type {DataBinding}
     */
    this._dataBinding = new DataBinding()
    /**
     * The HTML DOM hosting the slide contents
     * @type {HTMLDivElement}
     */
    this._html = document.createElement('div')
    this._html.innerHTML = text
    
    
    // execute any scripts
    const script = this._html.querySelector('script')
    if (script) {
      this._dataBinding.executeInContext(script.innerText, this._context, true)
      this._dataBinding.bindAll(this._html, this._context)
    }
  }

  /**
   * The HTML DOM node for the slide
   * @return {HTMLDivElement} The HTML content
   */
  get html() {
    return this._html
  }

  
}