( function() {

    /*  ////  --|    Gallery

        * Brand new component
    */


    // Check Gallery component exists on page
    if ( document.querySelector( '[data-shiftr-gallery]' ) === null ) return false;


    // Create the viewer
    const viewer = document.createElement( 'div' ),
        viewer_img = document.createElement( 'img' );

    viewer.classList.add( 'gallery-viewer' );

    viewer.appendChild( viewer_img );

    document.body.appendChild( viewer );



    let gallery_list    = document.querySelector( '.gallery-list' ),
        gallery_images  = document.querySelectorAll( '[data-shiftr-gallery-image]' );
        
    var sources = [];
    
    
    // Listen for image clicks
    gallery_images.forEach( image => {

        sources.push( image.src );

        image.addEventListener( 'click', () => {

            viewer_img.src = image.src;

            if ( viewer.classList.contains( 'display' ) ) return;

            viewer.classList.add( 'pre' );

            setTimeout( () => {
                viewer.classList.add( 'display' );
            }, 100 );
        });
    });

    let counter = sources.length;


    // Close the viewer
    viewer.addEventListener( 'click', () => {

        viewer.classList.remove( 'display' );
        setTimeout( () => {
            viewer.classList.remove( 'pre' );
        }, 600 );
    });


    viewer_img.addEventListener( 'click', e => {

        e.stopPropagation();
    });


    // Switch between images in the viewer
    document.addEventListener( 'keydown', e => {

        let key = e.keyCode || e.which,
            current_position = sources.indexOf( viewer_img.src );

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

})();

