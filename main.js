(function(){
  var hamburger=document.querySelector('.nav__hamburger');
  var mobileNav=document.querySelector('.nav__mobile');
  if(hamburger&&mobileNav){
    hamburger.addEventListener('click',function(){
      var isOpen=mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded',String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded','false');
      });
    });
  }
  document.querySelectorAll('.faq__item').forEach(function(item){
    var btn=item.querySelector('.faq__question');
    if(btn){btn.addEventListener('click',function(){
      var isOpen=item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',String(isOpen));
    });}
  });
})();

(function(){
  if(!window.IntersectionObserver)return;

  var revealObs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){revealObs.observe(el);});

  function animateCounter(el){
    var target=parseInt(el.getAttribute('data-target'));
    var duration=1800;
    var steps=Math.round(duration/16);
    var step=target/steps;
    var current=0;
    var timer=setInterval(function(){
      current+=step;
      if(current>=target){el.textContent=target.toLocaleString();clearInterval(timer);}
      else{el.textContent=Math.floor(current).toLocaleString();}
    },16);
  }
  var statsEl=document.querySelector('.stats-band');
  if(statsEl){
    var cObs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.querySelectorAll('.counter-number').forEach(animateCounter);
          cObs.unobserve(entry.target);
        }
      });
    },{threshold:0.1});
    cObs.observe(statsEl);
  }
})();

(function(){
  var popup=document.getElementById('quiz-popup');
  if(!popup)return;
  var STORAGE_KEY='eftQuizPopupShown';
  var shown=false;
  var timer;

  function hasShown(){
    try{return !!sessionStorage.getItem(STORAGE_KEY);}catch(e){return false;}
  }
  function markShown(){
    try{sessionStorage.setItem(STORAGE_KEY,'1');}catch(e){}
  }

  function openPopup(){
    if(shown||hasShown())return;
    shown=true;
    markShown();
    clearTimeout(timer);
    popup.classList.add('is-open');
    requestAnimationFrame(function(){popup.classList.add('is-visible');});
  }
  function closePopup(){
    popup.classList.remove('is-visible');
    setTimeout(function(){popup.classList.remove('is-open');},250);
  }

  if(!hasShown()){
    timer=setTimeout(openPopup,40000);
    document.addEventListener('mouseout',function(e){
      if(e.clientY<=0&&!e.relatedTarget){openPopup();}
    });
  }

  document.getElementById('popup-close').addEventListener('click',closePopup);
  document.getElementById('popup-skip').addEventListener('click',function(e){e.preventDefault();closePopup();});
  popup.addEventListener('click',function(e){if(e.target===popup)closePopup();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&popup.classList.contains('is-open'))closePopup();});
})();
