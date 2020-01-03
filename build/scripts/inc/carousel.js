

/*  ////  --|    Element.prototype.carousel( settings = Object )

    @since 1.0
    @version 1.0

    @polyfills: Object.assign
*/

Element.prototype.carousel = function( settings = {} ) {

    // The default settings
    let defaults = {
    	startSlide: 0,
        autoplay: true,
        speed: 4000,
        showNav: false,
        interactiveNav: true,
        customMarker: null,
        showArrows: true,
        arrowPrevTarget: '',
        arrowNextTarget: '',
        allowTouchEvents: true,
        infiniteLoop: true,
        transitionStyle: 'fade',
        lazyLoad: true
    };


    // Assign settings as defaults if settings are not set
    if ( Object.keys( settings ).length == 0 ) settings = defaults;


    // Override the defaults with any defined settings
    let _ = parseComponentData( Object.assign( defaults, settings ), this, 'carousel' );


    // The main carousel elements
    let carousel  = this,
        stage     = this.querySelector( '.carousel-stage' ),
        items     = this.querySelectorAll( '.carousel-item' );


    // This will store the current element
    var images = [],

        current,
        prev,
        next,

        auto,
        autoPaused,

        touchDownX = 0,
        touchDownY = 0,
        movementX = 0,
        movementY = 0;


    // Assign transition style class to parent
    carousel.classList.add( `transition-style--${_.transitionStyle}` );


    // Verify there are items in the stage
    if ( items.length == 0 ) return;


    // Generate a ID for the carousel
    let carouselID = generateComponentID( this, 'carousel' );
    
    carousel.setAttribute( 'id', carouselID );

    // Init the Carousel
    let nav;
    if ( _.showNav ) {
        nav = createEl( 'div' );
        nav.classList.add( 'carousel-nav' );

        carousel.appendChild( nav );
    }


    for ( var i = 0; i < items.length; i++ ) {

        items[i].dataset.carouselIndex = i;
        items[i].dataset.carouselActive = 'false';
        items[i].setAttribute( 'aria-hidden', true );
        items[i].setAttribute( 'aria-label', `${i+1} of ${items.length}` );
        items[i].id = `${carouselID}-item_${i+1}`;

        // Assign images for lazy load
        if ( _.lazyLoad ) {
        	images.push( [] );
	        var itemElements = items[i].querySelectorAll( '*' );

	        itemElements.forEach( el => {

	            if ( el.nodeName == 'IMG' ) {
	                images[i].push( el );
	            }
	        });
        }

        if ( _.showNav ) {

            var marker, inner;

            if ( typeof _.customMarker === 'function' ) {

                marker = _.customMarker( i, items );

            } else {

                marker = createEl( 'button' );
                inner = createEl( 'span' );

                marker.appendChild( inner );
            }

            marker.dataset.carouselMarker = i;
            marker.setAttribute( 'aria-controls', `${carouselID}-item_${i+1}` );
            marker.setAttribute( 'aria-label', `Slide ${i+1}` );
            marker.id = `${carouselID}-marker_${i+1}`;

            if ( ! _.interactiveNav ) {

                marker.setAttribute( 'disabled', '' );
            }

            // Add marker to navigation element
            nav.appendChild( marker );
        }
    }


    let markers;
    if ( _.showNav ) {
        markers = Object.keys( nav.children ).map( key => {
          return nav.children[key];
        });
    }


    // Set-up our base element stores
    let setupStart = () => {

    	let startIndex = items[_.startSlide] ? _.startSlide : 0;

    	current = items[startIndex];
	    prev = items[ getSlideIndex() == 0 ? lastSlideIndex() : getSlideIndex() - 1 ];
	    next = items[ getSlideIndex() == lastSlideIndex() ? 0 : getSlideIndex() + 1 ];

	    current.classList.add( 'active' );
	    current.dataset.carouselActive = 'true';
	    current.setAttribute( 'aria-hidden', false );

	    prev.classList.add( 'prev' );
	    next.classList.add( 'next' );

	    if ( _.showNav ) {
	    	markers[startIndex].classList.add( 'active' );
	    }

        loadImages( getSlideIndex( prev ) );
        loadImages( getSlideIndex( next ) );
    }


    let moveSlidePrev = e => {

        if ( ! _.infiniteLoop && isFirstSlide() ) return;

        moveSlide( isFirstSlide() ? lastSlideIndex() : getSlideIndex() - 1, ( typeof e !== 'undefined' ) ? e : null );
    } 


    let moveSlideNext = e => {

        if ( ! _.infiniteLoop && isLastSlide() ) return;

        moveSlide( isLastSlide() ? 0 : getSlideIndex() + 1, ( typeof e !== 'undefined' ) ? e : null );
    } 
    

    let moveSlide = ( index, e ) => {

        // Pause autoplay
        if ( e !== null ) pauseAutoplay();

        // Update current
        let newCurrent = items[index];

        current.classList.remove( 'active' );  
        current.dataset.carouselActive = 'false';
        current.setAttribute( 'aria-hidden', true );

        if ( _.showNav ) {
        	markers[getSlideIndex()].classList.remove( 'active' );
        }
        

        newCurrent.classList.add( 'active' );
        newCurrent.dataset.carouselActive = 'true';  
        newCurrent.setAttribute( 'aria-hidden', false );

        if ( _.showNav ) {
        	markers[index].classList.add( 'active' );
        }
        

        current = newCurrent;

        // Update prev
        let newPrev = isFirstSlide() ? items[ lastSlideIndex() ] : items[ getSlideIndex() - 1 ],
            newNext = isLastSlide() ? items[0] : items[ getSlideIndex() + 1 ];

        prev.classList.remove( 'prev' );
        newPrev.classList.add( 'prev' );

        next.classList.remove( 'next' );
        newNext.classList.add( 'next' );

        prev = newPrev;
        next = newNext;

        loadImages( getSlideIndex( prev ) );
        loadImages( getSlideIndex( next ) );

        resumeAutoplay();
    }   


    let touchStart = e => {

        touchDownX = e.touches[0].clientX;
        touchDownY = e.touches[0].clientY;
    }


    let touchMove = e => {

        movementX = touchDownX - e.touches[0].clientX;
        movementY = touchDownY - e.touches[0].clientY;
    }


    let touchEnd = e => {

        // Prevent accidential swipes
        if ( movementX <= -50 || movementX >= 50 ) {

            return movementX > 0 ? moveSlideNext( e ) : moveSlidePrev( e );
        }
    }


    let registerEventListeners = () => {

        if ( _.showArrows ) {

            carousel
                .querySelector( _.arrowPrevTarget != '' ? _.arrowPrevTarget : '.carousel-button:first-of-type' )
                .addEventListener( 'click', moveSlidePrev );
            carousel
                .querySelector( _.arrowNextTarget != '' ? _.arrowNextTarget : '.carousel-button:last-of-type' )
                .addEventListener( 'click', moveSlideNext );
        }

        if ( _.showNav && _.interactiveNav ) {

            markers.forEach( marker => {

                marker.addEventListener( 'click', e => {

                    moveSlide( getMarkerIndex( marker ), e );
                });
            });
        }

        if ( _.allowTouchEvents ) {
            carousel.addEventListener( 'touchstart', touchStart );
            carousel.addEventListener( 'touchmove', touchMove );
            carousel.addEventListener( 'touchend', touchEnd );
        }
    }


    let autoplay = ( a = _.autoplay ) => a;
    let initAutoplay = () => {

        if ( ! autoplay() ) return;

        auto = setInterval( moveSlideNext, _.speed );
    };

    
    function pauseAutoplay() {

        if ( ! autoplay() ) return;

        autoPaused = true;
        clearInterval( auto );
    }


    function resumeAutoplay() {

        if ( ! autoplay() ) return;

        if ( autoPaused ) initAutoplay();
        autoPaused = false;
    }


    function loadImages( index ) {

    	if ( ! _.lazyLoad ) return;

    	var slideImages = images[index];

    	for ( var i = 0; i < slideImages.length; i++ ) {

    		var img = slideImages[i];

    		if ( img.src == '' ) {
    			img.src = img.dataset.src;
    			img.setAttribute( 'srcset', img.dataset.srcset );
    		}
    	}
    }


    // The super sexy utility functions
    let getMarkerIndex  = m => parseInt( m.dataset.carouselMarker, 10 );
    let lastSlideIndex  = () => items.length - 1;
    let getSlideIndex   = ( s = current ) => parseInt( s.dataset.carouselIndex, 10 );
    let isFirstSlide    = ( s = current ) => getSlideIndex( s ) == 0;
    let isLastSlide     = ( s = current ) => getSlideIndex( s ) == lastSlideIndex();
    

    // Start the magic
    let init = () => {

    	setupStart();
    	registerEventListeners();
    	initAutoplay();
    }

    init();
}

