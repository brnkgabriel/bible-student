// @ts-check
class Util {
  constructor(json) {
    /**
     * @type {object[]} expanded material data 
     */
    this.data = this.expand(json)
  }

  /**
   * 
   * @param {string} src the location of the image to load
   * @param {HTMLElement} parent that hosts the image element
   */
  createImage(src, parent) {
    var img = new Image();
    img.src = src;
    img.classList.add('lazy-image')
    var preloader = parent.querySelector('.-preloader')
    preloader.classList.add('-loading')
    img.decode().then(() => {
      preloader.classList.remove('-loading')
      parent.appendChild(img)
    }).catch(() => {
      preloader.classList.remove('-loading')
      parent.appendChild(new Text("Could not load image :("))
    })
  }
  
  /**
   * 
   * @param {string} src the location of the image to load
   * @param {HTMLElement} parent that hosts the image as background
   */
  createImageBg(src, parent) {
    var img = new Image()
    img.src = src
    img.classList.add('lazy-image')
    var preloader = parent.querySelector('.-preloader')
    preloader.classList.add('-loading')
    img.decode().then(() => {
      preloader.classList.remove('-loading')
      parent.setAttribute('style', 'background-image: url(' + src + ')')
    }).catch(() => {
      preloader.classList.remove('-loading')
      parent.appendChild(new Text("Could not load image :("))
    })
  }
  
  replacePattern(pattern, str) {
    var re = new RegExp(pattern, 'g')
    var replaced = str.replace(re, '-')
    return replaced
  }

  id(name) {
    var replacedApos = this.replacePattern("'", name)
    var replaceAmp = this.replacePattern('&', replacedApos)
    var replacePercnt = this.replacePattern('%', replaceAmp)
    return replacePercnt.toLowerCase().split(' ').join('-')
  }

  expand(skus) {
    return skus.map(sku => this.json(sku.split('|')))
    .map(sku => { return { ...sku, filter: this.id(sku.author) } })
  }

  json(skuDetails) {
    var obj = {}
    skuDetails.map(property => {
      var keyValue = property.split('=')
      obj[keyValue[0]] = keyValue[1]
    })
    return obj
  }
}
class Tag {
  constructor(properties) {
    this.tag = properties[0]
    this.attributes = properties[1]
    this.styles = properties[2]
    this.textContent = properties[3]
    this.element = null
  }

  /**
   * @returns {HTMLElement}
   */
  get() {
    return this.init()
      .setAttributes()
      .setStyle()
      .setHTML()
      .getElement()
  }

  init() {
    this.element = document.createElement(this.tag)
    return this
  }

  /**
   * 
   * @param {object} properties properties of the markup
   * @returns {HTMLElement}
   */
  static create(properties) {
    return new Tag(properties).get()
  }

  assignAttribute(object) {
    var keys = Object.keys(object)
    keys.forEach(key => {
      var value = object[key]
      this.element.setAttribute(key, value)
    })
  }

  setAttributes() {
    this.assignAttribute(this.attributes)
    return this
  }

  setStyle() {
    this.assignAttribute(this.styles)
    return this
  }

  setHTML() {
    this.element.innerHTML = this.textContent
    return this
  }

  getElement() {
    return this.element
  }

  static appendMany2One(many, one) {
    many.forEach(each => one.appendChild(each))
  }

}

class ImageObserver {
  /**
   * 
   * @param {HTMLElement} parent 
   */
  constructor(parent) {
    this.images = parent.querySelectorAll('.lazy-image')
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {})
    this.images.forEach(image => this.observer.observe(image))
  }

  onIntersection(imageEntites) {
    imageEntites.forEach(image => {
      if (image.isIntersecting) {
        this.observer.unobserve(image.target)
        image.target.src = image.target.dataset.src
        image.target.onload = () => {
          image.target.classList.add('loaded')
          this.removeLoader(image)
        }
      }
    })
  }

  /**
   * 
   * @param {IntersectionObserverEntry} image 
   */
  removeLoader(image) {
    var parent = image.target.parentElement
    var preloader = parent.querySelector('.-preloader')
    preloader.classList.remove('-loading')
  }
}