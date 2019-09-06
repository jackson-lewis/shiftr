

/*  ////  --|    Element.prototype.animateScroll( duration, buffer )

    * Scroll document to element
*/

Element.prototype.animateScroll = function( duration = 1000, buffer = 0 ) {

    // Update buffer to include height of header
    buffer += document.querySelector( '.header' ).offsetHeight;

    var run = true;


    // Settings
    var start_pos = window.pageYOffset || document.documentElement.scrollTop,

        target_pos = this.getBoundingClientRect().top + start_pos,

        distance = target_pos - start_pos,

        distance = distance - buffer,

        currentTime = 0,

        increment = 16.66;

    
    // Do the animation
    var animate_scroll = function() {  

        if ( run === false ) return;

        currentTime += increment;

        var val = Math.easeInOutQuad( currentTime, start_pos, distance, duration );

        document.documentElement.scrollTop = document.body.scrollTop = val;

        if( currentTime < duration ) {
            setTimeout(animate_scroll, increment);
        }
    };


    // Easing...
    Math.easeInOutQuad = function (t, b, c, d) {

        t /= d/2;

        if (t < 1) return c/2*t*t + b;

        t--;

        return -c/2 * (t*(t-2) - 1) + b;
    };


    // Do initial iteration
    animate_scroll();
}