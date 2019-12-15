

/*  ////  --|    Element.prototype.animateScroll( duration, buffer )

    * Scroll document to element
*/

Element.prototype.animateScroll = function( duration = 1000, buffer = 0 ) {

    // Update buffer to include height of header
    buffer += header.offsetHeight;

    var run = true;


    // Settings
    var startPos = window.pageYOffset || document.documentElement.scrollTop,

        targetPos = this.getBoundingClientRect().top + startPos,

        distance = targetPos - startPos,

        distance = distance - buffer,

        currentTime = 0,

        increment = 16.66;

    
    // Do the animation
    var animateScroll = function() {  

        if ( run === false ) return;

        currentTime += increment;

        var val = Math.easeInOutQuad( currentTime, startPos, distance, duration );

        document.documentElement.scrollTop = document.body.scrollTop = val;

        if ( currentTime < duration ) {
            setTimeout( animateScroll, increment );
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
    animateScroll();
}