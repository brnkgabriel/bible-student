var Util=function(t){this.data=this.expand(t),console.log("this.data",this.data)};Util.prototype={create:function(t){return{...t,filter:this.id(t.author)}},expand:function(t){return t.map(t=>this.json(t.split("|"))).map(t=>this.create(t))},json:function(t){var e={};return t.map(t=>{var i=t.split("=");e[i[0]]=i[1]}),e},id:function(t){var e=this.replacePattern("'",t),i=this.replacePattern("&",e);return this.replacePattern("%",i).toLowerCase().split(" ").join("-")},replacePattern:function(t,e){var i=new RegExp(t,"g");return e.replace(i,"-")}},Util.lazyLoad=function(t){var e=document.querySelector(".-view.-"+t);Util.observe(e)},Util.observe=function(t){new ImageObserver(t)},Util.select=function(t){return document.querySelector(t)};var Tag=function(t){this.tag=t[0],this.attributes=t[1],this.styles=t[2],this.textContent=t[3],this.element=null};Tag.prototype={get:function(){return this.init().setAttributes().setStyle().setHTML().getElement()},init:function(){return this.element=document.createElement(this.tag),this},assignAttribute:function(t){Object.keys(t).map(e=>{var i=t[e];this.element.setAttribute(e,i)})},setAttributes:function(){return this.assignAttribute(this.attributes),this},setStyle:function(){return this.assignAttribute(this.styles),this},setHTML:function(){return this.element.innerHTML=this.textContent,this},getElement:function(){return this.element}},Tag.create=function(t){return new Tag(t).get()},Tag.appendMany2One=function(t,e){t.forEach(t=>e.appendChild(t))};var ImageObserver=function(t){this.images=t.querySelectorAll(".lazy-image"),this.images.forEach(t=>this.lazyLoadImage(t))};ImageObserver.prototype={onIntersection:function(t){var e=this;t.forEach(t=>{t.isIntersecting&&(e.observer.unobserve(t.target),t.target.src=t.target.dataset.src,t.target.onload=function(){t.target.classList.add("loaded"),e.removeLoader(t.target)})})},lazyLoadImage:function(t){var e=this;t.src?(t.classList.add("loaded"),e.removeLoader(t)):(t.src=t.getAttribute("data-src"),t.onload=function(){t.classList.add("loaded"),e.removeLoader(t)})},removeLoader:function(t){t.parentElement.querySelector(".-preloader").classList.remove("-loading")}};var Navigate=function(t){this.navLinks=document.querySelectorAll(".-nav-items .-item"),this.bannerLinks=document.querySelectorAll(".-link:not(.-mku)"),this.views=document.querySelectorAll(".-main .-view"),this.page=document.querySelector(".-header .-page"),this.navLinks.forEach(t=>t.addEventListener("click",()=>this.goto(t))),this.bannerLinks.forEach(t=>t.addEventListener("click",()=>this.goto(t))),this.paths=this.lastPath()||["home:null"],this.currentView={},this.util=t.util,this.home=t.home,this.mlp=t.mlp,this.mdp=t.mdp,this.names={home:"home",mlp:"manual listing page",mdp:"material detail page"},this.update(this.paths[this.paths.length-1].split(":"))};Navigate.prototype={goto:function(t){var e=this.viewID(t);this.update(e)},lastPath:function(){var t=JSON.parse(localStorage.getItem("paths"));return t||null},update:function(t){var e=this.updatePaths(t),i=this.selected(e.split(":"));this.currentView={...i,data:this.data(i)},this.updateViewData().toggleView().toggleBackBtn().updateLocalStorage()},updatePaths:function(t){var e=this.path(t);return"back"===t[0]?(this.mdp.material.setAttribute("src",""),1!==this.paths.length&&this.paths.pop(),this.paths[this.paths.length-1]):(-1==this.paths.findIndex(t=>t===e)&&this.paths.push(e),e)},updateViewData:function(){var t=this.currentView.view;return this.page.textContent=this[t].name,this["update"+t](),this},toggleView:function(){return this.views.forEach(t=>t.classList.remove("active")),this.currentView.el.classList.add("active"),this},toggleBackBtn:function(){var t=document.querySelector(".-item.-back").classList;return 1!==this.paths.length?t.remove("-hide"):t.add("-hide"),this},updateLocalStorage:function(){return localStorage.setItem("paths",JSON.stringify(this.paths)),this},selected:function(t){var e=t[0];return{id:t[1],el:Util.select(".-view.-"+e),view:e}},viewID:function(t){return[t.getAttribute("data-view"),t.getAttribute("data-id")]},path:function(t){return t[0]+":"+t[1]},updatemdp:function(){this.mdp.populate(this.currentView.data).lazyLoad("mdp")},updatemlp:function(){this.mlp.links.forEach(t=>t.removeEventListener("click",()=>this.goto(t))),this.mlp.populate(this.currentView.data).lazyLoad("mlp"),this.mlp.links.forEach(t=>t.addEventListener("click",()=>this.goto(t)))},updatehome:function(){},data:function(t){return"mdp"===t.view?this.util.data.filter(e=>e.id===t.id):this.util.data.filter(e=>this.util.id(e.author)===t.id)}};var Home=function(t,e){this.name="Home",this.banners=t,this.util=e,this.populate().lazyLoad("home")};Home.prototype={lazyLoad:Util.lazyLoad,populate:function(){return Object.keys(this.banners).map(t=>this.buildBanner(t)),this},buildBanner:function(t){var e=this.banners[t].view,i=this.banners[t].name,a=this.util.id(i),s=this.banners[t].src,n=document.querySelector('.-link[data-banner="'+t+'"]');n.setAttribute("data-view",e),n.setAttribute("data-id",a);var r=document.createElement("img");r.classList.add("lazy-image"),r.setAttribute("data-src",s),n.appendChild(r)}};var MLP=function(t){this.name="Manual Listing Page",this.mkus=document.querySelector(".-mkus"),this.data=[],this.links=[],this.util=t,this.thumbnail=(t=>"https://img.youtube.com/vi/"+t+"/0.jpg")};MLP.prototype={populate:function(t){return this.data=t,this.links=[],this.mkus.innerHTML="",this.data.map(t=>{var e={mku:["div",{class:"-mku -posrel -link","data-id":t.id,"data-view":"mdp"},"",""],imgP:["div",{class:"-posabs -img"},"",""],img:["img",{class:"lazy-image -posabs","data-src":this.thumbnail(t.id)},"",""],preloader:["span",{class:"-preloader -loading"},"",""],details:["div",{class:"-details -posabs"},"",""],name:["div",{class:"-name"},"",t.name],desc:["div",{class:"-desc"},"",t.desc],author:["div",{class:"-author"},"",t.author]},i=Tag.create(e.mku),a=Tag.create(e.imgP),s=Tag.create(e.img),n=Tag.create(e.preloader),r=Tag.create(e.details),o=Tag.create(e.name),l=Tag.create(e.desc),d=Tag.create(e.author);Tag.appendMany2One([n,s],a),Tag.appendMany2One([o,l,d],r),Tag.appendMany2One([a,r],i),this.links.push(i),this.mkus.appendChild(i)}),this},lazyLoad:Util.lazyLoad};var MDP=function(){this.name="Material Detail Page",this.data={},this.ImageObserver=null,this.slideCount=0,this.slideNum=1,this.material=document.querySelector(".-pane iframe.-material"),this.slideStatus=document.querySelector(".-slideshow .-status"),this.slideParent=document.querySelector(".-slides"),this.slideImg=document.querySelector(".-slides .lazy-image"),this.preloader=document.querySelector(".-slides .-preloader"),this.gotoSlide=document.getElementById("goto"),this.prevSlide=document.querySelector(".-control.-prev"),this.nextSlide=document.querySelector(".-control.-next"),this.youtubesrc=(t=>"https://www.youtube.com/embed/"+t),this.slidesrc=(t=>"./img/designs/"+t+".jpg"),this.listeners()};MDP.prototype={populate:function(t){return this.data=t[0],this[this.data.type](),this.togglePane(this.data.type),this},video:function(){return this.material.setAttribute("src",this.youtubesrc(this.data.id)),this},slideshow:function(){return this.slideCount=parseInt(this.data.meta.split("-")[1]),this.updateSlide(1),this},listeners:function(){this.gotoSlide.addEventListener("keyup",()=>this.updateSlide(parseInt(this.gotoSlide.value))),this.prevSlide.addEventListener("click",()=>this.updateSlide(--this.slideNum)),this.nextSlide.addEventListener("click",()=>this.updateSlide(++this.slideNum))},updateSlide:function(t){t=parseInt(t),this.setBoundary(t),this.updateUI()},setBoundary:function(t){t>this.slideCount?this.slideNum=1:this.slideNum=t<1?this.slideCount:t||1},updateUI:function(){var t=this.data.id+"/"+this.slideNum;this.slideImg.setAttribute("data-src",this.slidesrc(t)),this.slideImg.removeAttribute("src"),this.slideImg.classList.remove("loaded"),this.preloader.classList.add("-loading"),this.slideStatus.textContent=this.slideNum+" / "+this.slideCount,Util.observe(this.slideParent)},togglePane:function(t){document.querySelectorAll(".-mdp .-pane").forEach(t=>t.classList.add("-hide")),document.querySelector(".-pane.-"+t).classList.remove("-hide")},lazyLoad:Util.lazyLoad};var Main=function(){this.self=this,this.banners={banner11:{name:"Pace Christian Cartoons",src:"../img/designs/fl-pcc.jpg",view:"mdp"},banner21:{name:"Ramsay Christian Cartoons",src:"../img/designs/mfl-ramsay-christian-cartoons.jpg",view:"mdp"},banner22:{name:"The Bible Project",src:"../img/designs/mfl-tbp.jpg",view:"mlp"},banner31:{name:"Max 7 - RodTheNey",src:"../img/designs/fl-max7-3d.jpg",view:"mlp"},banner41:{name:"The Animated Series",src:"../img/designs/fl-bas.jpg",view:"mlp"}},this.authenticate(),this.afterLogin()};Main.prototype={getData:()=>fetch("../services/data.json").then(t=>t.json()),authenticate:function(){},afterLogin:function(){this.getData().then(t=>{var e=new Util(t),i=new Home(this.banners,e),a=new MLP(e),s=new MDP;new Navigate({util:e,home:i,mlp:a,mdp:s})})}},window.addEventListener("load",function(){console.log("content completely loaded"),new Main});