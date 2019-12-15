( () => {

    /*  ////  --|    Orphan

        * Say goodbye to orphan children in text;
          be it headings, paragraphs, list items or spans.

        * Exclude elements with data-orphan attribute

    */


    // Collect text elements
    var group = document.querySelectorAll( 'p' ) || [];


    // The Loop
    group.forEach( ( el ) => {

        // Assign text content
        let content = el.innerHTML,
            newNode = [];

        if ( content.length == 0 ) return;

        // Target elements with break tags
        if ( content.indexOf( '<br>' ) >= 0 ) {
            let textNodes = content.split( '<br>' );

            textNodes.forEach( ( node ) => {

                if ( node.match( / /g ).length >= 5 ) {
                    newNode.push( noOrphan( node ) );
                } else {
                    newNode.push( node );
                }
                
            });

            // Rejoin whole element and update
            el.innerHTML = newNode.join( '<br>' );

        } else if ( content.match( / /g ).length >= 5 ) {

            el.innerHTML = noOrphan( content );
        }

    });


    // Replace space with &nbsp;
    function noOrphan( el ) {

        // Get last space position
        let space = el.lastIndexOf( ' ' );

        // Do the magic
        return el.slice( 0, space ) + el.slice( space ).replace( ' ', '&nbsp;' ); 
    }


});

