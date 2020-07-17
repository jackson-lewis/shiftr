<?php

/*  
    ////  --|    Built-in Shiftr filters
    
*/

/**
 * Set placeholders to featured images, either by post type or globally.
 */
function shiftr_builtin_filter_thumbnail_placeholder( $media_id ) {
    global $post;

    $post_type = get_post_type( $post->ID );

    if ( ! $media_id ) {
        
        if ( get_field( "thumbnail_placeholder_{$post_type}", 'option' ) ) {
            $media_id = get_field( "thumbnail_placeholder_{$post_type}", 'option' );

        } elseif ( get_field( "thumbnail_placeholder", 'option' ) ) {
            $media_id = get_field( "thumbnail_placeholder", 'option' );

        } else {
            $media_id = false;
        }
    }

    return $media_id;
}
add_filter( 'shiftr_featured_image_thumbnail_id', 'shiftr_builtin_filter_thumbnail_placeholder', 10, 1 );
