/**
 * Control the behaviour of the site header. This includes 
 * the hamburger menu and dropdown menus. It would also be where 
 * to handle a search bar should one exist.
 */
import { Layout, vh } from '../inc/global'


const { header, body } = Layout; // Semi-colon here forces Layout to not be a function...


( () => {
    const mobileMenuTrigger  = document.querySelector( '#mobile-menu-trigger' ),
          mobileMenuClose    = document.querySelector( '#mobile-menu-close' ),
          mobileMenu         = document.querySelector( '.mobile-menu' ),
          mobileMenuSubMenus = mobileMenu?.querySelectorAll( 'li.has-sub-menu' ) || [],
          menu               = document.querySelector( 'header.site-header nav.nav-primary' ),
          menuSubMenus       = menu?.querySelectorAll( 'li.has-sub-menu' ) || [],
          headerWrapper      = header.parentElement


    /**
     * Sticky peek-a-boo header
     */
    let previousScroll = 0
    function displayStickyHeader() {
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop
        const threshold = vh() / 4

        /** Sticky header can only be available after the threshold */
        if ( scrollPos >= threshold ) {
            header.classList.add( 'pre-set-sticky' )

            setTimeout( () => {
                header.classList.add( 'set-sticky' )
            }, 50 )

            /** Catch scroll up */
            if ( scrollPos < previousScroll ) {
                
                /** Match scroll up against a threshold that must be reached */
                if ( previousScroll > scrollPos + 60 ) {
                    header.classList.add( 'is-visible' )
                    body.classList.add( 'header-state-active' )
                } else {
                    return
                }

            } else {
                header.classList.remove( 'is-visible' )
                body.classList.remove( 'header-state-active' )
            }

        } else if ( scrollPos > previousScroll || scrollPos <= 0 ) {
            header.classList.remove( 'pre-set-sticky', 'set-sticky', 'is-visible' )
            body.classList.remove( 'header-state-active' )
        }

        previousScroll = scrollPos
    }
    window.addEventListener( 'scroll', displayStickyHeader, { passive: true } )


    /**
     * Mobile menu
     */
    mobileMenu.addEventListener( 'click', e => e.stopPropagation() )

    function openMobileMenu( event ) {
        event.stopPropagation()

        mobileMenu.setAttribute( 'aria-hidden', false )
        headerWrapper.classList.add( 'mobile-menu-active' )
        body.classList.add( 'no-scroll', 'overlay-active' )

        setTimeout( () => {
            window.addEventListener( 'click', closeMobileMenu )
        }, 200 )
    }
    mobileMenuTrigger.addEventListener( 'click', openMobileMenu )

    function closeMobileMenu( event ) {
        event.preventDefault()

        mobileMenu.setAttribute( 'aria-hidden', true )
        headerWrapper.classList.remove( 'mobile-menu-active' )
        body.classList.remove( 'no-scroll', 'overlay-active' )

        setTimeout( () => {
            window.removeEventListener( 'click', closeMobileMenu )
        }, 200 )
    }
    mobileMenuClose.addEventListener( 'click', closeMobileMenu )


    /**
     * Sub menu event handling
     */
    menu?.classList.add( menuSubMenus.length <= 0 ? 'has-no-sub-menus' : 'has-sub-menus' )
    mobileMenu.querySelector( 'nav' )?.classList.add( mobileMenuSubMenus.length <= 0 ? 'has-no-sub-menus' : 'has-sub-menus' )
    const displayClass = 'is-visible'

    // Primary sub-menus
    menuSubMenus.forEach( ({ children, classList }) => {
        const link = children[0],
              subMenuEl = children[1]

        let removeOpen

        link.addEventListener( 'mouseover', event => {
            event.preventDefault()

            clearTimeout( removeOpen )

            if ( classList.contains( displayClass ) !== true ) {
                classList.add( displayClass )
            }
        })

        link.addEventListener( 'mouseleave', () => {
            removeOpen = setTimeout( () => {
                classList.remove( displayClass )
            }, 200 )
        })

        subMenuEl.addEventListener( 'mouseover', () => {
            clearTimeout( removeOpen )
        })

        subMenuEl.addEventListener( 'mouseleave', () => {
            removeOpen = setTimeout( () => {
                classList.remove( displayClass )
            }, 200 )
        })
    })

    // Mobile sub-menus
    mobileMenuSubMenus.forEach( subMenu => {
        const toggle = subMenu.children[1]

        toggle.addEventListener( 'click', event => {
            event.preventDefault()
            subMenu.classList.toggle( displayClass )
        })
    })


    /**
     * Dynamically size SVG site logo
     */
    function resetSvgSiteLogo() {
        const logo = document.querySelector( '.site-logo' )

        if ( ! logo ) return
        let svg = logo.children[0]

        let viewbox = svg.getAttribute( 'viewBox' ),
            values  = viewbox.split( ' ' ),
            width   = logo.offsetHeight * ( values[2] / values[3] )

        svg.style.width = `${ width }px`
    }
    resetSvgSiteLogo()
    window.addEventListener( 'resize', resetSvgSiteLogo )
    window.addEventListener( 'orientationchange', resetSvgSiteLogo )

})();
