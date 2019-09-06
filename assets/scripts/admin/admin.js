( function() {

    /*  ////  --|    Shiftr Admin Script

        * Just some magic
    */


    console.log( 'Shiftr v1.0' );


    //  ////  --|    Admin Shortcut

    ( function() {

        const alias = { a: 65, e: 69, v: 86, option: 18 };
        var the_keys = {};

        console.log( alias );

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

})();

