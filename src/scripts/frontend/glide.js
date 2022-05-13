import Glide, { Controls } from '@glidejs/glide/dist/glide.modular.esm'

/**
 * Image Gallery Flexi Block
 */
( () => {
    const blocks = document.querySelectorAll( '.block--gallery' )

    if ( !blocks ) {
        return
    }

    function initGallery( block ) {
        const glideEl = block.querySelector( '.glide' )
        const infiniteLoop = glideEl.dataset.infiniteLoop === 'true'

        const glide = new Glide( block.querySelector( '.glide' ), {
            type: 'carousel'
        })

        glide.mount({ Controls })

        if ( !infiniteLoop ) {
            glide.on( 'move.after', () => {
                glideEl.querySelector( '.glide__arrow--left' ).disabled = glide.index === 0
                glideEl.querySelector( '.glide__arrow--right' ).disabled = glide.index === glideEl.querySelectorAll( '.glide__slide:not(.glide__slide--clone)' )?.length - 1
            })
        }
    }
    blocks.forEach( initGallery )
})();
