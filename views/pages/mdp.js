
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

    return datum ? MDP[datum.type](datum) : ''
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
    var pieces = datum.id.split('~')
    var path = './img/designs/' + pieces[0] + '/'
    var count = parseInt(pieces[1])
    var images = new Array(count).fill(count)
    .map((i,v) => path + (v + 1) + '.jpg')
    
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
        <input id="goto" placeholder="slide no." type="number" />
      </div>
    </div>
    `
  },
  slide_idx: 0,
  after_render: () => {
    MDP.slide_idx = 0
    var slides = document.querySelectorAll('.-slides img')
    var prev = document.querySelector('.-controls .-control.-prev')
    var next = document.querySelector('.-controls .-control.-next')
    var status = document.querySelector('.-controls .-status')
    /**
     * @type {HTMLElement}
     */
    var goto_input = document.getElementById('goto')

    if (next && prev) {
      next.addEventListener('click', () => MDP.update_ui({ slides, status, btn: 'next' }))
      prev.addEventListener('click', () => MDP.update_ui({ slides, status, btn: 'prev' }))
    }

    goto_input.addEventListener('keyup', () => {
      var value = parseInt(goto_input.value)
      if (!isNaN(value) && value < slides.length){
        MDP.update_ui({ slides, status, btn: 'goto', goto: goto_input })
      }
    })
  },
  update_ui: (json) => {
    if (json.btn === 'next')
      (MDP.slide_idx === json.slides.length - 1) ? MDP.slide_idx = 0 : MDP.slide_idx++
    else if (json.btn === 'prev')
      (MDP.slide_idx === 0) ? MDP.slide_idx = json.slides.length - 1 : MDP.slide_idx--
    else MDP.slide_idx = parseInt(json.goto.value) - 1

    MDP.update_slide(json)
  },
  update_slide: (json) => {
    json.slides.forEach(slide => slide.classList.remove('active'))
    json.slides[MDP.slide_idx].classList.add('active')
    json.status.textContent = `${MDP.slide_idx + 1} / ${json.slides.length}`
  }
}

export default MDP