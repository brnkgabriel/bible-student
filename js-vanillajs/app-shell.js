// @ts-check

import { loadElement } from './elementLoader.js'
import { Navigator } from './navigator.js'

/**
 * Custom element that renders footer
 * @extends {HTMLElement}
 */
export class AppShell extends HTMLElement {

  /**
   * create a new instance of footer
   */
  constructor() {
    super()
    /**
     * Custom event name used to load content and dispatch event
     * @type {string}
     */
    this._name = 'app-shell'

    /**
     * Custom event raised when the current slide changes
     * @type {CustomEvent}
     */
    this._customEvent = null

    /**
     * The navigator
     * @type {Navigator}
     */
    this._navigator = null
  }

  /**
   * Called when the element is inserted into the DOM. Used to fetch the template and wire into the related navigator instance
   */

  async connectedCallback() {
    const loaded = await this.loadHTML()
    loaded.attachListener().notify()
  }

  /**
   * loads html to DOM
   * @returns {Promise<AppShell>}
   */
  async loadHTML() {
    this.innerHTML = ''
    const element = await loadElement(this.name)
    this.appendChild(element.html)
    return this
  }

  /**
   * attaches listeners to the element
   */
  attachListener() {
    var navItems = document.querySelectorAll('.-nav-item')
    navItems.forEach(navItem => {
      navItem.addEventListener('click', () => {
        var page = navItem.getAttribute('data-page')
        this.navigator.jumpTo(page)
      })
    })
    return this
  }

  /**
    * Get the list of attributes to watch
    * @returns {string[]} List of observable attributes
    */
  static get observedAttributes() {
    return ["content"];
  }

  /**
   * Called when the attribute is set
   * @param {string} attrName Name of the attribute that was set
   * @param {string} oldVal The old attribute value
   * @param {string} newVal The new attribute value
   */
  async attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'content') {
      if (oldVal !== newVal) {
        this._navigator = /** @type {Navigator} */ (document.getElementById(newVal))
      }
    }
  }

  /**
   * notifies listening element AppShell is ready
   */
  notify() {
    /**
     * Custom event raised when the current slide changes
     * @type {CustomEvent}
     */
    this._customEvent = new CustomEvent(this.name, {
      bubbles: true,
      cancelable: false
    });
    dispatchEvent(this._customEvent)
  }

  /**
   * @returns {string} name of this custom component
   */
  get name() {
    return this._name
  }

  /**
   * @returns {Navigator} navigator element
   */
  get navigator() {
    return this._navigator
  }
}

export const appShell = () => customElements.define('app-shell', AppShell)
