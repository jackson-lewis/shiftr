( function() {
    /**
     * Admin shortcuts
     */

    const alias = { a: 65, e: 69, v: 86, option: 18 };
    var the_keys = {};

    document.addEventListener( 'keydown', function( e ) {

        the_keys[e.keyCode] = true;

        switch ( true ) {

            // View page
            case the_keys[alias.option] && the_keys[alias.v]:
                open_frontend_url( shiftr.shortcuts.view );
                break;
        }
    });

    document.addEventListener( 'keyup', function( e ) {
        delete the_keys[e.keyCode];
    });

    function open_frontend_url( url ) {
        the_keys = {};
        window.open( url, '_blank' );
    }

})();


( $ => {

    $(document).on( 'wplink-open', function( wrap ) {

        // Custom HTML added to the link dialog
        if( $('#wp-link-display-style').length < 1 ) {

            const options = [
                '<option value="">None</option>',
                '<option value="button-fill">Button Fill</option>',
                '<option value="button-outline">Button Outline</option>',
                '<option value="button-text">Button Text</option>'
            ]

            $('#link-options').append( `<div class="link-display-style"> <label><span>Link Style</span> <select id="wp-link-display-style">${ options.join( '' ) }</select></label></div>` );
        }

        wpLink.getAttrs = function() {
            wpLink.correctURL();

            return {
                href: $.trim( $( '#wp-link-url' ).val() ),
                target: $( '#wp-link-target' ).prop( 'checked' ) ? '_blank' : null,
                class: $( '#wp-link-display-style' ).val()
            };
        }

    });


})( jQuery );
