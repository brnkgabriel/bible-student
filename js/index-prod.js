String.prototype.escape = function () {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }
  return this.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag
  })
}

var Util = function (list) {
  this.data = this.expand(list)
  console.log('this.data', this.data)
}

Util.prototype = {
  create: function (details) {
    details.filter = this.id(details.author)
    return details
  },
  expand: function (list) {
    return list.map(each => this.json(each.split('|')))
    .map(details => this.create(details))
  },
  json: function (eachList) {
    var obj = {}
    eachList.map(prop => {
      var keyVal = prop.split('=')
      obj[keyVal[0].escape()] = keyVal[1].escape()
    })
    return obj
  },
  id: function (str) {
    var replaceApost = this.replacePattern("'", str)
    var replaceAmper = this.replacePattern('&', replaceApost)
    var replacePercn = this.replacePattern('%', replaceAmper)
    return replacePercn.toLowerCase().split(' ').join('-')
  },
  replacePattern: function (pat, str) {
    var patRegExp = new RegExp(pat, 'g')
    return str.replace(patRegExp, '-')
  },
}

Util.lazyLoad = function (view) {
  var viewEl = document.querySelector('.-view.-' + view)
  Util.observe(viewEl)
}

Util.observe = function (parent) {
  var imageObserver = new ImageObserver(parent)
  imageObserver = null
}

Util.select = function (query) {
  return document.querySelector(query)
}

var Tag = function (properties) {
  this.tag = properties[0]
  this.attributes = properties[1]
  this.styles = properties[2]
  this.textContent = properties[3]
  this.element = null
}

Tag.prototype = {
  get: function () {
    return this.init()
    .setAttributes()
    .setStyle()
    .setHTML()
    .getElement()
  },
  init: function () {
    this.element = document.createElement(this.tag)
    return this
  },
  assignAttribute: function (json) {
    Object.keys(json).map(key => {
      var value = json[key]
      this.element.setAttribute(key, value)
    })
  },
  setAttributes: function () {
    this.assignAttribute(this.attributes)
    return this
  },
  setStyle: function () {
    this.assignAttribute(this.styles)
    return this
  },
  setHTML: function () {
    this.element.innerHTML = this.textContent
    return this
  },
  getElement: function () {
    return this.element
  }
}

Tag.create = function (properties) {
  return new Tag(properties).get()
}

Tag.appendMany2One = function (many, one) {
  many.forEach(each => one.appendChild(each))
}

var ImageObserver = function (parent) {
  this.images = parent.querySelectorAll('.lazy-image')

  try {
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {})
    this.images.forEach(image => this.observer.observe(image))
  } catch (error) {
    this.images.forEach(image => this.lazyLoadImage(image))
  }
  // this.images.forEach(image => this.lazyLoadImage(image))
}

ImageObserver.prototype = {
  onIntersection: function (imageEntities) {
    var self = this
    imageEntities.forEach(image => {
      if (image.isIntersecting) {
        self.observer.unobserve(image.target)
        image.target.src = image.target.dataset.src
        image.target.onload = function () {
          image.target.classList.add('loaded')
          self.removeLoader(image.target)
        }
      }
    })
  },
  lazyLoadImage: function (image) {
    var self = this
    if (!image.src) {
      image.src = image.getAttribute('data-src')
      image.onload = function () {
        image.classList.add('loaded')
        self.removeLoader(image)
      }
    } else {
      image.classList.add('loaded')
      self.removeLoader(image)
    }
  },
  removeLoader: function(target) {
    var parent = target.parentElement
    var preloader = parent.querySelector('.-preloader')
    preloader.classList.remove('-loading')
  }
}

