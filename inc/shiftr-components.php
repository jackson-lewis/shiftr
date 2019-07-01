<?php


/**  
 *  shiftr_gallery
 *
 *  Output a basic gallery component 
 *
 *  @since 1.0
 *
 *	@global $post Get post ID
 *	@param $gallery_name str The gallery field name of the ACF field
 *	@param $id null|int The post ID
 *	@return Output of HTML
 */

function shiftr_gallery( $gallery_name = 'gallery', $id = null ) {

	global $post;

	// Get Post ID
	if ( $id === null ) {
		$id = $post->ID;
	}

	// Get the images
	$images = get_field( $gallery_name, $id );

	// Output opening wrap tag
	echo '<div class="gallery" data-shiftr-gallery>';

	// Loop through images and output
	if ( $images ) :
		foreach ( $images as $image ) :
	?>

		<div class="gallery-item">
			<img data-src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" class="lazy" data-shiftr-gallery-image>
		</div>

	<?php 

		endforeach; 
	endif;

	// Output closing wrap
	echo '</div>';
}


/**  
 *  shiftr_excerpt_length
 *
 *  Set the length of the excerpt
 *
 *  @since 1.0
 *
 *	@return int The string length
 */

function shiftr_excerpt_length() {
	return 10;
}

add_filter( 'excerpt_length', 'shiftr_excerpt_length', 999 );


// Remove [...] from end of returned excerpt
add_filter( 'excerpt_more', '__return_empty_string' );


function shiftr_the_excerpt() {

	// Do the excerpt
	the_excerpt();
}

