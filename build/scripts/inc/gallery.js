

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
          viewerImg = document.createElement( 'img' );


    let arrowPrevious, arrowNext;
    if ( _.arrows ) {

        arrowPrevious = document.createElement( 'button' );

        const leftSvg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
              leftSvgPath = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

        leftSvg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
        leftSvg.setAttribute( 'viewbox', '0 0 11.29 20' );
        leftSvgPath.setAttribute( 'd', 'M1.5,20a1.51,1.51,0,0,1-1.3-.75,1.57,1.57,0,0,1,.3-1.88l6.67-6.66a1,1,0,0,0,0-1.42L.44,2.56A1.5,1.5,0,0,1,2.56.44L10.7,8.58a2,2,0,0,1,0,2.84L2.56,19.56A1.51,1.51,0,0,1,1.5,20Z' );
        leftSvg.appendChild( leftSvgPath );
        arrowPrevious.appendChild( leftSvg );

        
        arrowNext = arrowPrevious.cloneNode( true );

        arrowPrevious.classList.add( 'previous' );
        arrowPrevious.setAttribute( 'data-gallery-control', 'previous' );
        arrowPrevious.setAttribute( 'aria-label', 'View the previous image' );

        arrowNext.classList.add( 'next' );
        arrowNext.setAttribute( 'data-gallery-control', 'next' );
        arrowNext.setAttribute( 'aria-label', 'View the next image' );

        viewer.appendChild( arrowPrevious );
        viewer.appendChild( arrowNext );
    }

    let close;
    if ( _.close ) {
        close = document.createElement( 'button' );

        const closeSvg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
              closeSvgPath = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

        closeSvg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
        closeSvg.setAttribute( 'viewbox', '0 0 20 20' );
        closeSvgPath.setAttribute( 'd', 'M12.83,10.71a1,1,0,0,1,0-1.42l6.73-6.73A1.5,1.5,0,0,0,17.44.44L10.71,7.17a1,1,0,0,1-1.42,0L2.56.44A1.5,1.5,0,0,0,.44,2.56L7.17,9.29a1,1,0,0,1,0,1.42L.53,17.34a1.6,1.6,0,0,0-.16,2.15,1.5,1.5,0,0,0,2.19.07l6.73-6.73a1,1,0,0,1,1.42,0l6.73,6.73a1.5,1.5,0,0,0,2.19-.07,1.6,1.6,0,0,0-.16-2.15Z' );
        closeSvg.appendChild( closeSvgPath );
        close.appendChild( closeSvg );

        close.classList.add( 'close' );
        close.setAttribute( 'data-gallery-control', 'close' );
        close.setAttribute( 'aria-label', 'Close the image' );

        viewer.appendChild( close );
    }

    viewer.classList.add( 'gallery-viewer' );

    viewer.appendChild( viewerImg );

    document.body.appendChild( viewer );



    let gallery = this,
        images  = gallery.getElementsByTagName( 'img' );
        
        
    var sources = [];
    
    var i = 0;
    

    // Listen for image clicks
    for( var i = 0; i < images.length; i++ ) {

        let imgInLoop = images[i];
        sources.push( imgInLoop.getAttribute( 'data-src' ) );

        imgInLoop.addEventListener( 'click', () => {

            viewerImg.src = imgInLoop.getAttribute( 'data-src' );

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


    viewerImg.addEventListener( 'click', e => { e.stopPropagation(); });


    arrowPrevious.addEventListener( 'click', e => {
        e.stopPropagation();

        doPrev();
    });


    arrowNext.addEventListener( 'click', e => {
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
    function doPrev( currentPosition = getCurrPosition() ) {
        if ( currentPosition == 0 ) {
            viewerImg.src = sources[counter - 1];
            return;
        }

        viewerImg.src = sources[currentPosition - 1];
    }


    // Switch to next image
    function doNext( currentPosition = getCurrPosition() ) {
        if ( ( currentPosition + 1 ) == counter ) {
            viewerImg.src = sources[0];
            return;
        }

        viewerImg.src = sources[currentPosition + 1];
    }

    // Get current viewer position
    function getCurrPosition() {
       return sources.indexOf( viewerImg.getAttribute( 'src' ) );
    }

}