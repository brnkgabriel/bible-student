class Header {
  constructor() {
    this.nav = document.querySelector('.-nav')
    this.footer = document.querySelector('.-footer')
    this.hamburger = document.querySelector('.-hamburger')
    this.search = document.querySelector('.-search')

    this.listeners()
  }

  listeners() {
    this.hamburger.addEventListener('click', () => {
      var navAction = this.footer.getAttribute('data-action')
      var el = this.footer;
      // (navAction === 'show') ? fn('data-action', '') : fn('data-action', 'show')
      if (navAction === 'show') el.setAttribute('data-action', '')
      else el.setAttribute('data-action', 'show')
    })
    this.search.addEventListener('click', () => {
      var navAction = this.footer.getAttribute('data-action')
      if (navAction === 'search') {
        this.footer.setAttribute('data-action', '')
      } else {
        this.footer.setAttribute('data-action', 'search')
      }
    })
  }

}

// new Header()

// document.addEventListener('DOMContentLoaded', () => {
//   new Header()
// })