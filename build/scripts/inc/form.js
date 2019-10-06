

/*  ////  --|    Element.prototype.form( settings = {} )

    * Shiftr Form Handler
*/

Element.prototype.form = function( settings = {} ) {

    // The default settings
    let defaults = {
        states: true,
        validate: true,
        submission: true,
        targets: ['name', 'text', 'email', 'tel', 'date', 'password'],
        validation_classes: {
            focus: 'field-event--focus',
            success: 'field-event--success',
            error: 'field-event--error'
        },
        settings: shiftr.form
    };


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // Override the defaults with any defined settings
    let _ = Object.assign( defaults, settings );


    // The main carousel elements
    let form    = this,
        inputs  = form.querySelectorAll( 'input, textarea' ),
        selects = form.querySelectorAll( 'select' ),
        submit  = form.querySelector( 'input[type="submit"]' ) || this,

        vc      = _.validation_classes;

    // Checker var for requesting form styleshet
    var css_requested = false;


    // Loop all inputs
    inputs.forEach( input => {

        if ( _.targets.indexOf( input.type ) >= 0 ||
            input.nodeName == 'TEXTAREA' ) {

            // Apply all classes to field wrapper element
            const target = input.parentElement;

            input.addEventListener( 'focus', e => {

                get_stylesheet();

                target.classList.add( vc.focus );
            });

            input.addEventListener( 'blur', e => {

                target.classList.remove( vc.focus );
                target.classList.remove( vc.success );
                target.classList.remove( vc.error );

                if ( _.validate && input.value != '' ) {

                    if ( input.checkValidity() ) {
                        target.classList.add( vc.success );
                        clear_validation( input );

                    } else  { target.classList.add( vc.error ); }
                }
            });


            if ( _.validate ) {

                input.addEventListener( 'invalid', e => {
                    e.preventDefault();

                    target.classList.add( vc.error );

                    do_validation( input, input.validationMessage );
                });
            }
            

        } else if ( input.type == 'checkbox' || input.type == 'radio' ) {

            if ( _.validate ) {

                input.addEventListener( 'change', e => {

                    if ( input.checked ) {
                        clear_validation( input );
                    }
                });

                input.addEventListener( 'invalid', e => {
                    e.preventDefault();

                    do_validation( input, input.validationMessage );
                });
            }

            
        }
    });


    selects.forEach( select => {

        select.addEventListener( 'change', e => {
            select.parentElement.classList.add( vc.success );
        });
    });


    // Construct validation notification
    function do_validation( input, message ) {

        const m = createEl( 'span' );

        m.classList.add( 'validation' );
        m.innerHTML = message;
        input.parentElement.appendChild( m );

        setTimeout( () => {
            m.classList.add( 'pop' );
        }, 200 );

        setTimeout( () => {
            clear_validation( input );
        }, 6000 );
    }


    // Remove validation notification
    function clear_validation( input ) {

        let notification = input.parentElement.querySelector( 'span.validation' );
        
        if ( notification ) {

            notification.classList.remove( 'pop' );

            setTimeout( () => {
                input.parentElement.removeChild( notification );
            }, 400 );
        }
    }


    let submit_hover = e => {
        get_stylesheet();
    };

    submit.addEventListener( 'mouseover', submit_hover );


    if ( _.submission ) {

        form.addEventListener( 'submit', e => {
            e.preventDefault();

            form.classList.add( 'send-in-progress' );

            let data = new FormData( form ),
                xhr = new XMLHttpRequest();
        
            xhr.onload = () => {

                if ( xhr.status >= 200 && xhr.status < 400 ) {

                    form.classList.remove( 'send-in-progress' );
                    
                    do_message( xhr.responseText );

                } else {

                    do_message( 'XHR_ERROR', xhr.status );
                }
            };

            xhr.onerror = () => {
                do_message( 'XHR_ERROR', xhr );
            };

            xhr.open( 'POST', shiftr.ajax );
            xhr.send( data );
        });


        function do_message( response = '', data = null ) {

            var message     = createEl( 'div' ),
                wrap        = createEl( 'div' ),
                heading     = createEl( 'span' ),
                content     = createEl( 'p' ),
                error_ref   = createEl( 'span' ),
                closer      = createEl( 'button' );

            message.classList.add( 'form-submission' );

            // Select corresponding confirmation content
            switch ( response ) {

                // '1' equals true. 
                case '1':
                    var body = {
                        h: _.settings.success_heading,
                        c: _.settings.success_body
                    };
                    break;

                default:
                    var body = {
                        h: _.settings.error_heading,
                        c: _.settings.error_body
                    };
                    error_ref.innerHTML = `ERROR REF: ${response}`;
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

            setTimeout( () => {
                message.classList.add( 'show' );
            }, 100 );

            closer.addEventListener( 'click', e => {
                e.preventDefault();
                clearTimeout( auto_clear );
                clear_message( message, response );
            });


            let auto_clear_delay;

            if ( response == '1' ) {
                auto_clear_delay = 8100;
            } else {
                auto_clear_delay = 30000;
            }

            var auto_clear = setTimeout( () => {

                clear_message( message, response );

            }, auto_clear_delay ); 
        }


        function clear_message( el, action ) {

            if ( action == '1' ) {

                // Empty all fields of values
                for ( var i = 0; i < inputs.length; i++ ) {

                    if ( _.targets.indexOf( inputs[i].type ) > 0 ||
                        inputs[i].nodeName == 'TEXTAREA' ) {

                        inputs[i].value = '';
                        inputs[i].parentElement.classList.remove( vc.success );
                        inputs[i].parentElement.classList.remove( vc.error );

                    } else if ( inputs[i].type == 'checkbox' || inputs[i].type == 'radio' ) {
                        inputs[i].checked = false;
                    }
                }
            }

            setTimeout( () => {
                el.classList.remove( 'show' );
            }, 100 );       
        }
    }

    function get_stylesheet() {

        if ( ! css_requested ) {

            let stylesheet = createEl( 'link' );
            stylesheet.setAttribute( 'rel', 'stylesheet' );
            stylesheet.setAttribute( 'href', `${shiftr.theme}/assets/styles/form.css` );
            stylesheet.setAttribute( 'type', 'text/css' );
            head.appendChild( stylesheet );


            css_requested = true;
        }

        submit.removeEventListener( 'mouseover', submit_hover );
    }
}

