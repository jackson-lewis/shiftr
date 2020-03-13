<?php

/*  
    ////  --|    Built-in Shiftr filters
    
*/


function shiftr_builtin_filter_thumbnail_placeholder( $id, $post ) {

  $post_type = $post->post_type;

  if ( ! $id ) {
      
      if ( get_field( "thumbnail_placeholder_{$post_type}", 'option' ) ) {
          $id = get_field( "thumbnail_placeholder_{$post_type}", 'option' );

      } elseif ( get_field( "thumbnail_placeholder", 'option' ) ) {
          $id = get_field( "thumbnail_placeholder", 'option' );

      } else {
          $id = false;
      }
  }

  return $id;
}

add_filter( 'shiftr_featured_image_thumbnail_id', 'shiftr_builtin_filter_thumbnail_placeholder', 10, 2 );
