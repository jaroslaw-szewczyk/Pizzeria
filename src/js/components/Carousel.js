import { select } from '../settings.js'

class Carousel {
    constructor(element) {
        const thisCarousel = this;
        thisCarousel.element = element;

        // console.log('constructor',thisCarousel.element);

        thisCarousel.render();
        thisCarousel.initPlugin();
    }

    render() {
        const thisCarousel = this;

        thisCarousel.dom = {};

        // Selecting carusle form DOM 
        thisCarousel.dom.carulse = thisCarousel.element.querySelector(select.carousel.mainCarousel);
    }

    initPlugin() {
        const thisCarousel = this;

        
        //Init Flickity
        // eslint-disable-next-line no-undef
        flkty = new Flickity( thisCarousel.dom.carulse, {
            // options
            cellAlign: 'left',
            contain: true
          });
    }
    
}

export default Carousel;