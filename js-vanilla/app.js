// @ts-check

import Home       from '../views/pages/home.js'
import MLP        from '../views/pages/mlp.js'
import MDP        from '../views/pages/mdp.js'
// import About      from './views/pages/About.js'
import Error404   from '../views/pages/Error404.js'
// import PostShow   from './views/pages/PostShow.js'
// import Register   from './views/pages/Register.js'

// import Navbar     from './views/components/Navbar.js'
// import Bottombar  from './views/components/Bottombar.js'

import Utils      from '../services/Utils.js'
import AppShell from '../views/components/app-shell.js'

// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
  '/'         : Home,
  '/mlp/:id'  : MLP,
  '/mdp/:id'  : MDP,
  // '/about'    : About,
  // '/p/:id'    : PostShow,
  // '/register' : Register
}

// The router code. Takes a URL, checks against the list of supported routes and then renders corresponding content page
const router = async () => {

  // Lazy load view element
  // const header = null || document.getElementById('header_container')
  const content = null || document.getElementById('page_container')
  // const footer = null || document.getElementById('footer_container')
  const appShell = null || document.getElementById('app-shell')

  // Render the Header & footer of the page
  appShell.innerHTML = await AppShell.render()
  await AppShell.after_render()
  // header.innerHTML = await Navbar.render()
  // await Navbar.after_render()
  // footer.innerHTML = await Bottombar.render()
  // await Bottombar.after_render()

  // Get the parsed URI from the addressbar
  let request = Utils.parseRequestURL()

  let data = await Utils.data()
  let filters = Utils.mlp_filter(data)

  // Parse the URL and if it has an id part, change it with the string ":id"
  let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

  // Get the page from our hash of supported routes.
  // if the parsed URL is not in our list of supported routes, select the 404 page instead
  let page = routes[parsedURL] ? routes[parsedURL] : Error404
  content.innerHTML = await page.render()
  await page.after_render()
}

// Listen on hash change
window.addEventListener('hashchange', router)

// Listen on page load:
window.addEventListener('load', router)