<?php


/**  
 *  shiftr_featured_image
 *
 *  Output the html of the current post featured image
 *
 *  @since 1.0
 *
 *	@param $id null|int The post ID
 *  @param $size str The size of the image to output
 *	@param $lazy bool Set if the image should be lazy loaded
 *	@param $attr array Attributes that should be added to the img tag
 */

function shiftr_featured_image( $id = null, $size = 'large', $lazy = true, $attr = [] ) {

	$html = '';

	$html = get_the_post_thumbnail( $id, $size, $attr );

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

	echo $html;
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

	foreach ( $raw as $_key => $_value ) {

		if ( ! $force_empty_values ) {
			if ( $_value == '' ) continue;
		}

		$key = strtolower( $_key );

		$attr_url = array( 'href', 'src', 'srcset' );

		$value = in_array( $key, $attr_url ) ? esc_url( $_value ) : esc_attr( $_value );

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

