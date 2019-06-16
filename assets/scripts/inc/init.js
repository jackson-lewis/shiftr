/*  
    ////  --|    INIT JS

    * Set-up JavaScript
*/




function on_load( fn = e => {} ) {

    document.addEventListener( 'DOMContentLoaded', e => {
        fn;
    });
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

		if ( vw() > value ) {

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

