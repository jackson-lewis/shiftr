

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
        showMarkers: true,
        pauseOnMarkerHover: true,
        showArrows: false
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
    let stageMap;
    if ( showMarkers() ) {
        stageMap = document.createElement( 'div' );
        stageMap.classList.add( 'stage-map' );

        carousel.appendChild( stageMap );
    }
    

    // The pause variable
    var pauseLoop = false,
        transitionInProgress = false,

        highestPropHeight = 0;
    

    // Init the Carousel
    for ( i = 0; i < props.length; i++ ) {

        // Main Carousel data
        props[i].dataset.shiftrCarouselProp = i;
        props[i].dataset.shiftrCarouselActive = 'false';

        // Create the markers
        if ( showMarkers() ) {
            const marker = document.createElement( 'button' ),
                  inner  = document.createElement( 'span' );

            marker.dataset.shiftrCarouselMarker = i;

            // Add marker to navigation element
            marker.appendChild( inner );
            stageMap.appendChild( marker );
        }

        // Find the highest prop
        if ( props[i].offsetHeight > highestPropHeight ) {
            highestPropHeight = props[i].offsetHeight;
        }
    }

    // Set the stage height, using the height of the highest prop
    stage.style.height = highestPropHeight + 'px';

    // Assign markers after creation
    let markers;
    if ( showMarkers() ) {
        markers = Object.keys( stageMap.children ).map( key => {
          return stageMap.children[key];
        });
    }
    

    // Set-up first prop and marker
    props[0].classList.add( 'active' );
    props[0].dataset.shiftrCarouselActive = 'true';


    if ( showMarkers() ) {
        markers[0].classList.add( 'active' );
    }


    // Get all elements in the prop
    var images = [];
    for ( i = 0; i < props.length; i++ ) {

        images.push( [] );

        var propElements = props[i].querySelectorAll( '*' );

        propElements.forEach( el => {

            if ( el.nodeName == 'IMG' ) {
                images[i].push( el );
            }
        });
    }


    // Get the first and second prop images
    if ( images[0].length > 0 ) {
        getImages( images[0] );
    }
    
    if ( props.length > 1 ) {
        setTimeout( e => {
            getImages( images[1] );
        }, ( _.speed / 2 ) );
    }
    

    // The main loop
    const theLoop = function() {

        // Pause on hover
        if ( pauseLoop ) return false;

        // Early exit if transition is in progress
        if ( transitionInProgress ) return false;

        // Define transition start
        transitionInProgress = true;

        // Get info of active prop
        var activeProp = getActiveProp(),
            activePropID = getActivePropID( activeProp );

        // Remove active marker
        if ( showMarkers() ) {
            setTimeout( () => {
                markers[activePropID].classList.remove( 'active' );
            }, _.transition );
        }
        

        // If on the last prop
        if ( activePropID == ( props.length - 1 ) ) {

            // Set new prop
            props[0].style.zIndex = 150;
            props[0].classList.add( 'active' );
            props[0].dataset.shiftrCarouselActive = 'true';

            setTimeout( () => {
                props[0].style.zIndex = '';

                if ( showMarkers() ) {
                    markers[0].classList.add( 'active' );
                }
            }, _.transition );
            
            
            // Standard switch
        } else {

            const nextProp = activeProp.nextElementSibling,
                  nextPropID = parseInt( nextProp.dataset.shiftrCarouselProp, 10 );

            nextProp.classList.add( 'active' );
            nextProp.dataset.shiftrCarouselActive = 'true';

            setTimeout( () => {
                if ( showMarkers() ) {
                    markers[nextPropID].classList.add( 'active' );
                }
            }, _.transition );

            if ( activePropID == props.length - 2 ) {
                // All prop images should have loaded...
            } else {

                if ( images[nextPropID + 1] ) {
                    getImages( images[nextPropID + 1] );
                }
            }
        }


        // Remove active prop
        activeProp.dataset.shiftrCarouselActive = 'false';
        setTimeout( () => {
            activeProp.classList.remove( 'active' );

            // Define transition end
            transitionInProgress = false;
        }, _.transition );
    }   


    let looping,
        restart;

    if ( _.autoplay ) {
        looping = setInterval( theLoop, _.speed );
    }


    if ( showMarkers() ) {

        markers.forEach( marker => {


            marker.addEventListener( 'click', e => {
                e.preventDefault();
                
                // Early exit if transition is in progress
                if ( transitionInProgress ) {
                    pauseLoop = false;
                    return false;
                } 

                // activeProp and activePropID are corect
                let activeProp = getActiveProp(),
                    activePropID = getActivePropID( activeProp );

                // Issues with selectedProp
                let selectedProp = props[marker.dataset.shiftrCarouselMarker],
                    selectedPropID = marker.dataset.shiftrCarouselMarker;


                // Turn off pause to allow change
                pauseLoop = false;


                // Stop current actions
                if ( _.autoplay ) {
                    clearInterval( looping );
                    clearTimeout( restart );
                }

                if ( activePropID != selectedPropID ) {

                    // Define transition start
                    transitionInProgress = true;

                    
                    // Set prop
                    props[selectedPropID].style.zIndex = 150;
                    props[selectedPropID].classList.add( 'active' );
                    props[selectedPropID].dataset.shiftrCarouselActive = 'true';


                    // Continue remove
                    activeProp.dataset.shiftrCarouselActive = 'false';
                    setTimeout( () => {
                        activeProp.classList.remove( 'active' );
                        props[selectedPropID].style.zIndex = '';

                        markers[activePropID].classList.remove( 'active' );
                        markers[selectedPropID].classList.add( 'active' );

                        // Define transition end
                        transitionInProgress = false;
                    }, _.transition );

                }


                // Restart loop, if paused
                if ( _.autoplay ) {
                    restart = setTimeout( () => {
                        looping = setInterval( theLoop, _.speed );
                    }, _.speed );
                }
            });


            marker.addEventListener( 'mouseover', () => {

                let selectedProp = props[marker.dataset.shiftrCarouselMarker],
                    selectedPropID = marker.dataset.shiftrCarouselMarker;

                if ( _.pauseOnMarkerHover ) {
                    pauseLoop = true;
                }

                if ( images[selectedPropID] ) {
                    getImages( images[selectedPropID] );
                }
                
            });


            marker.addEventListener( 'mouseleave', () => {
                
                pauseLoop = false;
            });

        });
    }


    if ( showArrows() ) {

        const arrows = document.querySelectorAll( '.carousel-arrow' );
        
        arrows[0].addEventListener( 'click', e => {

            loopOnArrow( 'previous' );
        });

        arrows[1].addEventListener( 'click', e => {

            loopOnArrow( 'next' );
        });


        function loopOnArrow( direction = '' ) {

            // Early exit if transition is in progress
            if ( transitionInProgress ) {
                pauseLoop = false;
                return false;
            } 

            // activeProp and activePropID are corect
            let activeProp = getActiveProp(),
                activePropID = getActivePropID( activeProp ),
                selectedProp,
                selectedPropID;


            if ( direction == 'previous' ) {

                if ( activePropID == 0 ) {

                    var int = props.length - 1;
                    selectedProp = props[int];
                    selectedPropID = int;

                } else {
                    
                    selectedProp = props[activePropID - 1];
                    selectedPropID = activePropID - 1;
                }

            } else {

                if ( activePropID == ( props.length - 1 ) ) {

                    selectedProp = props[0];
                    selectedPropID = 0;

                } else {
                    
                    selectedProp = props[activePropID + 1];
                    selectedPropID = activePropID + 1;
                }
            }


            // Turn off pause to allow change
            pauseLoop = false;


            // Stop current actions
            if ( _.autoplay ) {
                clearInterval( looping );
                clearTimeout( restart );
            }

            if ( activePropID != selectedPropID ) {

                // Define transition start
                transitionInProgress = true;


                // Set prop
                props[selectedPropID].style.zIndex = 150;
                props[selectedPropID].classList.add( 'active' );
                props[selectedPropID].dataset.shiftrCarouselActive = 'true';


                if ( showMarkers() ) {
                    markers[activePropID].classList.remove( 'active' );
                    markers[selectedPropID].classList.add( 'active' );
                }


                // Continue remove
                activeProp.dataset.shiftrCarouselActive = 'false';
                setTimeout( () => {
                    activeProp.classList.remove( 'active' );
                    props[selectedPropID].style.zIndex = '';

                    // Define transition end
                    transitionInProgress = false;
                }, _.transition );

            }

            if ( images[selectedPropID] ) {
                getImages( images[selectedPropID] );
            }


            // Restart loop, if paused
            if ( _.autoplay ) {
                restart = setTimeout( () => {
                    looping = setInterval( theLoop, _.speed );
                }, _.speed );
            }
        }
    }


    // Get images
    function getImages( subImages ) {

        for ( i = 0; i < subImages.length; i++ ) {
            if ( subImages[i].hasAttribute( 'src' ) === false ) {
                subImages[i].src = subImages[i].dataset.src;
                subImages[i].dataset.src = '';
            }
        }
    }


    // Get data on the active prop
    function getActiveProp() {

        let theProp;
        
        for ( i = 0; i < props.length; i++ ) {
            if ( props[i].dataset.shiftrCarouselActive == 'true' ) {
                theProp = props[i];
            }
        }

        return theProp;
    }


    // Get active prop id
    function getActivePropID( theProp ) {
        return parseInt( theProp.dataset.shiftrCarouselProp, 10 );
    }


    // Toggle for markers
    function showMarkers() {
        if ( _.showMarkers ) {
            return true;
        } else {
            return false;
        }
    }


    // Toggle for arrows
    function showArrows() {
        if ( _.showArrows ) {
            return true;
        } else {
            return false;
        }
    }
}

