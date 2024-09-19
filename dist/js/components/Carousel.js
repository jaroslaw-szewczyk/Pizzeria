import { select } from "../settings";
import Flickity from "../../vendor/flickity.pkgd.min.js"

class Carousel {
    constructor() {
        const thisCarousel = this();

        thisCarousel.render();
        thisCarousel.initPlugin();
    }

    render() {
        const thisCarousel = this;

        thisCarousel.dom = {};

        // Selecting carusle form DOM 
        thisCarousel.dom.carulse = document.querySelector(select.carousel.mainCarousel);
        console.log(thisCarousel.dom.carousel);
    }

    initPlugin() {
        const thisCarousel = this;

        //Init Flickity
        var flkty = new Flickity( thisCarousel.dom.carulse, {
            // options
            cellAlign: 'left',
            contain: true
          });

          console.log(flkty);
    }
    
}

export default Carousel;