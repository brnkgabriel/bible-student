class Tag {
  constructor(properties) {
    this.tag          = properties[0]
    this.attributes   = properties[1]
    this.styles       = properties[2]
    this.textContent  = properties[3]
    this.element      = null
  }

  get() {
    return this.create()
      .setAttributes()
      .setStyle()
      .setHTML()
      .getElement()
  }

  create() {
    this.element = document.createElement(this.tag)
    return this
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

const Utils = {
  replacePattern: function(pattern, str) {
    var re = new RegExp(pattern, 'g')
    var replaced = str.replace(re, '-')
    return replaced
  },

  id: function (name) {
    var replacedApos = this.replacePattern("'", name)
    var replaceAmp = this.replacePattern('&', replacedApos)
    var replacePercnt = this.replacePattern('%', replaceAmp)
    return replacePercnt.toLowerCase().split(' ').join('-')
  }
}