/**
 * Imports
 */
import ShiftrComponent from '../inc/component-functions'


/**
 * Shiftr Component: Tabs
 */
export default class Tabs extends ShiftrComponent {

    componentSlug() {
        return 'tabs'
    }

    defaultSettings() {
        return {
            tabList: '.shiftr-tabs__tab',
            tabPanel: '.shiftr-tabs__panel'
        }
    }

    /**
     * We want some extra things to happen here
     */
    constructor( ...args ) {
        super( ...args )

        this.tabs = this.target.querySelectorAll( this.settings.tabList )
        this.panels = this.target.querySelectorAll( this.settings.tabPanel )
    }

    /**
     * Initiate the component
     */
    init() {
        this.target.setAttribute( 'role', 'tablist' )

        this.tabs.forEach( ( tab, index ) => {
            const tabID = `${ this.componentID }-tab_${ index }`,
                  panelID = `${ this.componentID }-panel_${ index }`

            tab.setAttribute( 'id', tabID )
            tab.setAttribute( 'role', 'tab' )
            tab.setAttribute( 'aria-selected', false )
            tab.setAttribute( 'aria-controls', panelID )
            tab.setAttribute( 'tabindex', -1 )

            tab.addEventListener( 'click', e => {
                e.preventDefault()

                this.activateTab( index )
            })
        })

        this.panels.forEach( ( panel, index ) => {
            const tabID = `${ this.componentID }-tab_${ index }`,
                  panelID = `${ this.componentID }-panel_${ index }`

            panel.setAttribute( 'id', panelID )
            panel.setAttribute( 'role', 'tabpanel' )
            panel.setAttribute( 'aria-labelledby', tabID )
            panel.setAttribute( 'tabindex', 0 )
        })

        this.activateTab( 0 )
    }

    activateTab( index ) {
        this.deactivateCurrentTab()

        const tab = this.target.querySelector( `#${ this.componentID }-tab_${ index }` ),
              panel = this.target.querySelector( `#${ this.componentID }-panel_${ index }` )

        tab.removeAttribute( 'tabindex' )
        tab.setAttribute( 'aria-selected', true )
        tab.classList.add( 'is-visible' )

        panel.classList.add( 'is-visible' )
    }

    deactivateCurrentTab() {
        const currentTab = this.target.querySelector( '.shiftr-tabs__tab[aria-selected="true"]' )

        if ( currentTab ) {
            currentTab.classList.remove( 'is-visible' )
            currentTab.setAttribute( 'tabindex', -1 )
            currentTab.setAttribute( 'aria-selected', false )

            const currentPanel = this.target.querySelector( `#${ currentTab.getAttribute( 'aria-controls' ) }` )

            if ( currentPanel ) {
                currentPanel.classList.remove( 'is-visible' )
            }
        }
    }
}
 