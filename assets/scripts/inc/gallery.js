

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
        left_svg.setAttribute( 'viewbox', '0 0 100 100' );
        left_svg_path.setAttribute( 'd', '' );
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
        close_svg.setAttribute( 'viewbox', '0 0 100 100' );
        close_svg_path.setAttribute( 'd', '' );
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
    
    var i = 0,
        img_in_loop;
    

    // Listen for image clicks
    for( var i = 0; i < images.length; i++ ) {

        img_in_loop = images[i];
        sources.push( img_in_loop.getAttribute( 'data-src' ) );

        img_in_loop.addEventListener( 'click', () => {

            viewer_img.src = img_in_loop.getAttribute( 'src' );

            if ( viewer.classList.contains( 'display' ) ) return;

            viewer.classList.add( 'pre' );

            setTimeout( () => {
                viewer.classList.add( 'display' );
            }, 100 );
        });
    }


    let counter = sources.length;


    // Close the viewer
    viewer.addEventListener( 'click', () => {

        viewer.classList.remove( 'display' );
        setTimeout( () => {
            viewer.classList.remove( 'pre' );
        }, 600 );
    });


    viewer_img.addEventListener( 'click', e => { e.stopPropagation(); });


    arrow_previous.addEventListener( 'click', e => {
        e.stopPropagation();

        let current_position = sources.indexOf( viewer_img.getAttribute( 'src' ) );

        if ( current_position == 0 ) {
            viewer_img.src = sources[counter - 1];

            return;
        }

        viewer_img.src = sources[current_position - 1];
    });


    arrow_next.addEventListener( 'click', e => {
        e.stopPropagation();

        let current_position = sources.indexOf( viewer_img.getAttribute( 'src' ) );

        if ( ( current_position + 1 ) == counter ) {

            viewer_img.src = sources[0];

            return;
        }

        viewer_img.src = sources[current_position + 1];
    });


    // Switch between images in the viewer
    document.addEventListener( 'keydown', e => {

        let key = e.keyCode || e.which,
            current_position = sources.indexOf( viewer_img.getAttribute( 'src' ) );

        console.log( viewer_img.getAttribute( 'src' ) );

        // Left arrow
        if ( key == 37 ) {
            if ( current_position == 0 ) {
                viewer_img.src = sources[counter - 1];

                return;
            }

            viewer_img.src = sources[current_position - 1];
        }

        // Right arrow
        if ( key == 39 ) {
            if ( ( current_position + 1 ) == counter ) {

                viewer_img.src = sources[0];

                return;
            }

            viewer_img.src = sources[current_position + 1];
        }
    });

}