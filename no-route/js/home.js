// @ts-check
class Home extends ViewController {
  constructor(banners, util) {
    super()
    this.banner11 = document.querySelector('.-link[data-row="1"]')
    this.banner21 = document.querySelector('.-link[data-row="2"][data-col="1"]')
    this.banner22 = document.querySelector('.-link[data-row="2"][data-col="2"]')
    this.banner31 = document.querySelector('.-link[data-row="3"]')

    this.banners = banners

    this.util = util

    // console.log('singleBanner11', this.banner11)
    // console.log('doubleBanner21', this.banner21)
    // console.log('doubleBanner21', this.banner22)
    // console.log('singleBanner11', this.banner31)
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

