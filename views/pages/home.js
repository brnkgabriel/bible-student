// @ts-check

let Home = {
  render: async () => {
    let view = /*html*/`
    <title>home</title>
    <div class="-row -main">
    
    <a href="/#/mdp/pace-christian-cartoons~339" class="-banner -single">
      <img src="./img/designs/fl-pcc.jpg" alt="pace christian cartoon"/>
    </a>
    
    <div class="-banner -double">
      <a href="/#/mdp/ramsay-christian-cartoons~48" class="-inlineblock -vamiddle -posrel">
        <img src="./img/designs/mfl-ramsay-christian-cartoons.jpg" alt="the bible project"/>
      </a><a href="/#/mlp/the-bible-project" class="-inlineblock -vamiddle -posrel">
        <img src="./img/designs/mfl-tbp.jpg" alt="the bible project"/>
      </a>
    </div>
      <a href="/#/mlp/max-7---rodtheney" class="-banner -single">
        <img src="./img/designs/fl-max7-3d.jpg" alt="max 7 rodTheNey"/>
      </a>
            
      <div class="-banner -double">
      <a href="/#/mlp/wisdom-for-dominion" class="-double -inlineblock -vamiddle -posrel">
        <img src="./img/designs/mfl-wfd.jpg" alt="wisdom for dominion"/>
      </a><a href="/#/mlp/superbook" class="-double -inlineblock -vamiddle -posrel">
          <img src="./img/designs/mfl-superbook.jpg" alt="superbook"/>
        </a>
      </div>
    
      <a href="/#/mlp/the-animated-series" class="-banner -single">
        <img src="./img/designs/fl-bas.jpg" alt="the animated series"/>
      </a>
      
      <a href="/#/mlp/ad-bible-school" class="-banner -single">
        <img src="./img/designs/fl-ad-bible-school.jpg" alt="ad bible school"/>
      </a>
      
    </div>
    `
    return view
  },
  after_render: async () => { }
}

export default Home