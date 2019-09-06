

/*  ////  --|    Element.prototype.carousel( settings = Object )

    @since 1.0

    @polyfills: Object.assign
*/

Element.prototype.carousel = function( settings = {} ) {

    // The default settings
    let defaults = {
        autoplay: true,
        speed: 4000,
        transition: 800,
        show_markers: true,
        pause_on_marker_hover: true,
        show_arrows: false
    };

    var i = 0;


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // Override the defaults with any defined settings
    let _ = Object.assign( defaults, settings );


    // The main carousel elements
    let carousel  = this,
        stage     = this.children[0],
        props     = this.children[0].children;


    if ( props.length == 0 ) return;


    // Create the navigation
    let stage_map;
    if ( show_markers() ) {
        stage_map = document.createElement( 'div' );
        stage_map.classList.add( 'stage-map' );

        carousel.appendChild( stage_map );
    }
    

    // The pause variable
    var pause_loop = false,
        transition_in_progress = false,

        highest_prop_height = 0;
    

    // Init the Carousel
    for ( i = 0; i < props.length; i++ ) {

        // Main Carousel data
        props[i].dataset.shiftrCarouselProp = i;
        props[i].dataset.shiftrCarouselActive = 'false';

        // Create the markers
        if ( show_markers() ) {
            const marker = document.createElement( 'button' ),
                  inner  = document.createElement( 'span' );

            marker.dataset.shiftrCarouselMarker = i;

            // Add marker to navigation element
            marker.appendChild( inner );
            stage_map.appendChild( marker );
        }

        // Find the highest prop
        if ( props[i].offsetHeight > highest_prop_height ) {
            highest_prop_height = props[i].offsetHeight;
        }
    }

    // Set the stage height, using the height of the highest prop
    stage.style.height = highest_prop_height + 'px';

    // Assign markers after creation
    let markers;
    if ( show_markers() ) {
        markers = Object.keys( stage_map.children ).map( key => {
          return stage_map.children[key];
        });
    }
    

    // Set-up first prop and marker
    props[0].classList.add( 'active' );
    props[0].dataset.shiftrCarouselActive = 'true';


    if ( show_markers() ) {
        markers[0].classList.add( 'active' );
    }


    // Get all elements in the prop
    var images = [];
    for ( i = 0; i < props.length; i++ ) {

        images.push( [] );

        var prop_elements = props[i].querySelectorAll( '*' );

        prop_elements.forEach( el => {

            if ( el.nodeName == 'IMG' ) {
                images[i].push( el );
            }
        });
    }


    // Get the first and second prop images
    if ( images[0].length > 0 ) {
        get_images( images[0] );
    }
    
    if ( props.length > 1 ) {
        setTimeout( e => {
            get_images( images[1] );
        }, ( _.speed / 2 ) );
    }
    

    // The main loop
    const the_loop = function() {

        // Pause on hover
        if ( pause_loop ) return false;

        // Early exit if transition is in progress
        if ( transition_in_progress ) return false;

        // Define transition start
        transition_in_progress = true;

        // Get info of active prop
        var active_prop = get_active_prop(),
            active_prop_id = get_active_prop_id( active_prop );

        // Remove active marker
        if ( show_markers() ) {
            setTimeout( () => {
                markers[active_prop_id].classList.remove( 'active' );
            }, _.transition );
        }
        

        // If on the last prop
        if ( active_prop_id == ( props.length - 1 ) ) {

            // Set new prop
            props[0].style.zIndex = 150;
            props[0].classList.add( 'active' );
            props[0].dataset.shiftrCarouselActive = 'true';

            setTimeout( () => {
                props[0].style.zIndex = '';

                if ( show_markers() ) {
                    markers[0].classList.add( 'active' );
                }
            }, _.transition );
            
            
            // Standard switch
        } else {

            const next_prop = active_prop.nextElementSibling,
                  next_prop_id = parseInt( next_prop.dataset.shiftrCarouselProp, 10 );

            next_prop.classList.add( 'active' );
            next_prop.dataset.shiftrCarouselActive = 'true';

            setTimeout( () => {
                if ( show_markers() ) {
                    markers[next_prop_id].classList.add( 'active' );
                }
            }, _.transition );

            if ( active_prop_id == props.length - 2 ) {
                // All prop images should have loaded...
            } else {

                if ( images[next_prop_id + 1] ) {
                    get_images( images[next_prop_id + 1] );
                }
            }
        }


        // Remove active prop
        active_prop.dataset.shiftrCarouselActive = 'false';
        setTimeout( () => {
            active_prop.classList.remove( 'active' );

            // Define transition end
            transition_in_progress = false;
        }, _.transition );
    }   


    let looping,
        restart;

    if ( _.autoplay ) {
        looping = setInterval( the_loop, _.speed );
    }


    if ( show_markers() ) {

        markers.forEach( marker => {


            marker.addEventListener( 'click', e => {
                e.preventDefault();
                
                // Early exit if transition is in progress
                if ( transition_in_progress ) {
                    pause_loop = false;
                    return false;
                } 

                // active_prop and active_prop_id are corect
                let active_prop = get_active_prop(),
                    active_prop_id = get_active_prop_id( active_prop );

                // Issues with selected_prop
                let selected_prop = props[marker.dataset.shiftrCarouselMarker],
                    selected_prop_id = marker.dataset.shiftrCarouselMarker;


                // Turn off pause to allow change
                pause_loop = false;


                // Stop current actions
                if ( _.autoplay ) {
                    clearInterval( looping );
                    clearTimeout( restart );
                }

                if ( active_prop_id != selected_prop_id ) {

                    // Define transition start
                    transition_in_progress = true;

                    
                    // Set prop
                    props[selected_prop_id].style.zIndex = 150;
                    props[selected_prop_id].classList.add( 'active' );
                    props[selected_prop_id].dataset.shiftrCarouselActive = 'true';


                    // Continue remove
                    active_prop.dataset.shiftrCarouselActive = 'false';
                    setTimeout( () => {
                        active_prop.classList.remove( 'active' );
                        props[selected_prop_id].style.zIndex = '';

                        markers[active_prop_id].classList.remove( 'active' );
                        markers[selected_prop_id].classList.add( 'active' );

                        // Define transition end
                        transition_in_progress = false;
                    }, _.transition );

                }


                // Restart loop, if paused
                if ( _.autoplay ) {
                    restart = setTimeout( () => {
                        looping = setInterval( the_loop, _.speed );
                    }, _.speed );
                }
            });


            marker.addEventListener( 'mouseover', () => {

                let selected_prop = props[marker.dataset.shiftrCarouselMarker],
                    selected_prop_id = marker.dataset.shiftrCarouselMarker;

                if ( _.pause_on_marker_hover ) {
                    pause_loop = true;
                }

                if ( images[selected_prop_id] ) {
                    get_images( images[selected_prop_id] );
                }
                
            });


            marker.addEventListener( 'mouseleave', () => {
                
                pause_loop = false;
            });

        });
    }


    if ( show_arrows() ) {

        const arrows = document.querySelectorAll( '.carousel-arrow' );
        
        arrows[0].addEventListener( 'click', e => {

            loop_on_arrow( 'previous' );
        });

        arrows[1].addEventListener( 'click', e => {

            loop_on_arrow( 'next' );
        });


        function loop_on_arrow( direction = '' ) {

            // Early exit if transition is in progress
            if ( transition_in_progress ) {
                pause_loop = false;
                return false;
            } 

            // active_prop and active_prop_id are corect
            let active_prop = get_active_prop(),
                active_prop_id = get_active_prop_id( active_prop ),
                selected_prop,
                selected_prop_id;


            if ( direction == 'previous' ) {

                if ( active_prop_id == 0 ) {

                    var int = props.length - 1;
                    selected_prop = props[int];
                    selected_prop_id = int;

                } else {
                    
                    selected_prop = props[active_prop_id - 1];
                    selected_prop_id = active_prop_id - 1;
                }

            } else {

                if ( active_prop_id == ( props.length - 1 ) ) {

                    selected_prop = props[0];
                    selected_prop_id = 0;

                } else {
                    
                    selected_prop = props[active_prop_id + 1];
                    selected_prop_id = active_prop_id + 1;
                }
            }


            // Turn off pause to allow change
            pause_loop = false;


            // Stop current actions
            if ( _.autoplay ) {
                clearInterval( looping );
                clearTimeout( restart );
            }

            if ( active_prop_id != selected_prop_id ) {

                // Define transition start
                transition_in_progress = true;


                // Set prop
                props[selected_prop_id].style.zIndex = 150;
                props[selected_prop_id].classList.add( 'active' );
                props[selected_prop_id].dataset.shiftrCarouselActive = 'true';


                if ( show_markers() ) {
                    markers[active_prop_id].classList.remove( 'active' );
                    markers[selected_prop_id].classList.add( 'active' );
                }


                // Continue remove
                active_prop.dataset.shiftrCarouselActive = 'false';
                setTimeout( () => {
                    active_prop.classList.remove( 'active' );
                    props[selected_prop_id].style.zIndex = '';

                    // Define transition end
                    transition_in_progress = false;
                }, _.transition );

            }

            if ( images[selected_prop_id] ) {
                get_images( images[selected_prop_id] );
            }


            // Restart loop, if paused
            if ( _.autoplay ) {
                restart = setTimeout( () => {
                    looping = setInterval( the_loop, _.speed );
                }, _.speed );
            }
        }
    }


    // Get images
    function get_images( sub_images ) {

        for ( i = 0; i < sub_images.length; i++ ) {
            if ( sub_images[i].hasAttribute( 'src' ) === false ) {
                sub_images[i].src = sub_images[i].dataset.src;
                sub_images[i].dataset.src = '';
            }
        }
    }


    // Get data on the active prop
    function get_active_prop() {

        let the_prop;
        
        for ( i = 0; i < props.length; i++ ) {
            if ( props[i].dataset.shiftrCarouselActive == 'true' ) {
                the_prop = props[i];
            }
        }

        return the_prop;
    }


    // Get active prop id
    function get_active_prop_id( the_prop ) {
        return parseInt( the_prop.dataset.shiftrCarouselProp, 10 );
    }


    // Toggle for markers
    function show_markers() {
        if ( _.show_markers ) {
            return true;
        } else {
            return false;
        }
    }


    // Toggle for arrows
    function show_arrows() {
        if ( _.show_arrows ) {
            return true;
        } else {
            return false;
        }
    }
}

