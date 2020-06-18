/**
 * This core file is for working on the core components 
 * of the theme.
 * 
 * It's unlikely you would need to alter this file
 */
import { polyfill__ObjectAssign, polyfill__forEach, polyfill__objectFit } from '../inc/polyfill'
import CookieNotice from '../inc/cookie'


/**
 * Load polyfills
 */
polyfill__ObjectAssign()
polyfill__forEach()
polyfill__objectFit()


/**
 * Load core components
 */
CookieNotice()
