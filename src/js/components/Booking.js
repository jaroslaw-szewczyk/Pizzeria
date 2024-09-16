import { select, templates, settings, classNames } from '../settings.js'
import utils from "../utils.js";

import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
    constructor(widgetBookingContainer) {
        const thisBooking = this;
        thisBooking.selected = 0;
        thisBooking.starters = [];

        thisBooking.render(widgetBookingContainer);
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.preparStarters();
        thisBooking.sendBooking();
    }

    getData() {
        const thisBooking = this;

        const startDayParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDayParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params = {
            booking: [
                startDayParam,
                endDayParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDayParam,
                endDayParam,
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                startDayParam,
            ],
        }

        const urls = {
            booking:       settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events   + '?' + params.eventsCurrent.join('&'),
            eventsRepeat:  settings.db.url + '/' + settings.db.events   + '?' + params.eventsRepeat.join('&'),
        }

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
        .then(function(allResponse) {
            const bookingsResponse = allResponse[0];
            const eventsCurrentResponse = allResponse[1];
            const eventsRepeatResponse = allResponse[2];
            return Promise.all([
                bookingsResponse.json(),
                eventsCurrentResponse.json(),
                eventsRepeatResponse.json(),
            ])
        })
        .then(function([bookings, eventsCurrent, eventsRepeat]) {
            // console.log('bookings', bookings);
            // console.log('eventsCurrentRespons', eventsCurrent);
            // console.log('eventsRepeatResponse', eventsRepeat);
            thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
        }); 

    }

    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;

        thisBooking.booked = {};

        for(const event of bookings) {
            thisBooking.makeBooked(event.date, event.hour, event.duration, event.table);
        }

        for(const event of eventsCurrent) {
            thisBooking.makeBooked(event.date, event.hour, event.duration, event.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for(const event of eventsRepeat) {
            if(event.repeat == 'daily'){
                for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
                    thisBooking.makeBooked(utils.dateToStr(loopDate), event.hour, event.duration, event.table);
                }
            }
        }

        thisBooking.updateDom();
    }

    makeBooked(date, hour, duration, table) {
        const thisBooking = this;
        
        if(typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
            if(typeof thisBooking.booked[date][hourBlock] == 'undefined') {
                thisBooking.booked[date][hourBlock] = [];
            }
    
            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    updateDom() {
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if(typeof thisBooking.booked[thisBooking.date] == 'undefined'
            || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ){
            allAvailable = true;
        }
        /* removing the ‘selected’ class each time the time or date is changed */
        for(const table of thisBooking.dom.tables) {
            table.classList.remove(classNames.booking.tableSelected);
        }

        for(let table of thisBooking.dom.tables) {
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if(!isNaN(tableId)){
                tableId = parseInt(tableId);
            }

            if(!allAvailable 
                && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);

            }
        }
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
        
        /* find tables element */
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        
        /* find floor plan */
        thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);

        /*find starters container */
        thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);

        /*find order confirmation inputs */
        thisBooking.dom.orderConfirmation = thisBooking.dom.wrapper.querySelectorAll(select.booking.orderConfirmation);
        
        /*find order confirmation button */
        thisBooking.dom.orderBtn = thisBooking.dom.wrapper.querySelector(select.booking.orderBtn);
    }   

    preparStarters() {
        const thisBooking = this;
       
        for(const starter of thisBooking.dom.starters){
            starter.addEventListener('click', function(){
              if(starter.checked){
                thisBooking.starters.push(starter.value);
              }else {
                const starterIndex = thisBooking.starters.indexOf(starter.value);
                thisBooking.starters.splice(starterIndex, 1);
              }
            });
        }
    }

    preperPayload() {
        const thisBooking = this;

        const url = settings.db.url + '/' + settings.db.bookings;

        let phone = '';
        let address = '';

        for(const item of thisBooking.dom.orderConfirmation){
            if(item.name == 'phone'){
                phone = item.value;
            } else{
                address = item.value;
            }
        }
 

        const payload = {
            "date": thisBooking.datePicker.value,
            "hour": thisBooking.hourPicker.value,
            "table": thisBooking.selected,
            "duration": thisBooking.hoursAmountWidget.value,
            "ppl": thisBooking.peopleAmountWidget.value,
            "starters": thisBooking.starters,
            "phone": phone,
            "address": address,
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        fetch(url, options)
            .then(function (response){
                return response.json();
            }).then(function(parsedResponse){
                console.log('parsed response', parsedResponse);
            });
    }

    sendBooking() {
        const thisBooking = this;

        thisBooking.dom.orderBtn.addEventListener('submit', function(event){
            event.preventDefault();
            thisBooking.preperPayload();
        });
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);    

        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.updateDom();
        });

        /* listening to the floor plan */
        thisBooking.dom.floorPlan.addEventListener('click', function(event){
            
            /* checking if the cliked element is a table */
            if(event.target.classList.contains('table')){
                /* checking whether the clicked element has the class 'reserved' */
                if(event.target.classList.contains(classNames.booking.tableBooked)){
                    alert('Table already booked');
                } else if(event.target.classList.contains(classNames.booking.tableSelected)){
                    event.target.classList.remove(classNames.booking.tableSelected);
                } else {
                    /*find a table with the class ‘selected*/
                    const selectedTable = thisBooking.dom.floorPlan.querySelector(select.booking.selectedTable);
                    /* if such a table exists we take the class selected */
                    if(selectedTable){
                        selectedTable.classList.remove(classNames.booking.tableSelected);
                    }
                    /*we assign to thisBooking.selected the value of the attribute of the selected table */
                    thisBooking.selected = event.target.getAttribute(settings.booking.tableIdAttribute);
                    /* Add ‘selected’ class to the selected table */
                    event.target.classList.add(classNames.booking.tableSelected);
                }
            }
        });
    }
}

export default Booking;