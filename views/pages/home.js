// @ts-check

let getPostsList = async () => {
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }
  try {
    // const response = await fetch(`https://5bb634f6695f8d001496c082.mockapi.io/api/posts`, options)
    // const json = await response.json()
    // console.log(json)
    return {}
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

let Home = {
  render: async () => {
    let posts = await getPostsList()
    let view = /*html*/`
    <title>home</title>
    <div class="-row -main">
      
      <a href="#" data-filter="pcc" class="-banner -single">
        <img src="./img/designs/fl-pcc.jpg" alt="doublebanner"/>
      </a>
            
      <div class="-banner -double">
        <a href="/#/mlp/the-bible-project" data-filter="tbp" class="-inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-tbp.jpg" alt="doublebanner"/>
        </a><a href="/#/mlp/superbook" data-filter="superbook" class="-double -inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-superbook.jpg" alt="doublebanner"/>
        </a>
      </div>
    
      <a href="#" data-filter="awmi" class="-banner -single">
        <img src="./img/designs/fl-awmi.jpg" alt="doublebanner"/>
      </a>
      
      
    </div>
    `
    return view
  },
  after_render: async () => {

  }
}

export default Home