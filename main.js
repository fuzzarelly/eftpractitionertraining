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
