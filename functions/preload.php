<?php
/**
 * Preload post thumbnail image
 */
function shiftr_preload_post_thumbnail() {
    global $post;
    /**
     * Prevent preloading for specific content types or post types
     */
    if ( ! is_singular() || is_singular( array( 'page' ) ) ) {
        return;
    }

    $image_size = 'full';
    /**
     * Adjust image size based on post type
     */
    if ( is_singular( 'post' ) ) {
        $image_size = 'large';
    }

    $thumbnail_id = apply_filters( 'shiftr_featured_image_thumbnail_id', get_post_thumbnail_id( $post->ID ) );
    /**
     * Get the image
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
add_action( 'wp_head', 'shiftr_preload_post_thumbnail' );
