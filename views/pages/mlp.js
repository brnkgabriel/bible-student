// @ts-check
import Utils from '../../services/Utils.js'
import ThreeDCubeController from '../../services/3d-cube.js'

let getData = async (id) => {
  try {
    let data = await Utils.data()
    let json = data.filter(datum => datum.filter == id)
    return json
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

let MLP = {
  data: [],
  shouldHaveThumbnails: ['the-bible-project'],
  requestID: null,
  threeDCube: null,
  render: async () => {
    let request = Utils.parseRequestURL()
    // let data = await getData(request.id)
    MLP.data = await getData(request.id)
    MLP.requestID = request.id

    return /*html*/`<div class="-row -main">
      <div class="-thumbnails -possti -hide">
        <section class="three-d-container">
          <div class="three-d-cube" data-face="1">
            <div data-filter="the-torah-series" class="three-d-item" data-id="2">
              <img src="./img/designs/the-bible-project/the-torah-series.jpg" alt=""/>
            </div>
            <div data-filter="the-wisdom-series" class="three-d-item" data-id="4">
              <img src="./img/designs/the-bible-project/the-wisdom-series.jpg" alt=""/>
            </div>
            <div data-filter="luke-acts-series" class="three-d-item" data-id="6">
              <img src="./img/designs/the-bible-project/luke-acts-series.jpg" alt=""/>
            </div>
            <div data-filter="new-testament" class="three-d-item" data-id="5">
              <img src="./img/designs/the-bible-project/new-testament.jpg" alt=""/>
            </div>
            <div data-filter="old-testament" class="three-d-item" data-id="3">
              <img src="./img/designs/the-bible-project/old-testament.jpg" alt=""/>
            </div>
            <div data-filter="how-to-read-the-bible" class="three-d-item" data-id="1">
              <img src="./img/designs/the-bible-project/how-to-read-the-bible.jpg" alt=""/>
            </div>
          </div>
        </section><section class="three-d-container">
          <div class="three-d-cube" data-face="1">
            <div data-filter="biblical-themes" class="three-d-item" data-id="2">
              <img src="./img/designs/the-bible-project/biblical-themes.jpg" alt=""/>
            </div>
            <div data-filter="advent-word-studies" class="three-d-item" data-id="4">
              <img src="./img/designs/the-bible-project/advent-word-studies.jpg" alt=""/>
            </div>
            <div data-filter="shema-word-studies" class="three-d-item" data-id="6">
              <img src="./img/designs/the-bible-project/shema-word-studies.jpg" alt=""/>
            </div>
            <div data-filter="bad-word-studies" class="three-d-item" data-id="5">
              <img src="./img/designs/the-bible-project/bad-word-studies.jpg" alt=""/>
            </div>
            <div data-filter="word-studies" class="three-d-item" data-id="3">
              <img src="./img/designs/the-bible-project/word-studies.jpg" alt=""/>
            </div>
            <div data-filter="spiritual-beings" class="three-d-item" data-id="1">
              <img src="./img/designs/the-bible-project/spiritual-beings.jpg" alt=""/>
            </div>
          </div>
        </section><section class="three-d-container">
          <div class="three-d-cube" data-face="1">
            <div data-filter="process-series" class="three-d-item" data-id="2">
              <img src="./img/designs/the-bible-project/process-series.jpg" alt=""/>
            </div>
            <div data-filter="studio-news" class="three-d-item" data-id="4">
              <img src="./img/designs/the-bible-project/studio-news.jpg" alt=""/>
            </div>
            <div data-filter="" class="three-d-item" data-id="6">
              <img src="./img/designs/the-bible-project/blank.jpg" alt=""/>
            </div>
            <div data-filter="" class="three-d-item" data-id="5">
              <img src="./img/designs/the-bible-project/blank.jpg" alt=""/>
            </div>
            <div data-filter="podcast" class="three-d-item" data-id="3">
              <img src="./img/designs/the-bible-project/podcast.jpg" alt=""/>
            </div>
            <div data-filter="character-of-god" class="three-d-item" data-id="1">
              <img src="./img/designs/the-bible-project/character-of-god.jpg" alt=""/>
            </div>
          </div>
        </section><div class="-turn">1</div>
        <div class="-names">
          <div class="-name -posrel">
            <div class="-face -posabs active" data-face="1">how to read the bible</div>
            <div class="-face -posabs" data-face="2">the torah series</div>
            <div class="-face -posabs" data-face="3">old testament</div>
            <div class="-face -posabs" data-face="4">the wisdom series</div>
            <div class="-face -posabs" data-face="5">new testament</div>
            <div class="-face -posabs" data-face="6">Luke-Acts series</div>
          </div><div class="-name -posrel">
            <div class="-face -posabs active" data-face="1">spiritual beings</div>
            <div class="-face -posabs" data-face="2">biblical themes</div>
            <div class="-face -posabs" data-face="3">word studies</div>
            <div class="-face -posabs" data-face="4">advent word studies</div>
            <div class="-face -posabs" data-face="5">bad word studies</div>
            <div class="-face -posabs" data-face="6">shema word studies</div>
          </div><div class="-name -posrel">
            <div class="-face -posabs active" data-face="1">character of God</div>
            <div class="-face -posabs" data-face="2">process series</div>
            <div class="-face -posabs" data-face="3">podcasts</div>
            <div class="-face -posabs" data-face="4">studio news</div>
            <div class="-face -posabs" data-face="5"></div>
            <div class="-face -posabs" data-face="6"></div>
          </div><div class="-name -posrel">
            <div class="-face -posabs active" data-face="1"></div>
            <div class="-face -posabs" data-face="2"></div>
            <div class="-face -posabs" data-face="3"></div>
            <div class="-face -posabs" data-face="4"></div>
            <div class="-face -posabs" data-face="5"></div>
            <div class="-face -posabs" data-face="6"></div>
          </div>
        </div>
      </div>
      <div class="-mkufloor">
        <div class="-title">${MLP.data[0].author}</div>
        <div class="-mkus">
        ${MLP.listing(MLP.data)}
        </div>
      </div>
    </div>`
  },
  listing: (data) => {
    return `${data.map(datum => {
      return `<a href="#/mdp/${datum.id}" class="-mku -posrel">
        <div class="-posabs -img" style="background-image: url('${Utils.YTThumbnail(datum.id)}');"></div><div class="-details -posabs">
          <div class="-name">${datum.name}</div>
          <div class="-desc">${datum.desc}</div>
          <div class="-author">${datum.author}</div>
        </div>
      </a>`
    }).join('')}`
  },
  after_render: async () => {
    var thumbnails = document.querySelector('.-thumbnails')
    var idx = MLP.shouldHaveThumbnails.findIndex(thumb => thumb === MLP.requestID)

    window.addEventListener('hashchange', evt => {
      MLP.threeDCube && MLP.threeDCube.stop()
      MLP.threeDCube = null
      console.log('listened for hash change in MLP')
    })

    if (idx !== -1) {
      thumbnails.classList.remove('-hide')
      MLP.threeDCube = new ThreeDCubeController()
      var faces = document.querySelectorAll('.three-d-cube .three-d-item')
      var mkus = document.querySelector('.-mkus')
      faces.forEach(face => {
        face.addEventListener('click', () => {
          var filter = face.getAttribute('data-filter')
          var found = MLP.data.filter(datum => {
            return Utils.id(datum.desc) === filter
          })
          mkus.innerHTML = ''
          mkus.innerHTML = MLP.listing(found)
        })
      })
    } else {
      thumbnails.classList.add('-hide')
    }

  }
}

export default MLP
