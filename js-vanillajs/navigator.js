// @ts-check

// todo: filter the materials to show on mlp based on selection on homepage 

import { loadSlide } from './slideLoader.js'
import { Slide } from './slide.js'
import { Materials } from './materials.js'
import { Router } from './router.js'

/**
 * The main class that handles rendering the slide decks
 * @extends {HTMLElement}
 */
export class Navigator extends HTMLElement {

  /**
   * Create an instance of the custom navigator element
   */
  constructor() {
    super()
    /**
     * The list of content types
     * @type {string[]}
     */
    this._contentTypes = ['home', 'mlp', 'mdp']

    /**
     * The current page
     * @type {Slide}
     */
    this._page = null

    /**
     * The related router control
     */
    this._router = new Router()
    /**
     * The last known route
     * @type {string}
     */
    this._route = this._router.getRoute()

    /**
     * @type {Materials}
     */
    this._materials = new Materials()



    // /**
    //  * Custom event raised when the current slide changes
    //  * @type {CustomEvent}
    //  */
    // this.contentChangedEvent = new CustomEvent('contentchanged', {
    //   bubbles: true,
    //   cancelable: false
    // })

    // this._router.eventSource.addEventListener('routechanged', () => {
    //   if (this._route !== this._router.getRoute()) {
    //     this._route = this._router.getRoute()
    //     if (this._route) {
    //       // const slide = parseInt(this._route) - 1
    //       this.jumpTo(this._route)
    //     }
    //   }
    // })
  }

  /**
   * Get the list of observed attributes
   * @returns {string[]} The list of attributes to watch
   */
  static get observedAttributes() {
    return ['start']
  }

  /**
   * Called when an attribute changes
   * @param {string} attrName
   * @param {string} oldVal
   * @param {string} newVal
   */
  async attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('materials', this._materials.data)
    if (attrName === 'start') {
      if (oldVal !== newVal) {
        this._page = await loadSlide(newVal)
        this._route = this._router.getRoute()
        var slide = ''
        if (this._route) {
          slide = this._route
        }
        this.jumpTo(slide)
        this._title = document.querySelectorAll('title')[0]
      }
    }
  }


  /**
   * Current slide
   * @returns {Slide} The current slide
   */
  get currentPage() {
    return this._page
  }


  /**
   * Main slide navigation: jump to specific slide
   * @param {string} slideName The name of the slide to navigate to
   */
  async jumpTo(slideName) {
    this.innerHTML = ''
    this._page = await loadSlide(slideName)
    this.appendChild(this.currentPage.html)
    this._router.setRoute(slideName)
    this._route = this._router.getRoute()
    // this.dispatchEvent(this.contentChangedEvent)
  }
  
}

/**
 * Register the custom main-slot component
 */
export const mainContent = () => customElements.define('main-content', Navigator)