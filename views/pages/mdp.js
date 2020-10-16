// @ts-check
import Utils from '../../services/Utils.js'

let getDatum = async (id) => {
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }
  try {
    // const response = await fetch('https://5bb634f6695f8d001496c082.mockapi.io/api/posts/' + id, options)
    // const json = await response.json()
    // console.log(json)
    
    return await Utils.datum(id)
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

let MDP = {
  render: async () => {
    let request = Utils.parseRequestURL()
    let datum = await getDatum(request.id)
    console.log('datum', datum)

    return MDP[datum.type](datum)
  },
  video: (datum) => {
    return /*html*/`
    <div class="-row -main">
      <div class="-title">${datum.name}</div>
      <div class="-pane -posrel">
        <iframe class="-posabs -material" src="https://www.youtube.com/embed/${datum.id}"></iframe>
        <div class="-posabs -exercise">exercise</div>
      </div>
    </div>
    `
  },
  slideshow: (datum) => {
    var path = './img/designs/pace-christian-cartoons/'
    var count = parseInt(datum.id.split('-')[1])
    var images = new Array(count).fill(count)
    .map((i,v) => path + (v + 1) + '.jpg')
    console.log('images', images, 'count', count)
    return /*html*/`
    <div class="-row -main">
      <div class="-title">${datum.name}</div>
      <div class="-slides -posrel">
        ${
          images.map((image, idx) => {
            var elClass = idx === 0 ? '-posabs active' : '-posabs'
            return '<img src="' + image + '" class="' + elClass + '" alt="_img"/>'
          }).join('')
        }
      </div>
      <div class="-controls">
        <div class="-control -prev -inlineblock -vamiddle -posrel"></div>
        <div class="-status -inlineblock -vamiddle">1 / ${count}</div>
        <div class="-control -next -inlineblock -vamiddle -posrel"></div>
      </div>
    </div>
    `
  },
  after_render: async () => {
    var idx = 0
    var slides = document.querySelectorAll('.-slides img')
    var prev = document.querySelector('.-controls .-control.-prev')
    var next = document.querySelector('.-controls .-control.-next')
    var status = document.querySelector('.-controls .-status')

    next.addEventListener('click', () => {
      idx++;
      (idx === slides.length) && (idx = 0)
      MDP.update_ui({ slides, idx, status })
    })

    prev.addEventListener('click', () => {
      idx--;
      (idx === -1) && (idx = slides.length - 1)
      MDP.update_ui({ slides, idx, status })
    })
  },
  update_ui: (json) => {
    var slides = json.slides
    var idx = json.idx
    var status = json.status
    slides.forEach(slide => slide.classList.remove('active'))
    slides[idx].classList.add('active')
    status.textContent = `${idx + 1} / ${slides.length}`
  }
}

export default MDP