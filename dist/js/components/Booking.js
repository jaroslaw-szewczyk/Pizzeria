import { select, templates } from '../settings.js'
import utils from "../utils.js";

import AmountWidget from './AmountWidget.js';

class Booking {
    constructor(widgetBookingContainer) {
        const thisBooking = this;

        thisBooking.render(widgetBookingContainer);
        thisBooking.initWidgets();
    }

    render(widgetBookingContainer) {
        const thisBooking = this;
        
        /* creating empty dom object */
        thisBooking.dom = {};

        /* add wrapper property to dom object */
        thisBooking.dom.wrapper = widgetBookingContainer;

         /* generate HTML based on template */
        const generatedHTML = templates.bookingWidget();

        /* create element using utils.createElementFromHTML */
        thisBooking.element = utils.createDOMFromHTML(generatedHTML);

         /* add thisBooking.element to thisBooking.dom.wrapper */
        thisBooking.dom.wrapper.appendChild(thisBooking.element);

        /* find peopleAmount element */
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

        /* find hoursAmount element */
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);    
    }
}

export default Booking;