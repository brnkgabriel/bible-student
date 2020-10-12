import { appShell } from './app-shell.js'
import { mainContent } from './navigator.js'


/**
 * Main application element, simply registers the web components
 */
const app = async () => {
  appShell()
  mainContent()
}

document.addEventListener('DOMContentLoaded', app)

window.addEventListener('app-shell', () => {
  console.log('custom-event has been called')
  new Header()
})