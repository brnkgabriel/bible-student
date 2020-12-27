// @ts-check

/**
 * @typedef {object} CustomRef
 * @property {Util} util The button to jump to the first slide
 * @property {Home} home The button to move to the previous slide
 * @property {MLP} mlp The button to advance to the next slide
 * @property {MDP} mdp The button to advance to the last slide
 */

/**
 * @typedef {object} Material
 * @property {string} author author of the material
 * @property {string} desc description of the material
 * @property {string} filter sub category of the material
 * @property {string} host platform that hosts the material
 * @property {string} id id of the material
 * @property {string} name the name of the material
 * @property {string} type the type of the material
 */
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

class Util {
  constructor(json) {
    /**
     * @type {Material[]} expanded material data 
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
      .map(sku => {
        sku.filter = this.id(sku.author)
        return sku
      })
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
  constructor(parent) {
    this.images = parent.querySelectorAll('.lazy-image')

    try {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), {})
      this.images.forEach(image => this.observer.observe(image))
    } catch (error) {
      this.lazyLoadImages()
    }
  }

  lazyLoadImages() {
    this.images.forEach(image => this.lazyLoadImage(image))

    // var image = document.getElementById('image');

    // image.onload = function () {
    //     alert ("The image has loaded!");        
    // };
    // setTimeout(function(){
    //     image.src = "http://lorempixel.com/500/500";         
    // }, 5000);
  }

  lazyLoadImage(image) {
    var self = this
    if (!image.src) {
      image.src = image.getAttribute('data-src')
      image.onload = function () {
        image.classList.add('loaded')
        self.removeLoaderBCompat(image)
      }
    } else {
      image.classList.add('loaded')
      self.removeLoaderBCompat(image)
    }
  }

  removeLoaderBCompat(image) {
    var parent = image.parentElement
    var preloader = parent.querySelector('.-preloader')
    preloader.classList.remove('-loading')
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

class Home extends ViewController {
  constructor(banners, util) {
    super()
    this.banner11 = document.querySelector('.-link[data-row="1"]')
    this.banner21 = document.querySelector('.-link[data-row="2"][data-col="1"]')
    this.banner22 = document.querySelector('.-link[data-row="2"][data-col="2"]')
    this.banner31 = document.querySelector('.-link[data-row="3"]')
    this.banner41 = document.querySelector('.-link[data-row="4"]')

    this.banners = banners

    this.util = util

    this.populate().lazyLoad('home')
  }

  populate() {
    Object.keys(this.banners).map(key => this.buildBanner(key))
    return this
  }

  buildBanner(key) {
    var view = this.banners[key].view
    var name = this.banners[key].name
    var id = this.util.id(name)
    var src = this.banners[key].src
    var parent = this[key]
    parent.setAttribute('data-view', view)
    parent.setAttribute('data-id', id)

    var img = document.createElement('img')
    img.classList.add('lazy-image')
    img.setAttribute('data-src', src)
    parent.appendChild(img)
    // this.util.createImage(src, parent)
  }
}

class MLP extends ViewController {
  constructor(util) {
    super()
    this.name = 'Manual Listing Page'
    this.mkus = document.querySelector('.-mkus')
    /**
     * @type {Material[]}
     */
    this.data = []

    /**
     * @type {HTMLElement[]}
     */
    this.links = []

    /**
     * @type {Util}
     */
    this.util = util

    this.thumbnail = id => 'https://img.youtube.com/vi/' + id + '/0.jpg'
  }

  /**
   * 
   * @param {Material[]} data 
   */
  populate(data) {
    this.data = data
    this.links = []
    // <span class="-preloader -loading"></span>
    this.mkus.innerHTML = ''
    this.data.map(datum => {
      var prop = {
        mku: ['div', { class: '-mku -posrel -link', 'data-id': datum.id, 'data-view': 'mdp', 'data-category': 'thumbnail' }, '', ''],
        imgP: ['div', { class: '-posabs -img' }, '', ''],
        img: ['img', { class: 'lazy-image -posabs', 'data-src': this.thumbnail(datum.id) }, '', ''],
        preloader: ['span', { class: '-preloader -loading' }, '', ''],
        details: ['div', { class: '-details -posabs' }, '', ''],
        name: ['div', { class: '-name' }, '', datum.name],
        desc: ['div', { class: '-desc' }, '', datum.desc],
        author: ['div', { class: '-author' }, '', datum.author]
      }

      var mku = Tag.create(prop['mku'])
      var imgP = Tag.create(prop['imgP'])
      var img = Tag.create(prop['img'])
      var preloader = Tag.create(prop['preloader'])
      var details = Tag.create(prop['details'])
      var name = Tag.create(prop['name'])
      var desc = Tag.create(prop['desc'])
      var author = Tag.create(prop['author'])


      // var src     = this.thumbnail(datum.id)
      // imgP.appendChild(preloader)
      // this.util.createImageBg(src, img)

      Tag.appendMany2One([preloader, img], imgP)
      Tag.appendMany2One([name, desc, author], details)
      Tag.appendMany2One([imgP, details], mku)
      this.links.push(mku)
      this.mkus.appendChild(mku)
    })
    return this
  }
}

