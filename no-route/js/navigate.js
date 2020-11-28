// @ts-check
/**
 * @typedef {object} CustomRef
 * @property {Util} util The button to jump to the first slide
 * @property {Home} home The button to move to the previous slide
 * @property {MLP} mlp The button to advance to the next slide
 * @property {MDP} mdp The button to advance to the last slide
 */
class Navigate {
  /**
   * @constructor
   * @param {CustomRef} json 
   */
  constructor(json) {
    this.navItems = document.querySelectorAll('.-nav-items .-item')
    this.bannerLinks = document.querySelectorAll('.-link:not(.-mku)')
    
    this.views = document.querySelectorAll('.-main .-view')

    this.navItems.forEach(item => item.addEventListener('click', () => this.goto(item)))
    this.bannerLinks.forEach(link => link.addEventListener('click', () => this.goto(link)))

    this.paths = ['home:null']

    this.currentView = {}
    
    this.util = json['util']
    this.home = json['home']
    this.mlp = json['mlp']
    this.mdp = json['mdp']
  }

  goto(item) {
    var selected = this.selected(item)
    this.currentView = {...selected, data: this.data(selected)}
    console.log('currentview', this.currentView)
    this.updateViewData()
    .toggleView()
    .toggleBackBtn()
  }

  updateViewData() {
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
    console.log('mlp data', this.currentView.data)
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

  selected(target) {
    var _viewID = this.viewID(target).split(':')
    var view = _viewID[0]
    var id = _viewID[1]

    return {id, el: document.querySelector('.-view.-' + view), view}
  }

  /**
   * @param {HTMLElement} target the html element clicked
   * @returns {string} the class to be viewed
   */
  viewID(target) {
    var view = target.getAttribute('data-view')
    var id = target.getAttribute('data-id')
    var _viewID = view + ":" + id
    // if view class is the back button,
    // pop the stack and return the previous view
    // else push the view class to the stack and return the view
    if (view === 'back') {
      (this.paths.length !== 1) && this.paths.pop()
      return this.paths[this.paths.length - 1]
    } else {
      this.paths.push(_viewID)
      return _viewID
    }
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
  }
}