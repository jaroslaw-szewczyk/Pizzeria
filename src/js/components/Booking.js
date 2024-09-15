import { select, templates } from '../settings.js'
import utils from "../utils.js";

import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

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

        /* find datePicker element */
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

        /* find hourPicker element */
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);    

        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    }
}

export default Booking;