class MDP extends ViewController {
  constructor() {
    super()
    this.name = 'Material Detail Page'
    this.data = {}
    this.imageObserver = null

    // slides
    this.slideCount = 0
    this.slideNum = 1
    this.material = document.querySelector('.-pane iframe.-material')
    this.slideStatus = document.querySelector('.-slideshow .-status')
    this.slideParent = document.querySelector('.-slides')
    this.slideImg = document.querySelector('.-slides .lazy-image')
    this.preloader = document.querySelector('.-slides .-preloader')
    this.gotoSlide = document.getElementById('goto')
    this.prevSlide = document.querySelector('.-control.-prev')
    this.nextSlide = document.querySelector('.-control.-next')

    this.youtubesrc = id => 'https://www.youtube.com/embed/' + id
    this.slidesrc = id => './img/designs/' + id + '.jpg'

    this.listeners()
  }

  build(data) {
    // this.mdp.populate(this.currentView.data)
  }

  listeners() {
    // @ts-ignore
    this.gotoSlide.addEventListener('keyup', () => this.updateSlide(parseInt(this.gotoSlide.value)))
    this.prevSlide.addEventListener('click', () => this.updateSlide(--this.slideNum))
    this.nextSlide.addEventListener('click', () => this.updateSlide(++this.slideNum))
  }

  populate(data) {
    this.data = data[0]
    this[this.data['type']]()
    this.togglePane(this.data['type'])
    return this
  }

  video() {
    this.material.setAttribute('src', this.youtubesrc(this.data['id']))
    return this
  }

  slideshow() {
    this.slideCount = parseInt(this.data.meta.split('-')[1])
    this.updateSlide(1)
    return this
  }

  updateSlide(num) {
    num = parseInt(num)
    // @ts-ignore
    this.setBoundary(num)
    // this.slideNum = (num && num <= this.slideCount && num > 0) ? num : 1
    this.updateUI()
  }
  updateUI() {
    var id = `${this.data.id}/${this.slideNum}`
    this.slideImg.setAttribute('data-src', this.slidesrc(id))
    this.slideImg.removeAttribute('src')
    this.slideImg.classList.remove('loaded')
    this.preloader.classList.add('-loading')
    this.imageObserver = new ImageObserver(this.slideParent)
    this.imageObserver = null
    this.slideStatus.textContent = `${this.slideNum} / ${this.slideCount}`
  }

  setBoundary(num) {
    if (num > this.slideCount) {
      this.slideNum = 1
    } else if (num < 1) {
      this.slideNum = this.slideCount
    } else {
      this.slideNum = num ? num : 1
    }
  }

  togglePane(type) {
    var panes = document.querySelectorAll('.-mdp .-pane')
    panes.forEach(pane => pane.classList.add('-hide'))
    var currentPane = document.querySelector('.-pane.-' + type)
    currentPane.classList.remove('-hide')
  }
}

class Navigate {
  /**
   * @constructor
   * @param {CustomRef} json 
   */
  constructor(json) {
    this.navItems = document.querySelectorAll('.-nav-items .-item')
    this.bannerLinks = document.querySelectorAll('.-link:not(.-mku)')
    this.views = document.querySelectorAll('.-main .-view')

    this.page = document.querySelector('.-header .-page')

    this.navItems.forEach(item => item.addEventListener('click', () => this.goto(item)))
    this.bannerLinks.forEach(link => link.addEventListener('click', () => this.goto(link)))

    /**
     * @type {string[]}
     */
    this.paths = this.getLastPath() || ['home:null']

    this.currentView = {}

    this.util = json['util']
    this.home = json['home']
    this.mlp = json['mlp']
    this.mdp = json['mdp']
    this.names = {
      home: 'home',
      mlp: 'manual listing page',
      mdp: 'material detail page'
    }
    this.update(this.paths[this.paths.length - 1].split(':'))
  }

  /**
   * @returns {string[]}
   */
  getLastPath() {
    var paths = JSON.parse(localStorage.getItem('paths'))
    return paths ? paths : null
  }

  goto(item) {
    this.measureEvent(item)
    var _viewID = this.viewID(item)
    this.update(_viewID)
  }

