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
        return {}
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
    init() {}



}
 