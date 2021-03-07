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
    console.log('this.data', this.data)

    this.el = query => document.querySelector(query)
    this.all = query => document.querySelectorAll(query)
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
    // this.banner11 = document.querySelector('.-link[data-row="1"]')
    // this.banner21 = document.querySelector('.-link[data-row="2"][data-col="1"]')
    // this.banner22 = document.querySelector('.-link[data-row="2"][data-col="2"]')
    // this.banner31 = document.querySelector('.-link[data-row="3"]')
    // this.banner41 = document.querySelector('.-link[data-row="4"]')

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
    // var parent = this[key]
    var parent = document.querySelector('.-link[data-banner="'+ key + '"]')
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
    console.log('selected', selected)
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

class BannerSlides {
  /**
   * @type {Util}
   */
  constructor(util) {
    this.util = util
    this.banners = this.util.all('.-slide .-link')
    this.controls = this.util.all('.-slide .-controls')

    this.listeners()
  }

  listeners() {
    this.controls.forEach(control => this.listen(control))
  }


  listen(control) {
    var prev = control.querySelector('.-prev')
    var next = control.querySelector('.-next')
    var parent = control.parentElement;
    var banners = parent.querySelectorAll('.-link');
    
    [
      { btn: prev, dir: 'prev' },
      { btn: next, dir: 'next' }
    ].map(data => data.btn.addEventListener('click', _ => { this.moveSlide({ banners, btn: data.btn, dir: data.dir  }) }))
    console.log('parent', parent, 'banners', banners)
  }

  moveSlide(json) {
    var banners = json.banners
    var btn = json.btn
    var dir = json.dir
    var is_active = Array.from(banners).findIndex((banner) => banner.classList.contains('active'))
    if (dir === 'prev') {
      var next = is_active === 0 ? (banners.length - 1) : (is_active - 1)
    } else {
      var next = is_active === (banners.length - 1) ? 0 : (is_active + 1)
    }
    banners[is_active].classList.remove('active')
    banners[next].classList.add('active')
  }
}

