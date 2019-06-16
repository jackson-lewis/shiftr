( function() {

    /*  ////  --|    ORPHAN

        * Say goodbye to orphan children in text;
          be it headings, paragraphs, list items or spans.

        * Exclude elements with data-orphan attribute

    */


    // Collect text elements
    var group = document.querySelectorAll( '[data-orphan]' );


    // The Loop
    group.forEach( ( el ) => {

        // Assign text content
        let content = el.innerHTML,
            newNode = [];

        // Target elements with break tags
        if ( content.indexOf( '<br>' ) >= 0 && content.indexOf( ' ' ) >= 0 ) {
            let textNodes = content.split( '<br>' );

            textNodes.forEach( ( node ) => {

                // Update text with no more orphans!
                newNode.push( no_orphan( node ) );

            });

            // Rejoin whole element and update
            el.innerHTML = newNode.join( '<br>' );

        } else if ( content.indexOf( ' ' ) >= 0 ) {

            // Update text with no more orphans!
            el.innerHTML = no_orphan( content );
        }

    });


    // Replace space with &nbsp;
    function no_orphan( el ) {

        // Get last space position
        let space = el.lastIndexOf( ' ' );

        // Do the magic
        return el.slice( 0, space ) + el.slice( space ).replace( ' ', '&nbsp;' ); 
    }


})();

