import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Carousel from './components/Carousel.js';

const app = {

  initPages: function() {
    const thisApp = this;
    
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navlinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
  
    thisApp.activatePage(pageMatchingHash);

    for(const link of thisApp.navlinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run.thisApp.activePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      })
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    /* add class "active" to maching pages, remove from non-matching */
    for(const page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class "active" to maching links, remove from non-matching */
    for(const link of thisApp.navlinks) {
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#/' + pageId
      );
    }

  },

  initMenu: function() {
      const thisApp = this;
      // console.log('thisApp.data', thisApp.data.products);

      for(const productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
  },

  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){

        /* save parsedResponse at thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });
  },

  initCart: function() {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', event => {
        app.cart.add(event.detail.product);
      })
  },

  initCarousel: function() {
    const thisApp = this;
    
    const carouselContainer = document.querySelector(select.carousel.carouselContainer);

    thisApp.carousel = new Carousel(carouselContainer);
  },

  initBooking: function() {
    const thisApp = this;

    const widgetBookingContainer = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(widgetBookingContainer);
  },

  init: function() {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      console.log('settings:', settings);
      // console.log('templates:', templates);
      
      thisApp.initPages();

      thisApp.initData();
      thisApp.initCart();
      thisApp.initBooking();
      thisApp.initCarousel();
  },
};

app.init();

