

/*  ////  --|    Element.prototype.gallery( settings )

    * Scroll document to element
*/

Element.prototype.gallery = function( settings = {} ) {

    // The default settings
    let defaults = {
        arrows: true,
        close: true
    };


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // Override the defaults with any defined settings
    let _ = Object.assign( defaults, settings );


    // Create the viewer
    const viewer     = document.createElement( 'div' ),
          viewer_img = document.createElement( 'img' );


    let arrow_previous, arrow_next;
    if ( _.arrows ) {

        arrow_previous = document.createElement( 'button' );

        const left_svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
              left_svg_path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

        left_svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
        left_svg.setAttribute( 'viewbox', '0 0 11.29 20' );
        left_svg_path.setAttribute( 'd', 'M1.5,20a1.51,1.51,0,0,1-1.3-.75,1.57,1.57,0,0,1,.3-1.88l6.67-6.66a1,1,0,0,0,0-1.42L.44,2.56A1.5,1.5,0,0,1,2.56.44L10.7,8.58a2,2,0,0,1,0,2.84L2.56,19.56A1.51,1.51,0,0,1,1.5,20Z' );
        left_svg.appendChild( left_svg_path );
        arrow_previous.appendChild( left_svg );

        
        arrow_next = arrow_previous.cloneNode( true );

        arrow_previous.classList.add( 'previous' );
        arrow_previous.setAttribute( 'data-gallery-control', 'previous' );
        arrow_previous.setAttribute( 'aria-label', 'View the previous image' );

        arrow_next.classList.add( 'next' );
        arrow_next.setAttribute( 'data-gallery-control', 'next' );
        arrow_next.setAttribute( 'aria-label', 'View the next image' );

        viewer.appendChild( arrow_previous );
        viewer.appendChild( arrow_next );
    }

    let close;
    if ( _.close ) {
        close = document.createElement( 'button' );

        const close_svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
              close_svg_path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

        close_svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
        close_svg.setAttribute( 'viewbox', '0 0 20 20' );
        close_svg_path.setAttribute( 'd', 'M12.83,10.71a1,1,0,0,1,0-1.42l6.73-6.73A1.5,1.5,0,0,0,17.44.44L10.71,7.17a1,1,0,0,1-1.42,0L2.56.44A1.5,1.5,0,0,0,.44,2.56L7.17,9.29a1,1,0,0,1,0,1.42L.53,17.34a1.6,1.6,0,0,0-.16,2.15,1.5,1.5,0,0,0,2.19.07l6.73-6.73a1,1,0,0,1,1.42,0l6.73,6.73a1.5,1.5,0,0,0,2.19-.07,1.6,1.6,0,0,0-.16-2.15Z' );
        close_svg.appendChild( close_svg_path );
        close.appendChild( close_svg );

        close.classList.add( 'close' );
        close.setAttribute( 'data-gallery-control', 'close' );
        close.setAttribute( 'aria-label', 'Close the image' );

        viewer.appendChild( close );
    }

    viewer.classList.add( 'gallery-viewer' );

    viewer.appendChild( viewer_img );

    document.body.appendChild( viewer );



    let gallery = this,
        images  = gallery.getElementsByTagName( 'img' );
        
        
    var sources = [];
    
    var i = 0;
    

    // Listen for image clicks
    for( var i = 0; i < images.length; i++ ) {

        let img_in_loop = images[i];
        sources.push( img_in_loop.getAttribute( 'data-src' ) );

        img_in_loop.addEventListener( 'click', () => {

            viewer_img.src = img_in_loop.getAttribute( 'data-src' );

            if ( viewer.classList.contains( 'display' ) ) return;

            viewer.classList.add( 'pre' );

            setTimeout( () => {
                viewer.classList.add( 'display' );
                body.classList.add( 'no-scroll' );
            }, 100 );
        });
    }


    let counter = sources.length;


    // Close the viewer
    viewer.addEventListener( 'click', () => {

        viewer.classList.remove( 'display' );
        setTimeout( () => {
            viewer.classList.remove( 'pre' );
            body.classList.remove( 'no-scroll' );
        }, 600 );
    });


    viewer_img.addEventListener( 'click', e => { e.stopPropagation(); });


    arrow_previous.addEventListener( 'click', e => {
        e.stopPropagation();

        doPrev();
    });


    arrow_next.addEventListener( 'click', e => {
        e.stopPropagation();

        doNext();
    });


    // Switch between images in the viewer
    document.addEventListener( 'keydown', e => {

        let key = e.keyCode || e.which;

        // Left arrow
        if ( key == 37 ) doPrev();

        // Right arrow
        if ( key == 39 ) doNext();
    });


    // Switch to previous image
    function doPrev( current_position = getCurrPosition() ) {
        if ( current_position == 0 ) {
            viewer_img.src = sources[counter - 1];
            return;
        }

        viewer_img.src = sources[current_position - 1];
    }


    // Switch to next image
    function doNext( current_position = getCurrPosition() ) {
        if ( ( current_position + 1 ) == counter ) {
            viewer_img.src = sources[0];
            return;
        }

        viewer_img.src = sources[current_position + 1];
    }

    // Get current viewer position
    function getCurrPosition() {
       return sources.indexOf( viewer_img.getAttribute( 'src' ) );
    }

}