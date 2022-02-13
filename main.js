let openPop;
const filterDropDown = document.querySelector('.filter-pop > i');

document.querySelectorAll('.nav-btns > *').forEach((navBtn) => {
  console.log(navBtn);
  navBtn.addEventListener('click', () => {
    if (navBtn.id !== 'to-top') {
      if (openPop !== navBtn.id) {
        document
          .querySelectorAll('.menu-bar > *,.nav-pop-up > *')
          .forEach((el) => {
            if (el.classList.contains('on')) el.classList.remove('on');
          });
      }
      if (navBtn.id === 'nav') {
        document.querySelector(`.${navBtn.id}-menu`).classList.toggle('on');
      } else {
        document.querySelectorAll('.menu-bar > *').forEach((el) => {
          if (el.classList.contains('on')) el.classList.remove('on');
        });
        document.querySelector(`.${navBtn.id}-pop`).classList.toggle('on');
      }
      openPop = navBtn.id;
    } else {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  });
});

filterDropDown &&
  filterDropDown.addEventListener('click', () => {
    document.querySelector('.filter-menu').classList.toggle('on');
    filterDropDown.classList.toggle('flip');
  });

window.onscroll = () => {
  scrollY > 20
    ? (document.getElementById('to-top').style.display = 'block')
    : document.getElementById('to-top').removeAttribute('style');
};

//Service Worker Registration

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw_cached_site.js');
  });
}
