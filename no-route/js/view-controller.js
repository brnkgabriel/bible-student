class ViewController {
  constructor() {

  }

  lazyLoad(view) {
    /**
     * @type {HTMLElement}
     */
    var viewEl = document.querySelector('.-view.-' + view)
    var imageObserver = new ImageObserver(viewEl)
    imageObserver = null
  }

  toString() {
    return Object.getPrototypeOf(this).constructor.name
  }
}