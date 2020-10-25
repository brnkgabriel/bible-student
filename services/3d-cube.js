export default class ThreeDCubeController {
  /**
   * creates an instance of the cube controller class
   * @constructor
   */
  constructor() {

    /**
     * @type {HTMLElement} selects the cube turn controller
     */
    this.turn = document.querySelector('.-turn')

    /**
     * @type {HTMLElement} container that houses the ui
     */
    this._container = document.querySelector('.-container')

    this.cubes = document.querySelectorAll('.three-d-cube')
    this.nameFaces = document.querySelectorAll('.-name .-face')
    
    /**
     * @type {number} point where the thumbnails sticky to the browser
     */
    this.thumb_point = 145

    /**
     * @type {number} current face of the cubes
     */
    this.face = 1
    /**
     * @type {number} the maximum face of the cubes
     */
    this.max_face = 6

    /**
     * @type {number} the interval to rotate cube
     */
    this.interval = null

    this.turn.addEventListener('click', () => {
      clearInterval(this.interval)
      this.update()
    })
    
    window.addEventListener('scroll', () => {

      if (window.scrollY > this.thumb_point) {
        // fn.add('-sticky')
        clearInterval(this.interval)
        this.turnCube()
      } else {
        // fn.remove('-sticky')
        clearInterval(this.interval)
      }
    })

    this.turnCube()
  }

  turnCube() {
    this.interval = setInterval(() =>  this.update() , 3000)
  }

  update() {
    this.face = (this.face === this.max_face) ? 1 : this.face + 1
    this.updateFaces(this.face)
    this.updateNames(this.face)
  }

  /**
   * @param {number} face current face of the cube
   */
  updateFaces(face) {
    this.turn.textContent = face.toString()
    this.cubes.forEach(cube => cube.setAttribute('data-face', face.toString()))
  }

  /**
   * @param {number} face current face of the cube
   */
  updateNames(face) {
    var selectedFaces = document.querySelectorAll('.-name .-face[data-face="' + face + '"]')
    this.nameFaces.forEach(nameFace => nameFace.classList.remove('active'))
    selectedFaces.forEach(selectedFace => selectedFace.classList.add('active'))
  }
}

