( function() {

    /*  ////  --|    FORM HANDLER 0.5 [BETA]

        * Ships 100% dynamic, not tied to a specific form,
          allowing multiple forms to use the whole module
    */



    //  --|    SETTINGS
    let settings = shiftr.form;


    // Validation classes
    const vc = {
        focus: 'focus',
        success: 'success',
        error: 'error'
    };


    //  --|    FIELDS

    const inputs = document.querySelectorAll( 'input, textarea' ),
        listed = ['name', 'text', 'email'];

    inputs.forEach( function( input ) {

        if ( listed.indexOf( input.type ) >= 0 ||
            input.nodeName == 'TEXTAREA' ) {

            // target is label
            const target = input.previousElementSibling;

            input.addEventListener( 'focus', function() {

                this.classList.add( vc.focus );
                target.classList.add( vc.focus );
            });

            input.addEventListener( 'blur', function() {

                this.className = '';
                target.className = '';

                if ( this.value != '' ) {

                    if ( this.checkValidity() ) {
                        target.classList.add( vc.success );
                        clear_validation( this );

                    } else  { target.classList.add( vc.error ); }
                }
            });


            input.addEventListener( 'invalid', function( e ) {
                e.preventDefault();

                target.classList.add( vc.error );

                do_validation( this, this.validationMessage );
            });

        } else if ( input.type == 'checkbox' ) {

            input.addEventListener( 'change', function() {

                if ( input.checked ) {
                    clear_validation( input );
                }
            });

            input.addEventListener( 'invalid', function( e ) {
                e.preventDefault();

                do_validation( this, this.validationMessage );
            });
        }
    });




    function do_validation( input, message ) {

        const m = document.createElement( 'span' );

        m.classList.add( 'validation' );
        m.innerHTML = message;
        input.parentElement.appendChild( m );

        setTimeout( () => {
            m.classList.add( 'pop' );
        }, 400 );

        setTimeout( () => {
            clear_validation( input );
        }, 6000 );
    }




    function clear_validation( input ) {

        const nextEl = input.nextElementSibling;
        
        if ( nextEl ) {

            if ( nextEl.nodeName == 'SPAN' ) {

                nextEl.classList.remove( 'pop' );

                setTimeout( () => {
                    input.parentElement.removeChild( nextEl );
                }, 400 );
            }
        }
    }








    /*  --|    Handle the submission


        * IE 10-11: does not support json as responseType
        * Firefox 6-9: does not support json as responseType
        * Firefox 6-11: does not support .timeout and .ontimeout
        * Chrome 7-28: does not support .timeout and .ontimeout
        * Chrome 7-30: does not support json as responseType
        * Safari 5-7: does not support .timeout and .ontimeout
        * Safari 6.1-7: does not support json as responseType

    */

    if ( document.querySelector( '.form' ) ) {
        const form = document.querySelector( '.form' );

        form.addEventListener( 'submit', function( e ) {
            e.preventDefault();

            form.querySelector( 'input[type="submit"]' ).classList.add( 'submitting' );

            const data = new FormData( form );

            const xhr = new XMLHttpRequest();
        
            xhr.onload = function() {

                if ( this.status >= 200 && this.status < 400 ) {

                    console.log( this.responseText );

                    const data = JSON.parse( this.responseText );

                    form.querySelector( 'input[type="submit"]' ).classList.remove( 'submitting' );

                    
                    if ( data.sent ) {

                        do_submission( true );
                    }

                } else {

                    console.log( 'error', xhr );
                }
            };

            xhr.onerror = function() {
                alert( settings.xhr_error );
            };

            xhr.open( 'POST', settings.ajax );
            xhr.send( data );
       });
    }




    function do_submission( type ) {

        var form = document.querySelector( 'form' );

        var message = document.createElement( 'div' ),
            wrap    = document.createElement( 'div' ),
            heading = document.createElement( 'span' ),
            content = document.createElement( 'p' ),
            error_ref = document.createElement( 'span' ),
            closer  = document.createElement( 'button' );

        message.classList.add( 'submission' );

        // Select corresponding confirmation content
        switch ( type ) {

            case 'POST' || 'MAIL':
                var body = {
                    h: settings.error_heading,
                    c: settings.error_body
                };
                error_ref.innerHTML = `ERROR REF: ${type}`;
                break;

            default:
                var body = {
                    h: settings.success_heading,
                    c: settings.success_body
                };
        }

        heading.innerHTML = body.h;
        content.innerHTML = body.c;

        closer.innerHTML = 'Close';
        closer.setAttribute( 'id', 'close-submission' );
        closer.classList.add( 'button' );

        wrap.appendChild( heading );
        wrap.appendChild( content );
        wrap.appendChild( error_ref );
        message.appendChild( wrap );
        message.appendChild( closer );

        form.appendChild( message );

        setTimeout( function() {
            message.classList.add( 'show' );
        }, 100 );

        closer.addEventListener( 'click', function( e ) {
            e.preventDefault();
            clearTimeout( auto_clear );
            clear_submission( message, type );
        });


        let error_types = [ 'POST', 'MAIL' ],
            auto_clear_delay;

        if ( error_types.indexOf( type ) == -1 ) {
            auto_clear_delay = 8100;
        } else {
            auto_clear_delay = 30000;
        }

        var auto_clear = setTimeout( function() {

            clear_submission( message, type );

        }, auto_clear_delay ); 
    }




    function clear_submission( el, action ) {

        if ( action === true ) {

            var i;

            for ( i = 0; i < inputs.length; i++ ) {

                if ( listed.indexOf( inputs[i].type ) > 0 ||
                    inputs[i].nodeName == 'TEXTAREA' ) {

                    inputs[i].value = '';
                    inputs[i].className = '';
                    inputs[i].previousElementSibling.className = '';

                } else if ( inputs[i].type == 'checkbox' ) {
                    inputs[i].checked = false;
                }
            }
        }

        setTimeout( function() {
            el.classList.remove( 'show' );
        }, 100 );       
    }
    
})();

