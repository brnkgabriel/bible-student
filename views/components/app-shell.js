// @ts-check
import Utils from '../../services/Utils.js'

let AppShell = {
  render: async () => {
    let view = /*html*/`
    <div class="-row -header -posfix">
      <a href="/#/" class="-posabs -site">
        <img src="./img/logo.png" alt="logo" />
        <div class="-txt">Bible<br />Student</div>
      </a>
      <div class="-posabs -page">home</div>
    </div>
    
    <div class="-footer -posfix">
      <div class="-nav -posrel">
        <div class="-hamburger -posabs"></div>
      </div>
      <div class="-nav-list">
        <a href="/#/" class="-nav-item">Home</a>
        <div class="-nav-item">sc-name: site-static-oct-18-8-48</div>
        <div class="-nav-item">dc-name: site-dynamic-oct-18-8-48</div>
        <!-- <a data-filter="mlp" class="-nav-item">Manual Listing Page</a>
        <a data-filter="mdp" class="-nav-item">Material Detail Page</a>
        <div data-page="" class="-nav-item">Auth</div>
        <div data-page="pdp" class="-nav-item">Personnel Detail Page</div> -->
      </div>
    </div>
    `
    return view
  },
  after_render: async () => {
    var types = {
      mdp: 'material detail page',
      mlp: 'manual listing page'
    }
    let request = Utils.parseRequestURL()
    var page = document.querySelector('.-header .-page')
    page.textContent = types[request.resource] || 'home'
    
    var footer = document.querySelector('.-footer')
    var hamburger = document.querySelector('.-hamburger')


    hamburger.addEventListener('click', () => {
      var navAction = footer.getAttribute('data-action')
      if (navAction === 'show') {
        footer.setAttribute('data-action', '')
      } else {
        footer.setAttribute('data-action', 'show')
      }
    })
  }
}

export default AppShell