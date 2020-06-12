/**
 * Imports
 */
import { vw } from '../inc/_init'
import { LazyLoader, CookieNotice } from '../inc/shiftr-core'
import { Accordion } from '../inc/shiftr-components'


// Init our lazy loading!
LazyLoader({
    targetClass: `temp_lazy`
})

// Init our Cookie notice
CookieNotice()

console.log( typeof Accordion )
console.log( vw() )

/**
 * Our code down here
 */
