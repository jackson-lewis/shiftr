/*  
    ////  --|    INIT JS

    * Set-up JavaScript
*/


/*  ////  --|    Global vars

    * Used throughout the Shiftr JS functions
*/ 

let header    = document.querySelector( '.site-header' ),    
    head      = document.getElementsByTagName( 'head' )[0],
    body      = document.body;


function on_load( fn = e => {} ) {

    document.addEventListener( 'DOMContentLoaded', e => {
        fn;
    });
}

function createEl( el ) {

    return document.createElement( el );
}

/*  ////  --|    Return window size

    * Twin functions, one for width and another for height
*/

function vw() {
    return window.innerWidth;
}


function vh() {
    return window.innerHeight;
}




/*  ////  --|    Width Breakpoint - the JS equivilant to CSS media queries

    * Ensure breakpoint settings match those set in the styles
*/

let s 	= 's';
let m 	= 'm';
let l 	= 'l';
let xl 	= 'xl';
let max = 'max';


function x( width, fn, callback = () => {}, run_once = false ) {

	var value;

	switch ( width ) {
		case s:     value = 450; break;
		case m: 	value = 768; break;
		case l: 	value = 1024; break;
		case xl: 	value = 1600; break;
        case max:   value = 1920; break;
		default:  	value = width;
	}

	let run = () => {
		
		var allow = false;

		if ( vw() >= value ) {

			if ( run_once === true && allow === false ) return;

			fn();

			allow = false;

		} else {
			
			if ( run_once === true && allow === true ) return;

			callback();

			allow = true;
		} 
	}


	document.addEventListener( 'DOMContentLoaded', run );
	window.addEventListener( 'resize', run );
	window.addEventListener( 'orientationchange', run );
}


//  ////  --|    Admin Shortcut

( () => {

    const alias = { a: 65, e: 69, option: 18 };
    var the_keys = {};

    document.addEventListener( 'keydown', e => {

        the_keys[e.keyCode] = true;

        switch ( true ) {

            // Admin home
            case the_keys[alias.option] && the_keys[alias.a]:
                open_admin_url( shiftr.shortcuts.admin );
                break;

            // Edit current page
            case the_keys[alias.option] && the_keys[alias.e]:
                if ( ! shiftr.vars.archive ) {
                    open_admin_url( shiftr.shortcuts.edit );
                }
                break;
        }
    });

    document.addEventListener( 'keyup', e => {
        delete the_keys[e.keyCode];
    });

    function open_admin_url( url ) {

        // Clear all keys
        the_keys = {};

        // Open the url in a new tab
        window.open( url, '_blank' );
    }

})();

    