  measureEvent(item) {
    var category = item.getAttribute('data-category')
    var action = 'click'
    var label = category === 'thumbnail' ? this.thumbnailLabel(item) : item.getAttribute('data-id')
    // ga('send', 'event', 'Videos', 'play', 'Fall Campaign')
    // @ts-ignore
    ga('send', 'event', category, action, label);
  }

  thumbnailLabel(item) {
    var name = item.querySelector('.-name').textContent
    var author = item.querySelector('.-author').textContent
    return this.util.id(name + ' ' + author)
  }

  /**
   * 
   * @param {string[]} _viewID a list of view & id
   */
  update(_viewID) {
    var path = this.updatePaths(_viewID)
    var selected = this.selected(path.split(':'))
    selected.data = this.data(selected)
    this.currentView = selected
    this.updateViewData().toggleView().toggleBackBtn().updateLocalStorage()
  }

  updateLocalStorage() {
    localStorage.setItem('paths', JSON.stringify(this.paths))
  }

  updatePaths(_viewID) {
    var path = this.path(_viewID)
    // if view class is the back button,
    // pop the stack and return the previous view
    // else push the view class to the stack and return the view
    if (_viewID[0] === 'back') {
      this.mdp.material.setAttribute('src', '');
      (this.paths.length !== 1) && this.paths.pop()
      return this.paths[this.paths.length - 1]
    } else {
      var idx = this.paths.findIndex(_path => _path === path);
      (idx == -1) && this.paths.push(path)
      return path
    }
  }

  selected(_viewID) {
    var view = _viewID[0]
    var id = _viewID[1]
    return { id, el: document.querySelector('.-view.-' + view), view }
  }

  path(_viewID) {
    return _viewID[0] + ":" + _viewID[1]
  }

  updateViewData() {
    this.page.textContent = this.names[this.currentView.view]
    var updatefn = 'update' + this.currentView.view
    this[updatefn]()
    return this
  }

  updatehome() {

  }

  updatemdp() {
    this.mdp.populate(this.currentView.data).lazyLoad('mdp')
  }

  updatemlp() {
    this.mlp.links.forEach(link => link.removeEventListener('click', () => this.goto(link)))
    this.mlp.populate(this.currentView.data).lazyLoad('mlp')
    this.mlp.links.forEach(link => link.addEventListener('click', () => this.goto(link)))
  }

  data(selected) {
    if (selected.view === 'mdp') {
      return this.util.data.filter(
        datum => datum.id === selected.id
      )
    } else {
      return this.util.data.filter(
        datum => this.util.id(datum.author) === selected.id
      )
    }
  }

  /**
   * @param {HTMLElement} target the html element clicked
   * @returns {string[]} the class to be viewed
   */
  viewID(target) {
    var view = target.getAttribute('data-view')
    var id = target.getAttribute('data-id')
    return [view, id]
  }

  toggleView() {
    this.views.forEach(view => view.classList.remove('active'))
    this.currentView.el.classList.add('active')
    return this
  }

  toggleBackBtn() {
    var back = document.querySelector('.-item.-back')
    var fn = back.classList
    this.paths.length !== 1 ? fn.remove('-hide') : fn.add('-hide')
    return this
  }
}

class Main {
  constructor() {
    this.self = this
    this.banners = {
      banner11: {
        name: 'Pace Christian Cartoons',
        src: '../img/designs/fl-pcc.jpg',
        view: 'mdp'
      },
      banner21: {
        name: 'Ramsay Christian Cartoons',
        src: '../img/designs/mfl-ramsay-christian-cartoons.jpg',
        view: 'mdp'
      },
      banner22: {
        name: 'The Bible Project',
        src: '../img/designs/mfl-tbp.jpg',
        view: 'mlp'
      },
      banner31: {
        name: 'Max 7 - RodTheNey',
        src: '../img/designs/fl-max7-3d.jpg',
        view: 'mlp'
      },
      banner41: {
        name: 'The Animated Series',
        src: '../img/designs/fl-bas.jpg',
        view: 'mlp'
      }
    }

    this.authenticate()
    this.afterLogin()
  }

  getData() {

    // var response = await fetch('../services/data.json')
    return fetch('../services/data.json')
      .then(response => response.json())
    // return await response.json()
  }

  authenticate() {

    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     afterLogin()
    //   } else {
    //     // No user is signed in.
    //   }
    // });
  }

  afterLogin() {
    this.getData().then(json => {
      var util = new Util(json)
      var home = new Home(this.banners, util)
      var mlp = new MLP(util)
      var mdp = new MDP()
      new Navigate({ util, home, mlp, mdp })
    })
  }
}

window.addEventListener('load', function () {
  console.log('completely loaded')
  new Main()
})