/**
 * Imports
 */
import { createEl } from '../inc/global'
import ShiftrComponent from '../inc/component-functions'


/**
 * Carousel component
 */
export default class Carousel extends ShiftrComponent {

    componentSlug() {
        return 'carousel'
    }

    defaultSettings() {
        return {
            startSlide: 0,
            autoplay: true,
            speed: 4000,
            showNav: true,
            interactiveNav: true,
            customMarker: null,
            showArrows: false,
            allowTouchEvents: true,
            transitionStyle: 'fade',
            lazyLoad: true
        }
    }


    /**
     * We want some extra things to happen here
     */
    constructor( ...args ) {
        super( ...args )

        /**
         * Assign the core elements of the component
         */
        this.stage = this.target.querySelector( '.carousel-stage' )
        this.slides = this.target.querySelectorAll( '.carousel-slide' )

        this.autoplay = this.settings.autoplay ? true : null
        this.slideImages = []
    }


    /**
     * Initiate the component
     */
    init() {
        /**
         * Add the transition style class, this is used for setting 
         * the styling based on the carousel type
         */
        this.target.classList.add( `transition-style--${this.settings.transitionStyle}` )

        /**
         * Define the start index slide
         */
        this.index = this.slides[ this.settings.startSlide ] ? this.settings.startSlide : 0

        /**
         * Utils
         */
        this.lastSlideIndex = this.slides.length - 1

        /**
         * Prepare all slides for a11y and index indicators
         */
        this.slides.forEach( ( slide, index ) => {
            slide.dataset.carouselIndex = index
            slide.dataset.carouselActive = 'false'
            slide.setAttribute( 'aria-hidden', true )
            slide.setAttribute( 'aria-label', `Slide ${index + 1} of ${this.slides.length}` )
            slide.id = `${this.target.id}-slide_${index + 1}`

            /**
             * Get all images that need to be lazy loaded
             */
            if ( this.settings.lazyLoad ) {
                this.slideImages.push( [] )
                const imgElements = slide.querySelectorAll( 'img' )
    
                imgElements.forEach( img => {
                    this.slideImages[index].push( img )
                })
            }
        })

        /**
         * Apply navigation if set
         */
        if ( this.settings.showNav ) {
            this.navigation()
        }

        /**
         * Prepare the first slide as current state
         */
        this.updateCurrent( this.index )

        /**
         * Init autoplay
         */
        if ( this.settings.autoplay ) {
            this.initAutoplay()
        }

        /**
         * Logic for touch events
         */
        if ( this.settings.allowTouchEvents ) {
            this.registerTouchEvents()
        }

        /**
         * Logic for arrow controls
         */
        if ( this.settings.showArrows ) {
            this.registerArrowEvents()
        }
    }


    /**
     * Setup the navigation and attach event listeners to markers
     */
    navigation() {
        /**
         * Create navigation wrapper and add to Carousel component
         */
        this.nav = createEl( 'div' )
        this.nav.classList.add( 'carousel-nav' )
        this.target.appendChild( this.nav )

        /**
         * Stores all the slide markers in the navigation
         */
        this.navMarkers = []

        /**
         * Loop all slides and create a marker for each
         */
        this.slides.forEach( ( slide, index ) => {
            var marker, inner

            if ( typeof this.settings.customMarker === 'function' ) {

                marker = this.settings.customMarker( index, slide )
            } else {

                marker = createEl( 'button' )
                inner = createEl( 'span' )
                marker.appendChild( inner )
            }

            marker.dataset.carouselMarker = index
            marker.setAttribute( 'aria-controls', `${this.target.id}-slide_${index + 1}` )
            marker.setAttribute( 'aria-label', `Slide ${index + 1}` )
            marker.id = `${this.target.id}-marker_${index + 1}`

            /**
             * Handle interactivity of the marker
             */
            if ( this.settings.interactiveNav ) {
                marker.addEventListener( 'click', () => this.move( index, true ) )
            } else {
                marker.disabled = true
            }

            if ( index == this.index ) {
                marker.classList.add( 'active' )
            }

            /** Add marker to navMarkers array */
            this.navMarkers.push( marker )

            /** Add marker to Carousel navigation */
            this.nav.appendChild( marker )
        })
    }


    /**
     * Move to a new slide
     * 
     * @param {integer} index The slide index to move to
     * @param {object|bool} event The event or false
     */
    move( index = 0, event = false ) {
        /**
         * Bail if requested index is the current index
         */
        if ( index == this.index ) {
            return
        }

        /**
         * Pause autoplay if event is set
         */
        if ( event && this.settings.autoplay ) {
            this.pauseAutoplay()
        }

        /**
         * Update the current index
         */
        this.updateCurrent( index )

        /**
         * Resume autoplay if paused
         */
        if ( event && this.settings.autoplay ) {
            this.resumeAutoplay()
        }
    }


    /**
     * Wrapper to move to previous slide
     * 
     * @param {bool} event Whether an event happened or not
     */
    previous( event = false ) {
        this.move( this.getPreviousSlideIndex(), event )
    }