class Main {
  constructor() {
    this.data = [
      "name=In the Beginning|desc=Old Testament|author=Superbook|host=YouTube|id=fn-wEOpPsMo|type=video|meta=",
      "name=Abraham|desc=Old Testament|author=Superbook|host=YouTube|id=xAFMg09bido|type=video|meta=",
      "name=Jacob & Esau|desc=Old Testament|author=Superbook|host=YouTube|id=zhykNXjGQuA|type=video|meta=",
      "name=The Exodus|desc=Old Testament|author=Superbook|host=YouTube|id=H98zaq803Tg|type=video|meta=",
      "name=The 10 Commandments|desc=Old Testament|author=Superbook|host=YouTube|id=VtWfiTXO1Ts|type=video|meta=",
      "name=David - Giant Adventure|desc=Old Testament|author=Superbook|host=YouTube|id=jdMq3YAfmO0|type=video|meta=",
      "name=Daniel - Roar|desc=Old Testament|author=Superbook|host=YouTube|id=5UNBtaVsWm4|type=video|meta=",
      "name=The First Christmas|desc=New Testament|author=Superbook|host=YouTube|id=1fl9laM4ViM|type=video|meta=",
      "name=Miracles of Jesus|desc=New Testament|author=Superbook|host=YouTube|id=uZTHwqj0Bkk|type=video|meta=",
      "name=The Last Supper|desc=New Testament|author=Superbook|host=YouTube|id=9Edfb_faOb0|type=video|meta=",
      "name=He is Risen|desc=New Testament|author=Superbook|host=YouTube|id=3F0rt2AiqJY|type=video|meta=",
      "name=Paul - Road to Damascus|desc=New Testament|author=Superbook|host=YouTube|id=ogDArF83p8I|type=video|meta=",
      "name=The Final Battle|desc=New Testament|author=Superbook|host=YouTube|id=ycSy-kmtM4Q|type=video|meta=",
      "name=Jonah|desc=Old Testament|author=Superbook|host=YouTube|id=YkC2MKfI5Gk|type=video|meta=",
      "name=Joseph|desc=And Pharaoh's Dream|author=Superbook|host=YouTube|id=1VENAMIch84|type=video|meta=",
      "name=The Fiery Furnace|desc=Shadrach, Meshach, Abednego|author=Superbook|host=YouTube|id=bFhmFzmW40I|type=video|meta=",
      "name=Rahab|desc=And The Walls of Jericho|author=Superbook|host=YouTube|id=F7sm4tSS7IE|type=video|meta=",
      "name=Esther|desc=For Such a Time as This|author=Superbook|host=YouTube|id=q94wBYdMwtE|type=video|meta=",
      "name=John the Baptist|desc=New Testament|author=Superbook|host=YouTube|id=_d4KeGaTa9U|type=video|meta=",
      "name=Paul & The Ship Wreck|desc=New Testament|author=Superbook|host=YouTube|id=p3xqGe3fVuM|type=video|meta=",
      "name=Job|desc=Old Testament|author=Superbook|host=YouTube|id=QhPLGMMz7yk|type=video|meta=",
      "name=Noah & the Ark|desc=Old Testament|author=Superbook|host=YouTube|id=t1p5ocaJzTM|type=video|meta=",
      "name=Gideon|desc=Old Testament|author=Superbook|host=YouTube|id=StowZD2JvZw|type=video|meta=",
      "name=Peter's Denial|desc=New Testament|author=Superbook|host=YouTube|id=y4ZOmkgPyjo|type=video|meta=",
      "name=The Prodigal Son|desc=New Testament|author=Superbook|host=YouTube|id=ZpRh8xedMPE|type=video|meta=",
      "name=Elijah & The Prophets of Baal|desc=Old Testament|author=Superbook|host=YouTube|id=k_kKBwG-hOQ|type=video|meta=",
      "name=In the Beginning|desc=Old Testament|author=The Animated Series|host=YouTube|id=6cvA9nIRy5A|type=video|meta=",
      "name=Abraham|desc=Old Testament|author=The Animated Series|host=YouTube|id=8UbeJSOQsHQ|type=video|meta=",
      "name=Moses|desc=Old Testament|author=The Animated Series|host=YouTube|id=E1SztIhPXtg|type=video|meta=",
      "name=The Exodus|desc=Old Testament|author=The Animated Series|host=YouTube|id=QPxjlOr7hro|type=video|meta=",
      "name=The Land of Canaan|desc=Old Testament|author=The Animated Series|host=YouTube|id=eZT8CMbznB4|type=video|meta=",
      "name=Elijah & Elisha|desc=Old Testament|author=The Animated Series|host=YouTube|id=0OHvyS_DJ_I|type=video|meta=",
      "name=Babylon|desc=Old Testament|author=The Animated Series|host=YouTube|id=me6HsPd85r0|type=video|meta=",
      "name=Birth|desc=Of Jesus Christ|author=The Animated Series|host=YouTube|id=YISebgzy0SI|type=video|meta=",
      "name=Early Ministry|desc=Of Jesus Christ|author=The Animated Series|host=YouTube|id=W5oJ3pT6VXA|type=video|meta=",
      "name=Miracles & Parables|desc=Of Jesus Christ|author=The Animated Series|host=YouTube|id=AqmBaJNLvAk|type=video|meta=",
      "name=Crucifixion & Death|desc=Of Jesus Christ|author=The Animated Series|host=YouTube|id=Cy0SzlxMVho|type=video|meta=",
      "name=Burial & Resurrection|desc=Of Jesus Christ|author=The Animated Series|host=YouTube|id=MEWdbYu94wQ|type=video|meta=",
      "name=The Gospel|desc=Of Jesus Christ|author=The Animated Series|host=YouTube|id=SN3Oa8867dM|type=video|meta=",
      "name=Pharisee & Tax Collector|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=Ufe6zouTq8g|type=video|meta=",
      "name=The Lost Son|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=mLI2zqMU6Ww|type=video|meta=",
      "name=Jesus Heals the Paralytic|desc=New Testament|author=Max 7 - RodTheNey|host=YouTube|id=0LqHYkGU4Zg|type=video|meta=",
      "name=Following Jesus|desc=New Testament|author=Max 7 - RodTheNey|host=YouTube|id=eKzGAlBvWP8|type=video|meta=",
      "name=The Good Samaritan|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=Dr0Vn5QBMtM|type=video|meta=",
      "name=Wise & Foolish Builders|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=CXWHLB1f6_U|type=video|meta=",
      "name=The Talents|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=bbPKhYBaWRg|type=video|meta=",
      "name=The Lost Sheep|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=tyWZeOlaRo4|type=video|meta=",
      "name=The Sower|desc=Parable of Jesus|author=Max 7 - RodTheNey|host=YouTube|id=V9IOhGPrRvY|type=video|meta=",
      "name=Overview|desc=Old Testament|author=The Bible Project|host=YouTube|id=ALsluAKBZ-c|type=video|meta=",
      "name=Genesis 1-11|desc=Old Testament|author=The Bible Project|host=YouTube|id=GQI72THyO5I|type=video|meta=",
      "name=Genesis 12-50|desc=Old Testament|author=The Bible Project|host=YouTube|id=F4isSyennFo|type=video|meta=",
      "name=Exodus 1-18|desc=Old Testament|author=The Bible Project|host=YouTube|id=jH_aojNJM3E|type=video|meta=",
      "name=Exodus 19-40|desc=Old Testament|author=The Bible Project|host=YouTube|id=oNpTha80yyE|type=video|meta=",
      "name=Leviticus|desc=Old Testament|author=The Bible Project|host=YouTube|id=IJ-FekWUZzE|type=video|meta=",
      "name=Numbers|desc=Old Testament|author=The Bible Project|host=YouTube|id=tp5MIrMZFqo|type=video|meta=",
      "name=Deuteronomy|desc=Old Testament|author=The Bible Project|host=YouTube|id=q5QEH9bH8AU|type=video|meta=",
      "name=Joshua|desc=Old Testament|author=The Bible Project|host=YouTube|id=JqOqJlFF_eU|type=video|meta=",
      "name=Judges|desc=Old Testament|author=The Bible Project|host=YouTube|id=kOYy8iCfIJ4|type=video|meta=",
      "name=1Samuel|desc=Old Testament|author=The Bible Project|host=YouTube|id=QJOju5Dw0V0|type=video|meta=",
      "name=2Samuel|desc=Old Testament|author=The Bible Project|host=YouTube|id=YvoWDXNDJgs|type=video|meta=",
      "name=1 & 2 Kings|desc=Old Testament|author=The Bible Project|host=YouTube|id=bVFW3wbi9pk|type=video|meta=",
      "name=Isaiah 1 - 39|desc=Old Testament|author=The Bible Project|host=YouTube|id=d0A6Uchb1F8|type=video|meta=",
      "name=Isaiah 40 - 66|desc=Old Testament|author=The Bible Project|host=YouTube|id=_TzdEPuqgQg|type=video|meta=",
      "name=Jeremiah|desc=Old Testament|author=The Bible Project|host=YouTube|id=RSK36cHbrk0|type=video|meta=",
      "name=Ezekiel 1 - 33|desc=Old Testament|author=The Bible Project|host=YouTube|id=R-CIPu1nko8|type=video|meta=",
      "name=Ezekiel 34 - 48|desc=Old Testament|author=The Bible Project|host=YouTube|id=SDeCWW_Bnyw|type=video|meta=",
      "name=Hosea|desc=Old Testament|author=The Bible Project|host=YouTube|id=kE6SZ1ogOVU|type=video|meta=",
      "name=Joel|desc=Old Testament|author=The Bible Project|host=YouTube|id=zQLazbgz90c|type=video|meta=",
      "name=Amos|desc=Old Testament|author=The Bible Project|host=YouTube|id=mGgWaPGpGz4|type=video|meta=",
      "name=Obadiah|desc=Old Testament|author=The Bible Project|host=YouTube|id=i4ogCrEoG5s|type=video|meta=",
      "name=Jonah|desc=Old Testament|author=The Bible Project|host=YouTube|id=dLIabZc0O4c|type=video|meta=",
      "name=Micah|desc=Old Testament|author=The Bible Project|host=YouTube|id=MFEUEcylwLc|type=video|meta=",
      "name=Nahum|desc=Old Testament|author=The Bible Project|host=YouTube|id=Y30DanA5EhU|type=video|meta=",
      "name=Habakkuk|desc=Old Testament|author=The Bible Project|host=YouTube|id=OPMaRqGJPUU|type=video|meta=",
      "name=Zephaniah|desc=Old Testament|author=The Bible Project|host=YouTube|id=oFZknKPNvz8|type=video|meta=",
      "name=Haggai|desc=Old Testament|author=The Bible Project|host=YouTube|id=juPvv_xcX-U|type=video|meta=",
      "name=Zechariah|desc=Old Testament|author=The Bible Project|host=YouTube|id=_106IfO6Kc0|type=video|meta=",
      "name=Malachi|desc=Old Testament|author=The Bible Project|host=YouTube|id=HPGShWZ4Jvk|type=video|meta=",
      "name=Psalms|desc=Old Testament|author=The Bible Project|host=YouTube|id=j9phNEaPrv8|type=video|meta=",
      "name=Proverbs|desc=Old Testament|author=The Bible Project|host=YouTube|id=AzmYV8GNAIM|type=video|meta=",
      "name=Job|desc=Old Testament|author=The Bible Project|host=YouTube|id=xQwnH8th_fs|type=video|meta=",
      "name=Song of Songs|desc=Old Testament|author=The Bible Project|host=YouTube|id=4KC7xE4fgOw|type=video|meta=",
      "name=Ruth|desc=Old Testament|author=The Bible Project|host=YouTube|id=0h1eoBeR4Jk|type=video|meta=",
      "name=Lamentations|desc=Old Testament|author=The Bible Project|host=YouTube|id=p8GDFPdaQZQ|type=video|meta=",
      "name=Ecclesiastes|desc=Old Testament|author=The Bible Project|host=YouTube|id=lrsQ1tc-2wk|type=video|meta=",
      "name=Esther|desc=Old Testament|author=The Bible Project|host=YouTube|id=JydNSlufRIs|type=video|meta=",
      "name=Daniel|desc=Old Testament|author=The Bible Project|host=YouTube|id=9cSC9uobtPM|type=video|meta=",
      "name=Ezra - Nehemiah|desc=Old Testament|author=The Bible Project|host=YouTube|id=MkETkRv9tG8|type=video|meta=",
      "name=Chronicles|desc=Old Testament|author=The Bible Project|host=YouTube|id=HR7xaHv3Ias|type=video|meta=",
      "name=Bible Study|desc=Study Resources|author=Clarence Larkin|host=Drive|id=1T-SrgO3Z_uzczLDxIj7MTa5UzaU2g2wO|type=pdf|meta=larkin-bible-study.jpg",
      "name=Cartoons|desc=by E.J. Pace|author=Pace Christian Cartoons|host=Domain|id=pace-christian-cartoons|type=slideshow|meta=1-339",
      "name=Cartoons|desc=by C.L. Ramsay|author=Ramsay Christian Cartoons|host=Domain|id=ramsay-christian-cartoons|type=slideshow|meta=1-48",
      "name=Creation Days 1 - 4|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=SmCMgI4q3v4|type=video|meta=",
      "name=Creation Days 5 & 6|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=sw6FRoDvwFs|type=video|meta=",
      "name=Creation of Man|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=XGcvvh2tO7Y|type=video|meta=",
      "name=Fall of Man|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=QeYzUWyzZU4|type=video|meta=",
      "name=God Promises a Savior|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=bpXiT5kcdXo|type=video|meta=",
      "name=Cain & Abel|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=4trte5e-g6Y|type=video|meta=",
      "name=Noah|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=SU7CBsWkusA|type=video|meta=",
      "name=Tower of Babel|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=ewz2yaucG94|type=video|meta=",
      "name=Abraham|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=9BimIL1xk8M|type=video|meta=",
      "name=Sodom & Gomorrah|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=OAonJzxCJRA|type=video|meta=",
      "name=Isaac|desc=Genesis - Deuteronomy|author=AD Bible School|host=YouTube|id=-KVT2HAIMG8|type=video|meta=",
      "name=5 Things a Man Needs|desc=Before a Woman|author=Wisdom for Dominion|host=YouTube|id=aBakJ2mlK08|type=video|meta=",
      "name=Attitudes|desc=For Leadership|author=Wisdom for Dominion|host=YouTube|id=VTdchwoFTK4|type=video|meta=",
      "name=Re-Adjusting|desc=Your Flight Course|author=Wisdom for Dominion|host=YouTube|id=Ba3hdinE3aU|type=video|meta=",
      "name=Marriage|desc=Kind of Love|author=Wisdom for Dominion|host=YouTube|id=tvNkpmekeec|type=video|meta=",
      "name=The Discipline|desc=Of Vision|author=Wisdom for Dominion|host=YouTube|id=QNNir8_WPLs|type=video|meta=",
      "name=Dangers of Bonding|desc=In Relationships|author=Wisdom for Dominion|host=YouTube|id=AMrb9SkP2MI|type=video|meta=",
      "name=Who|desc=Are You|author=Wisdom for Dominion|host=YouTube|id=48JRGihhicE|type=video|meta=",
      "name=Marriage Needs of Men|desc=Versus Women|author=Wisdom for Dominion|host=YouTube|id=K3hK-FdvUno|type=video|meta=",
      "name=Why Marriages|desc=End in Divorce|author=Wisdom for Dominion|host=YouTube|id=q4id36M9kMU|type=video|meta=",
      "name=You Are|desc=A Finished Masterpiece|author=Wisdom for Dominion|host=YouTube|id=0zzuHC-5Cmw|type=video|meta=",
      "name=The Test|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=sR4AT0LMJ5c|type=video|meta=",
      "name=Tree of Life|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=TJLan-pJzfQ|type=video|meta=",
      "name=Generosity|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=62CliEkRCso|type=video|meta=",
      "name=Temple|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=wTnq6I3vUbU|type=video|meta=",
      "name=God|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=eAvYmE2YYIU|type=video|meta=",
      "name=Holy Spirit|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=oNNZO9i1Gjc|type=video|meta=",
      "name=Messiah|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=3dEh25pduQ8|type=video|meta=",
      "name=The Law|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=3BGO9Mmd_cU|type=video|meta=",
      "name=The Way of Exile|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=XzWpa0gcPyo|type=video|meta=",
      "name=Exile|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=xSua9_WhQFE|type=video|meta=",
      "name=Heaven & Earth|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=Zy2AQlK6C5k|type=video|meta=",
      "name=Holiness|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=l9vn5UvsHvM|type=video|meta=",
      "name=Covenants|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=8ferLIsvlmI|type=video|meta=",
      "name=Sacrifice & Atonement|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=G_OlRWGLdnw|type=video|meta=",
      "name=Justice|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=A14THPoc4-4|type=video|meta=",
      "name=Gospel of the Kingdom|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=xmFPS0f-kzs|type=video|meta=",
      "name=Son of Man|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=z6cWEcqxhlI|type=video|meta=",
      "name=Image of God|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=YbipxLDtY8c|type=video|meta=",
      "name=Day of the Lord|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=tEBc2gSSW04|type=video|meta=",
      "name=Public Reading of Scripture|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=BO1Y9XyWKTw|type=video|meta=",
      "name=Sabbath|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=PFTLvkB3JLM|type=video|meta=",
      "name=Water of Life|desc=Biblical Themes|author=The Bible Project|host=YouTube|id=PgmAkM39Zt4|type=video|meta=",
      "name=New Testament|desc=New Testament|author=The Bible Project|host=YouTube|id=Q0BrP8bqj0c|type=video|meta=",
      "name=Matthew Ch 1 - 13|desc=New Testament|author=The Bible Project|host=YouTube|id=3Dv4-n6OYGI|type=video|meta=",
      "name=Matthew Ch 14 - 28|desc=New Testament|author=The Bible Project|host=YouTube|id=GGCF3OPWN14|type=video|meta=",
      "name=Mark|desc=New Testament|author=The Bible Project|host=YouTube|id=HGHqu9-DtXk|type=video|meta=",
      "name=John 1 - 12|desc=New Testament|author=The Bible Project|host=YouTube|id=G-2e9mMf7E8|type=video|meta=",
      "name=John 13 - 21|desc=New Testament|author=The Bible Project|host=YouTube|id=RUfh_wOsauk|type=video|meta=",
      "name=Luke 1 - 9|desc=New Testament|author=The Bible Project|host=YouTube|id=XIb_dCIxzr0|type=video|meta=",
      "name=Luke 10 - 24|desc=New Testament|author=The Bible Project|host=YouTube|id=26z_KhwNdD8|type=video|meta=",
      "name=Acts 1 - 12|desc=New Testament|author=The Bible Project|host=YouTube|id=CGbNw855ksw|type=video|meta=",
      "name=Acts 13 - 28|desc=New Testament|author=The Bible Project|host=YouTube|id=Z-17KxpjL0Q|type=video|meta=",
      "name=Romans 1 - 4|desc=New Testament|author=The Bible Project|host=YouTube|id=ej_6dVdJSIU|type=video|meta=",
      "name=Romans 5 - 16|desc=New Testament|author=The Bible Project|host=YouTube|id=0SVTl4Xa5fY|type=video|meta=",
      "name=1Corinthians|desc=New Testament|author=The Bible Project|host=YouTube|id=yiHf8klCCc4|type=video|meta=",
      "name=2Corinthians|desc=New Testament|author=The Bible Project|host=YouTube|id=3lfPK2vfC54|type=video|meta=",
      "name=Galatians|desc=New Testament|author=The Bible Project|host=YouTube|id=vmx4UjRFp0M|type=video|meta=",
      "name=Ephesians|desc=New Testament|author=The Bible Project|host=YouTube|id=Y71r-T98E2Q|type=video|meta=",
      "name=Philippians|desc=New Testament|author=The Bible Project|host=YouTube|id=oE9qqW1-BkU|type=video|meta=",
      "name=Colossians|desc=New Testament|author=The Bible Project|host=YouTube|id=pXTXlDxQsvc|type=video|meta=",
      "name=1Thessalonians|desc=New Testament|author=The Bible Project|host=YouTube|id=No7Nq6IX23c|type=video|meta=",
      "name=2Thessalonians|desc=New Testament|author=The Bible Project|host=YouTube|id=kbPBDKOn1cc|type=video|meta=",
      "name=1Timothy|desc=New Testament|author=The Bible Project|host=YouTube|id=7RoqnGcEjcs|type=video|meta=",
      "name=2Timothy|desc=New Testament|author=The Bible Project|host=YouTube|id=urlvnxCaL00|type=video|meta=",
      "name=Titus|desc=New Testament|author=The Bible Project|host=YouTube|id=PUEYCVXJM3k|type=video|meta=",
      "name=Philemon|desc=New Testament|author=The Bible Project|host=YouTube|id=aW9Q3Jt6Yvk|type=video|meta=",
      "name=Hebrews|desc=New Testament|author=The Bible Project|host=YouTube|id=1fNWTZZwgbs|type=video|meta=",
      "name=James|desc=New Testament|author=The Bible Project|host=YouTube|id=qn-hLHWwRYY|type=video|meta=",
      "name=1Peter|desc=New Testament|author=The Bible Project|host=YouTube|id=WhP7AZQlzCg|type=video|meta=",
      "name=2Peter|desc=New Testament|author=The Bible Project|host=YouTube|id=wWLv_ITyKYc|type=video|meta=",
      "name=1 - 3John|desc=New Testament|author=The Bible Project|host=YouTube|id=l3QkE6nKylM|type=video|meta=",
      "name=Jude|desc=New Testament|author=The Bible Project|host=YouTube|id=6UoCmakZmys|type=video|meta=",
      "name=Revelation 1 - 11|desc=New Testament|author=The Bible Project|host=YouTube|id=5nvVVcYD-0w|type=video|meta=",
      "name=Revelation 12 - 22|desc=New Testament|author=The Bible Project|host=YouTube|id=QpnIrbq2bKo|type=video|meta=",
      "name=Shalom - Peace|desc=Advent Word Studies|author=The Bible Project|host=YouTube|id=oLYORLZOaZE|type=video|meta=",
      "name=Hope|desc=Advent Word Studies|author=The Bible Project|host=YouTube|id=4WYNBjJSYvE|type=video|meta=",
      "name=Agape - Love|desc=Advent Word Studies|author=The Bible Project|host=YouTube|id=slyevQ1LW7A|type=video|meta=",
      "name=Joy|desc=Advent Word Studies|author=The Bible Project|host=YouTube|id=qvOhQTuD2e0|type=video|meta=",
      "name=Shema - Listen|desc=Shema Word Studies|author=The Bible Project|host=YouTube|id=6KQLOuIKaRA|type=video|meta=",
      "name=Love|desc=Shema Word Studies|author=The Bible Project|host=YouTube|id=HV_LUs2lnIQ|type=video|meta=",
      "name=Yahweh - Lord|desc=Shema Word Studies|author=The Bible Project|host=YouTube|id=eLrGM26pmM0|type=video|meta=",
      "name=Heart|desc=Shema Word Studies|author=The Bible Project|host=YouTube|id=aS4iM6KpPYo|type=video|meta=",
      "name=Soul|desc=Shema Word Studies|author=The Bible Project|host=YouTube|id=g_igCcWAMAM|type=video|meta=",
      "name=Strength|desc=Shema Word Studies|author=The Bible Project|host=YouTube|id=9aaVy1AmFX4|type=video|meta=",
      "name=Sin|desc=Bad Word Studies|author=The Bible Project|host=YouTube|id=aNOZ7ocLD74|type=video|meta=",
      "name=Iniquity|desc=Bad Word Studies|author=The Bible Project|host=YouTube|id=w1zkwkI9oAw|type=video|meta=",
      "name=Transgression|desc=Bad Word Studies|author=The Bible Project|host=YouTube|id=cq-r9FFN5ew|type=video|meta=",
      "name=Gospel|desc=Word Studies|author=The Bible Project|host=YouTube|id=HT41M013X3A|type=video|meta=",
      "name=Witness|desc=Word Studies|author=The Bible Project|host=YouTube|id=jhcmzjwbvyk|type=video|meta=",
      "name=Character of God|desc=Character of God|author=The Bible Project|host=YouTube|id=nxwzq1PJImM|type=video|meta=",
      "name=Compassion|desc=Character of God|author=The Bible Project|host=YouTube|id=qJEtyAiAQik|type=video|meta=",
      "name=Grace|desc=Character of God|author=The Bible Project|host=YouTube|id=ABPVVw_aw44|type=video|meta=",
      "name=Join the Bible Project|desc=Studio News|author=The Bible Project|host=YouTube|id=LVVtyvvRAGc|type=video|meta=",
      "name=Season 6 Preview|desc=Studio News|author=The Bible Project|host=YouTube|id=rB-uyIoSRD4|type=video|meta=",
      "name=What is BibleProject|desc=Studio News|author=The Bible Project|host=YouTube|id=vFwNZNyDu9k|type=video|meta=",
      "name=Award Unboxing - YouTube Creator|desc=Studio News|author=The Bible Project|host=YouTube|id=wX-42UOUPPs|type=video|meta=",
      "name=1 Million Subscriber|desc=Studio News|author=The Bible Project|host=YouTube|id=pxGY3Av5_Mc|type=video|meta=",
      "name=Choosing Our Video Topics|desc=Process Series|author=The Bible Project|host=YouTube|id=l0S7o-6F53Q|type=video|meta=",
      "name=Biblical Scholarship|desc=Process Series|author=The Bible Project|host=YouTube|id=VLpsR5CCWWo|type=video|meta=",
      "name=The Habit of Open Mindedness|desc=Process Series|author=The Bible Project|host=YouTube|id=GNLd1XPkWLk|type=video|meta=",
      "name=The Mind of a Researcher|desc=Process Series|author=The Bible Project|host=YouTube|id=m3Vd74_qekk|type=video|meta=",
      "name=What is the Bible?|desc=How to Read the Bible|author=The Bible Project|host=YouTube|id=ak06MSETeo4|type=video|meta=",
      "name=Biblical Story|desc=How to Read the Bible|author=The Bible Project|host=YouTube|id=7_CGP-12AE0|type=video|meta=",
      "name=Literary Styles|desc=How to Read the Bible|author=The Bible Project|host=YouTube|id=oUXJ8Owes8E|type=video|meta=",
      "name=Ancient Jewish Meditation Literature|desc=How to Read the Bible|author=The Bible Project|host=YouTube|id=VhmlJBUIoLk|type=video|meta=",
      "name=Plot|desc=How to Read the Bible|author=The Bible Project|host=YouTube|id=dLFCE8z__hw|type=video|meta=",
      "name=Is the Tree of Life Practical?|desc=Podcast|author=The Bible Project|host=YouTube|id=CuN4YZ7pup0|type=video|meta=",
      "name=The satan & demons Q+R?|desc=Podcast|author=The Bible Project|host=YouTube|id=npk34pB5P4A|type=video|meta=",
      "name=Does the bible Predict the End of the World?|desc=Podcast|author=The Bible Project|host=YouTube|id=c3_XU_BDbD0|type=video|meta=",
      "name=Birth of Jesus - Luke 1 - 2|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=_OLezoUvOEQ|type=video|meta=",
      "name=Luke 3 - 9|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=0k4GbvZUPuo|type=video|meta=",
      "name=The Prodigal Son - Luke 9 - 19|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=jUCCUHurV0I|type=video|meta=",
      "name=Luke 19 - 23|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=_unHmAf7INk|type=video|meta=",
      "name=Luke 24|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=Vb24Lk1Oh5M|type=video|meta=",
      "name=Acts 1 - 7|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=JQhkWmFJKnA|type=video|meta=",
      "name=Acts 8 - 12|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=oiVAbkINtRU|type=video|meta=",
      "name=Acts 8 - 12|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=oiVAbkINtRU|type=video|meta=",
      "name=Acts 13 - 20|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=fglsbcGSr3A|type=video|meta=",
      "name=Acts 21 - 28|desc=Luke-Acts Series|author=The Bible Project|host=YouTube|id=FJsiwOB0Pvg|type=video|meta=",
      "name=Intro to Spiritual Beings|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=cBxOZqtGTXE|type=video|meta=",
      "name=Elohim|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=U5iyUik97Lg|type=video|meta=",
      "name=The Divine Council|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=e1rai6WoOJU|type=video|meta=",
      "name=Angels & Cherubim|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=-bMRxQbLUlg|type=video|meta=",
      "name=Angel of the Lord|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=qgmf8bHayXw|type=video|meta=",
      "name=The satan & demons|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=CamYtVpoTNk|type=video|meta=",
      "name=The New Humanity|desc=Spiritual Beings|author=The Bible Project|host=YouTube|id=takEeHtRrMw|type=video|meta=",
      "name=The Book of Genesis 1 / 2|desc=The Torah Series|author=The Bible Project|host=YouTube|id=KOUV7mWDI34|type=video|meta=",
      "name=The Book of Genesis 2 / 2|desc=The Torah Series|author=The Bible Project|host=YouTube|id=VpbWbyx1008|type=video|meta=",
      "name=The Book of Exodus 1 / 2|desc=The Torah Series|author=The Bible Project|host=YouTube|id=0uf-PgW7rqE|type=video|meta=",
      "name=The Book of Exodus 2 / 2|desc=The Torah Series|author=The Bible Project|host=YouTube|id=b0GhR-2kPKI|type=video|meta=",
      "name=The Book of Leviticus|desc=The Torah Series|author=The Bible Project|host=YouTube|id=WmvyrLXoQio|type=video|meta=",
      "name=The Book of Numbers|desc=The Torah Series|author=The Bible Project|host=YouTube|id=zebxH-5o-SQ|type=video|meta=",
      "name=The Book of Deuteronomy|desc=The Torah Series|author=The Bible Project|host=YouTube|id=NMhmDPWeftw|type=video|meta=",
      "name=The Book of Proverbs|desc=The Wisdom Series|author=The Bible Project|host=YouTube|id=Gab04dPs_uA|type=video|meta=",
      "name=The Book of Ecclesiastes|desc=The Wisdom Series|author=The Bible Project|host=YouTube|id=VeUiuSK81-0|type=video|meta=",
      "name=The Book of Job|desc=The Wisdom Series|author=The Bible Project|host=YouTube|id=GswSg2ohqmA|type=video|meta=",
      "name=The Creation|desc=The Animated Bible Series - TV Series|author=Michael Arias|host=YouTube|id=Wz9mIBlzVx8|type=video|meta=",
      "name=The Flood|desc=The Animated Series - TV Series|author=Michael Arias|host=YouTube|id=zO4dxyg7sw0|type=video|meta=",
      "name=Job|desc=The Animated Series - TV Series|author=Michael Arias|host=YouTube|id=zv5UvtkZi10|type=video|meta=",
      "name=Solomon's Temple|desc= 3D|author=Messages of Christ|host=YouTube|id=y2tha7ogpec|type=video|meta=",
      "name=Solomon's Temple|desc= 3D - Explained|author=Messages of Christ|host=YouTube|id=Xt6lQAe8ues|type=video|meta=",
      "name=St. Patrick|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=ErPpSE47ihI|type=video|meta=",
      "name=Samuel Morris|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=lrn5turazCQ|type=video|meta=",
      "name=Perpetua|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=zH4Ow56HXo0|type=video|meta=",
      "name=Jim Elliot|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=tL_jGpADU64|type=video|meta=",
      "name=Eric Liddell|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=2SSR4OmSkXA|type=video|meta=",
      "name=Adoniram & Ann Judson|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=4yVo4802K_o|type=video|meta=",
      "name=William Tyndale|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=b-26lwIzsYc|type=video|meta=",
      "name=Martin Luther|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=pqlZPNskJpY|type=video|meta=",
      "name=Harriet Tubman|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=x4Slua7YAGg|type=video|meta=",
      "name=George Muller|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=03l-J7RelOU|type=video|meta=",
      "name=Amy Carmichael|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=_0dJkFv5kNk|type=video|meta=",
      "name=Gladys Aylward|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=h9emVj7PcAQ|type=video|meta=",
      "name=Robert Jermain Thomas|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=icucEJdoquI|type=video|meta=",
      "name=John Wesley|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=2t8v9sPYb8c|type=video|meta=",
      "name=William Booth|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=JmwH2R8tH1o|type=video|meta=",
      "name=Richard Wurmbrand|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=VD_mTGy7op0|type=video|meta=",
      "name=Corrie Ten Boom|desc=The Torchlighters|author=Christian History Institute|host=YouTube|id=oIC5bFFzSKI|type=video|meta="
    ]
    this.self = this
    this.banners = {
      banner11: {
        name: 'Pace Christian Cartoons',
        src: '../img/designs/fl-pcc.jpg',
        view: 'mdp'
      },
      banner21: {
        name: 'Ramsay Christian Cartoons',
        src: '../img/designs/fl-charles.jpg',
        view: 'mdp'
      },
      banner31: {
        name: 'Superbook',
        src: '../img/designs/mfl-superbook.jpg',
        view: 'mlp'
      },
      banner32: {
        name: 'The Bible Project',
        src: '../img/designs/mfl-tbp.jpg',
        view: 'mlp'
      },
      banner41: {
        name: 'Max 7 - RodTheNey',
        src: '../img/designs/fl-max7-3d.jpg',
        view: 'mlp'
      },
      banner51: {
        name: 'The Animated Series',
        src: '../img/designs/fl-bas.jpg',
        view: 'mlp'
      },
      banner61: {
        name: 'Michael Arias',
        src: '../img/designs/fl-the-animated-series-michael.jpg',
        view: 'mlp'
      },
      banner71: {
        name: 'Christian History Institute',
        src: '../img/designs/fl-the-torchlighters.jpg',
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
    // this.getData().then(json => this.start(json))
    this.start(this.data)
  }
  
  start(json) {
    var util = new Util(json)
    var home = new Home(this.banners, util)
    var mlp = new MLP(util)
    var mdp = new MDP()
    new Navigate({ util, home, mlp, mdp })
    new BannerSlides(util)
  }
}

// window.addEventListener('load', function () {
//   console.log('completely loaded')
// })

new Main()