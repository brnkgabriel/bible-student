// @ts-check
class MDP extends ViewController {
  constructor() {
    super()
    this.name = 'Material Detail Page'
    this.material = document.querySelector('.-pane iframe.-material')
    this.data = []

    this.youtubesrc = id => 'https://www.youtube.com/embed/' + id
  }

  build(data) {
    // this.mdp.populate(this.currentView.data)
  }

  populate(data) {
    this.data = data[0]
    this[this.data['type']]()
    return this
  }

  video() {
    this.material.setAttribute('src', this.youtubesrc(this.data['id']))
  }

  slideshow(datum) {

  }
}