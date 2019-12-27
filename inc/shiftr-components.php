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
	$gallery_atts = array(
		'class' => 'gallery',
		'data-shiftr-gallery' => ''
	);

	$gallery_atts = apply_filters( 'shiftr_gallery_atts', $gallery_atts );

	echo '<div ' . shiftr_output_attr( $gallery_atts, true ) . '>';

	// Loop through images and output
	if ( $images ) :
		foreach ( $images as $image ) :
	?>

		<div class="gallery-item">
			<?php shiftr_image( $image ); ?>
		</div>

	<?php 

		endforeach; 
	endif;

	// Output closing wrap
	echo '</div>';
}

