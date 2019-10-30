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

	// Assign attachment id if featured image is set
	$image_id = get_post_thumbnail_id( $args->post_id );

	// If featured image is not set, use placeholder
	$image_id = ( $image == '' ) ? get_field( 'thumbnail_placeholder', 'option' ) : $image_id;

	// Get image URL
	$image_url = wp_get_attachment_url( $image_id );

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

		$atts['alt'] = get_post_meta( $image_id, '_wp_attachment_image_alt', true );

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
 *	@param $id int The attachment ID
 *  @param $size str The size of the image to output
 *	@param $lazy bool Set if the image should be lazy loaded
 *	@param $attr array Attributes that should be added to the img tag
 */

function shiftr_do_acf_image( $id = 0, $size = 'large', $lazy = true, $attr = [] ) {

	$html = '';

	if ( $id > 0 ) {

		$html = wp_get_attachment_image( $id, $size, false, $attr );

		$patterns = array(
			'/width=\"[0-9]*\"/',
			'/height=\"[0-9]*\"/',
			'/class=\"[a-zA-Z0-9\s\-_]*\"/'
		);

		$html = preg_replace( $patterns, '', $html );


		if ( $lazy ) {
			$patterns = array(
				'/ (src=)/',
				'/ (srcset=)/'
			);

			$html = preg_replace( $patterns, ' data-\1', $html );
			$html = preg_replace( '/(<img\s)/', '\1 class="lazy" ', $html );
		}
	}

	echo $html;
}

