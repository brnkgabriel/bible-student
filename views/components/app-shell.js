// @ts-check

let AppShell = {
  render: async () => {
    let view = /*html*/`
    <div class="-row -header -posfix">
      <div class="-posabs -site">
        <img src="./img/logo.png" alt="logo" />
        <div class="-txt">Bible<br />Student</div>
      </div>
      <div class="-posabs -page">home</div>
    </div>
    
    <div class="-footer -posfix">
      <div class="-nav -posrel">
        <div class="-hamburger -posabs"></div>
        <div class="-search-input-loader -posabs">
          <div class="-search-input">
            <input id="search" placeholder="How can we help you?" type="text" />
          </div>
          <div id="preloader" class="-posabs">
            <img class="icon" src="./img/bolt.png" alt="_img" />
          </div>
        </div>
        <div class="-search -posabs"></div>
      </div>
      <div class="-nav-list">
        <a href="/#/" data-filter="home" class="-nav-item">Home</div>
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
    var nav = document.querySelector('.-nav')
    var footer = document.querySelector('.-footer')
    var hamburger = document.querySelector('.-hamburger')
    var search = document.querySelector('.-search')


    hamburger.addEventListener('click', () => {
      var navAction = footer.getAttribute('data-action')
      if (navAction === 'show') {
        footer.setAttribute('data-action', '')
      } else {
        footer.setAttribute('data-action', 'show')
      }
    })
    search.addEventListener('click', () => {
      var navAction = footer.getAttribute('data-action')
      if (navAction === 'search') {
        footer.setAttribute('data-action', '')
      } else {
        footer.setAttribute('data-action', 'search')
      }
    })
  }
}

export default AppShell