    /**
     * Wrapper to move to next slide
     * 
     * @param {bool} event Whether an event happened or not
     */
    next( event = false ) {
        this.move( this.getNextSlideIndex(), event )
    }


    /**
     * Update the current slide of the Carousel
     * 
     * @param {integer} index The new index of current
     */
    updateCurrent( index = 0 ) {
        /**
         * Remove state on current slide index
         */
        if ( this.current ) {
            this.current.classList.remove( 'active' ); 
            this.current.dataset.carouselActive = 'false'
            this.current.setAttribute( 'aria-hidden', true )
    
            if ( this.settings.showNav ) {
                this.navMarkers[this.index].classList.remove( 'active' )
            }

            this.previousSlide.classList.remove( 'prev' )
            this.nextSlide.classList.remove( 'next' )
        }

        /**
         * Update the current index
         */
        this.index = index
        this.current = this.slides[this.index]
        this.previousSlide = this.slides[this.getPreviousSlideIndex()]
        this.nextSlide = this.slides[this.getNextSlideIndex()]

        /**
         * Set state on updated slide index
         */
        this.current.classList.add( 'active' )
        this.current.dataset.carouselActive = 'true'
        this.current.setAttribute( 'aria-hidden', false )

        if ( this.settings.showNav ) {
            this.navMarkers[this.index].classList.add( 'active' )
        }

        this.previousSlide.classList.add( 'prev' )
        this.nextSlide.classList.add( 'next' )

        this.loadSlideImages( this.getPreviousSlideIndex() )
        this.loadSlideImages( this.getNextSlideIndex() )
    }


    /**
     * Initiate the autoplay
     */
    initAutoplay() {
        this.autplay = setInterval( this.next.bind( this ), this.settings.speed )
    }


    /**
     * Pause the autoplay
     */
    pauseAutoplay() {
        clearInterval( this.autoplay )
    }


    /**
     * Resume the autoplay
     */
    resumeAutoplay() {
        this.initAutoplay()
    }


    /**
     * Get the index of the next slide relative to `this.index`
     * 
     * @return {integer} The index of the next slide
     */
    getNextSlideIndex() {
        return this.index == this.lastSlideIndex ? 0 : this.index + 1
    }


    /**
     * Get the index of the previous slide relative to `this.index`
     * 
     * @return {integer} The index of the previous slide
     */
    getPreviousSlideIndex() {
        return this.index == 0 ? this.lastSlideIndex : this.index - 1
    }


    /**
     * Load the images of a target slide
     * 
     * @param {integer} index The slide index to load images of
     */
    loadSlideImages( index = 0 ) {
        /**
         * Sanity check lazy loading is enabled
         */
        if ( ! this.settings.lazyLoad ) {
            return
        }

        /** Get the array of slide images */
        var slideImages = this.slideImages[index]

        /** Check images are actually there */
        if ( slideImages.length == 0 ) {
            return
        }

        slideImages.forEach( image => {

            if ( ! image.src ) {
                image.src = image.dataset.src 
                delete image.dataset.src

                if ( image.dataset.srcset ) {
                    image.srcset = image.dataset.srcset 
                    delete image.dataset.srcset
                }

                if ( image.dataset.sizes ) {
                    image.sizes = image.dataset.sizes 
                    delete image.dataset.sizes
                }
            }
        })

        /** Empty the array so we don't try to loop the images again */
        this.slideImages[index] = []
    }


    /**
     * Touch start event handling
     */
    touchStart( e ) {
        this.touchDownX = e.touches[0].clientX
        this.touchDownY = e.touches[0].clientY
    }


    /**
     * Touch move event handling
     */
    touchMove( e ) {
        this.touchMoveX = this.touchDownX - e.touches[0].clientX
        this.touchMoveY = this.touchDownY - e.touches[0].clientY
    }


    /**
     * Touch end event handling
     */
    touchEnd() {
        if ( this.touchMoveX <= -50 || this.touchMoveX >= 50 ) {

            if ( this.touchMoveX > 0 ) {
                this.next( true )
            } else {
                this.previous( true )
            }
        }
    }


    /**
     * Register event listeners to touch events
     */
    registerTouchEvents() {
        this.touchDownX = 0
        this.touchDownY = 0
        this.touchMoveX = 0
        this.touchMoveY = 0

        this.stage.addEventListener( 'touchstart', this.touchStart.bind( this ) )
        this.stage.addEventListener( 'touchmove', this.touchMove.bind( this ) )
        this.stage.addEventListener( 'touchend', this.touchEnd.bind( this ) )
    }


    /**
     * Register event listeners to arrow button controls
     */
    registerArrowEvents() {
        this.previousArrow = this.target.querySelector( '#shiftr-carousel--previous' )
        this.nextArrow = this.target.querySelector( '#shiftr-carousel--next' )

        if ( this.previousArrow ) {
            this.previousArrow.addEventListener( 'click', () => this.previous( true ) )
        }

        if ( this.nextArrow ) {
            this.nextArrow.addEventListener( 'click', () => this.next( true ) )
        }
    }
}
