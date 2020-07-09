/**
 * This file is for auto-loading components only. 
 * 
 * It targets components by "data-shiftr-<COMPONENT>" attribute
 */
import Form from '../components/form'
import carousel from '../components/carousel'
import Accordion from '../components/accordion'


/**
 * Auto-load Form components
 */
if ( document.querySelector( '[data-shiftr-form]' ) ) {
    const forms = document.querySelectorAll( '[data-shiftr-form]' ) || [];

    forms.forEach( el => {
        const f = new Form( el )
        f.init()
    });
}


/**
 * Auto-load Carousel components
 */
if ( document.querySelector( '[data-shiftr-carousel]' ) ) {
    const carousels = document.querySelectorAll( '[data-shiftr-carousel]' );
    
    carousels.forEach( carousel => carousel.carousel() );
}


/**
 * Auto-load Accordion components
 */
if ( document.querySelector( '[data-shiftr-accordion]' ) ) {
    const accordions = document.querySelectorAll( '[data-shiftr-accordion]' );
    
    accordions.forEach( el => {
        const a = new Accordion( el )
        a.init()
    });
}
