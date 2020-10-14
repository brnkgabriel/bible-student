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
    console.log('datum from mdp.js is', datum)

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
  after_render: async () => {}
}

export default MDP