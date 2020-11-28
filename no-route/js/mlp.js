// @ts-check
class MLP extends ViewController {
  constructor(util) {
    super()
    this.name = 'Manual Listing Page'
    this.mkus = document.querySelector('.-mkus')
    this.data = []

    this.links = []

    /**
     * @type {Util}
     */
    this.util = util

    this.thumbnail = id => 'https://img.youtube.com/vi/' + id + '/0.jpg'
  }

  populate(data) {
    this.data = data
    this.links = []
    // <span class="-preloader -loading"></span>
    this.mkus.innerHTML = ''
    this.data.map(datum => {
      var prop = {
        mku:      ['div', { class: '-mku -posrel -link', 'data-id': datum.id, 'data-view': 'mdp' }, '', ''],
        imgP:      ['div', { class: '-posabs -img' }, '', ''],
        img:       ['img', { class: 'lazy-image -posabs', 'data-src': this.thumbnail(datum.id)}, '', ''],
        preloader: ['span', { class: '-preloader -loading' }, '', ''],
        details:  ['div', { class: '-details -posabs' }, '', ''],
        name:     ['div', { class: '-name' }, '', datum.name],
        desc:     ['div', { class: '-desc' }, '', datum.desc],
        author:   ['div', { class: '-author' }, '', datum.author]
      }

      var mku     = Tag.create(prop['mku'])
      var imgP     = Tag.create(prop['imgP'])
      var img     = Tag.create(prop['img'])
      var preloader = Tag.create(prop['preloader'])
      var details = Tag.create(prop['details'])
      var name    = Tag.create(prop['name'])
      var desc    = Tag.create(prop['desc'])
      var author  = Tag.create(prop['author'])


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