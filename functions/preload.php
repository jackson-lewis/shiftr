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
    $additional_attr_array = array();
    $additional_attr = '';

    if ( $image ) {
        list( $src, $width, $height ) = $image;

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
                $additional_attr_array['imagesrcset'] = $srcset;

                if ( empty( $attr['sizes'] ) ) {
                    $additional_attr_array['imagesizes'] = $sizes;
                }
            }
        }

        foreach ( $additional_attr_array as $name => $value ) {
            $additional_attr .= "$name=" . '"' . $value . '" ';
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
    printf( '<link rel="preload" as="image" href="%s" %s/>', esc_url( $src ), $additional_attr );
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
