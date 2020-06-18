/**  
 *  strToBool
 *
 *  Perform regex against string for true|false and return boolean
 *
 *  @since 1.0
 *
 *  @param str str The string to check against
 *  @return bool|str Boolean if match found, string if no match
 */

function strToBool( str ) {

    if ( str.match( /^true$/i ) ) {
        return true;

    } else if ( str.match( /^false$/i ) ) {
        return false;

    } else {
        return str;
    }
}


/**  
 *  parseComponentData
 *
 *  For use on parsing Shiftr component settings
 *  Override component setting defaults with data attributes
 *
 *  @since 1.0
 *
 *  @param settings obj The settings of the component
 *  @param el Element The component element
 *  @param component str The Shiftr component name
 *  @return obj The parsed settings
 */
function parseComponentData( settings = {}, el, component = '' ) {

    if ( el && el.hasAttribute( `data-shiftr-${component}` ) ) {

        Object.keys( settings ).forEach( s => {

            if ( el.hasAttribute( `data-${component}-${s}` ) ) {
                settings[s] = strToBool( el.getAttribute( `data-${component}-${s}` ) );
            }
        });
    }

    return settings;
}


/**  
 *  generateComponentID
 *
 *  For use on generating a random ID for a Shiftr Component
 *
 *  @since 1.0
 *
 *  @param el Element The component element
 *  @param component str The Shiftr component name
 *  @return str The ID
 */
function generateComponentID( el, component = '' ) {

    // Check if element already has id set
    if ( el.hasAttribute( 'id' ) ) return el.id;

    let $ID = `${component}_` + Math.floor( Math.random() * Math.floor( 100 ) );

    // Rerun if element with id already exists
    if ( document.getElementById( $ID ) ) generateComponentID( el, component );

    return $ID;
}


export { strToBool, parseComponentData, generateComponentID }
    