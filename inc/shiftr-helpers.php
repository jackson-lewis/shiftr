<?php


/**  
 *  shiftr_featured_image
 *
 *  Output the current post featured image in multiple formats, default as <img>
 *
 *  @since 1.0
 *
 *	@global $post Get post ID and featured image of the post
 *	@param $attr array List any attributes that should be included in img type
 *	@param $type str The type of format to output: default 'img', also appect 'background' and 'raw' url
 *	@param $id null|int The post ID
 *	@return mixed Depending on requested format as per $type
 */

function shiftr_featured_image( $attr = array(), $type = 'img', $id = null ) {

	global $post;

	if ( $id === null ) {
		$id = $post->ID;
	}

	$imageID = get_post_thumbnail_id( $id );

	if ( $imageID != '' ) {
		// Get the featured image url
		
		$image_url = wp_get_attachment_url( $imageID );

	} else {
		// Set Featured Image placeholder

		$image_url = get_template_directory_uri() . '/assets/media/imagery/audi_dash.jpg';
	}


	// Handle the different image types

	if ( $type == 'img' ) {
		// echo an img tag with attributes

		$attr['src'] = $image_url;
		$attr['alt'] = get_post_meta( $imageID, '_wp_attachment_image_alt', true );

		echo '<img ' . shiftr_output_attr( $attr ) . '>';

	} elseif ( $type == 'background' ) {
		// echo a style attribute

		$attr['style'] = 'background-image: url(' . $image_url . ');';

		echo shiftr_output_attr( $attr );

	} elseif ( $type == 'raw' ) {
		// Simply echo the raw url

		echo $image_url;

	} else {
		// If no types match

		return false;
	}
}


/**  
 *  shiftr_inline_svg
 *
 *  Output a basic gallery component 
 *
 *  @since 1.0
 *
 *	@param $file str The name of the file, excluding .svg extension
 *	@param $dir str The directory path relative to the theme root
 *	@return mixed Output SVG element or bool (false) if file not found
 */

function shiftr_inline_svg( $file = '', $dir = '/assets/media/icons/' ) {

	// Put together file path
	$relative_path = get_template_directory() . $dir . $file . '.svg';

	// Check if file exists
	if ( file_exists( $relative_path ) ) {

		include_once $relative_path;
	} else {

 		return false;
	} 
}


/**  
 *  shiftr_output_attr
 *
 *  Loop through an array of attributes and output string
 *
 *  @since 1.0
 *
 *	@param $raw array The array of attributes
 *	@param $auto_echo bool Whether the function should echo or return output
 *	@param $force_empty_values bool Whether an attribute with no value should be included in output
 *	@return str The attributes to be included inside HTML tag
 */

function shiftr_output_attr( $raw = [], $auto_echo = false, $force_empty_values = false ) {

	$the_attributes = array();

	foreach ( $raw as $key => $value ) {

		if ( ! $force_empty_values ) {
			if ( $value == '' ) continue;
		}

		$the_attributes[] = $key . '="' . $value . '"';
	}

	// Should attributes be echo'ed or returned
	if ( ! $auto_echo ) {
		return join( ' ', $the_attributes );

	} else {
		echo join( ' ', $the_attributes );
	}	
}


/**  
 *  shiftr_ext_link_attr
 *
 *  Output the standard attributes for an external link
 *
 *  @since 1.0
 *	@see shiftr_output_attr() for more
 */

function shiftr_ext_link_attr() {

	shiftr_output_attr(
		array(
			'target' => '_blank',
			'rel' => 'noopener'
		),
		true
	);
}


/**  
 *  shiftr_do_acf_image
 *
 *  Output an img tag with data from an ACF image field
 *
 *  @since 1.0
 *
 *	@param $field str The name of the ACF image field
 *	@param $attr array Attributes that should be added to the img tag
 *	@param $is_sub_field bool Set if the field is a sub field
 *	@param $lazyload bool Set if the image should be lazy loaded
 */

function shiftr_do_acf_image( $field = 'image', $attr = [], $is_sub_field = true, $lazyload = true ) {

	if ( $is_sub_field ) {
		$image = get_sub_field( $field );

	} else {
		$image = get_field( $field );
	}

	$core_attr = array();

	$core_attr['data-src'] = $image['url'];
	$core_attr['alt'] = $image['alt'];
	$core_attr['class'] = 'lazy';

	if ( isset( $attr['class'] ) ) {
		$core_attr['class'] .= ' ' . $attr['class'];

		unset( $attr['class'] );
	}

	// Merge src and alt with any aditional attributes
	$attr = array_merge( $core_attr, $attr );

	echo '<img ' . shiftr_output_attr( $attr ) . '>';
}

