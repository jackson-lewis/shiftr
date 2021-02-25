/**
 * Imports
 */
import ShiftrComponent from '../inc/component-functions'


/**
 * Shiftr Component: Accordion
 */
export default class Accordion extends ShiftrComponent {

    componentSlug() {
        return 'accordion'
    }

    defaultSettings() {
        return {
            itemsTarget: '.accordion--item',
            duration: 600,
            defaultOpen: 0,
            allowMultiOpen: false
        }
    }

    /**
     * We want some extra things to happen here
     */
    constructor( ...args ) {
        super( ...args )

        this.items = this.target.querySelectorAll( this.settings.itemsTarget )
    }

    /**
     * Initiate the component
     */
    init() {
        
        if ( this.items.length <= 0 ) {
            console.warn( 'This Accordion component contains no items.' )
            return false;
        }

        this.target.setAttribute( 'role', 'tablist' )

        /**
         * Prepare each item
         */
        let index = 0
        this.items.forEach( item => {

            const [ tab, panel ] = item.children

            const tabID = `${this.componentID}-tab_${index}`,
                  panelID = `${this.componentID}-panel_${index}`

            // handle the label
            tab.setAttribute( 'id', tabID )
            tab.setAttribute( 'role', 'tab' )
            tab.setAttribute( 'aria-selected', false )
            tab.setAttribute( 'aria-controls', panelID )

            // handle the content
            panel.style.display = 'none'
            panel.setAttribute( 'id', panelID )
            panel.setAttribute( 'role', 'tabpanel' )
            panel.setAttribute( 'aria-labelledby', tabID )
            panel.setAttribute( 'hidden', '' )

            tab.addEventListener( 'click', e => {
                e.preventDefault()
    
                if ( ! this.settings.allowMultiOpen ) {
                    const current = this.target.querySelector( '.accordion--item.is-expanded' ) || null
    
                    if ( current != item && current !== null ) {
                        this.close( current )
                    }
                }
    
                if ( window.getComputedStyle( panel ).display === 'none' ) {
                    this.open( item )
    
                } else {
                    this.close( item )
                }
            });

            index++
        })

        /**
         * Set a first open state
         */
        if ( this.settings.defaultOpen >= 0 ) {
            const first = this.items[ this.settings.defaultOpen ]
    
            first.classList.add( 'is-expanded' )
    
            first.children[0].setAttribute( 'aria-selected', true )
            first.children[1].removeAttribute( 'hidden' )
            first.children[1].style.display = 'block'
        }
    }

    /**
     * Open an Accordion item
     */
    open( item ) {
        item.classList.add( 'is-expanded' )

        const [ tab, panel ] = item.children

        // ARIA
        tab.setAttribute( 'aria-selected', 'true' )
        panel.removeAttribute( 'hidden' )

        // Styling & transition
        panel.style.removeProperty( 'display' )

        const display = window.getComputedStyle( panel ).display

        if ( display === 'none' ) {
            display = 'block'
        }

        panel.style.display = display

        const height = panel.offsetHeight

        panel.style.overflow = 'hidden'
        panel.style.height = 0
        panel.style.paddingTop = 0
        panel.style.paddingBottom = 0
        panel.offsetHeight
        panel.style.transitionProperty = "height, padding"
        panel.style.transitionDuration = this.settings.duration + 'ms'
        panel.style.height = height + 'px'

        panel.style.removeProperty( 'padding-top' )
        panel.style.removeProperty( 'padding-bottom' )

        setTimeout( () => {
            panel.style.removeProperty( 'height' )
            panel.style.removeProperty( 'overflow' )
            panel.style.removeProperty( 'transition-duration' )
            panel.style.removeProperty( 'transition-property' )
        }, this.settings.duration )
    }

    /**
     * Close an Accordion item
     */
    close( item ) {
        item.classList.remove( 'is-expanded' )

        const [ tab, panel ] = item.children

        // ARIA
        tab.setAttribute( 'aria-selected', false )
        panel.setAttribute( 'hidden', '' )

        // Styling & transition
        panel.style.transitionProperty = 'height, padding'
        panel.style.transitionDuration = this.settings.duration + 'ms'
        panel.style.height = panel.offsetHeight + 'px'
        panel.offsetHeight
        panel.style.overflow = 'hidden'
        panel.style.height = 0
        panel.style.paddingTop = 0
        panel.style.paddingBottom = 0

        setTimeout( () => {
            panel.style.display = 'none';
            panel.style.removeProperty( 'height' )
            panel.style.removeProperty( 'padding-top' )
            panel.style.removeProperty( 'padding-bottom' )
            panel.style.removeProperty( 'overflow' )
            panel.style.removeProperty( 'transition-duration' )
            panel.style.removeProperty( 'transition-property' )
        }, this.settings.duration )
    }
}
