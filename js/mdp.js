var MaterialDetailPage = function () {
  this.listeners = function () {
    console.log('listening in mdp')
    window.addEventListener('popstate', function (event) {
      console.log('document.location', document.location)
      console.log('event.state', event.state)
    })
  }
}

new MaterialDetailPage().listeners()