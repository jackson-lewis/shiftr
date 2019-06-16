<?php


define( 'SHIFTR_SPACE_ENTITY', '&nbsp;' );


/**  
 *  shiftr_get_branding
 *
 *  Output a file uri from within the branding directory
 *
 *  @since 1.0
 *
 *	@param $file str The file name of the requested file
 */

function shiftr_get_branding( $file = '' ) {
	echo get_template_directory_uri() . '/assets/media/branding/' . $file;
}


/**  
 *  shiftr_get_asset
 *
 *  Output a file uri from within the media directory
 *
 *  @since 1.0
 *
 *	@param $file str The file name of the requested file
 *	@param $media_dir str The directory name where the file is expected
 */

function shiftr_get_asset( $file = '', $media_dir = 'imagery' ) {
	echo get_template_directory_uri() . '/assets/media/' . $media_dir . '/' . $file;
}


/**  
 *  shiftr_get_setting
 *
 *  Return a Shiftr setting
 *
 *  @since 1.0
 *
 *	@param $key str The suffix of the setting name
 *	@return str|null The value on success, null if setting does not exist
 */

function shiftr_get_setting( $key = '' ) {

	$value = get_option( 'shiftr_' . $key );

	if ( ! $value ) {
		return $value;

	} else {

		return null;
	}
}


/**  
 *  space_to_
 *
 *  Convert spaces in a string to underscores
 *
 *  @since 1.0
 *
 *	@param $str str The string to convert
 *	@return str The re-formatted string
 */

function space_to_( $str = '' ) {

	return str_replace( ' ', '_', $str );
}


/**  
 *  space_to_nbsp
 *
 *  Convert spaces in a string to HTML space entity &nbsp;
 *
 *  @since 1.0
 *
 *	@param $str str The string to convert
 *	@return str The re-formatted string
 */

function space_to_nbsp( $str = '' ) {

	return str_replace( ' ', SHIFTR_SPACE_ENTITY, $str );
}

