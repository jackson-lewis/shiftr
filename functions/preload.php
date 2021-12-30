<?php
/**
 * Preload post thumbnail image
 */
function shiftr_preload_post_thumbnail() {
    global $post;
    /**
     * Prevent preloading for specific content types or post types
     * 
     * Defaults to true becuase preload must be on an opt-in basis.
     */
    if ( apply_filters( 'shiftr_preload_post_thumbnail_early_exit', true, $post ) ) {
        return;
    }
    /**
     * Set the size of the image
     */
    $image_size = apply_filters( 'shiftr_preload_post_thumbnail_size', 'large', get_post_thumbnail_id( $post->ID ) );
    /**
     * Set the attachment ID that should be used
     */
    $thumbnail_id = apply_filters( 'shiftr_preload_post_thumbnail_id', get_post_thumbnail_id( $post->ID ) );
    /**
     * Get the image, we should have everything we need now.
     */
    $image = wp_get_attachment_image_src( $thumbnail_id, $image_size );
    $src = '';
    $attr = array();
    $attr_string = '';

    $attachment = get_post( $thumbnail_id );

    if ( $image ) {
        list( $src, $width, $height ) = $image;

        $attr['src'] = $src;

        /**
         * The following code which generates the srcset is plucked straight
         * out of wp_get_attachment_image() for consistency as it's important
         * that the output matches otherwise the preloading could become ineffective.
         */
        $image_meta = wp_get_attachment_metadata( $thumbnail_id );
 
        if ( is_array( $image_meta ) ) {
            $size_array = array( absint( $width ), absint( $height ) );
            $srcset     = wp_calculate_image_srcset( $size_array, $src, $image_meta, $thumbnail_id );
            $sizes      = wp_calculate_image_sizes( $size_array, $src, $image_meta, $thumbnail_id );

            if ( $srcset && ( $sizes || ! empty( $attr['sizes'] ) ) ) {
                $attr['srcset'] = $srcset;

                if ( empty( $attr['sizes'] ) ) {
                    $attr['sizes'] = $sizes;
                }
            }
        }
        /**
         * Same filter applied in wp_get_attachment_image().
         * 
         * This should allow plugins that manipulate an images attributes to also take affect here.
         */
        $attr = apply_filters( 'wp_get_attachment_image_attributes', $attr, $attachment, $image_size );
        /**
         * Process all the necessary formatting to prepare for generating attributes string
         */
        $attr = array_intersect_key( $attr, array_flip( array( 'src', 'srcset', 'sizes' ) ) );
	    $attr = array_map( 'esc_attr', $attr );

        $src = $attr['src'];
        unset( $attr['src'] );

        foreach ( $attr as $name => $value ) {
            $attr_string .= "image{$name}=" . '"' . $value . '" ';
        }

    } else {
        /**
         * Early exit if no thumbnail set
         */
        return;
    }

    /**
     * Output the link HTML tag
     */
    printf( '<link rel="preload" as="image" href="%s" %s/>', $src, $attr_string );
}
add_action( 'wp_head', 'shiftr_preload_post_thumbnail', 1 );


/**
 * Return true if the function should not run.
 * 
 * @param bool $exit Defaults to true
 */
add_filter( 'shiftr_preload_post_thumbnail_early_exit', function( $exit ) {

    if ( is_singular( array( 'post' ) ) ) {
        return false;
    }

    if ( is_singular( array( 'page' ) ) && get_page_template_slug() == 'templates/flexi-blocks-builder.php' ) {
        return false;
    }

    return true;
});

/**
 * Filter the size of the image that should be preloaded.
 * 
 * @param string $size `large` by default
 */
add_filter( 'shiftr_preload_post_thumbnail_size', function( $size ) {

    if ( is_singular( 'post' ) ) {
        $size = 'large';
    }

    if ( is_singular( array( 'page' ) ) && get_page_template_slug() == 'templates/flexi-blocks-builder.php' ) {
        $size = 'full';
    }

    return $size;
});

/**
 * Filter the size of the image that should be preloaded.
 * 
 * @param integer $id Post thumbnail ID
 */
add_filter( 'shiftr_preload_post_thumbnail_id', function( $id ) {

    return $id;
});