var Navigate = function (json) {
  this.navLinks = document.querySelectorAll('.-nav-items .-item')
  this.bannerLinks = document.querySelectorAll('.-link:not(.-mku)')
  this.views = document.querySelectorAll('.-main .-view')
  this.page = document.querySelector('.-header .-page')

  this.navLinks.forEach(link => link.addEventListener('click', () => this.goto(link)))
  this.bannerLinks.forEach(link => link.addEventListener('click', () => this.goto(link)))

  this.paths = this.lastPath() || ['home:null']

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

Navigate.prototype = {
  goto: function (link) {
    var _viewID = this.viewID(link)
    this.update(_viewID)
  },
  lastPath: function () {
    var paths = JSON.parse(localStorage.getItem('paths'))
    return paths ? paths : null
  },
  update: function (_viewID) {
    var path = this.updatePaths(_viewID)
    var selected = this.selected(path.split(':'))
    selected.data = this.data(selected)
    this.currentView = selected
    console.log('this.currentView', this.currentView)
    this.updateViewData()
    .toggleView()
    .toggleBackBtn()
    .updateLocalStorage()
  },
  updatePaths: function (_viewID) {
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
  },
  updateViewData: function () {
    var view = this.currentView.view
    this.page.textContent = this[view].name
    var updatefn = 'update' + view
    this[updatefn]()
    return this
  },
  toggleView: function () {
    this.views.forEach(view => view.classList.remove('active'))
    this.currentView.el.classList.add('active')
    return this
  },
  toggleBackBtn: function () {
    var back = document.querySelector('.-item.-back')
    var fn = back.classList
    this.paths.length !== 1 ? fn.remove('-hide') : fn.add('-hide')
    return this
  },
  updateLocalStorage: function () {
    localStorage.setItem('paths', JSON.stringify(this.paths))
    return this
  },
  selected: function (_viewID) {
    var view = _viewID[0]
    var id = _viewID[1]
    return { id, el: Util.select('.-view.-' + view), view }
  },
  viewID: function (link) {
    var view = link.getAttribute('data-view')
    var id = link.getAttribute('data-id')
    return [view, id]
  },
  path: function (_viewID) {
    return _viewID[0] + ':' + _viewID[1]
  },
  updatemdp: function () {
    this.mdp.populate(this.currentView.data).lazyLoad('mdp')
  },
  updatemlp: function () {
    this.mlp.links.forEach(link => link.removeEventListener('click', () => this.goto(link)))
    this.mlp.populate(this.currentView.data).lazyLoad('mlp')
    this.mlp.links.forEach(link => link.addEventListener('click', () => this.goto(link)))
  },
  updatehome: function () {

  },
  data: function (selected) {
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
}

var Home = function (banners, util) {
  this.name = 'Home'
  // this.banner11 = document.querySelector('.-link[data-row="1"]')
  // this.banner21 = document.querySelector('.-link[data-row="2"][data-col="1"]')
  // this.banner22 = document.querySelector('.-link[data-row="2"][data-col="2"]')
  // this.banner31 = document.querySelector('.-link[data-row="3"]')
  // this.banner41 = document.querySelector('.-link[data-row="4"]')

  this.banners = banners
  
  this.util = util

  // continue from line 270
  this.populate().lazyLoad('home')
}

Home.prototype = {
  lazyLoad: Util.lazyLoad,
  populate: function () {
    Object.keys(this.banners).map(key => this.buildBanner(key))
    return this
  },
  buildBanner: function (key) {
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
  }
}

var MLP = function (util) {
  this.name = 'Manual Listing Page'
  this.mkus = document.querySelector('.-mkus')
  this.data = []
  this.links = []
  this.util = util

  this.thumbnail = id => 'https://img.youtube.com/vi/' + id + '/0.jpg'
  // this.lazyLoad()
}

MLP.prototype = {
  populate: function (data) {
    this.data = data
    this.links = []
    this.mkus.innerHTML = ''
    this.data.map(datum => {
      var prop = {
        mku: ['div', { class: '-mku -posrel -link', 'data-id': datum.id, 'data-view': 'mdp' }, '', ''],
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

      Tag.appendMany2One([preloader, img], imgP)
      Tag.appendMany2One([name, desc, author], details)
      Tag.appendMany2One([imgP, details], mku)
      this.links.push(mku)
      this.mkus.appendChild(mku)
    })
    return this
  },
  lazyLoad: Util.lazyLoad
}

var MDP = function () {
  this.name = 'Material Detail Page'
  this.data = {}
  this.ImageObserver = null
  // this.lazyLoad()

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

MDP.prototype = {
  populate: function (data) {
    this.data = data[0]
    this[this.data['type']]()
    this.togglePane(this.data['type'])
    return this
  },
  video: function () {
    this.material.setAttribute('src', this.youtubesrc(this.data['id']))
    return this
  },
  slideshow: function () {
    this.slideCount = parseInt(this.data.meta.split('-')[1])
    this.updateSlide(1)
    return this
  },
  listeners: function () {
    this.gotoSlide.addEventListener('keyup', () => this.updateSlide(parseInt(this.gotoSlide.value)))
    this.prevSlide.addEventListener('click', () => this.updateSlide(--this.slideNum))
    this.nextSlide.addEventListener('click', () => this.updateSlide(++this.slideNum))
  },
  updateSlide: function (num) {
    num = parseInt(num)
    this.setBoundary(num)
    this.updateUI()
  },
  setBoundary: function (num) {
    if (num > this.slideCount)
      this.slideNum = 1
    else if (num < 1)
      this.slideNum = this.slideCount
    else
      this.slideNum = num ? num : 1
  },
  updateUI: function () {
    var id = this.data.id + '/' + this.slideNum
    this.slideImg.setAttribute('data-src', this.slidesrc(id))
    this.slideImg.removeAttribute('src')
    this.slideImg.classList.remove('loaded')
    this.preloader.classList.add('-loading')
    this.slideStatus.textContent = this.slideNum + ' / ' + this.slideCount

    Util.observe(this.slideParent)
    // this.imageObserver = new ImageObserver(this.slideParent)
    // this.imageObserver = null
  },
  togglePane: function (type) {
    var panes = document.querySelectorAll('.-mdp .-pane')
    panes.forEach(pane => pane.classList.add('-hide'))
    var currentPane = document.querySelector('.-pane.-' + type)
    currentPane.classList.remove('-hide')
  },
  lazyLoad: Util.lazyLoad
}

var Main = function () {
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
    }
  }
  
  this.authenticate()
  this.afterLogin()
}

Main.prototype = {
  getData() {
    return fetch('../services/data.json')
    .then(response => response.json())
  },
  authenticate: function () {

  },
  afterLogin: function () {
    this.getData().then(json => {
      var util = new Util(json)
      var home = new Home(this.banners, util)
      var mlp = new MLP(util)
      var mdp = new MDP()
      new Navigate({ util, home, mlp, mdp })
    })
  }
}

// window.addEventListener('load', function () {
//   console.log('content completely loaded')
//   new Main()
// })
new Main()
// function runOnStart() {
//   new Main()
// }
// if(document.readyState !== 'loading') {
//   runOnStart()
// } else {
//   document.addEventListener('DOMContentLoaded', function () {
//       runOnStart()
//   });
// }