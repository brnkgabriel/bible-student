// @ts-check

let Home = {
  render: async () => {
    let view = /*html*/`
    <title>home</title>
    <div class="-row -main">
      
      <a href="/#/mlp/max-7---rodtheney" data-filter="pcc" class="-banner -single">
        <img src="./img/designs/fl-max7-3d.jpg" alt="doublebanner"/>
      </a>
            
      <div class="-banner -double">
        <a href="/#/mlp/the-bible-project" data-filter="tbp" class="-inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-tbp.jpg" alt="doublebanner"/>
        </a><a href="/#/mlp/superbook" data-filter="superbook" class="-double -inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-superbook.jpg" alt="doublebanner"/>
        </a>
      </div>
    
      <a href="/#/mlp/the-animated-series" data-filter="awmi" class="-banner -single">
        <img src="./img/designs/fl-bas.jpg" alt="doublebanner"/>
      </a>
      
      
    </div>
    `
    return view
  },
  after_render: async () => { }
}

export default Home