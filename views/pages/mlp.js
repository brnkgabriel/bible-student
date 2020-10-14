// @ts-check
import Utils from '../../services/Utils.js'

let getData = async (id) => {
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
    
    let data = await Utils.data()
    let json = data.filter(datum => datum.filter === id)
    return json
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

let MLP = {
  render: async () => {
    let request = Utils.parseRequestURL()
    let data = await getData(request.id)
    // console.log('data from mlp.js is', data)

    return /*html*/`<div class="-row -main">
      <div class="-mkufloor">
        <div class="-title">${data[0].author}</div>
        <div class="-mkus">
        ${data.map(datum => {
          return `<a href="#/mdp/${datum.id}" class="-mku -posrel">
            <div class="-posabs -img" style="background-image: url('${Utils.YTThumbnail(datum.id)}');"></div><div class="-details -posabs">
              <div class="-name">${datum.name}</div>
              <div class="-desc">${datum.desc}</div>
              <div class="-author">${datum.author}</div>
            </div>
          </a>`
        }).join('')}
        </div>
      </div>
    </div>`
  },
  after_render: async () => {}
}

export default MLP