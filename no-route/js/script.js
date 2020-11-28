// @ts-check
var banners = {
  banner11: {
    name: 'Pace Christian Cartoons',
    src: '../img/designs/fl-pcc.jpg',
    view: 'mdp'
  },
  banner21: {
    name: 'Ramsay Christian Cartoons',
    src: '../img/designs/mfl-ramsay-christian-cartoons.jpg',
    view: 'mdp'
  },
  banner22: {
    name: 'The Bible Project',
    src: '../img/designs/mfl-tbp.jpg',
    view: 'mlp'
  },
  banner31: {
    name: 'Max 7 - RodTheNey',
    src: '../img/designs/fl-max7-3d.jpg',
    view: 'mlp'
  }
}

async function getData(){
  var response = await fetch('../services/data.json')
  return await response.json()
}

window.addEventListener('load', function(){
  console.log('completely loaded')
  authenticate()
  afterLogin()
});

function afterLogin() {
  getData().then(json => {
    var util = new Util(json)
    var home = new Home(banners, util)
    var mlp = new MLP(util)
    var mdp = new MDP()
    new Navigate({util, home, mlp, mdp})
  })
}

function authenticate() {

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     afterLogin()
  //   } else {
  //     // No user is signed in.
  //   }
  // });
}
// new Navigate()
// new Home(banners)