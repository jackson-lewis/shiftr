<?php


/**  
 *  shiftr_featured_image
 *
 *  Output the current post featured image in multiple formats, default as <img>
 *
 *  @since 1.0
 *
 *	@global $post Get post ID and featured image of the post
 *	@param $args array The arguments passed
 *  @return mixed Depending on requested format as per $type
 */

function shiftr_featured_image( $args = [] ) {

	global $post;

	$defaults = array(
		'post_id' => null,
		'type' => 'img',
		'atts' => [],
		'lazy' => false
	);

	$args = (object) wp_parse_args( $args, $defaults );


	if ( $args->post_id === null ) {
		$args->post_id = $post->ID;
	}

	$imageID = get_post_thumbnail_id( $args->post_id );

	if ( $imageID != '' ) {
		
		$image_url = wp_get_attachment_url( $imageID );

	} else {

		// Set Featured Image placeholder
		$image_url = get_template_directory_uri() . '/assets/media/imagery/hills.jpg';

		// Apply any filters for the placeholder
		$image_url = apply_filters( 'shiftr_featured_image_image_url', $image_url );
	}

	$atts = $args->atts;


	// Handle the different image types

	if ( $args->type == 'img' ) {

		if ( $args->lazy ) {
			$atts['data-src'] = $image_url;

			if ( isset( $atts['class'] ) ) {
				$atts['class'] .= ' lazy';
			} else {
				$atts['class'] = 'lazy';
			}

			$atts['loading'] = 'lazy';

		} else {
			$atts['src'] = $image_url;
		}

		$atts['alt'] = get_post_meta( $imageID, '_wp_attachment_image_alt', true );

		// Apply any filters
		$atts = apply_filters( 'shiftr_featured_image_atts', $atts );

		echo '<img ' . shiftr_output_attr( $atts ) . '>';

	} elseif ( $args->type == 'background' ) {
		$atts['style'] = 'background-image: url(' . $image_url . ');';

		echo shiftr_output_attr( $atts );

	} elseif ( $args->type == 'raw' ) {
		echo $image_url;

	} else { return false; }
}


/**  
 *  shiftr_inline_svg
 *
 *  Include an SVG file to inline on the page
 *
 *  @since 1.0
 *
 *	@param $file str The name of the file, excluding .svg extension, or full path to uploads
 *	@param $dir str|bool The directory path relative to the theme root, or false if uploads path
 *	@return mixed Output SVG element or bool (false) if file not found
 */

function shiftr_inline_svg( $file = '', $dir = '/assets/media/icons/' ) {

	// Put together file path
	$relative_path = get_template_directory() . $dir . $file . '.svg';

	if ( ! $dir ) {
		$relative_path = str_replace( get_bloginfo( 'url' ), '', $file );

	} else {
		$relative_path = get_template_directory() . $dir . $file . '.svg';
	}

	// Check if file exists
	if ( file_exists( $relative_path ) ) {

		include $relative_path;
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
 *	@param $force_empty_values bool Whether an attribute with no value should be included in output
 *	@return str The attributes to be included inside HTML tag
 */

function shiftr_output_attr( $raw = [], $force_empty_values = false ) {

	$the_attributes = array();

	foreach ( $raw as $key => $value ) {

		if ( ! $force_empty_values ) {
			if ( $value == '' ) continue;
		}

		$the_attributes[] = $key . '="' . $value . '"';
	}

	return join( ' ', $the_attributes );	
}


/**  
 *  shiftr_do_acf_image
 *
 *  Output an img tag with data from an ACF image field
 *
 *  @since 1.0
 *
 *	@param $image str The name of the ACF image field
 *	@param $lazy bool Set if the image should be lazy loaded
 *	@param $attr array Attributes that should be added to the img tag
 */

function shiftr_do_acf_image( $image = array(), $lazy = true, $attr = [] ) {

	if ( empty( $image ) ) {

		if ( get_field( 'image' ) ) {
			$image = get_field( 'image' );

		} elseif ( get_sub_field( 'image' ) ) {
			$image = get_sub_field( 'image' );
		}

	}

	if ( gettype( $image ) == 'integer' ) {
		$image_id = $image;

		$image = array();
		$image['url'] = wp_get_attachment_url( $image_id );
		$image['alt'] = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
	}


	$core_attr = array();

	if ( $lazy ) {
		$core_attr['data-src'] = $image['url'];
		
		if ( isset( $core_attr['class'] ) ) {
			$core_attr['class'] .= ' lazy';
		} else {
			$core_attr['class'] = 'lazy';
		}

		$atts['loading'] = 'lazy';

	} else {
		$core_attr['src'] = $image['url'];
	}

	$core_attr['alt'] = $image['alt'];
	

	if ( isset( $attr['class'] ) ) {
		$core_attr['class'] .= ' ' . $attr['class'];

		unset( $attr['class'] );
	}

	// Merge src and alt with any aditional attributes
	$attr = array_merge( $core_attr, $attr );

	echo '<img ' . shiftr_output_attr( $attr ) . '>';
}

