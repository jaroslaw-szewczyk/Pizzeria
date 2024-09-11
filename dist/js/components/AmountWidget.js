import { select, settings, } from '../settings.js';


class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      
      if(isNaN(thisWidget.input.value) 
        && thisWidget.input.value >= settings.amountWidget.defaultMin 
        && thisWidget.input.value <= settings.amountWidget.defaultMax){
          thisWidget.setValue(thisWidget.input.value);
        } else {
          thisWidget.setValue(settings.amountWidget.defaultValue);
        }
      
      thisWidget.initAction();
      
      // console.log('AmountWidget: ', thisWidget);
      // console.log('Constructor arguments: ', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;
      
      const newValue = parseInt(value);

      /* newValue valdidation */
      if(newValue !== thisWidget.value 
        && !isNaN(newValue) 
        && newValue >= settings.amountWidget.defaultMin 
        && newValue <= settings.amountWidget.defaultMax){
        
          thisWidget.value = newValue;
          thisWidget.announce();
      }
      

      thisWidget.input.value = thisWidget.value;
    }

    initAction(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', ()=>{
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', (event)=>{
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.linkIncrease.addEventListener('click', (event)=>{
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      
      thisWidget.element.dispatchEvent(event);
    }
}

export default AmountWidget;