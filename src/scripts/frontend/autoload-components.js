/**
 * This file is for auto-loading components only. 
 * 
 * It targets components by "data-shiftr-<COMPONENT>" attribute
 */
import Form from '../components/form'
import Accordion from '../components/accordion'
import Tabs from '../components/tabs'


/**
 * Auto-load Form components
 */
if ( document.querySelector( '[data-shiftr-form]' ) ) {
    const forms = document.querySelectorAll( '[data-shiftr-form]' ) || []

    forms.forEach( el => {
        const f = new Form( el )
        f.init()
    })
}


/**
 * Auto-load Accordion components
 */
if ( document.querySelector( '[data-shiftr-accordion]' ) ) {
    const accordions = document.querySelectorAll( '[data-shiftr-accordion]' ) || []
    
    accordions.forEach( el => {
        const a = new Accordion( el )
        a.init()
    })
}


/**
 * Auto-load Tabs components
 */
 if ( document.querySelector( '[data-shiftr-tabs]' ) ) {
    const tabs = document.querySelectorAll( '[data-shiftr-tabs]' ) || []
    
    tabs.forEach( el => {
        const t = new Tabs( el )
        t.init()
    })
}
