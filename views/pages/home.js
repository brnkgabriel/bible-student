// @ts-check

let Home = {
  render: async () => {
    let view = /*html*/`
    <title>home</title>
    <div class="-row -main">
    
      <a href="/#/mlp/max-7---rodtheney" class="-banner -single">
        <img src="./img/designs/fl-max7-3d.jpg" alt="doublebanner"/>
      </a>
            
      <div class="-banner -double">
        <a href="/#/mlp/the-bible-project" class="-inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-tbp.jpg" alt="doublebanner"/>
        </a><a href="/#/mlp/superbook" data-filter="superbook" class="-double -inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-superbook.jpg" alt="doublebanner"/>
        </a>
      </div>
    
      <a href="/#/mlp/the-animated-series" class="-banner -single">
        <img src="./img/designs/fl-bas.jpg" alt="doublebanner"/>
      </a>
      
      <a href="/#/mdp/slide1-7" class="-banner -single">
        <img src="./img/designs/fl-pcc.jpg" alt="doublebanner"/>
      </a>
      
    </div>
    `
    return view
  },
  after_render: async () => { }
}

export default Home