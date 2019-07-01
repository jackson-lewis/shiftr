<?php

	/*  ////  --|    Theme Support

    */


/**  
 *  shiftr_theme_support
 *
 *  The fundamental theme support 
 *
 *  @since 1.0
 */

function shiftr_theme_support() {

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );

	if ( function_exists( 'is_woocommerce' ) ) {
		add_theme_support( 'woocommerce' );
	}
}

add_action( 'after_setup_theme', 'shiftr_theme_support' );


/**  
 *  shiftr_filter_ptag_on_images
 *
 *  Filter and remove <p> tags surrounding images in content
 *
 *  @since 1.0
 */

function shiftr_filter_ptag_on_images( $content ) {
   return preg_replace( '/<p>\s*(<a .*>)?\s*(<img .* \/>)\s*(<\/a>)?\s*<\/p>/iU', '\1\2\3', $content );
}

add_filter( 'the_content', 'shiftr_filter_ptag_on_images' );


/**  
 *  shiftr_fonts
 *
 *  Output the font associated link tags
 *
 *  @since 1.0
 */

function shiftr_fonts() {

	global $shiftr;

	$preconnect_attr = array(
		'rel' => 'preconnect',
		'href' => $shiftr->font_host
	);
	echo '<link ' . shiftr_output_attr( $preconnect_attr ) . '>';

	$stylesheet_attr = array(
		'rel' => 'stylesheet',
		'href' => $shiftr->font_url
	);
	echo '<link ' . shiftr_output_attr( $stylesheet_attr ) . '>';
}

add_action( 'wp_head', 'shiftr_fonts', 1 );

